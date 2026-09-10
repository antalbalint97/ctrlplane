import { after, before, beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient, type Collection } from "mongodb";
import { attributionFrom, normalizeEmail } from "../src/lib/newsletter/contract";
import { createSubscribeHandler } from "../src/lib/newsletter/handler";
import { ensureSubscriberIndex } from "../src/lib/newsletter/mongodb";
import type { Subscriber } from "../src/lib/newsletter/model";
import { getResendConfig, syncResendContact } from "../src/lib/newsletter/resend";

let mongo: MongoMemoryServer;
let client: MongoClient;
let collection: Collection<Subscriber>;
const tasks: Array<() => Promise<void>> = [];
const config = { apiKey: "test-only", segmentId: "ctrlplane-only" };
const launchAttribution = { utm_source: "linkedin", utm_medium: "organic_social", utm_campaign: "ctrlplane_launch", utm_content: "launch_post_01" };
const handler = createSubscribeHandler({ getCollection: async () => collection, scheduleSync: () => {} });
const request = (body: unknown, headers: Record<string, string> = {}) => new Request("https://ctrplane.com/api/subscribe", {
  method: "POST", headers: { "Content-Type": "application/json", Origin: "https://ctrplane.com", ...headers }, body: JSON.stringify(body),
});
const signup = (email = "reader@example.com", extra = {}) => request({ email, newsletter_consent: true, ...extra });
before(async () => {
  mongo = await MongoMemoryServer.create();
  client = await new MongoClient(mongo.getUri()).connect();
  collection = client.db("ctrlplane").collection<Subscriber>("newsletter_subscribers");
  await ensureSubscriberIndex(collection);
});
beforeEach(async () => { await collection.deleteMany({}); tasks.length = 0; });
after(async () => { await client?.close(); await mongo?.stop(); });

test("valid request persists normalized, allowlisted data with unique index and consent evidence", async () => {
  const result = await handler(signup("  Foo.Bar@Example.COM  ", { source: "injected", status: "unsubscribed", subscribed_at: "yesterday", ...launchAttribution, resend_sync_status: "synced" }));
  assert.equal(result.status, 201);
  assert.deepEqual(await result.json(), { status: "success" });
  const doc = await collection.findOne({ email_normalized: "foo.bar@example.com" });
  assert.ok(doc);
  assert.equal(doc.email, "foo.bar@example.com");
  assert.equal(doc.source, "ctrlplane_web");
  assert.equal(doc.status, "active");
  assert.ok(doc.subscribed_at instanceof Date);
  assert.equal(doc.unsubscribed_at, null);
  assert.deepEqual(attributionFrom(doc), launchAttribution);
  assert.equal(doc.resend_sync_status, "pending");
  assert.equal(doc.consent_version, "newsletter-2026-09-10");
  assert.ok((await collection.indexes()).some((index) => index.key.email_normalized === 1 && index.unique));
});

test("invalid values, injection objects, malformed email and missing consent never write", async () => {
  for (const email of [null, 4, { $ne: null }, "bad", "a@@example.com", ".a@example.com", "a..b@example.com", "a@-host.com", "a@example", "a b@example.com", "a\r\nb@example.com"]) {
    const response = await handler(request({ email, newsletter_consent: true }));
    assert.equal(response.status, 422);
  }
  for (const consent of [undefined, false, "true"]) assert.equal((await handler(request({ email: "a@example.com", newsletter_consent: consent }))).status, 400);
  assert.equal(await collection.countDocuments(), 0);
  assert.equal(normalizeEmail("  Foo.Bar@Example.COM "), "foo.bar@example.com");
});

test("concurrent duplicate requests create one document and preserve first subscription", async () => {
  const responses = await Promise.all(Array.from({ length: 12 }, (_, index) => handler(signup("reader@example.com", { ...launchAttribution, utm_content: `launch_post_${index}` }))));
  assert.equal(responses.filter((r) => r.status === 201).length, 1);
  assert.equal(responses.filter((r) => r.status === 200).length, 11);
  assert.equal(await collection.countDocuments(), 1);
  const before = await collection.findOne({});
  assert.equal(before?.utm_content, `launch_post_${responses.findIndex((response) => response.status === 201)}`);
  assert.deepEqual(await (await handler(signup("READER@example.com", { utm_source: "overwrite", utm_medium: "overwrite", utm_campaign: "overwrite", utm_content: "overwrite" }))).json(), { status: "already_subscribed" });
  assert.deepEqual(await collection.findOne({}), before);
  assert.equal((await handler(signup())).status, 200);
  assert.deepEqual(await collection.findOne({}), before);
});

test("signup without utm_content succeeds and keeps existing campaign fields", async () => {
  const originalFields = { utm_source: "linkedin", utm_medium: "organic_social", utm_campaign: "ctrlplane_launch" };
  const response = await handler(signup("reader@example.com", originalFields));
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { status: "success" });
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  const doc = await collection.findOne({});
  assert.ok(doc);
  assert.deepEqual(attributionFrom(doc), { ...originalFields, utm_content: null });
  assert.equal(doc.utm_content, null);
});

test("repeat signup never backfills null attribution or legacy missing utm_content", async () => {
  await handler(signup());
  const original = await collection.findOne({});
  assert.ok(original);
  assert.deepEqual(attributionFrom(original), { utm_source: null, utm_medium: null, utm_campaign: null, utm_content: null });
  assert.equal((await handler(signup("reader@example.com", launchAttribution))).status, 200);
  assert.deepEqual(await collection.findOne({}), original);
  await collection.updateOne({}, { $unset: { utm_content: "" }, $set: { consent_version: "newsletter-2026-09-09" } });
  const legacy = await collection.findOne({});
  assert.equal((await handler(signup("reader@example.com", launchAttribution))).status, 200);
  assert.deepEqual(await collection.findOne({}), legacy);
});

test("utm_content validation drops unsafe values without failing signup", async () => {
  const invalid = [null, "", " ", "launch post", "reader@example.com", "reader%40example.com", "reader%2540example.com", "<script>", "post\n", "ékezet", "x".repeat(101), 123, true, ["post"], { $ne: null }];
  for (const [index, utm_content] of invalid.entries()) {
    const response = await handler(signup(`validation-${index}@example.com`, { ...launchAttribution, utm_content }));
    assert.equal(response.status, 201);
    assert.deepEqual(await response.json(), { status: "success" });
    const doc = await collection.findOne({ email_normalized: `validation-${index}@example.com` });
    assert.ok(doc);
    assert.deepEqual(attributionFrom(doc), { ...launchAttribution, utm_content: null });
    assert.equal(doc.utm_content, null);
  }
  assert.equal((await handler(signup("boundary@example.com", { utm_content: "x".repeat(100) }))).status, 201);
  assert.equal((await collection.findOne({ email_normalized: "boundary@example.com" }))?.utm_content, "x".repeat(100));
});

test("unsubscribed and provider-suppressed records are never reactivated", async () => {
  await handler(signup("reader@example.com", launchAttribution));
  const date = new Date();
  await collection.updateOne({}, { $set: { status: "unsubscribed", unsubscribed_at: date } });
  const unsubscribed = await collection.findOne({});
  assert.equal((await handler(signup("reader@example.com", { utm_content: "overwrite" }))).status, 409);
  assert.deepEqual(await collection.findOne({}), unsubscribed);
  assert.equal((await collection.findOne({}))?.unsubscribed_at?.getTime(), date.getTime());
  await collection.updateOne({}, { $set: { status: "active", resend_sync_status: "suppressed" } });
  const suppressed = await collection.findOne({});
  assert.deepEqual(await (await handler(signup("reader@example.com", { utm_content: "overwrite" }))).json(), { status: "unsubscribed" });
  assert.deepEqual(await collection.findOne({}), suppressed);
  assert.equal(await collection.countDocuments(), 1);
});

test("database outage returns 503 without success or downstream scheduling", async () => {
  let scheduled = false;
  const unavailable = createSubscribeHandler({ getCollection: async () => { throw new Error("secret@example.com"); }, scheduleSync: () => { scheduled = true; } });
  const response = await unavailable(signup());
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { status: "server_error" });
  assert.equal(scheduled, false);
});

test("provider outage happens after success; record survives, retry syncs the same record", async () => {
  const route = createSubscribeHandler({ getCollection: async () => collection, scheduleSync: (c, doc) => { tasks.push(() => syncResendContact(c, doc._id, config, async () => new Response(null, { status: 503 }))); } });
  assert.equal((await route(signup("reader@example.com", launchAttribution))).status, 201);
  assert.equal((await collection.findOne({}))?.resend_sync_status, "pending");
  await tasks[0]();
  const failed = await collection.findOne({});
  assert.ok(failed);
  assert.equal(failed.resend_sync_status, "failed");
  assert.equal(failed.status, "active");
  let calls = 0;
  await syncResendContact(collection, failed._id, config, async (url, options) => {
    calls++;
    assert.ok(String(url).startsWith("https://api.resend.com/"));
    if (options?.method === "GET") return new Response(null, { status: 404 });
    const body = JSON.parse(options?.body as string);
    assert.deepEqual(body, { email: "reader@example.com", segments: [{ id: "ctrlplane-only" }] });
    return Response.json({ id: "contact-1" });
  });
  assert.equal(calls, 2);
  assert.equal(await collection.countDocuments(), 1);
  assert.equal((await collection.findOne({}))?.resend_contact_id, "contact-1");
  assert.equal((await collection.findOne({}))?.resend_sync_status, "synced");
  assert.deepEqual(attributionFrom((await collection.findOne({}))!), launchAttribution);
});

test("global Resend opt-out is preserved without any provider mutation", async () => {
  await handler(signup());
  const subscriber = await collection.findOne({});
  let calls = 0;
  await syncResendContact(collection, subscriber!._id, config, async (_url, options) => {
    calls++;
    assert.equal(options?.method, "GET");
    return Response.json({ id: "opted-out", unsubscribed: true });
  });
  assert.equal(calls, 1);
  assert.equal((await collection.findOne({}))?.resend_sync_status, "suppressed");
});

test("existing active contact is added only to CtrlPlane segment", async () => {
  await handler(signup());
  const subscriber = await collection.findOne({});
  await syncResendContact(collection, subscriber!._id, config, async (url, options) => {
    if (options?.method === "GET") return Response.json({ id: "existing", unsubscribed: false });
    assert.equal(String(url), "https://api.resend.com/contacts/existing/segments/ctrlplane-only");
    assert.equal(options?.body, undefined);
    return Response.json({ id: "existing" });
  });
  assert.equal((await collection.findOne({}))?.resend_sync_status, "synced");
});

test("optional config and scheduling errors never turn a persisted signup into an error", async () => {
  assert.equal(getResendConfig(), null);
  const route = createSubscribeHandler({ getCollection: async () => collection, scheduleSync: () => { throw new Error("unavailable"); } });
  assert.equal((await route(signup())).status, 201);
  const subscriber = await collection.findOne({});
  await syncResendContact(collection, subscriber!._id, null, async () => { throw new Error("must not call"); });
  assert.equal((await collection.findOne({}))?.resend_sync_status, "pending");
});

test("cross-origin, honeypot, malformed and oversized requests are rejected before DB access", async () => {
  assert.equal((await handler(request({ email: "a@example.com" }, { Origin: "https://attacker.example" }))).status, 403);
  assert.equal((await handler(signup("a@example.com", { website: "bot" }))).status, 400);
  assert.equal((await handler(request({}, { "Content-Type": "text/plain" }))).status, 415);
  assert.equal((await handler(request({ extra: "x".repeat(5000) }))).status, 400);
  assert.equal((await handler(new Request("https://ctrplane.com/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" }))).status, 400);
  assert.equal(await collection.countDocuments(), 0);
});

test("same-origin browser request behind Next's internal host is accepted", async () => {
  const response = await handler(new Request("http://localhost:3100/api/subscribe", {
    method: "POST", headers: { "Content-Type": "application/json", Host: "ctrplane.com", "X-Forwarded-Proto": "https", Origin: "https://ctrplane.com" },
    body: JSON.stringify({ email: "proxy@example.com", newsletter_consent: true }),
  }));
  assert.equal(response.status, 201);
});

test("attribution accepts campaign identifiers and drops addresses/free text", () => {
  assert.deepEqual(attributionFrom(launchAttribution), launchAttribution);
  assert.deepEqual(attributionFrom({ utm_source: "reader@example.com", utm_medium: "reader%40example.com", utm_campaign: { $ne: null }, utm_content: "free text" }), { utm_source: null, utm_medium: null, utm_campaign: null, utm_content: null });
});
