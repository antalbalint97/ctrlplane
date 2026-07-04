# Meniva Ecosystem Design System — how to build with it

A multi-brand React system. Four brands share one component set and one
skeleton; identity comes entirely from **design tokens** switched by a
`data-brand` attribute. Build pages by composing the real components
(`Button`, `Card`, `Hero`, …) and using the `ds-*` utility classes for layout
glue. Never hand-roll buttons/cards, and never hard-code colors — use tokens.

## 1. Setup & wrapping (required)

1. Import the stylesheet once at the root: `styles.css` (it pulls in tokens,
   the brand web fonts, and component CSS).
2. **Set the brand on a wrapping element** — this is what makes anything look
   styled. Without a `data-brand` ancestor, components fall back to the bare
   `:root` defaults (Meniva-ish) and never pick up a brand's accent, fonts, or
   surfaces. Add `data-theme="dark"` for the dark surface (Nullfal and
   CtrlPlane are dark-first).

```jsx
import "@meniva/design-system/styles.css"; // or the bound styles.css

<div data-brand="meniva" className="ds-base">   {/* brand: meniva | metis | nullfal | ctrlplane */}
  {/* …page… */}
</div>
// dark surface:
<div data-brand="nullfal" data-theme="dark" className="ds-base"> … </div>
```

Switching brand = change the `data-brand` value; every token re-resolves, no
other edits. `ds-base` sets the base font/text color from the active brand.

## 2. The styling idiom — `ds-*` classes + tokens (no inline hex)

BEM-ish, `ds-` prefixed. Use these for layout/composition; component internals
already carry their own classes. Real families:

- **Layout:** `ds-container` + width modifier `ds-container--prose|content|wide|marketing`; `ds-section` (vertical section rhythm, `ds-section--lg`); `ds-stack` (vertical flow); `ds-grid` + `ds-grid--2|3|4`.
- **Buttons (also available as `<Button>`):** `ds-btn` + `ds-btn--primary|secondary|outline|ghost|link` + size `ds-btn--sm|md|lg` + `ds-btn--full`.
- **Cards (also `<Card>`):** `ds-card` + `ds-card--pad-sm|md|lg` + `ds-card--interactive`.
- **Accents:** `ds-overline` (small uppercase accent label), `ds-badge` / `ds-badge--neutral`.

**Tokens** — style with `var(--token)`, never raw hex. Confirmed families:
`--color-*` (`--color-background`, `--color-surface`, `--color-surface-muted`,
`--color-text`, `--color-text-muted`, `--color-text-subtle`, `--color-border`,
`--color-primary`, `--color-primary-foreground`, `--color-accent`,
`--color-accent-2`, `--color-link`, plus `--color-success|warning|danger|info`),
spacing `--space-1..6,8,10,12,16,20,24,32`, radius `--radius-sm|md|lg|xl|2xl|full`,
typography `--font-display | --font-sans | --font-mono`, plus `--shadow-*`,
`--container-*`, `--duration-*`, `--ease-*`. Accents stay in the cool
cyan/teal/green/blue arc by design; `--color-accent-2` is the secondary (amber on Nullfal).

## 3. Where the truth lives

- The stylesheet the agent should read before styling: the bound **`styles.css`**
  and its `@import` closure (tokens + component CSS) — it lists every real
  token value and `ds-*` rule.
- Per component: **`components/<group>/<Name>/<Name>.prompt.md`** (usage +
  examples) and **`<Name>.d.ts`** (prop contract). Read these before composing.

## 4. Idiomatic snippet

```jsx
<div data-brand="meniva" className="ds-base">
  <div className="ds-container ds-container--marketing ds-section">
    <Hero
      variant="display" align="center"
      overline="DATA · BI · AI · AUTOMATION"
      title="Data & AI systems for modern teams"
      description="Foundations to production ML, so decisions are faster."
      primaryAction={{ label: "Book a consultation", href: "/contact" }}
      secondaryAction={{ label: "View our work", href: "#work" }}
      stats={[{ value: "€1.85B", label: "Revenue supported" }]}
    />
    <div className="ds-grid ds-grid--4" style={{ marginTop: "var(--space-8)" }}>
      <ServiceCard title="Data foundations" description="Pipelines you can trust."
        features={["Modeling", "Quality & tests"]} action={{ label: "Learn more", href: "#" }} />
    </div>
  </div>
</div>
```

Voice per brand (Meniva: calm/senior; Metis: warm/encouraging; Nullfal:
efficient/modular; CtrlPlane: sharp/opinionated). Hero `variant` carries the
per-brand mood: `display` (Meniva/CtrlPlane), `panel` (Metis), `split` (Nullfal).

# MenivaDesignSystem (@meniva/design-system@0.1.0)

This design system is the published @meniva/design-system React library, bundled as a single
browser global. All 11 components are the real upstream code.

## Where things are

- `_ds_bundle.js` — the whole-DS bundle at the project root; loads every component to `window.MenivaDesignSystem`. First line is a `/* @ds-bundle: … */` metadata header.
- `styles.css` — the single stylesheet entry: it `@import`s the tokens, fonts, and component styles (`_ds_bundle.css`). Link this one file.
- `components/<group>/<Name>/<Name>.prompt.md` (example JSX + variants), `<Name>.d.ts` (types), `<Name>.html` (variant grid).
- `tokens/*.css` — CSS custom properties, names verbatim from upstream.
- `fonts/` — `@font-face` files + `fonts.css` (when the package ships fonts).

For a specific component, `read_file("components/<group>/<Name>/<Name>.prompt.md")`.

## Loading

Add these two lines to your page once (React must be on the page first):

```html
<link rel="stylesheet" href="styles.css">
<script src="_ds_bundle.js"></script>
```

Components are then available at `window.MenivaDesignSystem.*`. Mount into a dedicated child node (e.g. `<div id="ds-root">`), not the host page's own React root, so the two trees don't collide:

```jsx
const { ArticleCard } = window.MenivaDesignSystem;
ReactDOM.createRoot(document.getElementById('ds-root')).render(<ArticleCard />);
```

## Tokens

113 CSS custom properties from @meniva/design-system. Names are
preserved verbatim from upstream. They are declared inside `_ds_bundle.css` (this DS ships one compiled stylesheet rather than separate token files).

- **color** (44): `--color-background`, `--color-surface`, `--color-surface-muted`, …
- **spacing** (18): `--space-0`, `--space-px`, `--space-0_5`, …
- **typography** (14): `--font-display`, `--font-sans`, `--font-mono`, …
- **radius** (7): `--radius-none`, `--radius-sm`, `--radius-md`, …
- **shadow** (5): `--shadow-xs`, `--shadow-sm`, `--shadow-md`, …
- **other** (25): `--leading-none`, `--leading-tight`, `--leading-snug`, …

## Components

### cards
- `ArticleCard` — ArticleCard  editorial/blog preview (CtrlPlane issues, Metis posts). The
- `Card` — Card  the bordered-surface container used everywhere in the ecosystem
- `CourseCard` — CourseCard  learning-path / module card. Mirrors the strong Metis track
- `ServiceCard` — ServiceCard  consulting/offering card (Meniva Services grid, but brand-

### actions
- `Button` — Button  the single button primitive for the ecosystem.

### navigation
- `Footer` — Footer  structured footer: brand block + link columns + a bottom bar.
- `Navbar` — Navbar  banded header with logo + links + a primary action. Includes an

### sections
- `Hero` — Hero  the section hierarchy of the system, scaled up. The variant carries
- `SectionHeader` — SectionHeader  encodes the shared section hierarchy

### brand
- `LogoLockup` — LogoLockup  lettermark + wordmark (+ optional tagline). Each brand has its own

### forms
- `NewsletterSignup` — NewsletterSignup  email capture (CtrlPlane subscribe, Meniva lead magnet,
