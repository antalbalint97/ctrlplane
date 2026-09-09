import "server-only";
import type { Collection } from "mongodb";
import { attributionFrom, normalizeEmail, type SignupStatus } from "./contract";
import type { Subscriber } from "./model";
import { persistSubscriber } from "./subscribe";

type Dependencies = {
  getCollection: () => Promise<Collection<Subscriber>>;
  scheduleSync: (collection: Collection<Subscriber>, subscriber: Subscriber) => void;
};

function reply(status: SignupStatus, code: number) {
  return Response.json({ status }, { status: code, headers: { "Cache-Control": "no-store" } });
}

async function readBody(request: Request): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("empty_body");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 4096) { await reader.cancel(); throw new Error("body_too_large"); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export function createSubscribeHandler({ getCollection, scheduleSync }: Dependencies) {
  return async (request: Request): Promise<Response> => {
    const origin = request.headers.get("origin");
    // Next may expose an internal hostname in request.url. Host is the browser's
    // actual destination; forwarded protocol is set by the deployment proxy.
    const requestUrl = new URL(request.url);
    const host = request.headers.get("host") || requestUrl.host;
    const protocol = request.headers.get("x-forwarded-proto") || requestUrl.protocol.slice(0, -1);
    const expectedOrigin = `${protocol}://${host}`;
    if ((origin && origin !== expectedOrigin) || request.headers.get("sec-fetch-site") === "cross-site") {
      return reply("invalid_request", 403);
    }
    if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
      return reply("invalid_request", 415);
    }
    let body: Record<string, unknown>;
    try {
      const data = await readBody(request);
      if (!data || typeof data !== "object" || Array.isArray(data)) return reply("invalid_request", 400);
      body = data as Record<string, unknown>;
    } catch { return reply("invalid_request", 400); }
    if (body.website !== undefined && body.website !== "") return reply("invalid_request", 400);
    if (body.newsletter_consent !== true) return reply("consent_required", 400);
    const email = normalizeEmail(body.email);
    if (!email) return reply("invalid_email", 422);
    try {
      const collection = await getCollection();
      const result = await persistSubscriber(collection, { email, ...attributionFrom(body) });
      if (result.status === "success") {
        // Even scheduling failure must not turn a committed subscription into a failure response.
        try { scheduleSync(collection, result.subscriber); }
        catch { console.warn("newsletter_resend_schedule_failed"); }
      }
      return reply(result.status, result.status === "success" ? 201 : result.status === "unsubscribed" ? 409 : 200);
    } catch {
      console.error("newsletter_database_failed");
      return reply("server_error", 503);
    }
  };
}
