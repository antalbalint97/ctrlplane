# Analytics v2 audit report

## Scope

Audited the analytics helpers and event sources for Meniva, Metis, CtrlPlane, and Nullfal. The implementation remains GTM-only with container GTM-P97RB9PD and GA4 measurement ID G-6SMJB8N0RF.

## Findings fixed

1. Meniva's canvas action emitted multiple overlapping download and view events. The source now emits one asset_view and one asset_download with the required asset metadata.
2. Generic PDF detection is suppressed for the Meniva canvas link, so file_download cannot duplicate the business asset download.
3. The deprecated asset event names are removed from the helper allowlists and no longer emitted by the popup.
4. All four helpers now parse an allowlisted campaign context and persist it in session storage.
5. Campaign context is added only to the approved page, asset, CTA, form, article, signup, and offer enrichment events.
6. Query strings and hashes are stripped from page location, canonical URL, and referrer values.
7. All four helpers expose trackExperimentExposure() with session dedupe on experiment_id + variant_id + page_path.
8. CtrlPlane article tracking now measures focused, visible active time and emits article_engaged only after 50% scroll and 60 seconds active time.
9. The GTM design is split into page, CTA, asset, form, content, cross-brand/link, and experiment event groups. The old universal parameter-mapping tag is no longer part of the recommended setup.

## Contract verification

The source contract now requires every application event to contain:

~~~text
brand, brand_id, site_id, site_section, page_type, page_title,
page_path, page_location, canonical_url
~~~

page_referrer is present only when it has a value. The raw payload cleaner removes undefined, null, gtm, tagTypeBlacklist, and gtm.* keys.

## Required manual checks

The following still require Tag Assistant and GA4 DebugView because the GTM container cannot be published from the application repositories:

- Verify the seven GTM event groups use the exact regexes in GTM_GA4_SETUP.md.
- Pause the old universal GA4 Event tag.
- Verify one Meniva asset download produces only asset_download as the business download event.
- Verify article_engaged appears only after focused, visible 50% scroll plus 60 seconds active time.
- Verify an experiment variant produces one exposure per session and page path.
- Verify campaign context persists across a route change and appears on downstream enrichment events.
- Verify no email, name, phone, message body, arbitrary query value, or query string reaches GA4.

## Build and lint status

Run the repository-specific commands after source changes:

~~~text
Meniva: npm run typecheck, targeted ESLint, npm run build
Metis: npm run typecheck, targeted ESLint, npm run build
CtrlPlane: npm run typecheck, npm run build
Nullfal: npm run build, targeted ESLint when an ESLint 9 config is present
~~~

The CtrlPlane repository currently has no ESLint dependency/script. Nullfal's targeted ESLint command remains blocked by the installed ESLint 9 package without an eslint.config.* file; this is a tooling configuration gap, not a helper finding.
