import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { MongoClient } from "mongodb";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("meniva_ecosystem_analytics_consent", "denied"));
});

test("real form persists in Mongo, duplicate is idempotent, no email in URL or analytics", async ({ page }) => {
  const email = `e2e-${Date.now()}@example.com`;
  await page.goto("/?utm_source=linkedin&utm_medium=social&utm_campaign=launch#feliratkozas");
  await page.getByLabel("E-mail-cím", { exact: true }).fill(`  ${email.toUpperCase()}  `);
  await page.getByRole("button", { name: "Feliratkozom a hírlevélre" }).click();
  await expect(page.getByRole("status")).toContainText("Köszönjük, feliratkoztál.");
  const { uri } = JSON.parse(await readFile(".local/newsletter-test-mongo.json", "utf8"));
  const client = await new MongoClient(uri).connect();
  try {
    const collection = client.db("ctrlplane").collection("newsletter_subscribers");
    const doc = await collection.findOne({ email_normalized: email });
    expect(doc?.email).toBe(email);
    expect(doc?.source).toBe("ctrlplane_web");
    expect(doc?.subscribed_at).toBeInstanceOf(Date);
    expect(doc?.utm_source).toBe("linkedin");
    expect(doc?.utm_medium).toBe("social");
    expect(doc?.resend_sync_status).toBe("pending");
    await page.getByLabel("E-mail-cím", { exact: true }).fill(email);
    await page.getByRole("button", { name: "Feliratkozom a hírlevélre" }).click();
    await expect(page.getByRole("status")).toContainText("már feliratkoztál");
    expect(await collection.countDocuments({ email_normalized: email })).toBe(1);
    expect(page.url()).not.toContain(email);
    const analytics = await page.evaluate(() => JSON.stringify(window.dataLayer));
    expect(analytics).not.toContain(email);
    expect(analytics).not.toContain("newsletter_signup");
  } finally { await client.close(); }
});

test("invalid email shows Hungarian feedback without sending a request", async ({ page }) => {
  let sent = false;
  page.on("request", (request) => { if (request.url().includes("/api/subscribe")) sent = true; });
  await page.goto("/#feliratkozas");
  await page.getByLabel("E-mail-cím", { exact: true }).fill("not-an-email");
  await page.getByRole("button", { name: "Feliratkozom a hírlevélre" }).click();
  await expect(page.getByRole("status")).toContainText("érvényes e-mail-címet");
  expect(sent).toBe(false);
});

test("loading prevents rapid resubmission; database error never shows success", async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  let calls = 0;
  await page.route("**/api/subscribe", async (route) => { calls++; await gate; await route.fulfill({ status: 503, json: { status: "server_error" } }); });
  await page.goto("/#feliratkozas");
  await page.getByLabel("E-mail-cím", { exact: true }).fill("outage@example.com");
  await page.getByRole("button", { name: "Feliratkozom a hírlevélre" }).click();
  await expect(page.getByRole("button", { name: "Feliratkozás folyamatban…" })).toBeDisabled();
  await page.locator(".cp-newsletter-form").evaluate((form) => { form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })); });
  release();
  await expect(page.getByRole("status")).toContainText("Most nem sikerült");
  expect(calls).toBe(1);
  await expect(page.getByRole("status")).not.toContainText("Köszönjük");
});

test("unsubscribed and malformed backend results have no false success", async ({ page }) => {
  await page.route("**/api/subscribe", (route) => route.fulfill({ status: 409, json: { status: "unsubscribed" } }));
  await page.goto("/#feliratkozas");
  await page.getByLabel("E-mail-cím", { exact: true }).fill("former@example.com");
  await page.getByRole("button", { name: "Feliratkozom a hírlevélre" }).click();
  await expect(page.getByRole("status")).toContainText("korábban leiratkoztál");
  await page.route("**/api/subscribe", (route) => route.fulfill({ status: 503, json: { status: "success" } }));
  await page.getByRole("button", { name: "Feliratkozom a hírlevélre" }).click();
  await expect(page.getByRole("status")).toContainText("Most nem sikerült");
});

test("analytics sends one signup event only with consent, filters email campaign data", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("meniva_ecosystem_analytics_consent", "granted"));
  await page.goto("/?utm_source=linkedin&utm_campaign=private%40example.com#feliratkozas");
  const email = `analytics-${Date.now()}@example.com`;
  await page.getByLabel("E-mail-cím", { exact: true }).fill(email);
  await page.getByRole("button", { name: "Feliratkozom a hírlevélre" }).click();
  await expect(page.getByRole("status")).toContainText("Köszönjük");
  const events = await page.evaluate(() => window.dataLayer?.filter((event) => (event as { event?: string }).event === "newsletter_signup"));
  expect(events).toHaveLength(1);
  expect(JSON.stringify(events)).not.toContain(email);
  expect(JSON.stringify(events)).not.toContain("private");
  expect(events?.[0]).toMatchObject({ source: "ctrlplane_web", page_path: "/", utm_source: "linkedin" });
});

test("throwing analytics cannot hide a successful signup", async ({ page }) => {
  await page.goto("/#feliratkozas");
  await page.evaluate(() => {
    localStorage.setItem("meniva_ecosystem_analytics_consent", "granted");
    window.dataLayer = [];
    window.dataLayer.push = () => { throw new Error("analytics unavailable"); };
  });
  await page.getByLabel("E-mail-cím", { exact: true }).fill(`optional-${Date.now()}@example.com`);
  await page.getByRole("button", { name: "Feliratkozom a hírlevélre" }).click();
  await expect(page.getByRole("status")).toContainText("Köszönjük");
});

test("mobile article CTA preserves LinkedIn attribution and signup fits the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const article = await page.locator('a[href^="/irasok/"]').first().getAttribute("href");
  await page.goto(`${article}?utm_source=linkedin&utm_medium=social`);
  await page.locator('[data-cta-id="article_newsletter"]').click();
  await expect(page).toHaveURL(/utm_source=linkedin.*#feliratkozas/);
  await expect(page.getByRole("button", { name: "Feliratkozom a hírlevélre" })).toBeInViewport();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
  await page.getByLabel("E-mail-cím", { exact: true }).fill(`mobile-${Date.now()}@example.com`);
  await page.getByRole("button", { name: "Feliratkozom a hírlevélre" }).click();
  await expect(page.getByRole("status")).toContainText("Köszönjük");
  const button = await page.getByRole("button", { name: "Feliratkozom a hírlevélre" }).boundingBox();
  expect(button?.height).toBeGreaterThanOrEqual(44);
  await page.locator("#feliratkozas").screenshot({ path: "test-results/newsletter-mobile.png" });
});

test("privacy is reachable from form and contains no development placeholders", async ({ page }) => {
  await page.goto("/#feliratkozas");
  await page.locator('#newsletter-privacy a').click();
  await expect(page.getByRole("heading", { name: "CtrlPlane hírlevél" })).toBeVisible();
  await expect(page.locator("body")).not.toContainText("REQUIRED_USER_INPUT");
  await expect(page.locator('[aria-labelledby="privacy-controller"]')).toContainText("Antal Bálint egyéni vállalkozó");
  await expect(page.locator('a[href="mailto:info@meniva.net"]')).toBeVisible();
  await page.getByRole("button", { name: "Süti beállítások megnyitása" }).click();
  await expect(page.getByRole("dialog", { name: "Analitikai sütik" })).toBeVisible();
  await page.getByRole("button", { name: "Elutasítom", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Analitikai sütik" })).toBeHidden();
});
