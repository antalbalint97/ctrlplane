# Newsletter verification — 2026-09-09

Historical validation below distinguishes local production-build checks, real provider smoke tests and public deployment checks. Other repositories were read-only context for that earlier audit; the main application has no runtime dependency on them. Current operating mode is recorded in [PROJECT_STATE.md](../PROJECT_STATE.md).

| Check | Result |
| --- | --- |
| TypeScript / production Next build | Pass; Node `/api/subscribe` route present |
| Backend tests | 12 pass, real disposable MongoDB |
| Browser tests | 8 pass, Chromium, production build + disposable MongoDB |
| Existing content tests | 11 pass |
| Concurrent duplicate insertion | 12 requests → 1 new document, 11 duplicate responses |
| Mongo persistence | Browser success directly checked against normalized email, source, BSON timestamp, UTM and sync state |
| Resend failure / manual retry | Stubbed provider failure preserves active Mongo subscriber and 201; retry updates same record |
| Previous unsubscribe | Preserved; no reactivation or duplicate record |
| Analytics | No signup event without consent; with consent one event without email; throwing dataLayer does not break signup |
| Mobile | 375×812 article→signup, UTM preserved, successful submit, no horizontal overflow |
| Client boundary | Built client chunks contain no `MONGODB_URI`, `RESEND_API_KEY`, Mongo driver or server-only imports |
| Public source UI | No `REQUIRED_USER_INPUT` placeholder |
| Public deployment check after PR #13 | `/api/subscribe` is deployed: an invalid-address request returns HTTP 422 `invalid_email` without a database write. This does not establish that production provider env values have been configured |
| Resend configuration | New operator-supplied API key authenticates; configured Segment resolves to **CtrlPlane Newsletter** |
| Atlas database creation | `ctrlplane.newsletter_subscribers` verified in the shared Nullfall free cluster; unique `newsletter_email_unique` index exists on `email_normalized` |
| Updated Atlas URI | Connection, ping, index creation, insert, read and targeted test-record deletion pass with the operator's replacement user |
| Real Atlas browser smoke | Local production Next build, mobile 375×812: HTTP 201 and actual Mongo document; normalized email, source, BSON timestamp, consent version and UTM verified; second submission HTTP 200 `already_subscribed`, exactly one record; invalid input HTTP 422; no email in browser URL/dataLayer; no horizontal overflow |
| Atlas smoke cleanup | Exactly one synthetic test record removed; absence verified. Resend disabled, no contact sync or email delivery. Screenshot: ignored `.local/atlas-signup-mobile.png` |
| Live Atlas + Resend browser smoke | Local production Next build, mobile browser: HTTP 201 → Atlas subscriber → Resend contact in the configured CtrlPlane Segment → Mongo `resend_sync_status=synced`, contact ID and sync timestamp verified. Duplicate returns 200, one Mongo record and unchanged contact ID; email absent from browser URL/dataLayer |
| Full integration cleanup | Synthetic Resend contact deleted and subsequent GET returns 404; synthetic Mongo subscriber deleted and absence verified. No email sent; Resend automation list was empty before testing |
| Resend sending domain | `ctrplane.com` verified; TXT `resend._domainkey`, CNAME `rsend`, CNAME `send` all verified; sending enabled, receiving disabled |

The first build's Google Fonts fetch failed under local TLS. Setting `NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS=1` for the build fixed it without changing production code or disabling certificate validation. Chromium downloaded successfully; the optional headless-shell download failed, so tests use the installed full Chromium channel. First Mongo test run downloads a local MongoDB binary. The later real-Atlas smoke test created and removed one synthetic subscriber; no email delivery occurred.

Browser tests found and fixed (1) origin comparison against Next's internal hostname and (2) unhandled analytics queue errors. Both have regression coverage. The manual recovery command rejects missing Resend configuration with a fixed, non-sensitive error and nonzero exit.

## Current operating status — 2026-09-10

The publication and newsletter signup are live per the current operating status supplied by the operator. Editorial work and sending are manual. The earlier launch-blocker list is historical; it is not evidence that the current signup is a placeholder. The public [privacy page](https://ctrplane.com/privacy) was read on 2026-09-10 and contains the completed notice, including campaign source/medium/campaign storage.

The new `utm_content` patch still needs deployment and an operator-owned-mailbox browser→Atlas check, including duplicate/mobile behavior, Resend contact sync and GTM Preview/GA4 DebugView. Local tests do not certify deployed provider configuration or GA4 ingestion. See the exact campaign URL and checks in [newsletter operations](NEWSLETTER_OPERATIONS.md).

Privacy follow-up (2026-09-10): operator confirmed controller name, address and `info@meniva.net` contact; these are now public page content with no privacy env dependency. The notice covers newsletter/hosting/analytics, retention criteria, service providers/international transfers, requests and complaints. Operational request handling and retention remain manual/provider-configured as documented in VERCEL_SETUP.md.

Optional Resend configuration does not block saving newsletter subscriptions. Live contact sync and domain verification pass; actual sender/delivery and unsubscribe behavior must still be tested before newsletter delivery is enabled. See [operations handoff](NEWSLETTER_OPERATIONS.md).

## LinkedIn attribution patch — 2026-09-10

Changed files: `src/lib/newsletter/contract.ts`, `src/app/privacy/page.tsx`, `tests/newsletter.test.ts`, `tests/browser/newsletter.spec.ts`, `PROJECT_STATE.md`, `docs/NEWSLETTER_OPERATIONS.md`, this verification document, and the move of root `implementation_backlog.md` to `docs/archive/meniva-portfolio-implementation-backlog.md` with an origin/status header. Pre-existing local changes were preserved.

The shared contract now includes nullable `utm_content`, so existing client capture, article signup links, API sanitization and the Mongo subscriber type/insert carry it end-to-end. Previously only source/medium/campaign were persisted. No handler, component, Mongo index, Resend payload or analytics architecture change was needed. Signup keeps its original URL-based attribution and insert/duplicate behavior, including leaving legacy missing values and original nulls untouched. No migration or backfill is required.

Privacy copy adds only the post/creative identifier and clarifies that it can identify which LinkedIn post led to signup. Project state now describes the live site/signup, main-app persistence, Resend contact workflow, manual editorial/sending mode, personal-profile LinkedIn distribution and optional future assistance. Historical Meniva tasks and dated verification evidence remain available; obsolete launch status and external automation approval dependency claims were corrected.

| Local check | Result |
| --- | --- |
| `pnpm run lint` | Unavailable: no lint script, linter dependency or repository lint configuration exists; no lint tooling added for this patch |
| `pnpm exec tsc --noEmit` | Pass |
| `pnpm newsletter:test` | 15 pass with disposable MongoDB |
| `pnpm newsletter:test:e2e` | 10 pass, Chromium against production build and disposable MongoDB |
| `pnpm content:test` | 11 pass |
| `pnpm content:check` | Pass |
| `pnpm build` | Pass; existing system-TLS-certificate build workaround used, certificate validation retained |
| Diff review / `git diff --check` | Pass; task changes compared against a pre-edit snapshot because the checkout already contained uncommitted work |

Regression coverage includes all four campaign fields, signup without content, unsafe values and the 100-character boundary, raw Mongo persistence, concurrent first insert, repeat signup with different/missing values, legacy records, opt-outs and Resend retries. Browser coverage verifies article→form propagation on mobile, email campaign filtering, successful HTTP response handling, no signup analytics before the real response reaches the form, exactly one event after success, and no event for duplicates/errors or denied consent.

No production subscriber/contact writes or newsletter sends were made for this patch. Deployment and the operator-owned-mailbox checks in [newsletter operations](NEWSLETTER_OPERATIONS.md#verification-commands-and-real-launch-check) remain manual: verify all four Mongo values, Resend Segment membership, first-subscription preservation, the deployed privacy copy and actual GTM/GA4 event delivery.
