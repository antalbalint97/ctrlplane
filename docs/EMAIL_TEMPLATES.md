# CtrlPlane email presentation and welcome delivery

## Ownership and migration

The main CtrlPlane repository owns canonical email presentation: `src/emails/CtrlPlaneEmailLayout.ts`, `WelcomeEmail.ts`, and `NewsletterEmail.ts`. The standalone application renders them without reading another repository. Newsletter composition and issue sending remain manual/editorial. Future research/draft assistance may supply reviewed content; it must not autonomously publish or send without explicit human approval.

The source inspected was `ctrlplane-newsletter-automation` at `a10d8b2f0b56969a78a7637dee38e49e914871df`. The root `CtrlPlane Radar - Newsletter (Light).html` is an older placeholder design using SVG, web fonts and flex layouts. Its working email-compatible successor is the presentation section of `src/ctrlplane_intel/newsletter.py` (`NewsletterShell`, `Masthead`, cards, footer and HTML/text renderers). `sender_export.py` adds Sender.net-specific unsubscribe tokens; delivery elsewhere uses Gmail SMTP, not Resend or React Email. These presentation implementations are superseded for future CtrlPlane work by the main repository. The automation repository was inspected only and remains intact.

The TypeScript port retains the working renderer's 640px table layout, inline CSS, Outlook conditional table, 36px outer/32px section spacing, Arial/Helvetica and Consolas/Courier fallbacks, and original palette (`#EEF0F3`, `#FBFBFD`, `#3B6FF6`, `#E4E6EB`). The existing `public/brand/logo-icon.png` replaces its CSS letter-C fallback; the brand name stays readable with remote images blocked. No new asset, React Email, Python runtime or rendering dependency is needed.

Newsletter presentation retains TL;DR, stories (what/context/why/take/sources), papers/status/tags, repositories, watchlist and provenance sections. An optional CTA uses the original light HTML design's button treatment. The source's claim that tracking parameters were removed is omitted: this renderer validates HTTPS links but does not claim to clean editorial URLs. The footer replaces obsolete placeholder controls and Sender tokens with actual archive/privacy links and a mailto unsubscribe request. There is no preferences page or one-click unsubscribe endpoint. The current operator processes requests manually in MongoDB and Resend.

`NewsletterContent` is presentation data, not a pipeline: an editor supplies `newsletter_name`, `issue_date`, `issue_id`, `weekday`, `tldr`, section arrays and optional CTA. Text is escaped; source/CTA URLs must be HTTPS without credentials. No raw editorial HTML is accepted. `NewsletterEmail(content)` and `WelcomeEmail()` return `{subject, html, text}`. No newsletter send/export-to-provider command is introduced.

## New signup and failure policy

1. Existing validation and unique normalized-email insertion remain unchanged, including all four UTM fields and `newsletter-2026-09-10` consent version.
2. Only a genuinely new insert schedules the existing Next.js `after()` callback. HTTP 201 `success` means the Mongo subscription exists, independent of email delivery.
3. The callback syncs the Resend contact/Segment. Existing local/provider suppression prevents welcome delivery. Missing or failed sync never permits a welcome send.
4. With a valid `RESEND_FROM_EMAIL`, the callback sends the fixed welcome subject `Üdv a CtrlPlane-en` with HTML and plain text via [Resend POST /emails](https://resend.com/docs/api-reference/emails/send-email). It uses the existing API key, `reply_to: info@meniva.net`, and a mailto `List-Unsubscribe` header. It does not claim RFC 8058 one-click support.
5. Mongo atomically claims `pending` → `sending` before the request, so concurrent callbacks cannot send twice. The provider key is `ctrlplane-welcome/<subscriber ObjectId>`; it contains no email address. [Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys) lasts 24 hours; the application status guard persists beyond that window.

Sync has its existing 6-second bound; welcome POST has an 8-second timeout. A 1.1-second pause separates the contact-request burst from the send inside the existing 30-second function budget. This is not a shared rate limiter; concurrent traffic may still be rejected by Resend and is recorded as a failure.

Duplicate/already-subscribed requests return 200, never reschedule welcome, and never rewrite original attribution, consent or timestamps. No historical records are enrolled. `pnpm newsletter:sync` remains contact recovery only and never sends welcome or newsletter mail. Analytics still fires once after confirmed HTTP 201 and consent; email content/status/addresses do not enter GTM/GA4.

## Subscriber observability

New inserts initialize these fields. They are optional on legacy documents; no migration/backfill is required. No message body, raw exception, recipient address in logs, or new event collection is stored.

| Field | Meaning |
| --- | --- |
| `welcome_email_status` | `pending`, `sending`, `sent`, `failed`, or `skipped` |
| `welcome_email_attempted_at` | BSON date set at the atomic send claim, null before it |
| `welcome_email_sent_at` | BSON date of successful Resend acceptance, null otherwise |
| `welcome_email_resend_id` | Provider message ID when returned and stored successfully |
| `welcome_email_error_code` | Null or fixed code: `not_configured`, `suppressed`, `contact_sync_failed`, `send_failed` |

`sent` means Resend accepted the request, not that the inbox received it. Missing config and opt-outs produce `skipped`; failed sync produces `failed` without a send attempt; HTTP errors, malformed responses and timeouts produce `failed` with an attempt timestamp. None changes subscriber `active` status or the successful browser response. The successful path and failures log fixed event codes only.

If scheduling/process execution stops before a claim, the record may stay `pending`. If execution or the final Mongo write stops after a claim/provider acceptance, it may stay `sending` with an unknown delivery outcome. A timeout/malformed response can also hide a successful provider send. There is intentionally no automatic welcome retry or bulk/manual send command. Investigate the attempt date, Resend logs/idempotency key and suppression state before any individually reviewed recovery; never blindly reset `sending`/`failed` to `pending`, especially outside the provider's 24-hour window. Original subscribers must not receive backfilled welcomes.

## Configuration and local preview

Keep `RESEND_API_KEY` and `RESEND_SEGMENT_ID`. Add only `RESEND_FROM_EMAIL`, a plain mailbox on a verified Resend domain chosen by the operator. It is not a secret; the existing key must have sending permission. Blank/invalid sender disables welcome. No environment secrets are loaded by the preview command, and it performs no sends or database access.

```sh
pnpm email:preview
```

Open `.local/email-preview/welcome.html` and `newsletter.html` in a browser. Plain-text counterparts are adjacent. `src/emails/preview-data.ts` is clearly labelled synthetic data covering every newsletter section. This replaces the old Python render/HTML-artifact workflow for presentation review; there is no admin UI. Remote logo loading is the only external image request. For real email-client compatibility, check Gmail, Outlook and mobile after an operator-controlled test send.

```sh
pnpm newsletter:test
pnpm email:test
pnpm exec tsc --noEmit
pnpm build
pnpm newsletter:test:e2e
```

Tests use disposable MongoDB and stubbed provider responses. Browser tests explicitly disable sender/key/Segment configuration. No live email is sent by these checks. See [verification results](NEWSLETTER_VERIFICATION.md).

## Production verification

After review/deployment, configure the verified sender and existing key/Segment, then submit a fresh operator-owned mailbox. Verify one active Mongo record with four UTMs and consent version, successful contact sync, one welcome provider ID, actual inbox delivery, branding/links and Reply-To. Repeat the signup and verify no second message or analytics event. In isolated Preview, test provider failure and confirm subscription success with recorded failure. Check the existing mailbox unsubscribe procedure in both Mongo and Resend. No production smoke send was performed during local implementation.
