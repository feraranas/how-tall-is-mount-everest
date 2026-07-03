# Vanilla design system + Storybook (no React migration)

## Context

The site is one 50,000px absolutely-positioned canvas. "Components" (clouds, info
tooltips, mountain titles, birds/objects, backgrounds) exist only implicitly:

- Markup: 51 hardcoded cloud divs in `index.html`; illustrations/birds likewise.
  Only mountains have a factory — `mountainMarkup(m)` in `js/mountainsData-script.js`.
- Styling: *skin* (background-image, filter, opacity) and *canvas placement*
  (`top: NNNNNpx`, breakpoint transforms) are entangled per class, spread across
  `css/main-styles.css`, `css/clouds.css`, `css/illustrations.css`, and six
  `css/media-*.css` breakpoint files.

Goal: a browsable design-system catalog where each component can be viewed and
edited in isolation — **staying vanilla HTML/CSS/JS**. Storybook supports this
via the official `@storybook/html-vite` framework (stories return HTML strings
or DOM nodes; Vite is a dev-only dependency — the production site keeps its
"no build step" model, served by `python3 -m http.server 5599`).

The prerequisite is making components explicit: isolation-rendering fails while
a cloud's identity includes `top: 5100px`.

## The 4 steps

### Step 1 — Component inventory + skin/layout CSS split
No behavior change; a CSS reorganization gated on the Playwright suite.

- Inventory every implicit component: clouds, mountain title block, info
  tooltip (`.mountain-data`/`.mountain-info`), mountain SVG layers, birds &
  objects + their i-tooltips, background gradient/grid, metronome, dividers,
  animations (ashes, twinkle, drift).
- For each, split CSS into:
  - `css/components/<name>.css` — what it *looks like* (skin)
  - `css/layout/<name>-placement.css` — where it *sits on the canvas*
    (`top/left/z`, per-breakpoint transforms; media-query files keep placement)
- `index.html` link order updated; visual checkpoints + full suite must stay green.

### Step 2 — Factory functions in `js/components/`
One source of truth for markup, shared by the site and (later) stories.

- `makeCloud({variant, filter, opacity, z, flip})`, `makeInfoPanel(data)`,
  `makeMountainTitle(data)`, `makeIllustration({kind, tooltip})`, …
- Refactor consumers: `index.html`'s hardcoded cloud divs become a small boot
  script calling `makeCloud` per entry of a clouds data array (mirroring the
  mountains pattern); `mountainMarkup(m)` decomposes into the shared factories.
- Site behavior identical; suite green. This alone fixes "several coordinated
  edits to add a thing".

### Step 3 — Storybook infrastructure (`@storybook/html-vite`)
- `npx storybook@latest init --type html` (Vite builder), dev-only deps.
- `.storybook/preview.js` imports `css/components/*.css` only (never layout
  CSS) + global styles (fonts, CSS custom properties from `src/index.css`
  equivalents in `css/main-styles.css`).
- Backgrounds addon configured with altitude-gradient swatches (floor, sky
  bands, night) so components preview in context; viewport addon mirrors the
  six media breakpoints.
- `npm run storybook` / `npm run build-storybook` scripts; prod site untouched.

### Step 4 — Stories + docs per component
- One `*.stories.js` per factory: variants as args/controls (cloud image
  variant, filter/brightness, flip; tooltip with/without range row; title with
  long names/flags; illustrations with their i-tooltips).
- Animations (drift, twinkle, ashes) demoed in stories via the same JS.
- A docs page ("Design tokens") for CSS custom properties, fonts, z-index bands.
- Playwright smoke for the built storybook (it serves statically) — optional gate.

## Order & gating

1 → 2 → 3 → 4, each gated on the full Playwright suite (`--workers=2`).
Steps 1–2 are valuable standalone even if Storybook is never installed.
Start with the easiest wins: mountain title/info-panel (already data-driven)
and clouds; long-tail components (dividers, metronome) can trail in step 4.

## Non-goals

- No React migration; no bundler for the production site.
- No pixel-perfect redesign — catalog reflects what exists.
- Broken/missing CDN assets (e.g. cloudsv8.png) are out of scope.
