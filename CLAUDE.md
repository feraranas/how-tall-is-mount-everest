# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

An interactive single-page site visualizing the world's tallest mountains and volcanoes by altitude.
It is a **vanilla static site**: hand-written `index.html` loading plain `./js/*.js` and `./css/*.css`
directly in the browser. There is **no framework, no bundler, and no build step** — the files are
served as-is. (Despite the React/Vite/TypeScript/Tailwind packages still listed in `package.json`,
none of that stack is wired up — there is no `tsconfig.json`, vite config, or eslint config.)

## Commands

```bash
npm install      # install deps (only @playwright/test is actually used)
npm run dev      # serve the site statically at http://localhost:5599/ (python3 -m http.server)
npm run preview  # same as dev — serve the static site at http://localhost:5599/
npm run build    # no-op (static site; nothing to compile)
npm test         # run the Playwright smoke suite (auto-starts the static server)
```

The regression gate is the **Playwright smoke suite** in `tests/` (`npm test` or `npx playwright test`),
run against the statically-served site (`playwright.config.ts` starts `python3 -m http.server 5599`
automatically via its `webServer` block, baseURL `http://localhost:5599/`). There is no typecheck or
lint gate.

## Architecture

The whole experience is **one tall scrollable canvas** (50,000px). There is no router and no state
management — the visualization is driven entirely by absolute positioning along the Y axis and a single
scroll listener.

- `index.html` — the entire page. Sets `<body>` to `--page-height` (50000px) tall, paints the altitude
  gradient/grid backdrop, holds **all the markup** (every mountain is a hardcoded block, plus the
  metronome, illustrations, and animation layers), and loads the stylesheets and scripts. The six
  `media-*.css` files are attached here via `media="..."` queries for per-breakpoint layout.
- `js/scene.js` — **single source of truth for canvas constants** (`PAGE_HEIGHT` 50000, `MAP_HEIGHT`
  6800, `SUMMIT_OFFSET`, `MOUNTAIN_SPACING`). Loaded first; it also injects `--page-height` /
  `--half-page-height` CSS vars at boot so CSS and JS can't drift.
- `js/script.js` — the metronome. A `scroll` listener (`onScroll` → `updateMetronomo`) maps
  `window.pageYOffset` over `PAGE_HEIGHT`/`MAP_HEIGHT` to a meters value, writes it into
  `.metronomo-wrapper .metronomo`, and toggles the `active` class. Uses the `js/scene.js` constants.
- `js/mountainsData-script.js` — the hover info-panel interaction (`.fa-info` icon → `.mountain-info`
  panel). **Note:** this code is buggy (see the `info-panel-*` beads) and is mid-refactor.
- `js/ashesAnimation-script.js`, `js/rainAnimation-script.js`, `js/snowAnimation-script.js` — the
  weather/particle animation layers (live features, not stubs).
- `css/` — hand-written CSS. `main-styles.css` is the bulk (layout, metronome, per-mountain
  positioning, info-panel); `clouds.css`, `illustrations.css`, `animations.css`, `divider-ranges.css`
  are feature stylesheets; `media-*.css` hold the responsive overrides per breakpoint.

> **In-flight refactor:** the `refactor-v2-ulv` epic is moving the mountains from hardcoded HTML blocks
> to **data-driven rendering** — a data array in `js/mountainsData-script.js` rendered into a
> `#mountains-root` container. That work lives on unmerged branches/PRs; on `main`/`release` the
> mountains are still the hardcoded blocks described below.

### How a mountain is positioned (important)

Mountains are **hardcoded** in `index.html` and positioned by **bespoke CSS keyed to per-mountain
slug classes**. Adding or moving a mountain requires coordinated edits:

1. **Markup** — add a `<div class="mountain-N">` block in `index.html` containing
   `.mountain.<slug>-title` (title + height), `.mountain-data.<slug>-data` (the `.fa-info` tab and the
   `.mountain-info[data-key="N"]` panel rows), and a `.mountain-svg.<slug>-svg` element (e.g.
   `mount-everest`, `k2`, `kangchenjunga`).
2. **Position** — set the absolute `top:` (and size / `background` SVG) for that slug in
   `css/main-styles.css` (e.g. `.mountain-svg.mount-everest-svg { top: 3300px; ... }`). This CSS is the
   source of truth for *where* each mountain sits on the canvas.
3. **Responsive** — adjust the slug's rules in the relevant `css/media-*.css` breakpoint file(s) as
   needed.

The mountain SVG art is applied as a CSS `background` on the `.mountain-svg` slug class (not as
separate `<img>`/asset modules).

### Styling conventions

- Styling is **hand-written CSS** in `css/*.css` (no utility-class framework). Positioning leans on
  absolute `top:`/`left:` values and z-index layering keyed to per-mountain slug classes.
- Responsive behavior is split across the six `media-*.css` files, attached by `media="..."` queries in
  `index.html` rather than `@media` blocks inside one file.
- The `:root` block in `css/main-styles.css` holds only base settings (e.g. `font-size`). The canvas
  CSS custom properties (`--page-height`, `--half-page-height`) are **injected at boot from
  `js/scene.js`** rather than declared in CSS, so keep the canvas dimensions in `js/scene.js` as the
  source of truth.
