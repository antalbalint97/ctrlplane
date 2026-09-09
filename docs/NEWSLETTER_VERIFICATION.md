# Newsletter verification — 2026-09-09

Implementation is local in `ctrlplane`; no deployment was performed. The private newsletter automation repository and Nullfal were read-only context.

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
| Production read-only check | Homepage and privacy return 200; `/api/subscribe` returns 404; live privacy still has old placeholder |
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

## Launch status

**NOT READY TO LAUNCH**

Actual remaining blockers:

1. Install the verified `MONGODB_URI`, `MONGODB_DB_NAME=ctrlplane`, `RESEND_API_KEY` and `RESEND_SEGMENT_ID` in the public CtrlPlane deployment. Atlas writes and live Resend Segment synchronization are now verified through the local production app.
2. Confirm controller/contact and outstanding privacy retention/processor details; finish the notice.
3. Deploy this implementation and complete an operator-owned-mailbox browser→Atlas smoke test on the real environment, including duplicate/mobile checks and deployed analytics configuration inspection.

Optional Resend configuration does not block saving newsletter subscriptions. Live contact sync and domain verification pass; actual sender/delivery and unsubscribe behavior must still be tested before newsletter delivery is enabled. See [operations handoff](NEWSLETTER_OPERATIONS.md).
