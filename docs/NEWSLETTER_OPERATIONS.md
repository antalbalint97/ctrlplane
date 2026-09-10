# Newsletter launch handoff

## Storage and infrastructure audit

`POST /api/subscribe` → MongoDB Atlas `ctrlplane.newsletter_subscribers` → HTTP 201 → Next.js `after()` contact sync → optional one-time welcome email for the new subscriber.
MongoDB is canonical. Welcome failure never changes a committed signup response. Editorial work and newsletter issue sending are manual; the contact retry command sends no mail. This main application owns canonical email presentation in `src/emails/` and has no dependency on the separate newsletter automation project. See [templates and welcome delivery](EMAIL_TEMPLATES.md).

Nullfal uses a process-level Python Motor client, `MONGO_URL`, validated `DB_NAME`, TLS certificates and Resend SMTP. The operator has created `ctrlplane.newsletter_subscribers` in the existing **Nullfall** free Atlas cluster (confirmed by their Data Explorer screenshot). No separate cluster is needed. The operator authorized reusing the Atlas URI from Nullfal/Railway; map `MONGO_URL` to CtrlPlane's `MONGODB_URI`, but set `MONGODB_DB_NAME=ctrlplane` independently. The explicit database selection overrides any database name in the URI. Nullfal's runtime code and data remain independent.

The operator supplied an updated Atlas URI for a user with CtrlPlane access in ignored `ctrlplane/.env.local`. Connection, ping, unique index creation and actual subscriber writes passed in the earlier smoke test. The local production Next build was tested through a mobile browser against this real Atlas database: signup persisted, duplicate signup kept one record, invalid input was rejected, and the synthetic test record was deleted with cleanup verified. Resend sync was disabled during this smoke test. No new cluster or Nullfal data changes were needed. Subscription is now live per the current operating status; the configuration steps below remain setup/recovery instructions, not outstanding launch blockers. New attribution changes still require a deployed smoke check.

The Node driver reuses one pool per warm process (maximum 5 application connections, idle minimum 0); development hot reload shares the cache. Failed connections/index initialization are retryable. Writes use majority acknowledgement; timeouts bound database failures. See [MongoDB connection pools](https://www.mongodb.com/docs/drivers/node/current/connect/connection-options/connection-pools/).

## Configuration and launch actions

Set server environment variables in the existing CtrlPlane Vercel project's Production environment; use a separate test database for Preview. Redeploy after setting them.

```dotenv
MONGODB_URI=<tested CtrlPlane Atlas URI from local .env.local>
MONGODB_DB_NAME=ctrlplane

# Optional: enable only when BOTH are configured
RESEND_API_KEY=<Resend API key with contact management access>
RESEND_SEGMENT_ID=<dedicated CtrlPlane Newsletter segment UUID>

# Optional welcome sending: plain mailbox on a verified Resend domain
RESEND_FROM_EMAIL=<operator-selected sender mailbox>
```

1. Copy the now-tested `MONGODB_URI` from local `.env.local` privately to the CtrlPlane Vercel project's Production environment. Keep `MONGODB_DB_NAME=ctrlplane`; do not copy Nullfal's `DB_NAME`. Atlas Network Access must permit Vercel's actual egress. Keep TLS/certificate verification enabled. Vercel runs the Next.js API route directly; a Railway backend is not needed. See [Vercel setup](VERCEL_SETUP.md).
2. Set `MONGODB_URI` privately in deployment secrets (or ignored `.env.local` locally). The first signup initializes the collection and **unique** `newsletter_email_unique` index on `{email_normalized: 1}` before writing. An index creation error fails the signup closed. If migrating existing data, resolve collisions deliberately; do not drop the unique constraint.
3. The operator created **CtrlPlane Newsletter** and supplied working `RESEND_API_KEY` / `RESEND_SEGMENT_ID` values in `.env.local`. Deploy these same values privately to CtrlPlane. Live testing confirmed the local production form creates a Mongo subscriber, synchronizes its Resend contact into this Segment and records `synced`; duplicate signup keeps one document and the same contact ID. The synthetic contact and Mongo record were removed with cleanup verified. Never use a Nullfal segment or send a broadcast to all account contacts.
4. The controller details supplied by the operator are now in the public privacy page: Antal Bálint egyéni vállalkozó, 2112 Veresegyház, Viczián u. 14., `info@meniva.net`. No privacy env variables are required. Keep actual retention practices/provider settings consistent with the notice and process unsubscribe/privacy requests at this mailbox.
5. Deploy and complete the real environment smoke check below. Secrets must never use `NEXT_PUBLIC_` names.

The privacy notice explains newsletter consent, unsubscribe/suppression retention, hosting, consent-based analytics/browser storage, service providers/transfer terms, data rights and NAIH complaints. Provider-configured log/analytics retention is described by criteria without inventing numeric periods. The notice is accessible from the signup form and footer; its settings button opens the existing consent controls.

## Data and signup behavior

| Fields | Meaning |
| --- | --- |
| `_id`, `email`, `email_normalized` | ObjectId; email stored trimmed/lowercase; unique normalized address |
| `status`, `source` | `active` / `unsubscribed`; server-owned `ctrlplane_web` |
| `subscribed_at`, `unsubscribed_at` | BSON dates, latter null until unsubscribe |
| `consent_version` | Server-owned `newsletter-2026-09-10`; timestamp is `subscribed_at` |
| `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` | Nullable campaign identifiers, max 100 ASCII letters/digits/underscore/hyphen; content identifies a post or creative variant |
| `resend_contact_id` | Nullable provider contact ID |
| `resend_sync_status` | `pending`, `synced`, `failed`, `suppressed` |
| `resend_last_sync_at` | Nullable last completed attempt timestamp |
| `welcome_email_status` | New records: `pending`, then `sending` / `sent` / `failed` / `skipped`; absent on historical records |
| `welcome_email_attempted_at`, `welcome_email_sent_at` | Nullable BSON dates for attempt and Resend acceptance; not inbox delivery evidence |
| `welcome_email_resend_id`, `welcome_email_error_code` | Nullable provider message ID and fixed safe reason code; no message body or raw provider errors stored |

The request requires `newsletter_consent: true`, supplied only by the dedicated form submit, whose adjacent text states the newsletter purpose. No extra checkbox was added. This is a product implementation based on an explicit affirmative action, not a legal certification; see [EDPB consent guidance](https://www.edpb.europa.eu/sme/be-compliant/process-personal-data-lawfully_en). Client-supplied status/timestamps/internal state are ignored. No IP address is stored.

New subscriber: 201 `success`. Active duplicate: 200 `already_subscribed`, preserving original data. Prior unsubscribe/provider suppression: 409 `unsubscribed`, with no automatic reactivation. Invalid email: 422; missing consent/bad JSON/honeypot/oversized body: 400; cross-site origin: 403; unsupported content type: 415; database failure: 503. Responses contain only a status code string, never the submitted email. A network timeout can mean the write committed but its response was lost; retry safely yields the duplicate state.

Abuse minimum: server validation, 4 KiB streaming body limit, honeypot, JSON-only and same-origin browser checks, database uniqueness. No shared rate limiter/CAPTCHA is introduced; origin and honeypot checks are not protection against determined direct API bots. Add deployment rate rules if abuse is observed.

Navbar and footer already link to `/#feliratkozas`; article-end CTA now does too. Campaign identifiers follow article→signup links without cookies/storage, including without analytics consent. The existing hero remains focused on the featured article. No separate landing page or popup is needed.

### Attribution semantics and LinkedIn campaign

Before this patch, signup persisted source, medium and campaign from the current signup URL. It now also persists `utm_content` through the same shared allowlist: URL → article signup link → form JSON → API validation → Mongo insert. Invalid or absent values become `null`; signup still succeeds. No values are fabricated or inferred from the referrer.

This is first-subscription attribution: persistence uses an insert with a unique normalized-email index, then reads the existing document on a duplicate-key error. It does not update/upsert attribution on repeat requests, including when the original values are null or an older document lacks `utm_content`. Timestamps, consent and suppression also remain unchanged. No migration, new index or backfill is required; treat a missing legacy field as unknown. Historical post identifiers cannot be reconstructed from repeat visits.

Newsletter storage reads only the current URL, not analytics session storage. Campaign parameters must remain on the URL or travel through the existing article→signup links; arbitrary navigation that drops them can lose attribution. Separately, consent-based analytics already accepts `utm_content` and merges saved session context with current URL values, with current values taking precedence. That existing behavior is unchanged. The form emits `newsletter_signup` only after HTTP 201 with `status: "success"`, and only with analytics consent; duplicates and errors do not emit it. Submitted email is never added to GTM/GA4 events. Resend contact sync receives email and Segment membership, not campaign attribution.

For the first personal-profile LinkedIn post, use:

```text
https://ctrplane.com/?utm_source=linkedin&utm_medium=organic_social&utm_campaign=ctrlplane_launch&utm_content=launch_post_01#feliratkozas
```

For an article-led post, put the same query parameters on the article URL and follow its signup CTA. Keep source/medium/campaign consistent and assign a distinct `utm_content` per post. Compare article engagement in GA4 (consented traffic) with new Mongo subscriptions grouped by these four fields; the populations can differ because signup does not require analytics consent.

### First-party campaign short links

Publish `https://ctrplane.com/go/[slug]`, for example `https://ctrplane.com/go/launch`. The typed static registry lives in `src/lib/short-links.ts`; `/go/launch` returns a temporary **307** with `Cache-Control: no-store` to:

```text
https://ctrplane.com/?utm_source=linkedin&utm_medium=organic_social&utm_campaign=ctrlplane_launch&utm_content=launch_post_01#feliratkozas
```

Add an explicit registry entry for each future post, choosing its home/article destination, source, medium, campaign, content and optional anchor. Every LinkedIn content experiment must have a unique `utm_content`. Only `launch` is currently registered. Unknown slugs return 404; request query parameters cannot override destinations or attribution. The relative Location stays on the current origin, including local and preview deployments.

These short links are first-party redirects, not analytics themselves. The redirect runs on the server without rendering a page or emitting events; the existing destination page handles consent, session attribution and signup as before. No subscriber or analytics data model changes are needed.

A crawler that follows the HTTP redirect receives the destination's existing Open Graph metadata; no custom preview page is introduced. LinkedIn's caching and preview behavior still need a deployed check in [Post Inspector](https://www.linkedin.com/post-inspector/). After deployment, inspect `/go/launch` without following redirects (for example `curl -I https://ctrplane.com/go/launch`), verify 307 and the full Location including the fragment, then open it in a browser and confirm all four UTM values and the signup section. Confirm an unknown slug returns 404 and `?url=https://example.com&utm_content=other` cannot change the mapping. For a controlled signup smoke test, verify the four stored fields and one consented signup event; the redirect itself must produce neither a page view nor a signup event.

## Resend and manual recovery

Live provider verification: `ctrplane.com` is **verified**; TXT `resend._domainkey` and CNAME records `rsend` and `send` are verified, sending enabled, receiving disabled. No Resend automations were configured at test time. No email was sent. Sender selection, approved issue delivery and unsubscribe behavior still require the separate delivery check.

Resend has [migrated Audiences to Segments](https://resend.com/docs/dashboard/segments/migrating-from-audiences-to-segments); this implementation uses `RESEND_SEGMENT_ID`, **not** the deprecated Audience API. Contacts are global within an account; segment membership keeps the CtrlPlane recipient list separate, but global opt-out can affect multiple brands. Use a separate Resend account if independent global contact/opt-out domains are required.

After the Mongo commit/response, [Next.js `after()`](https://nextjs.org/docs/app/api-reference/functions/after) runs a bounded API lookup then contact creation/segment membership. Existing global opt-outs are never explicitly reset; they become `suppressed` locally and are not added to the segment. New contact creation omits `unsubscribed:false`. After successful sync, the new subscriber may receive the welcome email when `RESEND_FROM_EMAIL` is configured; no Broadcast is sent. A provider error leaves the signup successful and marks sync `failed`; interrupted work can remain `pending`. If state recording also fails, fixed log code `newsletter_resend_state_write_failed` signals it. Logs never print raw errors, URIs, request bodies or addresses.

Welcome delivery uses a durable atomic `pending` → `sending` claim and a subscriber-ID-based Resend idempotency key. Duplicates, legacy records and contact-sync retries do not send welcome mail. Missing configuration skips welcome; suppression skips it; failed sync blocks it. Send failure records `failed` without undoing the subscription. A lost response can still mean Resend accepted the message, so failed/interrupted sends are not automatically retried. Inspect provider logs before any manual recovery; never bulk-reset welcome status. Full state semantics and recovery boundaries are in [EMAIL_TEMPLATES.md](EMAIL_TEMPLATES.md).

After fixing credentials, segment or provider availability, run from a trusted checkout with the intended database env:

```sh
pnpm newsletter:sync
```

This manually retries up to 100 pending/failed active records, at a controlled pace, using the same code. It prints counts only, exits nonzero if failures remain, and never sends mail or reactivates suppressed subscribers. Re-run for more records. Concurrent signup traffic can hit Resend's rate limit; those contacts remain retryable. This is a manual recovery command, not a queue or scheduled automation.

## Verify and export

In Atlas Data Explorer select `ctrlplane` → `newsletter_subscribers`, filter on the operator-owned test address after trim/lowercase, and inspect the document and Indexes tab. Do not paste addresses into tickets/logs. Example read-only `mongosh` queries (substitute your controlled test address privately):

```javascript
use ctrlplane
db.newsletter_subscribers.findOne({email_normalized: "your-controlled-test-address"})
db.newsletter_subscribers.countDocuments({email_normalized: "your-controlled-test-address"})
db.newsletter_subscribers.getIndexes()
db.newsletter_subscribers.countDocuments({status: "active", resend_sync_status: {$in: ["pending", "failed"]}})
```

For a later manual export, use MongoDB Compass on this collection: filter `{status:"active",resend_sync_status:{$ne:"suppressed"}}`, Export Data → Export query results → CSV, selecting only needed fields (usually `email`). Save outside the public repo in restricted storage. Do not point the web endpoint at encrypted CSV or commit plaintext subscriber lists. Reconcile delivery suppressions before using an export.

## Verification commands and real launch check

```sh
pnpm install --frozen-lockfile
pnpm newsletter:test
pnpm build
pnpm exec playwright install chromium --no-shell
pnpm newsletter:test:e2e
```

Backend tests use a real disposable local MongoDB binary (downloaded on first run), including 12 concurrent inserts. Browser tests run the production Next build with another disposable MongoDB; they do not use Atlas or Resend secrets. Screenshots go to ignored `test-results/`. This verifies the application path but does not establish live Atlas connectivity or provider/dashboard settings.

Before posting the production signup link:

1. After deploying the patch, open the exact campaign link above and also follow an article CTA (on 375px mobile) with all four LinkedIn campaign identifiers.
2. Submit a fresh **operator-owned test mailbox**; confirm success and directly verify the Mongo document, normalized email, `source`, date, consent version and all four values, including `utm_content: "launch_post_01"`. Also verify signup without `utm_content` stores null.
3. If enabled, verify membership in **CtrlPlane Newsletter** and sync state. In an isolated preview with an invalid Resend key, repeat with another controlled mailbox; Mongo success must survive and sync become failed.
4. Submit the same address again with a different post identifier: duplicate feedback, exactly one record and unchanged original attribution. Submit invalid input: no record. Test the error path in an isolated preview with an unavailable Mongo URI: no false success.
5. Inspect browser URL, network and `dataLayer`: the email appears only in the HTTPS signup request body, never in analytics payloads. With consent, confirm one `newsletter_signup` after HTTP 201 and its post identifier in GTM Preview/GA4 DebugView; no event before success or for duplicate/error responses. Reject analytics consent: signup still succeeds, no signup event. Check deployed GTM/GA4 configuration for automatic user-provided data collection and DOM/form-field variables; disable those for this form. Do not enable request-body capture in hosting logs/error reporting.
6. Confirm completed privacy notice/contact path and mobile layout; remove only the specific test records/contacts after review. Record evidence before calling production launch-ready.

## Deliberately manual / deferred

Current manual newsletter issue workflow: Mongo active subscribers → reconcile suppressions → dedicated Resend Segment → **editorially reviewed** issue → manually sent Broadcast. The operator writes, reviews and initiates issue delivery. The one-time welcome email is the only new signup-triggered message. Newsletter issues must not be triggered by signup, segment entry, sync retries or a schedule. No external automation repository or approval system is required.

Before real sends, reconcile Mongo with the provider's actual unsubscribe/suppression state. P2: a signature-verified, replay-safe Resend webhook (plus periodic/manual reconciliation for missed events) should set Mongo `status=unsubscribed` and `unsubscribed_at`, scoped to the appropriate brand/topic. Until that exists, manually reconcile opt-outs before each approved issue and honor requests received at the verified privacy mailbox. Never bulk-write `unsubscribed:false` to Resend or infer renewed consent from another brand's membership. Independent per-brand preferences may require Resend Topics. Confirm current webhook event contracts when implementing.

Double opt-in, confirmed resubscribe, self-service unsubscribe, automated exports/delivery and segmentation are deferred. Before enabling delivery, configure a verified sender and Resend's unsubscribe mechanism and validate actual unsubscribe behavior; signup does not promise an already working one-click flow.
