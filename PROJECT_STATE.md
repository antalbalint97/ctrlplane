# CtrlPlane project state

Updated: 2026-09-10.

## Current

- CtrlPlane is a live publication/site at https://ctrplane.com covering AI, data, work and technology strategy.
- Newsletter subscription is live. The main Next.js application owns `POST /api/subscribe` and subscriber persistence in MongoDB (`ctrlplane.newsletter_subscribers`).
- Resend is part of the current newsletter/contact workflow: saved subscribers are synchronized to the dedicated CtrlPlane Segment when configured. The new local implementation sends one welcome email after a new signup when a verified sender is configured; deployment verification is still required. Contact-sync retries do not send mail.
- GA4/GTM event instrumentation exists, including article engagement and successful newsletter signup, subject to analytics consent.
- Editorial work, newsletter writing and sending are currently manual. The operator reviews each issue and reconciles opt-outs before sending through Resend.

## Current marketing mode

- Initial distribution is primarily through the founder's personal LinkedIn profile.
- CtrlPlane is the publication, article archive and owned-audience layer.
- The current goal is to validate content → article → newsletter subscription behavior, using a distinct `utm_content` identifier for each LinkedIn post.
- Signup captures allowlisted `utm_source`, `utm_medium`, `utm_campaign` and `utm_content` from the signup URL. Article links to the signup section carry these values forward without browser storage or analytics consent. Repeat signups preserve the entire first subscription record; they do not replace or fill missing attribution.
- Analytics separately retains campaign context in session storage with consent. Signup storage does not read that session context; arbitrary navigation that drops URL parameters can lose subscriber attribution. See [newsletter operations](docs/NEWSLETTER_OPERATIONS.md) for the exact behavior and campaign check.

## Not current

- Fully automated newsletter generation, autonomous publishing and autonomous sending are not live.
- A separate CtrlPlane social-media brand operation is not the current distribution model.
- The main application does not depend on the separate `ctrlplane-newsletter-automation` project.
- Canonical email presentation now belongs to this repository in `src/emails/`: shared layout, welcome email and reusable newsletter rendering. See [email templates and welcome delivery](docs/EMAIL_TEMPLATES.md). The separate project may prepare research/drafts in future; autonomous publishing or sending requires explicit human approval and is not introduced here.

## Future / optional

Editorial research assistance, source collection, draft preparation, repurposing assistance and human-reviewed newsletter preparation may be added later. These are possible future capabilities, not live automation.

## Documentation and next checks

- [Newsletter operations](docs/NEWSLETTER_OPERATIONS.md): storage, Resend contact sync, manual workflow and post-level campaign verification.
- [Newsletter verification](docs/NEWSLETTER_VERIFICATION.md): dated evidence and remaining production checks. The `utm_content` patch must be deployed and checked with an operator-owned test mailbox before relying on production attribution.
- [Vercel setup](docs/VERCEL_SETUP.md): existing deployment configuration.
- The root Meniva portfolio backlog was unrelated to active CtrlPlane work and is preserved in [the historical archive](docs/archive/meniva-portfolio-implementation-backlog.md). No separate active CtrlPlane backlog was found; current scope is recorded here.
