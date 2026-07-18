# Canonical domain audit

Audit date: 2026-07-18

## Canonical hosts

| Brand | Canonical host | Root result | Sitemap | Robots sitemap |
| --- | --- | --- | --- | --- |
| Nullfal | `https://nullfal.com/` | 200 | `https://nullfal.com/sitemap.xml` | correct |
| CtrlPlane | `https://ctrplane.com/` | 200 | `https://ctrplane.com/sitemap.xml` | correct |
| Meniva | `https://www.meniva.net/` | 200 | `https://www.meniva.net/sitemap.xml` | correct |
| Metis | `https://metis.name/` | 200 | `https://metis.name/sitemap.xml` | correct |

Metis was verified as apex canonical: `https://metis.name/` returns 200 and `https://www.metis.name/` redirects to it with 308.

## Redirect matrix

| Brand | HTTP apex | HTTPS apex | HTTP www | HTTPS www |
| --- | --- | --- | --- | --- |
| Nullfal | 308 to HTTPS apex | 200 | 308 to HTTPS www, then 308 to apex | 308 to apex |
| CtrlPlane | 308 to HTTPS apex | 200 | 308 to HTTPS www, then 308 to apex | 308 to apex |
| Meniva | 308 to HTTPS apex, then 308 to www | 308 to www | 308 to HTTPS www | 200 |
| Metis | 308 to HTTPS apex | 200 | 308 to HTTPS www, then 308 to apex | 308 to apex |

The redirect chains are intentional host and protocol normalization. The canonical endpoint itself is a 200 response. Content routes use slashless URLs. CtrlPlane, Meniva, and Metis redirect a trailing slash on content routes with 308.

The curl audit used this matrix for every brand:

```sh
curl -I http://canonical-host/
curl -I https://canonical-host/
curl -I http://www-host/
curl -I https://www-host/
```

For Meniva, `canonical-host` is `meniva.net` and `www-host` is `www.meniva.net`. For Nullfal, CtrlPlane, and Metis the canonical host is the apex domain and `www-host` is the corresponding `www` domain.

## Sitemap and canonical checks

- Nullfal publishes 2 URLs. Both sitemap URLs are canonical-host URLs and return 200. Before the current frontend fix, `/privacy` still received the root canonical from the static CRA shell. The frontend now synchronizes the canonical link and `og:url` on route changes.
- CtrlPlane publishes 8 URLs. All tested sitemap URLs return 200 and their canonical tags match the sitemap URLs.
- Meniva publishes 12 URLs through `sitemap-0.xml`. All tested sitemap URLs return 200 and their canonical tags match the sitemap URLs.
- Metis publishes 18 URLs. All tested sitemap URLs return 200 and their canonical tags match the sitemap URLs.
- No tested sitemap contained an HTTP URL, a wrong www variant, or a redirecting URL. No old slug was found in the generated sitemap entries.

## Nullfal route fix

Nullfal now updates the canonical link from the React Router pathname and normalizes content paths without a trailing slash. Its Vercel route table also redirects known slash-suffixed routes to the slashless route with 308 instead of returning a 404.

## Search Console interpretation

Search Console `Page with redirect` is expected for HTTP URLs, non-canonical www/apex aliases, and the Meniva apex alias. Those URLs should not be submitted as sitemap entries. It is not expected for a canonical URL listed in a sitemap. The previous Nullfal `/privacy/` 404 was an actual routing inconsistency, not an intentional Search Console redirect; the source fix must be deployed before the live audit will pass for that path.
