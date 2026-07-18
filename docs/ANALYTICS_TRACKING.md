# Cross-brand analytics tracking contract

This contract applies to Meniva, Metis, CtrlPlane, and Nullfal.

## Measurement strategy

- GTM container: `GTM-P97RB9PD`
- GA4 measurement ID configured in GTM: `G-6SMJB8N0RF`
- Strategy: GTM only
- Google Tag `send_page_view`: `false`
- Direct `gtag.js`, `gtag('config')`, and `gtag('event', 'page_view')`: not allowed

GTM loads only on the canonical production host and only after analytics consent is granted. Events pushed before the GTM script finishes loading remain queued in `window.dataLayer`.

## Payload rules

Every object event is created by `pushDataLayerEvent(eventName, params)`.

- Each push receives a new object reference.
- Pushed objects are never reused or mutated by application code.
- `undefined`, `null`, `gtm`, `tagTypeBlacklist`, and keys beginning with `gtm.` are removed.
- String values are limited to 120 characters.
- `event` is assigned by the helper, not by page context.

The only deliberate `gtm.*` key is the standard one-time `gtm.start` field on the technical `gtm.js` bootstrap object. It is created by `pushGtmBootstrap()` and is never copied into analytics events.

The standard context fields are:

```text
brand
brand_id
site_id
site_section
page_type
page_title
page_path
page_location
page_referrer
canonical_url
content_id       optional
content_title    optional
```

Brand defaults are held once per application in `TRACKING_CONFIG`:

```text
meniva     site_id=meniva_web
metis      site_id=metis_web
ctrlplane  site_id=ctrlplane_web
nullfal    site_id=nullfal_web
```

`site_section` is resolved centrally. Meniva and Metis use `main`. CtrlPlane distinguishes `home`, `blog`, `article`, and `main`. Nullfal distinguishes `main`, `learning`, `practice`, and `admin`.

`page_location` uses the canonical URL when the canonical pathname matches the active route. It falls back to `window.location.href` when the canonical is absent, invalid, or stale during a client-side transition. The initial `page_referrer` comes from `document.referrer` when present. After an SPA route change, it uses the previously tracked `page_location`. Empty referrers are omitted from the raw payload.

## Pageview strategy

`trackPageView()` is the only official pageview source. It runs after consent on initial load and after framework route changes.

It pushes exactly two fresh events in order:

```text
page_context
page_view
```

`page_context` is technical state only and must not trigger a GA4 Event tag. `page_view` is the only custom event that triggers the GA4 pageview.

The dedupe key is:

```text
brand_id|site_id|page_path|page_location|page_title
```

The same consecutive key is suppressed until a different page is successfully tracked. This protects against React Strict Mode, hydration, delayed remounts, consent lifecycle callbacks, and repeated router callbacks. A changed path or location produces a new pageview, and navigating `A -> B -> A` produces three valid pageviews.

History Change is not an analytics trigger. The React router hooks are the route-change source, and they call `trackPageView()`.

## CTA strategy

`cta_click` is the generic interaction event. Controlled elements should provide:

```html
data-analytics-event="cta_click"
data-cta-id="stable_identifier"
data-analytics-placement="navbar"
```

The click delegate adds `cta_text` from visible text and uses `unspecified` when placement is missing.

`consultation_click` remains a separate business conversion event. A consultation CTA intentionally sends:

```text
cta_click
consultation_click
```

This is intentional. The first event supports general CTA analysis; the second is eligible to be marked as a GA4 key event.

Cross-brand, social, external, email, phone, and file links use their dedicated events in addition to any explicit CTA event attached to the element.

## Consent strategy

The initial Consent Mode command is pushed once per page runtime:

```text
analytics_storage=denied
ad_storage=denied
ad_user_data=denied
ad_personalization=denied
wait_for_update=500
```

On acceptance, `analytics_storage` changes to `granted`; advertising storage remains denied. GTM loads after this update. The first `page_context` and `page_view` pair is then queued.

Rejecting consent does not load GTM and does not push analytics object events. Revoking previously granted consent reloads the page after the denied update so active tags cannot continue in that session.

## Console inspection

```js
window.dataLayer
  .filter(x => x && typeof x === "object" && !Array.isArray(x))
  .map((x, i) => ({
    i,
    event: x.event,
    uniqueEventId: x["gtm.uniqueEventId"],
    brand: x.brand,
    brand_id: x.brand_id,
    site_id: x.site_id,
    site_section: x.site_section,
    page_type: x.page_type,
    page_path: x.page_path,
    page_location: x.page_location,
    page_referrer: x.page_referrer,
    content_id: x.content_id,
    content_title: x.content_title
  }));
```

For one route, expect one `page_context` row and one `page_view` row. GTM assigns a separate `gtm.uniqueEventId` to each event.
