# Cross-brand measurement and SEO audit

Audit date: 2026-07-05. Repositories and public responses were inspected. Search Console, GA4, GTM, Clarity, DNS, and newsletter dashboards were not available; those states are marked `REQUIRED_USER_INPUT` rather than inferred.

Canonical hosts are `https://www.meniva.net`, `https://ctrplane.com`, `https://metis.name`, and `https://nullfal.com`. The publication is visibly named **CtrlPlane**, while its intentionally shorter domain is **ctrplane.com**.

## 1. Executive summary

* **Overall status:** Meniva is partially launch-ready; CtrlPlane and Metis have strong crawlable content but lack crawl controls and measurement; Nullfal is a functioning product SPA but is not search-safe. Production builds pass for all four projects.
* **Biggest risks:** Nullfal returns the app shell with HTTP 200 for nonexistent URLs, `/robots.txt`, `/sitemap.xml`, and `/privacy`; CtrlPlane's newsletter displays success without submitting anywhere; Meniva's lead-magnet flow reports success even when its API fails and does not deliver the promised asset; Meniva's production SEO feature flag is off; no shared measurement exists; privacy/consent is absent on three sites.
* **Biggest opportunities:** CtrlPlane already has six substantive, statically rendered Hungarian articles; Metis has seven articles plus role-based learning paths and a glossary; Meniva has commercial proof and a working consultation surface. A shared GA4 stream can make the ecosystem journey measurable without merging the brands' purposes.
* **Must fix before launch:** canonical production hosts, robots/sitemaps, canonicals, preview noindex, Nullfal real 404 behavior, privacy/consent, working newsletter and canvas delivery, shared GA4/GTM, key events, social images, and Search Console verification.
* **Can wait:** paid pixels, server-side tagging, CRM scoring, article sitemap splitting, advanced schema, and brand social accounts other than Meniva/CtrlPlane.
* **Privacy risk:** **High** overall. Meniva has partial consent handling; Nullfal processes account credentials and learning data without public privacy/terms pages; the other sites have no privacy baseline for the proposed tracking.

## 2. Brand-by-brand audit table

| Brand | URL | Search readiness | Analytics readiness | Conversion readiness | SEO readiness | AI-search readiness | Priority issues |
|---|---|---|---|---|---|---|---|
| Meniva | `https://www.meniva.net/` | Medium | Medium: direct GA4 + Clarity | Low-Medium | Medium | Medium | Canonical/OG feature flag off; sitemap uses non-www; lead magnet can falsely succeed; events fragmented |
| CtrlPlane | `https://ctrplane.com/` | Medium after patch deployment | None | Low | Medium | Medium | Canonical/robots/sitemap/social source patch ready; newsletter remains UI-only; no article measurement |
| Metis | `https://metis.name/` | Medium after patch deployment | None | Low | Medium | Medium | Canonical/robots/sitemap/article metadata source patch ready; mentor inquiry and privacy still missing |
| Nullfal | `https://nullfal.com/` | Low-Medium after patch deployment | Product events only, not GA4 | Medium product signup | Low-Medium | Low | Crawl-resource/soft-404 source patch ready; privacy/consent and authenticated-route safeguards still need production verification |

Public search checks surfaced Meniva, but did not provide reliable evidence of indexing for the other three. Only Search Console can confirm coverage and canonical selection.

## 3. Search Console readiness

Google recommends sitemaps for discovery but does not guarantee indexing; robots controls crawling, while canonicalization consolidates duplicate URLs ([Google crawling/indexing](https://developers.google.com/search/docs/crawling-indexing), [canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)). Prefer Domain properties for owned custom domains; they cover protocols and subdomains and require DNS verification ([Domain properties](https://support.google.com/webmasters/answer/10431861?hl=en), [verification methods](https://support.google.com/webmasters/answer/9008080?hl=en)).

### Meniva

* Check `https://www.meniva.net/robots.txt` and `https://www.meniva.net/sitemap.xml` (both currently return 200).
* Use Domain property `meniva.net`, DNS TXT. Verification status: `REQUIRED_USER_INPUT`.
* The source patch standardizes sitemap/canonical/OG/JSON-LD URLs on `https://www.meniva.net`; deploy and recheck the generated files.
* Enable shared SEO in production or remove the flag; currently production emits title/description only, without canonical, robots metadata, OG, or Twitter.
* Ensure `/thank-you` and `/thank-you-subscribe` always emit `noindex,follow`, independent of an optional feature flag.
* Inspect `/`, `/book-consultation`, `/demos`, `/demos/nullfal`, and `/blog/sme-data-strategy-2025`.

### CtrlPlane

* Canonical host: `https://ctrplane.com`. Check `https://ctrplane.com/robots.txt` and `https://ctrplane.com/sitemap.xml`; both returned 404 before this source patch is deployed.
* Create/verify Domain property `ctrplane.com` using DNS TXT. Verification status: `REQUIRED_USER_INPUT`.
* Inspect `/`, all six `/irasok/{slug}` URLs, and one intentional 404.
* Add a sitemap containing home plus six articles, reliable publication/modified dates, and no source PDFs.

### Metis

* Canonical host: `https://metis.name`. Check `https://metis.name/robots.txt` and `https://metis.name/sitemap.xml`; both returned 404 before this source patch is deployed.
* Create/verify Domain property `metis.name` using DNS TXT. Status: `REQUIRED_USER_INPUT`.
* Inspect `/`, `/mentorprogram`, `/posts`, two representative posts, `/glossary`, and one role path.
* Sitemap should include all public static routes and seven posts; exclude build/output ZIPs and internal tooling.

### Nullfal

* Canonical host `https://nullfal.com/` returns 200. Before this source patch is deployed, `/robots.txt`, `/sitemap.xml`, and arbitrary nonexistent paths still return the HTML app shell with 200.
* Create/verify Domain property `nullfal.com` using DNS TXT. Status: `REQUIRED_USER_INPUT`.
* Only the marketing landing page and intentionally public learning-resource pages should be indexable. `/auth`, `/dashboard`, `/placement`, `/practice`, `/quest/*`, `/admin/*`, `/curriculum`, and user-specific pages should be `noindex` and excluded from sitemaps.
* Inspect `/`, `/auth` (expect noindex), an invalid URL (expect real 404), `/robots.txt`, and `/sitemap.xml`.

| Brand | Property type | Domain | Verification status | Sitemap URL | URL Inspection targets | Priority | Owner action needed |
|---|---|---|---|---|---|---|---|
| Meniva | Domain | `meniva.net` | `REQUIRED_USER_INPUT` | `https://www.meniva.net/sitemap.xml` after host fix | `/`, consultation, demos, article | P0 | Add DNS TXT; submit sitemap |
| CtrlPlane | Domain | `ctrplane.com` | `REQUIRED_USER_INPUT` | `https://ctrplane.com/sitemap.xml` | home + six articles | P0 | Add DNS TXT; deploy; submit |
| Metis | Domain | `metis.name` | `REQUIRED_USER_INPUT` | `https://metis.name/sitemap.xml` | home, mentor, posts, glossary | P0 | Add DNS TXT; deploy; submit |
| Nullfal | Domain | `nullfal.com` | `REQUIRED_USER_INPUT` | `https://nullfal.com/sitemap.xml` | landing, auth/noindex, invalid/404 | P0 | Add DNS TXT; deploy; submit |

## 4. Technical SEO findings

### Indexability

* CtrlPlane and Metis are statically rendered and crawlable; this is a strong base. Nullfal is client-rendered and exposes identical HTML/status for all routes.
* Meniva, CtrlPlane, and Metis return real 404s. Nullfal does not; fix Vercel rewrites with explicit public resources and framework/server handling for unknown paths.
* Vercel previews should emit `X-Robots-Tag: noindex, nofollow` and should not appear in sitemaps or analytics.
* CtrlPlane source PDFs live under repository `content/`, not `public/`, so they are not currently exposed. Keep them excluded. Several `pdfHref` values point to nonexistent public paths; remove or implement deliberately.

### Metadata

* Meniva production currently emits title/description only because `MENIVA_SHARED_SEO_ENABLED` is not enabled. Page intent is good, but OG/Twitter/canonical are absent.
* CtrlPlane has unique article titles/descriptions and article OG fields, but no absolute URL, canonical, image, `og:url`, or Twitter image.
* Metis has basic page titles; post pages have no `generateMetadata`, so articles inherit the generic site title/description.
* Nullfal has one global title/description for every SPA route.

### Canonical/redirects

* Meniva redirects non-www to www, while sitemap config declares non-www. Standardize on `https://www.meniva.net` everywhere.
* No canonical tags were observed on any production home page.
* Canonical domains are fixed: `www.meniva.net`, `ctrplane.com`, `metis.name`, and `nullfal.com`. Redirect every Vercel production alias to its canonical host; noindex preview deployments.

### Sitemap/robots

* Meniva has both; its generated `lastmod` is build time for every URL and therefore unreliable. Use real content modification dates or omit it.
* CtrlPlane and Metis have neither. Nullfal has neither and masks the absence with SPA fallbacks.
* Meniva correctly excludes thank-you pages from the sitemap, but noindex must also be unconditional.

### Performance

* Builds pass. Meniva reports about 214 kB first-load JS on home. Nullfal's CRA build emits roughly 746 kB gzip JavaScript across main chunks, a material mobile-performance risk; code-split authenticated/admin/3D/editor routes.
* Run Lighthouse/PageSpeed on canonical production hosts after deployment. No lab score was invented in this audit.

### Accessibility

* Next sites use semantic headings and generally meaningful image alt text. CtrlPlane articles have strong H1/H2 structure.
* Meniva's lead-magnet email input lacks a programmatic label; its modal lacks dialog semantics/focus management. Metis contact email is plain text, not a link. Verify keyboard focus, contrast, carousel controls, and reduced motion.

### Structured data

* Meniva: P0 `Organization`, `WebSite`, and truthful `ProfessionalService`; P1 `Service`, `BlogPosting`, `BreadcrumbList`; FAQ only for visible FAQ content.
* CtrlPlane: P0 `WebSite`, publisher/author `Person`, and complete `BlogPosting`; P1 `Blog`/`CollectionPage` and breadcrumbs. Existing schema needs canonical URLs, images, and `dateModified` when real.
* Metis: P0 `Person` + `WebSite`; P1 `BlogPosting`, breadcrumbs, and `LearningResource` where defensible. Do not use `Course` until an actual course page exists; do not mark up aggregate ratings from decorative/testimonial UI.
* Nullfal: P0 `WebSite`; P1 `SoftwareApplication` only once public product facts, offers/access mode, and canonical app URL are truthful; `LearningResource` only on public resources. Never schema-mark private dashboards.

### Social previews

* Meniva's production OG/Twitter fields are absent. CtrlPlane has text fields but no share image. Metis and Nullfal have no OG/Twitter metadata.
* Create 1200×630 branded defaults plus article-specific images; include absolute `og:url`, `og:image`, `twitter:card=summary_large_image`, favicon, and apple/app icons. Test with LinkedIn Post Inspector and Facebook Sharing Debugger.

## 5. Analytics and tracking architecture

* **GA4:** use one property and one web data stream across all four brands. The same tag ID must be on every production page for GA4 cross-domain measurement ([official GA4 setup](https://support.google.com/analytics/answer/10071811?hl=en)). Add `brand`, `page_type`, `content_id`, and `content_title` as controlled parameters/custom dimensions. Separate properties are justified only for different legal controllers, access-control boundaries, sale/spin-out, or radically different retention requirements.
* **GTM:** use one container across the ecosystem. Migrate Meniva's hard-coded `G-FE1M458W4C` implementation only after the user confirms that this is the intended shared property. Never run direct gtag and GTM GA4 tags together. Gate GTM to production hostnames.
* **Clarity:** use separate projects per brand because heatmaps, URL spaces, and masking policies differ; defer Nullfal until privacy and strict masking are ready. Meniva currently uses direct project `ta4edlltm9`; ownership/settings are `REQUIRED_USER_INPUT`. GA4 remains the source of truth.
* **Consent:** deploy one shared consent specification/component in all apps. For Hungary/EEA, default `analytics_storage`, `ad_storage`, `ad_user_data`, and `ad_personalization` to denied before any measurement command; update on the same page without a forced reload. Google documents this Consent Mode v2 sequence ([official guide](https://developers.google.com/tag-platform/security/guides/consent)). Send Clarity Consent API v2 signals and use Strict masking on Nullfal; Microsoft states EEA consent signals are required for full functionality and inputs are always masked ([Clarity consent](https://learn.microsoft.com/en-gb/clarity/setup-and-installation/clarity-consent-api-v2), [masking](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-masking)).
* **Cross-domain:** configure `www.meniva.net`, `meniva.net`, `ctrplane.com`, `metis.name`, and `nullfal.com`. Verify `_gl` survives links/redirects. Preserve explicit `cross_brand_click` even though configured domains stop being ordinary outbound clicks.
* **Explorations:** create Cross-brand Path Exploration; Article→CTA→conversion funnel; LinkedIn organic acquisition; Canvas view→click→download; Newsletter start→submit; CTA performance by brand/location; landing page by source/medium/campaign; article engagement by title; returning-user brand sequence.

## 6. Event taxonomy

Every event receives `brand`, `page_type`, `page_title`, and `page_path`. Add only relevant parameters from: `content_id`, `content_title`, `cta_id`, `cta_text`, `cta_location`, `source_brand`, `destination_brand`, `destination_url`, `link_domain`, `file_name`, `form_id`, `method`, `campaign`. Never send email, name, message, user-entered text, or raw user IDs.

| Event name | Trigger | Extra parameters | Brand(s) | Key event? | Implementation notes |
|---|---|---|---|---|---|
| `page_view` | consented page/route view | referrer | All | No | One event only; SPA route listener where needed |
| `scroll` | GA4 enhanced measurement | percent | All | No | Keep built-in 90%; custom article milestones below |
| `cta_click` | governed CTA click | cta fields | All | No | Generic layer; specific events may fire in parallel |
| `cross_brand_click` | link to another ecosystem brand | source/destination fields | All | Yes | Fire before navigation; cross-domain linker remains intact |
| `outbound_social_click` | link to social profile | destination_url, link_domain | All | Yes | Exclude share buttons; use share event |
| `external_link_click` | non-ecosystem external link | destination_url, link_domain | All | No | Do not duplicate configured cross-domain links |
| `contact_click` | mail/contact CTA click | cta fields, method | All | Yes | A click, not a completed lead |
| `email_click` | `mailto:` click | cta fields | All | No | Never include the address as a parameter |
| `file_download` | successful file navigation | file_name | All | No | Use built-in event or governed custom, not both |
| `form_start` | first field interaction once | form_id | All | No | Not on submit |
| `form_submit` | server/provider success | form_id, method | All | No | Never on attempted submission |
| `form_error` | validation/API/provider failure | form_id, error_type | All | No | Controlled error types only |
| `newsletter_form_start` | first newsletter interaction | form_id | CtrlPlane | No | Parallel to generic form_start is optional |
| `newsletter_signup` | provider accepts subscription/DOI pending | form_id, method | CtrlPlane | Yes | Do not send email; distinguish `pending_double_opt_in` |
| `article_view` | article render | content fields | CtrlPlane/Metis | No | Prefer once per page view |
| `article_read_25/50/75/100` | article-body depth, once | content fields, engaged_seconds | CtrlPlane/Metis | `75` only | Require visible tab and minimum engagement time |
| `article_cta_click` | in-article CTA | content + cta fields | CtrlPlane | No | Use destination fields where applicable |
| `article_share_click` | share control | content fields, method | CtrlPlane | No | method = linkedin/facebook/copy_link |
| `article_crosslink_click` | article→ecosystem link | content + destination fields | CtrlPlane | No | Also fire cross_brand_click |
| `canvas_cta_click` | canvas CTA | cta fields | Meniva | No | Before download/form |
| `canvas_download` | asset actually starts/downloads | file_name, method | Meniva | Yes | Not merely modal open |
| `consultation_click` | consultation CTA | cta fields | Meniva | Yes | Track Calendly handoff separately if available |
| `meniva_contact_click` | Meniva contact CTA | cta fields | Meniva | No | Also generic contact_click |
| `service_card_click` | service card CTA | cta_id | Meniva | No | Stable service IDs |
| `case_study_click` | dossier/card click | content_id | Meniva | No | Applies now, not only later |
| `mentoring_cta_click` | mentor CTA | cta fields | Metis | Yes | Destination must become a real form/contact flow |
| `testimonial_expand` | user expands full testimonial | content_id | Metis | No | Do not fire for carousel autoplay |
| `free_resource_click` | resource/article CTA | content_id | Metis | No | Separate from ordinary nav |
| `metis_contact_click` | inquiry CTA | method | Metis | No | Also contact_click |
| `youtube_click` | YouTube handoff | destination_url | Metis | No | Add once videos exist |
| `course_interest_click` | explicit course interest | content_id | Metis | No | Only once a real offer exists |
| `tutor_cta_click` | AI mentor entry | cta fields | Nullfal | No | Avoid recording learner prompts |
| `roadmap_click` | roadmap entry/action | content_id | Nullfal | No | No private roadmap title in GA4 |
| `waitlist_click` | waitlist CTA/success as defined | cta fields | Nullfal | Yes | Rename to signup success if no waitlist exists |
| `practice_module_click` | public module entry | content_id | Nullfal | No | Controlled module IDs only |
| `nullfal_signup_click` | signup CTA click | cta fields | Nullfal | No | Track successful registration separately as `sign_up` |

Use GA4 recommended `generate_lead` in parallel with a successful contact form and `sign_up` for completed Nullfal registration. Preserve the requested business-readable events; recommended names improve standard reports but do not replace business semantics.

## 7. Conversion map

| Brand | Conversion | CTA selector/text | Event | Destination | GA4 key event? | Priority |
|---|---|---|---|---|---|---|
| Meniva | Canvas download | governed `data-cta-id=canvas_download` | `canvas_download` | PDF/download response | Yes | P0 |
| Meniva | Consultation interest | “Book Free Consultation” | `consultation_click` | `/book-consultation`/Calendly | Yes | P0 |
| Meniva | Contact | contact CTA + successful form | `contact_click`; `generate_lead` on success | contact API | click Yes; success Yes | P0 |
| CtrlPlane | Newsletter | `#feliratkozas` form | `newsletter_signup` | provider success | Yes | P0 |
| CtrlPlane | Engaged reader | article body | `article_read_75` | same page | Yes | P1 |
| CtrlPlane | Meniva handoff | Meniva links | `cross_brand_click` | Meniva | Yes | P0 |
| Metis | Mentor inquiry | mentor CTAs | `mentoring_cta_click` | real inquiry form (missing) | Yes | P0 |
| Metis | Nullfal handoff | ecosystem card | `cross_brand_click` | Nullfal | Yes | P0 |
| Nullfal | Signup | “Start learning/Create account” | `nullfal_signup_click`; `sign_up` on success | `/auth`/account | success Yes | P0 |
| Nullfal | Roadmap/tutor | product CTAs | `roadmap_click`, `tutor_cta_click` | app surfaces | No | P1 |

## 8. Cross-brand traffic plan

* CtrlPlane → Meniva: cross-domain linker + `cross_brand_click(source_brand=ctrlplane,destination_brand=meniva,content_id=article_slug,cta_location=article|nav|footer)`.
* Meniva → CtrlPlane: same event with Meniva source; article links retain content IDs. Meniva visitors who later contact can be analyzed in path exploration without UTM-tagging internal links.
* Metis ↔ Nullfal: instrument ecosystem cards and product back-links in both directions. Do **not** put UTMs on internal cross-brand links; they start new campaigns and can damage journey attribution. Use event parameters instead.
* Personal LinkedIn → each brand: external posts use governed UTMs. GA4 session acquisition reports source/medium/campaign; key events show downstream value.
* Newsletter → each brand: UTMs on every newsletter link; preserve content ID. Use `source=ctrlplane_newsletter`, `medium=newsletter`.
* Register custom dimensions for `brand`, `source_brand`, `destination_brand`, `page_type`, `content_id`, `cta_id`, and `cta_location`; create audiences only after consent and volume justify them.

## 9. UTM taxonomy

Rules: lowercase ASCII, underscores, no spaces/accents; `source` = platform/sender, `medium` = `organic|paid|referral|email|social|newsletter`, `campaign` = strategic initiative, `content` = post/creative/CTA variant, `term` = paid audience/keyword only.

Campaigns: `ctrlplane_launch`, `meniva_canvas_launch`, `metis_mentor_launch`, `nullfal_waitlist_launch`, `ctrlplane_article_rollout`, `meniva_consulting_launch`.

| Use | Example query string |
|---|---|
| Bálint LinkedIn → CtrlPlane | `utm_source=linkedin&utm_medium=organic&utm_campaign=ctrlplane_article_rollout&utm_content=it_market_overview_post_01` |
| Bálint Facebook → Metis | `utm_source=facebook&utm_medium=organic&utm_campaign=metis_mentor_launch&utm_content=mentor_story_post_01` |
| Meniva LinkedIn page | `utm_source=linkedin&utm_medium=organic&utm_campaign=meniva_canvas_launch&utm_content=canvas_carousel_01` |
| Future CtrlPlane LinkedIn page | `utm_source=linkedin&utm_medium=organic&utm_campaign=ctrlplane_launch&utm_content=launch_post_01` |
| CtrlPlane newsletter → Meniva | `utm_source=ctrlplane_newsletter&utm_medium=newsletter&utm_campaign=meniva_consulting_launch&utm_content=article_footer_cta_01` |
| Paid LinkedIn canvas | `utm_source=linkedin&utm_medium=paid&utm_campaign=meniva_canvas_launch&utm_content=canvas_static_01&utm_term=cee_sme_founders` |
| Meta retargeting | `utm_source=facebook&utm_medium=paid&utm_campaign=meniva_consulting_launch&utm_content=retargeting_proof_01&utm_term=site_visitors_30d` |

Maintain a shared campaign registry sheet with owner, destination URL, launch date, and exact parameters.

## 10. SEO keyword map

| Brand | Page | Primary keyword | Secondary keywords | Intent | Recommended title | Recommended meta description |
|---|---|---|---|---|---|---|
| Meniva | `/` | AI strategy consulting Europe | data strategy, AI readiness, BI consulting | Commercial | AI & Data Strategy Consulting for European SMEs | Practical data, BI and AI systems for European SMEs—from readiness and use-case prioritization to production delivery. |
| Meniva | `/book-consultation` | AI strategy consultation | data consulting Budapest, AI roadmap | Transactional | Book an AI & Data Strategy Consultation | Discuss your data, BI, automation or AI use case in a focused 30-minute consultation with Meniva. |
| Meniva | canvas landing/download | AI use case prioritization canvas | AI pilot selection, AI readiness canvas | Lead/resource | AI Use Case Triage Canvas | Prioritize AI opportunities by value, feasibility, data readiness and risk with Meniva’s practical triage canvas. |
| Meniva | `/demos` | production AI systems case studies | RAG case study, lead scoring system | Commercial research | AI Systems Case Studies | Inspect the architecture, evaluation and business impact behind Meniva’s production data and AI systems. |
| Meniva | blog article | SME data strategy Europe | analytics roadmap, data foundations | Informational | Data Strategy for European SMEs | A practical guide to building reliable data foundations, decision metrics and an implementation roadmap for SMEs. |
| CtrlPlane | `/` | magyar AI és adat blog | magyar tech blog, AI hírlevél | Informational/subscription | CtrlPlane – AI, adatmunka és technológiai döntések | Forrásalapú magyar elemzések AI-rendszerekről, adatcsapatokról, munkaerőpiacról és technológiai döntésekről. |
| CtrlPlane | agentic coding articles | agentic coding magyarul | AI kódreview, szoftverfejlesztés AI | Informational | Article title + `| CtrlPlane` | Keep current article-specific excerpts; add concrete query language naturally. |
| CtrlPlane | Hungarian NLP article | magyar nyelvtechnológia története | magyar nyelvi modellek | Informational | Nem a ChatGPT volt a kezdet | A magyar nyelvtechnológia útja a korai gépi fordítástól a mai magyar nyelvi modellekig. |
| CtrlPlane | AI enablement article | AI governance magyarul | AI operating model, vállalati AI | Informational/commercial bridge | Nem AI-t kell bevezetni – működést kell áttervezni | Hogyan lesz a chatbot-használatból mérhető, biztonságos és skálázható vállalati AI-működés? |
| CtrlPlane | IT market article | magyar IT piaci elemzés 2026 | AI munkaerőpiac, junior válság | Informational | Nem az AI okozta a válságot | Adat- és kutatásalapú körkép a magyar IT-piacról, juniorokról, senioritásról és AI-hatásokról. |
| Metis | `/` | adatelemzés mentorálás | Python mentor, statisztika mentor | Commercial/informational | Adatelemzés mentorálás és tanulás | Magyar mentorálás, tutorialok és fejlődési utak SQL-hez, Pythonhoz, statisztikához és adatelemzéshez. |
| Metis | `/mentorprogram` | data science mentorálás | data analyst mentor, Python mentorálás | Transactional | Data Science és Adatelemzés Mentorprogram | Személyre szabott magyar mentorálás adatelemzéshez, statisztikához, Pythonhoz és szakmai fejlődéshez. |
| Metis | role paths | data analyst tanulási útvonal | data scientist roadmap, MLE roadmap | Informational | `{Role} fejlődési útvonal | Metis` | Show foundations, practice areas and next steps for the named role. |
| Metis | `/posts` + posts | adatelemzés tutorial magyarul | SQL, EDA, churn, statisztika | Informational | Adatelemzés tutorialok magyarul | Rövid, gyakorlati magyarázatok SQL-ről, adatmodellezésről, EDA-ról, churnről és statisztikáról. |
| Metis | `/glossary` | adatelemzés fogalomtár | statisztika fogalmak, churn jelentése | Informational | Adatelemzés és statisztika fogalomtár | Rövid magyar definíciók az elemzői gondolkodás, statisztika, KPI-k, churn és retention fogalmaihoz. |
| Nullfal | `/` | AI-assisted ML learning platform | machine learning roadmap, Python practice | Product/commercial | Nullfal – Graph-native ML Engineering Learning | Build Python, SQL, data science and production ML skills through connected roadmaps, quests and guided practice. |
| Nullfal | public roadmap/resources | machine learning roadmap | coding interview practice, Python exercises | Informational/product | Machine Learning Roadmaps and Practice | Follow connected learning paths, practice technical skills and turn progress into portfolio evidence. |

Content gaps: Meniva needs a dedicated canvas landing page and focused service pages; CtrlPlane needs an author page and newsletter archive/value page; Metis needs a real inquiry page and clearer resource destinations; Nullfal needs crawlable public roadmap/resource summaries separate from the authenticated app. Support Hungarian and English with distinct URLs only when content is genuinely localized; do not auto-translate thin variants.

## 11. AI-search readiness

* Meniva: make the organization, founder, services, geography, evidence status, and contact path explicit. Clearly label prototype/target metrics versus measured production outcomes.
* CtrlPlane: add a durable author page/bio, canonical article URLs, visible published/updated dates, source links/citations, article summaries, and related-article/related-Meniva links. Existing original analysis is the strongest ecosystem asset.
* Metis: connect the Person entity, mentoring experience, learning paths, glossary, and articles. Add author/date metadata and citations where claims require them.
* Nullfal: separate public explanatory content from private/product state. Explain who it is for, learning methodology, limitations, pricing/access, and the relationship to Metis. Render key public content in HTML, not only after API calls.
* Across all brands: consistent `sameAs` links, clear brand roles, breadcrumbs, descriptive anchors, source hygiene, and truthful structured data. Do not mass-generate pages, stuff keywords, manufacture mentions, or treat `llms.txt` as a Google ranking requirement.

## 12. Email signup implementation

Current state:

* CtrlPlane has a polished form but no `onSubmit`; the design-system component immediately shows success. There is no provider, error state, consent link, or real double opt-in.
* Meniva's `/api/subscribe` writes to Zoho CRM, not an email newsletter service. The popup ignores HTTP failure, claims an email was sent, and does not deliver the asset. This must not be used for the CtrlPlane newsletter as-is.

Recommendation: use **Buttondown** for the editorial CtrlPlane newsletter if the priority is the simplest exportable newsletter workflow and mandatory double opt-in ([Buttondown DOI](https://docs.buttondown.com/double-opt-in)); use **Brevo** if one provider should also support Meniva lead magnets, automation, tagged lists and transactional delivery. Brevo currently documents a free tier, GDPR fields and double-opt-in flows ([pricing](https://help.brevo.com/hc/en-us/articles/208589409-About-Brevo-s-pricing-plans), [GDPR forms](https://help.brevo.com/hc/en-us/articles/360000454204-Guidelines-for-a-GDPR-compliant-sign-up-form)). Final choice: `REQUIRED_USER_INPUT`.

Implementation: server-side API route → provider API; store `source_brand`, landing page, and campaign in provider fields/tags; return controlled pending/success/error; fire `newsletter_signup` only after provider acceptance; never send email to GA4/Clarity; include clear newsletter consent, privacy link, unsubscribe, and double opt-in.

## 13. Social distribution readiness

* Meniva: keep the existing brand page; founder profile distributes expert POV and case-study context, brand page holds proof, service updates and retargetable assets.
* CtrlPlane: create a LinkedIn page at launch to own the publication identity and archive; use Bálint's profile for reach and interpretation. Do not wait for a large posting cadence.
* Metis: Bálint's profile is sufficient initially; YouTube can wait until there is an actual repeatable video format. The Gmail address is not a social presence.
* Nullfal: defer separate social accounts until canonical domain, onboarding and product cadence are stable. Cross-promote from Metis and personal LinkedIn.
* Before sharing: default/article 1200×630 images, absolute OG URLs, `summary_large_image`, favicon/app icons, consistent avatars, and preview validation.

## 14. Implementation roadmap

### P0 — before public launch

| Task | Sites | Why / approach | Acceptance criteria | Complexity | Dependencies | Commit suggestion |
|---|---|---|---|---|---|---|
| Canonical domains + preview controls | All | Pick canonical hosts; redirect aliases; noindex previews | One 200 canonical per page; previews noindex; `_gl` preserved | M | DNS/domain choice | `feat(seo): enforce canonical production hosts` |
| Robots and sitemaps | CtrlPlane, Metis, Nullfal; fix Meniva | Framework-native generation; real dates only | Valid text/XML, canonical URLs, correct inclusions/exclusions | M | Domains | `feat(seo): add crawl controls and sitemaps` |
| Nullfal HTTP/index model | Nullfal | Real 404s; marketing indexable; app/private routes noindex | Invalid URL 404; robots/sitemap not HTML; private routes absent | L | Hosting decision | `fix(seo): separate public and app crawl behavior` |
| Metadata/canonicals/social | All | Page templates + share images | Unique titles/descriptions/canonical/OG/Twitter; preview tests pass | M | Domains/images | `feat(seo): complete metadata and social cards` |
| Shared GA4 via GTM | All | One stream/container; production allowlist; data layer | One page_view; brand parameter; no duplicate tags | M | `REQUIRED_USER_INPUT` IDs | `feat(analytics): add shared consent-aware data layer` |
| Consent/privacy baseline | All | Shared CMP/spec; Consent Mode v2; privacy/cookie links | Defaults denied before tags; choice persists/revokes; policies accessible | L | Legal copy/CMP choice | `feat(privacy): add consent and policy baseline` |
| Working newsletter | CtrlPlane | Provider API + real states + DOI | Success only after accepted response; errors visible; no PII analytics | M | Provider credentials | `feat(newsletter): connect double-opt-in signup` |
| Working canvas flow | Meniva | Match asset/copy; deliver/download only on success | Real file/delivery; failure cannot show success; event fires once | M | Asset/provider decision | `fix(leads): make canvas delivery truthful and measurable` |
| Core CTA events | All | Controlled attributes + shared listener | Required key events visible in DebugView with correct params | M | GA/GTM/consent | `feat(analytics): instrument core conversions` |
| Search Console | All | Verify and submit | Properties verified; sitemap accepted; targets inspected | S manual | DNS/GSC access | No code commit |

### P1 — first two weeks

* Complete truthful JSON-LD and validate Rich Results/Schema.org; M; depends on canonical metadata.
* Implement article milestones, shares, and crosslinks; M; verify once-per-view behavior.
* Create GA4 custom dimensions, explorations and a Looker Studio executive dashboard; M; depends on stable event data.
* Fix Meniva's build-time `lastmod`, unconditional noindex pages, and www sitemap host; S.
* Add Metis inquiry flow and post metadata; M.
* Review Clarity after consent, with separate projects and strict Nullfal masking; M; collect at least one week before conclusions.
* Improve internal links, author/entity pages, source citations, and CTA-content match; M.
* Establish campaign registry and social preview QA; S.

### P2 — after launch

* Paid LinkedIn/Meta/Google tags only after consent, audience volume and a campaign plan.
* Newsletter automations, CRM/lightweight pipeline, and source tagging.
* Case-study and content clusters driven by Search Console queries, not speculative volume.
* Server-side tagging only when traffic, ad loss, governance or performance creates a measured need.
* Lead scoring only after enough clean labeled outcomes exist.

## 15. Developer implementation tickets

### Ticket 1 — Canonical hosts and crawl controls

**Context:** three sites lack robots/sitemaps; Meniva host signals conflict. **Files:** Next app metadata routes/configs, Nullfal `vercel.json`/public assets. **Steps:** define canonical env; add native robots/sitemap; noindex previews/private routes; implement real 404s; fix Meniva www. **Acceptance:** validators pass, only canonical URLs listed, invalid URLs 404. **Tests:** production builds; curl headers/status/content types; sitemap parse.

### Ticket 2 — Shared consent-aware analytics shell

**Context:** only Meniva has direct GA/Clarity and consent is incomplete. **Files:** each root layout/app shell; shared analytics module; env docs. **Steps:** add GTM placeholder; default Consent Mode v2 denied before container; production host allowlist; common `brand/page_type` data layer; remove direct Meniva tags after parity. **Acceptance:** one page_view, no analytics cookies before consent, revoke works, no preview traffic. **Tests:** Tag Assistant, GA4 DebugView, browser cookie/network checks.

### Ticket 3 — Cross-brand event instrumentation

**Context:** journeys are currently invisible. **Files:** nav/footer/cards/CTA components. **Steps:** stable data attributes; shared click handler; ecosystem domain map; emit `cross_brand_click`, CTA and social events; preserve linker. **Acceptance:** source/destination/CTA fields populated and no duplicates. **Tests:** click matrix across every brand pair; verify `_gl` and DebugView.

### Ticket 4 — CtrlPlane newsletter integration

**Context:** current form falsely succeeds without a submission. **Files:** home/newsletter client component, API route, env docs. **Steps:** choose provider; server-side subscribe; DOI; start/success/error UI; privacy link; events. **Acceptance:** provider receives subscriber; success only on accepted response; email absent from analytics. **Tests:** valid, invalid, duplicate, provider failure, consent and DOI flows.

### Ticket 5 — Meniva canvas delivery repair

**Context:** popup promises a different checklist, ignores API errors, and does not deliver the PDF. **Files:** `LeadMagnetPopup`, subscribe/delivery API, asset/landing page. **Steps:** align copy with AI Use Case Triage Canvas; check `response.ok`; provider tagging; secure delivery/download; events. **Acceptance:** no false success; exact promised asset arrives/downloads; consent copy and privacy link present. **Tests:** API failure, asset response, CRM/provider record, GA DebugView.

### Ticket 6 — Article SEO and engagement

**Context:** CtrlPlane lacks canonical images; Metis posts inherit generic metadata. **Files:** dynamic article routes/data/frontmatter. **Steps:** generate canonical metadata; dates/authors/images; complete BlogPosting/breadcrumbs; instrument view/read/share/crosslink. **Acceptance:** unique source metadata and valid JSON-LD for every article; milestones once. **Tests:** static build route count, metadata snapshots, schema validator, scroll tests.

### Ticket 7 — Nullfal public/private SEO boundary

**Context:** all SPA paths are soft 200s and share metadata. **Files:** hosting rewrites, public files, router/marketing delivery. **Steps:** decide prerender/SSR/static marketing shell; serve real robots/sitemap; return 404 for unknowns; noindex auth/product/admin; add privacy/terms; defer Clarity or mask strictly. **Acceptance:** only intentional marketing/resources indexable; authenticated data never appears in page source/recordings. **Tests:** route/status matrix, crawler fetch, logged-in privacy check.

### Ticket 8 — Search Console and launch QA

**Context:** dashboard state is unknown. **Files:** verification file/meta only if DNS is not used. **Steps:** verify properties; submit sitemaps; inspect targets; validate canonical selection/mobile rendering; record baseline. **Acceptance:** sitemap processed without structural errors; key URLs eligible; issues assigned. **Tests:** URL Inspection live test and screenshot/export of coverage baseline.

## 16. Manual actions for Bálint

* Keep DNS/deployment stable for `ctrplane.com`, `metis.name`, and `nullfal.com`; configure Vercel production aliases to redirect to these canonical hosts.
* Create/verify Search Console properties, add DNS TXT records, submit sitemaps, and run URL Inspection. Existing property state is `REQUIRED_USER_INPUT`.
* Confirm whether Meniva's `G-FE1M458W4C` property should become the shared ecosystem GA4 property; otherwise provide the intended GA4 measurement ID.
* Create/provide one GTM container ID and configure all production domains for cross-domain measurement.
* Confirm ownership/settings of Meniva Clarity project `ta4edlltm9`; create separate project IDs for other brands only when approved.
* Choose Buttondown or Brevo and provide server-side credentials/list IDs; configure sender authentication, double opt-in, unsubscribe and data-processing terms.
* Approve privacy/cookie/newsletter/form wording with qualified legal advice; add controller/contact/retention/vendor details.
* Create the CtrlPlane LinkedIn page; update Bálint's LinkedIn/Facebook profile links with governed UTMs; defer Metis/Nullfal accounts as recommended.
* Provide/approve 1200×630 default and article share images.
* In GA4: mark `newsletter_signup`, `article_read_75`, `canvas_download`, `contact_click`, `consultation_click`, `cross_brand_click`, `mentoring_cta_click`, and the chosen Nullfal signup/waitlist success as key events; register custom dimensions and create explorations.
* In Clarity: enable the required consent behavior, Strict masking for Nullfal, and review access/retention. Do not use recordings as conversion truth.
* Maintain the UTM registry and do not tag internal cross-brand links with UTMs.

### Implemented during this audit

* Meniva branch `codex/nullfal-spelling-cleanup`, commit `7ccf6a5`: visible/internal Nullfal spelling, demo slug `/demos/nullfal`, trusted asset rename, regenerated sitemap.
* Metis branch `codex/nullfal-spelling-cleanup`, commit `0269dd1`: visible Nullfal spelling.
* Canonical-host patch on `codex/canonical-hosts`: CtrlPlane and Metis now generate canonical robots, sitemaps, page/article canonicals, structured URLs, and absolute social images; their former Vercel production hosts redirect to the custom domains and previews receive `X-Robots-Tag`.
* Meniva now standardizes generated sitemap, robots, canonical, OG, JSON-LD, redirects, and internal ecosystem links on `https://www.meniva.net`; preview deployments suppress production analytics.
* Nullfal now ships real robots/sitemap resources, canonical/OG/JSON-LD metadata, explicit noindex headers for product/authenticated routes, a legacy-host redirect, and an allowlist of known SPA rewrites so unknown paths can return 404.
* Canonical-host source patches standardize public URLs on `www.meniva.net`, `ctrplane.com`, `metis.name`, and `nullfal.com`; deployment and dashboard verification remain manual. The pinned `@meniva/content-types`/`@meniva/seo` packages still define `nullfall` as a compatibility ID and require a separate shared-package migration.
* User-owned untracked Meniva file `public/AI Use Case Triage Canvas.pdf` was preserved and not committed.
