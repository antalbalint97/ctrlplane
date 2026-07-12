# Analytics audit report

## Scope

Audited applications:

- Meniva, Next.js App Router
- Metis, Next.js App Router
- CtrlPlane, Next.js App Router
- Nullfal, React Router with React Strict Mode

Reviewed all source occurrences of `dataLayer`, `gtag`, `page_context`, `page_view`, `cta_click`, `consultation_click`, consent initialization, GTM loading, router hooks, history listeners, and direct Google Analytics identifiers.

## Findings fixed

1. `page_context` was pushed directly from the React component and included its own `event` field. The same object content was then passed to `page_view`.
2. The route effect depended on both pathname and consent. The `null` to saved-consent transition produced repeated context events.
3. Payload cleaning removed `undefined` but retained `null` and `gtm.*` fields.
4. No explicit pageview dedupe protected Strict Mode, hydration, or duplicate route callbacks.
5. CTA payloads did not consistently include text, location, or both supported data-attribute naming variants.
6. Tracking configuration and payload construction lived inside UI components.

## Resulting implementation

Each app now has a central `lib/analytics` module with:

- `TRACKING_CONFIG`
- `ensureDataLayer()`
- `cleanAnalyticsPayload()`
- `pushDataLayerEvent()`
- `getPageContext()`
- `trackPageView()`
- `trackAnalyticsEvent()`
- consent default, update, and persistence helpers

React components now own only lifecycle, consent UI, production-host GTM loading, and delegated click detection.

There is no direct GA4 script or direct GA4 pageview call in any of the four source trees. GTM remains consent-gated, and Meniva Clarity remains consent-gated.

## Code-level verification

Completed:

- TypeScript checks passed for Meniva, Metis, and CtrlPlane.
- Nullfal production build passed under React Strict Mode.
- Source search confirms object page events exist only in the central helpers.
- Source search confirms no direct `gtag('config')`, direct GA4 `page_view`, or parallel `gtag.js` loader.
- `page_context` and `page_view` are built by two separate helper calls.
- Context contains no `event` field.
- Payload cleaning removes nullish values and `gtm.*` keys without mutating the input.
- The 1500 ms key-based dedupe is enabled in all four apps.
- Runtime helper assertions passed for nullish and `gtm.*` cleaning, input immutability, fresh page event references, event order, and duplicate suppression.

Manual production verification still required in GTM Preview, GA4 DebugView, and the browser Network panel:

- distinct GTM timeline rows and unique event IDs
- exactly one initial pageview after consent
- exactly one pageview after each client-side route change
- no GA4 event tag on `page_context` or History Change
- `en=page_view`, `en=cta_click`, and intentional `en=consultation_click` collect requests
- no request before consent

## Required GTM GUI changes

1. Keep Google Tag `send_page_view=false`.
2. Add Data Layer Variables for `site_id`, `site_section`, `page_location`, and `page_referrer` if they do not exist.
3. Ensure the GA4 Event tag uses the approved Custom Event trigger regex from `GTM_GA4_SETUP.md`.
4. Exclude `page_context` from every GA4 Event trigger.
5. Remove History Change from every GA4 pageview trigger.
6. Require `analytics_storage` consent on the Google Tag and GA4 Event tag.
7. Mark `consultation_click` as a key event only if it remains the agreed consultation conversion.
8. Disable Enhanced Measurement browser-history page changes in the GA4 web stream.
9. Preview each canonical domain before publishing the container.
