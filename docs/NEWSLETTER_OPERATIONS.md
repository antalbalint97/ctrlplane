# Newsletter launch handoff

## Storage and infrastructure audit

`POST /api/subscribe` → MongoDB Atlas `ctrlplane.newsletter_subscribers` → HTTP 201 → optional Resend contact sync using Next.js `after()`.
MongoDB is canonical. No mail is sent by signup or the retry command. The private automation repository, collectors, encrypted CSV files and delivery approval gate are unchanged.

Nullfal uses a process-level Python Motor client, `MONGO_URL`, validated `DB_NAME`, TLS certificates and Resend SMTP. The operator has created `ctrlplane.newsletter_subscribers` in the existing **Nullfall** free Atlas cluster (confirmed by their Data Explorer screenshot). No separate cluster is needed. The operator authorized reusing the Atlas URI from Nullfal/Railway; map `MONGO_URL` to CtrlPlane's `MONGODB_URI`, but set `MONGODB_DB_NAME=ctrlplane` independently. The explicit database selection overrides any database name in the URI. Nullfal's runtime code and data remain independent.

The operator supplied an updated Atlas URI for a user with CtrlPlane access in ignored `ctrlplane/.env.local`. Connection, ping, unique index creation and actual subscriber writes now pass. The local production Next build was tested through a mobile browser against this real Atlas database: signup persisted, duplicate signup kept one record, invalid input was rejected, and the synthetic test record was deleted with cleanup verified. Resend sync was disabled during this smoke test. No new cluster or Nullfal data changes were needed. The verified URI/database configuration still needs to be installed in the public CtrlPlane deployment.

The Node driver reuses one pool per warm process (maximum 5 application connections, idle minimum 0); development hot reload shares the cache. Failed connections/index initialization are retryable. Writes use majority acknowledgement; timeouts bound database failures. See [MongoDB connection pools](https://www.mongodb.com/docs/drivers/node/current/connect/connection-options/connection-pools/).

## Configuration and launch actions

Set server environment variables in the existing CtrlPlane Vercel project's Production environment; use a separate test database for Preview. Redeploy after setting them.

```dotenv
MONGODB_URI=<tested CtrlPlane Atlas URI from local .env.local>
MONGODB_DB_NAME=ctrlplane

# Optional: enable only when BOTH are configured
RESEND_API_KEY=<Resend API key with contact management access>
RESEND_SEGMENT_ID=<dedicated CtrlPlane Newsletter segment UUID>
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
| `consent_version` | Server-owned `newsletter-2026-09-09`; timestamp is `subscribed_at` |
| `utm_source`, `utm_medium`, `utm_campaign` | Nullable campaign identifiers, max 100 ASCII letters/digits/underscore/hyphen |
| `resend_contact_id` | Nullable provider contact ID |
| `resend_sync_status` | `pending`, `synced`, `failed`, `suppressed` |
| `resend_last_sync_at` | Nullable last completed attempt timestamp |

The request requires `newsletter_consent: true`, supplied only by the dedicated form submit, whose adjacent text states the newsletter purpose. No extra checkbox was added. This is a product implementation based on an explicit affirmative action, not a legal certification; see [EDPB consent guidance](https://www.edpb.europa.eu/sme/be-compliant/process-personal-data-lawfully_en). Client-supplied status/timestamps/internal state are ignored. No IP address is stored.

New subscriber: 201 `success`. Active duplicate: 200 `already_subscribed`, preserving original data. Prior unsubscribe/provider suppression: 409 `unsubscribed`, with no automatic reactivation. Invalid email: 422; missing consent/bad JSON/honeypot/oversized body: 400; cross-site origin: 403; unsupported content type: 415; database failure: 503. Responses contain only a status code string, never the submitted email. A network timeout can mean the write committed but its response was lost; retry safely yields the duplicate state.

Abuse minimum: server validation, 4 KiB streaming body limit, honeypot, JSON-only and same-origin browser checks, database uniqueness. No shared rate limiter/CAPTCHA is introduced; origin and honeypot checks are not protection against determined direct API bots. Add deployment rate rules if abuse is observed.

Navbar and footer already link to `/#feliratkozas`; article-end CTA now does too. Campaign identifiers follow article→signup links without cookies/storage, including without analytics consent. The existing hero remains focused on the featured article. No separate landing page or popup is needed.

## Resend and manual recovery

Live provider verification: `ctrplane.com` is **verified**; TXT `resend._domainkey` and CNAME records `rsend` and `send` are verified, sending enabled, receiving disabled. No Resend automations were configured at test time. No email was sent. Sender selection, approved issue delivery and unsubscribe behavior still require the separate delivery check.

Resend has [migrated Audiences to Segments](https://resend.com/docs/dashboard/segments/migrating-from-audiences-to-segments); this implementation uses `RESEND_SEGMENT_ID`, **not** the deprecated Audience API. Contacts are global within an account; segment membership keeps the CtrlPlane recipient list separate, but global opt-out can affect multiple brands. Use a separate Resend account if independent global contact/opt-out domains are required.

After the Mongo commit/response, [Next.js `after()`](https://nextjs.org/docs/app/api-reference/functions/after) runs a bounded API lookup then contact creation/segment membership. Existing global opt-outs are never explicitly reset; they become `suppressed` locally and are not added to the segment. New contact creation omits `unsubscribed:false`. No welcome mail/broadcast is sent. A provider error leaves the signup successful and marks sync `failed`; interrupted work can remain `pending`. If state recording also fails, fixed log code `newsletter_resend_state_write_failed` signals it. Logs never print raw errors, URIs, request bodies or addresses.

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

1. Open production/preview, follow an article CTA (also on 375px mobile) to `/#feliratkozas` with LinkedIn campaign identifiers.
2. Submit an **operator-owned test mailbox**; confirm success and directly verify the Mongo document, normalized email, `source`, date, consent version and attribution.
3. If enabled, verify membership in **CtrlPlane Newsletter** and sync state. In an isolated preview with an invalid Resend key, repeat with another controlled mailbox; Mongo success must survive and sync become failed.
4. Submit the same address again: duplicate feedback and exactly one record. Submit invalid input: no record. Test the error path in an isolated preview with an unavailable Mongo URI: no false success.
5. Inspect browser URL, network and `dataLayer`: the email appears only in the HTTPS signup request body, never in analytics payloads. Reject analytics consent: signup still succeeds, no signup event. Check deployed GTM/GA4 configuration for automatic user-provided data collection and DOM/form-field variables; disable those for this form. Do not enable request-body capture in hosting logs/error reporting.
6. Confirm completed privacy notice/contact path and mobile layout; remove only the specific test records/contacts after review. Record evidence before calling production launch-ready.

## Deliberately manual / deferred

Future delivery: Mongo active subscribers → reconcile suppressions → dedicated Resend Segment → **editorially approved** issue → manually approved Broadcast. Do not trigger delivery on signup, segment entry, sync retries or a schedule. The private repository's approval gate remains authoritative.

Before real sends, reconcile Mongo with the provider's actual unsubscribe/suppression state. P2: a signature-verified, replay-safe Resend webhook (plus periodic/manual reconciliation for missed events) should set Mongo `status=unsubscribed` and `unsubscribed_at`, scoped to the appropriate brand/topic. Until that exists, manually reconcile opt-outs before each approved issue and honor requests received at the verified privacy mailbox. Never bulk-write `unsubscribed:false` to Resend or infer renewed consent from another brand's membership. Independent per-brand preferences may require Resend Topics. Confirm current webhook event contracts when implementing.

Double opt-in, confirmed resubscribe, self-service unsubscribe, automated exports/delivery and segmentation are deferred. Before enabling delivery, configure a verified sender and Resend's unsubscribe mechanism and validate actual unsubscribe behavior; signup does not promise an already working one-click flow.
