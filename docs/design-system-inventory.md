# Design-system component inventory

Every implicit component on the 50,000px canvas, where its markup and CSS live
today, and how its styles split into **skin** (what it looks like — belongs in
`css/components/`) vs **placement** (where it sits on the canvas — belongs in
`css/layout/` / the `css/media-*.css` breakpoint files).

Companion plan: `.claude/plans/vanilla-design-system-storybook.md`.

## Legend

- **Markup** — where the DOM comes from (static `index.html` vs generated).
- **Skin** — visual identity: `background-image`, `filter`, `opacity`, fonts,
  borders, colors, animation keyframes.
- **Placement** — canvas position: `top/left/z-index`, per-breakpoint
  `padding`/`transform` sizing hacks.

## Components

### 1. Cloud (`.cloud.cloud-N`, 51 instances)
- **Markup:** `index.html` lines ~57–108 (hardcoded divs in `.clouds-container`).
- **Skin:** `css/clouds.css` — per-cloud `background-image` (mostly Cloudflare
  CDN, some local `images/clouds/*.png`; `cloudsv8.png` is missing → broken),
  `filter: brightness(…)`, `opacity`, base `.cloud` rule.
- **Placement:** the six `css/media-*.css` files — `top: NNNNNpx`,
  `padding: 400px 800px` (size hack), `transform: translateX(…) scaleX(±…)`.
  `z-index` doubles as *drift depth* (see behavior) so it stays in skin file
  but is semantically shared.
- **Behavior:** `js/cloudsParallax-script.js` — horizontal drift engine
  (speed keyed off z-index; preserves CSS scale).

### 2. Mountain title block (`.mountain`, `.mountain-title`, `.mountain-height`)
- **Markup:** generated — `mountainMarkup(m)` in `js/mountainsData-script.js`
  into `#mountains-root` (41 peaks).
- **Skin:** `css/main-styles.css` (typography, dashed underline).
- **Placement:** `.m-N { top: … }` rules in `css/main-styles.css` +
  breakpoint overrides in `css/media-*.css`.

### 3. Info tooltip (`.mountain-data`, `.tab-arrow`, `.fa-info`, `.mountain-info`)
- **Markup:** generated (same factory as #2).
- **Skin:** `css/main-styles.css` — icon chip, panel, arrow; open/close is
  pure CSS `:hover` (no JS).
- **Placement:** rides inside the mountain's `.data-container`; minor
  breakpoint tweaks in `css/media-*.css`.
- **Tests:** `tests/info-panel.spec.ts`, `tests/half-dome-label.spec.ts`.

### 4. Mountain SVG layer (`.mountain-svg.<slug>-svg`)
- **Markup:** generated (same factory).
- **Skin:** `background-image` (CDN) + `opacity` — in `css/main-styles.css`
  per slug.
- **Placement:** same rules carry `top` + `z-index` (skin and placement are in
  the *same* rule today; the split must separate them).

### 5. Illustration w/ tooltip (`.illustration-container.<name>-container`, 22 instances)
- **Markup:** `index.html` lines ~117–293 (hardcoded): planes, helicopters,
  drones, air balloon, 12 birds. Each = `.illustration-data`
  (`.tab-arrow-illustration` + `.fa-info-illustration`) + `.illustration.<name>`.
- **Skin:** `css/illustrations.css` — sprite `background-image` per name,
  `.mountain-info-icon` (currently orphaned — its only consumer was removed
  with the Half Dome duplicate), icon/arrow styling.
- **Placement:** `top/left/z` per name in `css/illustrations.css` +
  breakpoint files. Same entangled-rule problem as #4.

### 6. Background (altitude gradient + grids)
- **Markup:** none — painted on `body` / `body::before` / `body::after`.
- **Skin & placement fused:** `css/main-styles.css` — `bg-floor-to-sky`
  gradient hard-codes `50000px` stops; grid overlays.
- **Canvas constants:** `js/scene.js` injects `--page-height: 50000px`,
  `--half-page-height`.

### 7. Metronome altitude readout (`.metronomo-wrapper`, `.metronomo-grid`, digit cells)
- **Markup:** `index.html` lines ~26–37.
- **Skin:** digit cells, monospace look — `css/main-styles.css`.
- **Placement:** fixed top-center.
- **Behavior:** `js/scene.js` (scroll → meters, `SUMMIT_OFFSET = 2500`).
- **Tests:** covered by `tests/smoke.spec.ts` checkpoints.

### 8. Divider / range banner (`.dividers-container`, `.divider.three-thousander`)
- **Markup:** `index.html` lines ~40–44 (one instance).
- **Skin + placement:** `css/divider-ranges.css` (19 lines, already isolated).

### 9. Stars / twinkle (`.stars`)
- **Markup:** `index.html` line 48.
- **Skin:** `styles.css`-era rule now in `css/main-styles.css`
  (`twinkleMask.png` repeat) — night band `top: 21200px`, `height: 2200px`
  (placement fused in).

### 10. Ashes canvas (`.ashes` + `#canvas`/`#buffer`)
- **Markup:** `index.html` lines ~52–55.
- **Behavior:** `js/ashesAnimation-script.js` (canvas particles).
- **Skin/placement:** container sizing in `css/main-styles.css`.

### 11. Initial screen (offroad, floor, man/woman, boulders, `.title`, scroll-up hint)
- **Markup:** `index.html` lines ~296–318.
- **Skin + placement:** `css/main-styles.css` ("INITIAL SCREEN" section).
  The `h1` title with `.mex/.ico/.lindo` spans is the site's typographic
  signature — a natural first docs-page candidate.

### 12. End screen (`.end-title.slide-in`, `.end-text`)
- **Markup:** `index.html` lines ~321–328.
- **Skin:** `css/main-styles.css` + `slide-in` animation.

## Cross-cutting facts

- **`styles.css` (4,295 lines) is dead code** — not linked from `index.html`
  (only `css/*.css` files are). Do not split it; candidate for deletion in a
  separate cleanup.
- **`css/animations.css`** holds one unused keyframe (`cloudHorizontall`) —
  fold real keyframes into their component files during the split.
- **Breakpoints:** 0–390 / 391–428 / 429–768 / 769–1440 / 1441–1950 / 1950+
  (six `css/media-*.css` files, ~1,150 lines each, mostly placement).
- **z-index bands:** mountains/SVG ≈ 8–11, clouds 7–150 (doubles as drift
  depth), UI/icons ≥ 150.
- **Load order** (`index.html` head): `main-styles.css` → `clouds.css` →
  `illustrations.css` → `divider-ranges.css` → `animations.css` → media files.
  The split must preserve cascade order (components before layout overrides).

## Split order (per plan step 1)

1. Clouds (1.2) — cleanest boundary, `clouds.css` already exists.
2. Mountain title + info tooltip (1.3) — extract from `main-styles.css`.
3. Illustrations + background (1.4) — untangle top/z from sprite rules.
4. Long tail (metronome, dividers, screens, stars/ashes) — during step 4
   story work, as needed.
