# Cross-brand analytics tracking contract

This contract applies to Meniva, Metis, CtrlPlane, and Nullfal.

## Measurement strategy

- GTM container: GTM-P97RB9PD
- GA4 measurement ID configured in GTM: G-6SMJB8N0RF
- Strategy: GTM only
- Google Tag send_page_view: false
- Direct gtag.js, gtag('config'), and direct GA4 pageview calls: not allowed

GTM loads only on the canonical production host and after analytics consent. Events pushed before the GTM script finishes loading remain queued in window.dataLayer.

## Raw payload rules

All application events use pushDataLayerEvent(eventName, params).

- Every application event receives a fresh object.
- undefined, null, gtm, tagTypeBlacklist, and keys beginning with gtm. are removed.
- String values are limited to 120 characters.
- The helper owns the event property.
- page_location, canonical_url, and page_referrer omit query strings and hashes.
- Only the allowlisted campaign parameters are read from the URL. Arbitrary query parameters are never sent.

The technical gtm.js bootstrap object may contain the standard gtm.start key. It is not copied into application analytics events.

Every application event receives these common fields:

~~~text
brand
brand_id
site_id
site_section
page_type
page_title
page_path
page_location
canonical_url
page_referrer   optional, only when non-empty
~~~

Content routes may additionally receive content_id and content_title.

Brand defaults:

~~~text
meniva     site_id=meniva_web
metis      site_id=metis_web
ctrlplane  site_id=ctrlplane_web
nullfal    site_id=nullfal_web
~~~

## Page views

trackPageView() is the only official pageview source. It pushes exactly two events in order:

~~~text
page_context
page_view
~~~

page_context is technical state only and must not trigger a GA4 Event tag. page_view is the GA4 event. The same consecutive route key is suppressed, while A -> B -> A remains valid.

The page_view event receives stored campaign context. The technical page_context event does not, which prevents campaign state from being mistaken for permanent page state.

## Event taxonomy v2

### Asset events

The canonical asset events are:

~~~text
asset_view
asset_download
~~~

Meniva's AI Use Case Triage Canvas uses:

~~~text
asset_id=ai_use_case_triage_canvas
asset_name=AI Use Case Triage Canvas
asset_type=canvas
asset_category=lead_magnet
asset_brand=meniva
offer_id=meniva_ai_use_case_triage_canvas_v1
placement=engagement_popup
~~~

asset_download also sends file_url and file_name. One download action produces one business download event. The deprecated lead_magnet_view, meniva_canvas_view, lead_magnet_download, meniva_canvas_download, and canvas_download events are no longer emitted. file_download remains generic file tracking only and is suppressed for the Meniva asset link.

### Article engagement

CtrlPlane article routes preserve article_read_25, article_read_50, article_read_75, and article_read_100.

article_engaged fires once per article lifecycle after both conditions are true:

~~~text
max_scroll_percent >= 50
active_time_seconds >= 60
~~~

Active time is accumulated only while the document is visible and focused. Background-tab time is excluded. The payload includes content_id, content_title, content_type=article, content_category, max_scroll_percent, active_time_seconds, and estimated_reading_time_minutes.

article_read_75 and article_engaged are key event candidates. Mark them in GA4 only after business agreement.

### Campaign, offer, and experiment context

The helper parses and session-persists only these fields:

~~~text
utm_source, utm_medium, utm_campaign, utm_id, utm_content, utm_term,
utm_source_platform, campaign_id, campaign_name, campaign_type, offer_id,
landing_page_id, experiment_id, variant_id, variant_name, creative_id,
copy_variant, placement, audience_segment
~~~

Campaign context is added to:

~~~text
page_view, asset_view, asset_download, cta_click, consultation_click,
form_start, form_submit, generate_lead, article_engaged, article_read_75,
newsletter_signup, sign_up
~~~

trackExperimentExposure() sends experiment_exposure only when a variant is actually shown. It deduplicates experiment_id + variant_id + page_path in the current session. Its payload includes experiment_id, variant_id, variant_name, campaign_id, offer_id, landing_page_id, and placement when available.

No names, email addresses, phone numbers, message bodies, arbitrary query values, or other PII may enter the data layer or GA4.

## GTM event groups

The universal GA4 Event tag has been retired. Each group sends common context plus only the event-specific fields listed for that group. Because the GTM data model is stateful, fields must also be mapped conditionally by event shape. If a single tag cannot omit a field for a specific event, split that tag inside the group.

| Group | Custom Event trigger regex | Event name strategy | Event-specific parameters | Do not send |
| --- | --- | --- | --- | --- |
| Page View | ^page_view$ | Keep {{Event}} as page_view | Campaign and page context | CTA, asset, form, article threshold fields |
| CTA Events | ^(cta_click|consultation_click|article_cta_click|canvas_cta_click|service_card_click|case_study_click|mentoring_cta_click|free_resource_click|tutor_cta_click|roadmap_click|waitlist_click|practice_module_click|nullfal_signup_click|lead_magnet_book_session|lead_magnet_dismiss)$ | Stable interaction event name, no renaming in GTM | cta_id, cta_text, cta_location, destination fields when present | Asset file fields, form status, article scroll metrics |
| Asset Events | ^(asset_view|asset_download|file_download)$ | asset_view and asset_download are canonical; file_download is generic | asset_view: asset fields; asset_download: asset and file fields; file_download: generic file fields only | CTA fields and form fields; no duplicate generic file event for the canvas; never reuse asset fields for generic file_download |
| Form Events | ^(form_(start|submit|error)|newsletter_form_start|newsletter_signup|generate_lead|meniva_contact_(start|submit|success|error|click)|meniva_canvas_(form_start|submit|success|error)|metis_contact_click|metis_mentor_(interest|form_start|form_submit)|sign_up|nullfal_(signup_success|login))$ | Keep the source event name | form_id, form status, method, destination, success metadata | Asset fields and scroll metrics |
| Content Engagement Events | ^(article_view|article_read_(25|50|75|100)|article_engaged|article_share_click|article_crosslink_click|testimonial_expand|metis_(testimonial_expand|role_view)|nullfal_(start_learning|module_open|practice_start|roadmap_step_open|tutor_open))$ | Keep source event names; retain article threshold events | article_view: content identity; threshold events: percent_scrolled; article_engaged: full engagement metrics | CTA, form, asset file fields, and scroll metrics on article_view unless conditionally mapped |
| Cross-brand / Link Events | ^(cross_brand_click|email_click|outbound_social_click|external_link_click|contact_click|youtube_click)$ | Keep source link event name | source_brand, destination_brand, destination_url, link_domain, method | Article thresholds and form status |
| Experiment Events | ^(experiment_exposure|offer_view)$ | Keep experiment_exposure and offer_view | experiment_id, variant_id, variant_name, campaign_id, offer_id, landing_page_id, placement | CTA text, form fields, article scroll metrics |

## GTM Data Layer Variables

Create Version 2 Data Layer Variables for the common fields and these v2 fields:

~~~text
asset_id
asset_name
asset_type
asset_category
asset_brand
offer_id
campaign_id
campaign_name
campaign_type
landing_page_id
experiment_id
variant_id
variant_name
creative_id
copy_variant
audience_segment
max_scroll_percent
active_time_seconds
estimated_reading_time_minutes
content_type
content_category
~~~

Keep existing variables for cta_id, cta_text, cta_location, file_url, file_name, form_id, method, source_brand, destination_brand, destination_url, and link_domain.

## Manual verification

1. In Tag Assistant, verify no analytics object event appears before consent.
2. Verify one page_context followed by one page_view per route.
3. Verify asset_view when the Meniva popup becomes visible.
4. Verify one asset_download and no deprecated or duplicate download event on one canvas click.
5. On CtrlPlane, verify article thresholds and wait for 50% scroll plus 60 seconds of focused, visible time before article_engaged.
6. Open a campaign URL, navigate to another route, and verify the allowlisted context persists without arbitrary query values.
7. Render an experiment variant and verify one experiment_exposure per experiment, variant, and page path in the session.
