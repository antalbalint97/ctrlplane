# Shared GTM and GA4 implementation guide

## Scope and identifiers

- GTM container: GTM-P97RB9PD
- GA4 measurement ID: G-6SMJB8N0RF
- Canonical hosts: www.meniva.net, ctrplane.com, metis.name, nullfal.com
- Brand IDs: meniva, ctrlplane, metis, nullfal
- Strategy: GTM only, with Google Tag send_page_view=false

GTM is loaded by the applications only after analytics consent and only on the canonical production host.

## Google Tag

Create or retain one Google Tag:

- Tag ID: G-6SMJB8N0RF
- Configuration parameter: send_page_view = false
- Trigger: Initialization - All Pages
- Consent requirement: analytics_storage

Disable GA4 Enhanced Measurement browser-history page changes. The applications own initial and SPA pageviews.

## Data Layer Variables

Create Version 2 Data Layer Variables for:

~~~text
brand, brand_id, site_id, site_section, page_type, page_title, page_path,
page_location, page_referrer, canonical_url, content_id, content_title,
content_type, content_category, cta_id, cta_text, cta_location,
source_brand, destination_brand, destination_url, link_domain, method,
file_name, file_url, form_id, asset_id, asset_name, asset_type, asset_category,
asset_brand, offer_id, placement, campaign_id, campaign_name, campaign_type,
landing_page_id, experiment_id, variant_id, variant_name, creative_id,
copy_variant, audience_segment, max_scroll_percent, active_time_seconds,
estimated_reading_time_minutes, percent_scrolled
~~~

Do not create variables for arbitrary query parameters or personal form values.

## Event tags and triggers

Create one Custom Event trigger and one or more shape-specific GA4 Event tags per group. Every tag uses:

- Google Tag: G-6SMJB8N0RF
- Event name: {{Event}}
- Consent requirement: analytics_storage
- Event parameters: common context plus only the group-owned parameters below

Do not attach any GA4 Event tag to page_context, History Change, or arbitrary Custom Events.

### Stateful Data Layer guard

GTM Data Layer Variables read the current model, which can retain a value from an earlier event. Do not add every available DLV to every tag. Use event-name filters or separate tags when the payload shape differs:

- Asset View: asset fields only, no file fields.
- Asset Download: asset fields plus file_url and file_name.
- Generic File Download: file_url and file_name only, no asset or offer fields.
- Article View: content identity only.
- Article Threshold: percent_scrolled and content identity.
- Article Engaged: engagement metrics and content identity.

The raw application push must remain null-free. Do not clear the GTM model with undefined or null values. Conditional tag mapping is the data quality control.

### GA4 Event - Page View

- Trigger: ^page_view$
- Send: common page context and campaign context
- Do not send: CTA, asset, form, article threshold, or experiment-only fields

### GA4 Event - CTA Events

- Trigger: ^(cta_click|consultation_click|article_cta_click|canvas_cta_click|service_card_click|case_study_click|mentoring_cta_click|free_resource_click|tutor_cta_click|roadmap_click|waitlist_click|practice_module_click|nullfal_signup_click|lead_magnet_book_session|lead_magnet_dismiss)$
- Send: cta_id, cta_text, cta_location, destination_url when present, plus common context
- Do not send: asset file fields, form status, or article scroll metrics

### GA4 Event - Asset Events

- Trigger: ^(asset_view|asset_download|file_download)$
- Send for asset_view: asset_id, asset_name, asset_type, asset_category, asset_brand, offer_id, placement, plus common context
- Send for asset_download: the asset fields above plus file_url and file_name
- Send for generic file_download: file_name and file_url only when available
- Do not send: CTA or form fields
- file_download is not emitted for the Meniva canvas action when asset_download has already been sent

### GA4 Event - Form Events

- Trigger: ^(form_(start|submit|error)|newsletter_form_start|newsletter_signup|generate_lead|meniva_contact_(start|submit|success|error|click)|meniva_canvas_(form_start|submit|success|error)|metis_contact_click|metis_mentor_(interest|form_start|form_submit)|sign_up|nullfal_(signup_success|login))$
- Send: form_id, form status, method, success metadata, plus common context and campaign context for the enrichment events
- Do not send: asset file fields or article scroll metrics

### GA4 Event - Content Engagement Events

- Trigger: ^(article_view|article_read_(25|50|75|100)|article_engaged|article_share_click|article_crosslink_click|testimonial_expand|metis_(testimonial_expand|role_view)|nullfal_(start_learning|module_open|practice_start|roadmap_step_open|tutor_open))$
- Send for article_view: content_id, content_title, content_type, and content_category plus common context
- Send for article_read thresholds: content identity, percent_scrolled, and only metrics present for that event
- Send for article_engaged: content identity, content_type, content_category, max_scroll_percent, active_time_seconds, and estimated_reading_time_minutes
- Send campaign context on article_engaged and article_read_75
- Do not send: CTA, form, or asset file fields

### GA4 Event - Cross-brand and Link Events

- Trigger: ^(cross_brand_click|email_click|outbound_social_click|external_link_click|contact_click|youtube_click)$
- Send: source_brand, destination_brand, destination_url, link_domain, method, plus common context
- Do not send: form status, asset fields, or article scroll metrics

### CE - Experiment Events and GA4 Event - Experiment Events

Create a separate Custom Event trigger and tag:

- Trigger: ^(experiment_exposure|offer_view)$
- Send: experiment_id, variant_id, variant_name, campaign_id, offer_id, landing_page_id, placement, plus common context
- Do not send: CTA text, form values, or article scroll metrics

The source helper fires experiment_exposure only after the variant is actually shown. Dedupe is experiment_id + variant_id + page_path per session.

## Manual GTM GUI checklist

1. Keep send_page_view=false on the Google Tag.
2. Confirm consent checks require analytics_storage for the Google Tag and every GA4 Event tag.
3. Create or verify all Data Layer Variables listed above.
4. Create the seven Custom Event triggers with the exact regexes above.
5. Create the seven GA4 Event tags with {{Event}} as the event name.
6. Remove or pause the old universal GA4 Event tag that mapped every Data Layer Variable to every event.
7. Remove deprecated asset names from triggers: lead_magnet_view, meniva_canvas_view, lead_magnet_download, meniva_canvas_download, canvas_download.
8. Confirm page_context and History Change do not fire GA4 Event tags.
9. Preview each canonical domain before publishing.
10. In GA4 DebugView, confirm one asset_download per Meniva canvas download and no PII or raw query strings.
11. Mark article_read_75 and article_engaged as key event candidates only after business approval.
