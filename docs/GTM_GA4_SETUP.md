# Shared GTM + GA4 implementation guide

## Scope and identifiers

- GTM container: `GTM-P97RB9PD`
- GA4 measurement ID: `G-6SMJB8N0RF`
- Canonical hosts: `www.meniva.net`, `ctrplane.com`, `metis.name`, `nullfal.com`
- Brand IDs: `meniva`, `ctrlplane`, `metis`, `nullfal`
- Meniva Clarity: `ta4edlltm9` (loaded in Meniva code only, after consent)
- Retired Meniva GA4 ID: `G-FE1M458W4C`

The applications default all four Consent Mode v2 storage keys to denied. They do not load GTM until analytics consent is granted. GTM is also gated to each canonical production hostname, so previews, aliases, and localhost do not send analytics.

## Environment variables

Next.js sites support:

```dotenv
NEXT_PUBLIC_GTM_ID=GTM-P97RB9PD
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_BRAND_ID=meniva
NEXT_PUBLIC_SITE_URL=https://www.meniva.net
```

Nullfal supports equivalent `REACT_APP_*` names. Committed defaults make the supplied public GTM identifier work before platform variables are added. Set brand and site URL independently in every Vercel project.

## GTM container configuration

**MANUAL_ACTION_FOR_BALINT:** The following is a dashboard task; source code cannot publish the GTM container.

1. In GTM, enable the built-in consent overview and consent variables.
2. Create Data Layer Variables (Version 2) for: `brand`, `brand_id`, `page_type`, `page_title`, `page_path`, `canonical_url`, `content_id`, `content_title`, `cta_id`, `cta_text`, `cta_location`, `source_brand`, `destination_brand`, `destination_url`, `link_domain`, `file_name`, `form_id`, `method`, `asset_id`, `percent_scrolled`, and `testimonial_index`.
3. Create a Google Tag:
   - Tag ID: `G-6SMJB8N0RF`
   - Configuration parameter: `send_page_view` = `false`
   - Trigger: Initialization - All Pages
   - Consent requirement: `analytics_storage`
4. Create a Custom Event trigger named `CE - Approved analytics events`, using:
   ```text
   ^(page_view|cta_click|cross_brand_click|outbound_social_click|external_link_click|contact_click|email_click|file_download|form_start|form_submit|form_error|newsletter_form_start|newsletter_signup|generate_lead|article_view|article_read_(25|50|75|100)|article_cta_click|article_share_click|article_crosslink_click|canvas_cta_click|canvas_download|consultation_click|meniva_contact_click|service_card_click|case_study_click|mentoring_cta_click|testimonial_expand|free_resource_click|metis_contact_click|youtube_click|tutor_cta_click|roadmap_click|waitlist_click|practice_module_click|meniva_contact_(start|submit|success|error)|meniva_canvas_(view|form_start|submit|success|error|download)|metis_mentor_(interest|form_start|form_submit)|metis_role_view|sign_up|nullfal_(signup_click|signup_success|login|start_learning|module_open|practice_start|roadmap_step_open|tutor_open))$
   ```
5. Create one GA4 Event tag:
   - Google Tag: `G-6SMJB8N0RF`
   - Event name: `{{Event}}`
   - Add all data-layer variables above as event parameters with unprefixed names.
   - Trigger: `CE - Approved analytics events`
   - Consent requirement: `analytics_storage`
6. Do not trigger on `page_context`. It updates the GTM data model immediately before a consented `page_view`.
7. Publish only after Preview mode confirms no tag before consent, one page view after acceptance, and one more per client-side route change.

## GA4 Admin configuration

**MANUAL_ACTION_FOR_BALINT:** These are manual dashboard tasks and are not claimed as completed.

1. Confirm the web stream uses `G-6SMJB8N0RF`.
2. Disable Enhanced Measurement’s browser-history page changes; the apps emit explicit initial and SPA page views.
3. Under Configure your domains, add all four canonical hosts.
4. Add canonical hosts to unwanted referrals only if testing reveals self-referrals.
5. Register custom dimensions: `brand`, `page_type`, `content_id`, `content_title`, `cta_id`, `cta_location`, `source_brand`, `destination_brand`, `form_id`, and `method`.
6. After each event first arrives, mark the agreed key events: `newsletter_signup`, `article_read_75`, `canvas_download`, `contact_click`, `consultation_click`, `cross_brand_click`, `outbound_social_click`, `mentoring_cta_click`, and `sign_up`/`nullfal_signup_success`.
7. Create audiences only after enough consented traffic exists.

## Event and privacy rules

- Never send names, emails, usernames, passwords, source code, message bodies, search text, or query strings.
- Success events fire only after a successful backend response.
- CtrlPlane newsletter success stays dormant until a provider confirms it.
- Metis mentor form success stays dormant because no application form currently exists.
- Meniva canvas download stays dormant until a real delivery/download action exists.
- No paid-media pixels are installed.
- Clarity is Meniva-only and consent-gated.

## Verification checklist

1. Clear storage and cookies.
2. Before consent, verify denied consent and `page_context` in `dataLayer`, with no GTM/GA/Clarity requests.
3. Reject, reload, and confirm no analytics requests or cookies.
4. Accept and verify GTM loads, analytics is granted, ads remain denied, and exactly one initial page view reaches DebugView/Realtime.
5. Navigate client-side and verify one new page context plus one page view.
6. Exercise controlled events without exposing personal data.
7. Revoke through Cookie settings; active-tag sessions reload after updating consent to denied.
8. Verify aliases redirect and previews never load GTM.
