# Meniva portfolio implementation backlog

## P0 — Must fix before public/client use

### P0.1 Replace false production framing

- `../meniva/src/components/DemosSection.tsx:297-305`
  - Replace `// Release log - 04 operational systems` with `// Selected builds — demos, case studies & R&D`.
  - Replace `What we actually shipped.` with `Systems you can inspect.`
  - Replace “Four production AI systems...” with evidence-boundary copy from `revised_meniva_portfolio_copy.md`.
- `../meniva/src/components/DemosSection.tsx:308-311`
  - Remove the fake sort/window/filter block.
- `../meniva/src/components/HeroSection.tsx:104-118`
  - Remove “Production registry,” “live deployments,” and “Systems running in production environments.” Rename to `Selected products and prototypes` or remove the roster.
- `../meniva/src/components/HeroSection.tsx:48-52`
  - Remove or independently evidence the €1.85B, €250k, €850k, and 40 hrs/yr stats. At minimum remove “Revenue uplift delivered” because the detail page calls €850k a modelled estimate.

Acceptance: no homepage text calls an audited demo production/live/operational without a linked operating artifact.

### P0.2 Remove fabricated telemetry

- `../meniva/src/components/DemosSection.tsx:10-72`
  - Delete `deployed`, `build`, `region`, `uptime`, `perf`, `evalKpi`, and `scale` from `DemoOverviewMeta` unless populated from audited data.
  - Replace with `category`, `maturity`, and `caveat`.
- `../meniva/src/components/DemosSection.tsx:101-135`
  - Replace `TelemetryStrip` with a compact header: section/project/category/status.
- `../meniva/src/components/DemosSection.tsx:263-273`
  - Replace the three-cell telemetry footer with one stack/data-boundary line.

Acceptance: no fake hash, region, uptime day count, or unsupported runtime/eval metric is rendered.

### P0.3 Replace the portfolio set

- `../meniva/src/data/case-studies.ts`
  - Keep and rewrite TasteTrend and Nullfal.
  - Add PiacRadar from `../pwc-hackathon` as the third main case.
  - Move Revon and Scoutbound to a separate Labs data collection.
  - Add AI Research Intelligence to Labs.
- Create an explicit field such as `portfolioTier: 'main' | 'lab'` and `maturityLabel` in `../meniva/src/types/case-study.ts`.
- Update homepage render logic to show three main cards and a smaller Labs group.

Acceptance: main cards are TasteTrend, PiacRadar, Nullfal; Labs contains Scoutbound, Revon, AI Research Intelligence.

### P0.4 Align detailed case studies with repository truth

- TasteTrend (`../meniva/src/data/case-studies.ts:8-180`)
  - Replace 74k/200+/312k/81%/52×/220ms/RAGAS claims.
  - Replace FAISS/BGE/GPT-4o/OpenAI embedding architecture with Titan v2/OpenSearch/Bedrock Agent/Claude Haiku.
- Revon (`:187-365`)
  - Remove XGBoost, calibrated SHAP, all business impact and benchmark values.
  - Describe config-driven rule scoring and sklearn training/inference scaffolding.
- Nullfal (`:372-557`)
  - Remove unimplemented/unevidenced IRT/CAT, knowledge graph, SM-2, judge, uplift, psychometric, grounding, and latency claims.
- Scoutbound (`:564-753`)
  - Replace Playwright/Pydantic/GPT-4o/Clearbit with TinyFish/TypeScript/Zod and explicit modes.
  - Remove all outcome/quality/runtime claims.

Acceptance: every architecture term is found in the named repository and every number has an artifact in `metrics_evidence_matrix.csv`.

### P0.5 Remove sensitive test credentials

- `../nullfal/test_reports/iteration_4.json`
  - Remove `test_credentials` from the tracked report.
  - Rotate credentials if they have ever been usable outside an isolated test environment.
  - Replace with a fixture-generation instruction.

Acceptance: repository search finds no working-looking password or reusable test login in public artifacts.

## P1 — Should fix this week

### P1.1 Create evidence bundles

For each public case, add `docs/evidence/<YYYY-MM-DD>/` with:

- `environment.json` — commit SHA, model/provider versions, hardware/region, timestamp.
- `data_manifest.json` — counts, provenance, synthetic/real flag, checksums.
- `test_results.*` — machine output, not a prose assertion.
- `eval_results.json` — metric definition, sample size, raw/aggregate values.
- `sample_input.json` and `sample_output.json` — sanitized.
- `limitations.md` — known failure modes and non-claims.

### P1.2 TasteTrend evidence and docs

- Run `../tastetrend_analytics_genai/src/api/eval.py` against the current endpoint and save output.
- Add retrieval-specific labels and compute Recall@k only from labelled relevant document IDs.
- Add pytest for ETL, search request/response, auth failure, and proxy response normalization.
- Write a non-empty `../tastetrend-ai-demo/README.md` linking the backend repo and documenting required environment variables.
- Add visible demo data / PoC badge in the frontend.

### P1.3 Nullfal evidence and positioning

- Expand `../nullfal/README.md` into product overview, architecture, quickstart, seeded demo, data boundaries, and limitations.
- Run `POST /api/admin/rag/eval`; save full per-question output and config.
- Add a clean presenter path using an isolated demo account/seed.
- Decide whether to implement IRT/CAT and spaced repetition or remove those concepts from product positioning.

### P1.4 PiacRadar packaging

- Replace the minimal root README with an overview, architecture, local run, data provenance, cached-demo path, and limitations.
- Pick one public name; recommended: `PiacRadar — Market Intelligence Copilot`.
- Run and save:
  - `npm run validate:demo-data`
  - backend build and data/Qdrant smoke tests
  - frontend build
- Add an always-visible `Synthetic core demo data` badge.
- Capture five screenshots matching the executive demo flow.

### P1.5 Scoutbound consolidation

- Declare `../scoutbound_agent` canonical in its README.
- Archive, redirect, or clearly mark `../scoutbound-frontend` as historical.
- Install dependencies and save `typecheck`, `test:smoke`, and `build` output.
- Add dated replay fixtures as the public demo default.
- Add screenshots and a 90-second operator script.

### P1.6 Revon minimum credible prototype

- Write `../revon/README.md` with honest current state.
- Provide seeded Docker Compose or a one-command isolated demo.
- Run backend tests and save output after dependency install.
- Train one baseline on a sanitized/versioned dataset; commit report and artifact provenance if licensing/privacy permits.
- Add calibration and latency scripts before publishing model language.

### P1.7 Meniva evidence UI

- Extend `CaseStudy` types with:
  - `maturityLabel`
  - `dataBoundary`
  - `lastVerified`
  - `proofType: 'repository-fact' | 'recorded-test' | 'demo-benchmark' | 'target'`
  - `evidenceHref`
- On detail pages, render `What this proves` and `What this does not prove` above metrics.
- Add tooltips or links from every number to its method/artifact.

## P2 — Nice-to-have polish

- Add a `Professional systems experience` section with anonymised capability patterns and no employer IP.
- Add per-project architecture diagrams generated from the actual current stack.
- Add a short silent demo video/GIF as fallback for each main card.
- Add availability checks for public frontend and backend health, but do not translate them into uptime claims until monitoring history exists.
- Add visual tokens for `CASE STUDY`, `DEMO`, `PROTOTYPE`, `R&D`, `SYNTHETIC`, and `RECORDED TEST`.
- Add a repository/evidence last-updated date to each detail page.
- Add analytics events distinguishing `open_demo`, `inspect_case_study`, and `view_lab`.

## P3 — Later strategic improvements

- Build a shared evaluation harness format across projects: dataset manifest, task schema, run manifest, raw predictions, aggregates, and HTML/JSON report.
- Establish a demo deployment baseline: auth, secrets, health, error monitoring, cost caps, data reset, and deterministic replay.
- Add a public “Engineering notes” series that turns architecture trade-offs into credibility without inventing outcomes.
- Build one anonymised professional-experience case narrative per major capability, reviewed for confidentiality.
- Promote a Labs project to the main section only after it has a stable demo, evidence bundle, limitations, and at least one meaningful evaluation.

## Verification notes from this audit

- `../meniva`: `pnpm typecheck`, 24 SEO tests, and production build passed on 2026-07-06.
- Public Meniva, TasteTrend, Revon, Nullfal, Scoutbound, and PwC hackathon frontend URLs returned HTTP 200 on 2026-07-06. This is availability evidence only.
- Scoutbound, Revon, PiacRadar, and TasteTrend frontend verification commands could not run in their current checkouts because local dependencies were absent. Treat this as “not verified in this audit,” not as a code failure.
- Nullfal’s repository contains a dated 25/25 API test XML artifact; it was not independently rerun because the service/data dependencies were not started.

