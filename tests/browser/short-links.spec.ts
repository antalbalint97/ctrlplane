import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { MongoClient } from "mongodb";

const destination = "/?utm_source=linkedin&utm_medium=organic_social&utm_campaign=ctrlplane_launch&utm_content=launch_post_01#feliratkozas";
const attribution = {
  utm_source: "linkedin",
  utm_medium: "organic_social",
  utm_campaign: "ctrlplane_launch",
  utm_content: "launch_post_01",
};

test("launch returns a temporary server redirect with all UTMs and the fragment", async ({ request }) => {
  const response = await request.get("/go/launch", { maxRedirects: 0 });
  expect(response.status()).toBe(307);
  expect(response.headers().location).toBe(destination);
  expect(response.headers()["cache-control"]).toBe("no-store");
  expect(await response.text()).toBe("");
  const head = await request.head("/go/launch", { maxRedirects: 0 });
  expect(head.status()).toBe(307);
  expect(head.headers().location).toBe(destination);
});

test("unknown and prototype-property slugs return 404 without a Location", async ({ request }) => {
  for (const slug of ["unknown-campaign", "constructor", "toString", "__proto__", "https%3A%2F%2Fexample.com"]) {
    const response = await request.get(`/go/${slug}?url=https://example.com`, { maxRedirects: 0 });
    expect(response.status(), slug).toBe(404);
    expect(response.headers().location, slug).toBeUndefined();
  }
});

test("request parameters cannot override destination or campaign attribution", async ({ request }) => {
  const response = await request.get("/go/launch", {
    maxRedirects: 0,
    params: {
      url: "https://example.com",
      destination: "//example.com",
      redirect: "https://example.com",
      next: "https://example.com",
      utm_source: "spoofed",
      utm_medium: "spoofed",
      utm_campaign: "spoofed",
      utm_content: "person@example.com",
      hash: "other",
    },
  });
  expect(response.status()).toBe(307);
  expect(response.headers().location).toBe(destination);
});

test("a crawler following the redirect receives the existing Open Graph metadata", async ({ request }) => {
  const response = await request.get("/go/launch", { headers: { "User-Agent": "LinkedInBot/1.0" } });
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain('property="og:title"');
  expect(html).toContain('property="og:image"');
  expect(html).toContain('property="og:url" content="https://ctrplane.com"');
});

test("short-link visit preserves session and signup attribution without extra analytics events", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("meniva_ecosystem_analytics_consent", "granted"));
  await page.goto("/go/launch");
  expect(new URL(page.url()).pathname + new URL(page.url()).search + new URL(page.url()).hash).toBe(destination);
  await expect(page.locator("#feliratkozas")).toBeInViewport();
  await expect.poll(() => page.evaluate(() => window.dataLayer?.filter((item) => (item as { event?: string }).event === "page_view").length)).toBe(1);
  expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem("meniva_ecosystem_campaign_context_v2") ?? "{}"))).toMatchObject(attribution);
  expect(await page.evaluate(() => window.dataLayer?.filter((item) => (item as { event?: string }).event === "newsletter_signup"))).toHaveLength(0);

  const email = `short-link-${Date.now()}@example.com`;
  await page.getByLabel("E-mail-cím", { exact: true }).fill(email);
  await page.getByRole("button", { name: "Feliratkozom a hírlevélre" }).click();
  await expect(page.getByRole("status")).toContainText("Köszönjük, feliratkoztál.");
  const { uri } = JSON.parse(await readFile(".local/newsletter-test-mongo.json", "utf8"));
  const client = await new MongoClient(uri).connect();
  try {
    expect(await client.db("ctrlplane").collection("newsletter_subscribers").findOne({ email_normalized: email })).toMatchObject(attribution);
  } finally { await client.close(); }
  const events = await page.evaluate(() => window.dataLayer ?? []);
  expect(events.filter((item) => (item as { event?: string }).event === "page_view")).toHaveLength(1);
  const signups = events.filter((item) => (item as { event?: string }).event === "newsletter_signup");
  expect(signups).toHaveLength(1);
  expect(signups[0]).toMatchObject(attribution);
  expect(JSON.stringify(events)).not.toContain(email);
});
