# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

An interactive single-page site visualizing the world's tallest mountains and volcanoes by altitude ("Montañas de México lindo y del mundo"). **Vanilla HTML/CSS/JS — no production framework, bundler, or build step.** The development toolchain is deliberately small: Playwright for browser tests and Storybook with its Vite-based HTML adapter for the component catalog.

## Commands

```bash
npm install        # installs Playwright + Storybook tooling
npm run dev        # python3 -m http.server 5599 (site is served as-is)
npm test           # Playwright suite in tests/ — this is the regression gate
npm run storybook  # component stories (Storybook html-vite)
```

There is no build or typecheck step. `npm test` (Playwright) is the gate before claiming a change works.

## Architecture

The whole experience is **one tall scrollable canvas** (50,000px). You "start" at the bottom (page auto-scrolls to bottom on load) and scroll *up* to gain altitude. Everything is absolutely positioned along the Y axis; a single rAF-throttled scroll listener drives the altitude readout.

- `js/scene.js` — **single source of truth for canvas constants** (`PAGE_HEIGHT`, `MAP_HEIGHT`, `SUMMIT_OFFSET`, `MOUNTAIN_SPACING`). Injects `--page-height`/`--half-page-height` CSS vars at boot so CSS and JS cannot drift. Loaded first; its globals are shared by the other scripts.
- `index.html` — static shell: metronome, dividers, animation containers, `#mountains-root`, `.illustrations`, intro/end screens. Script order at the bottom matters (scene → cloud DOM → drift engine → script.js → renderers).
- `js/script.js` — metronome update on scroll (maps `scrollY` to a meters readout), intro-title responsiveness, show/hide of metronome, end screen, and the three-thousander divider.
- `js/mountainsData-script.js` — the `mountains` data array (content only) + DOM builder that renders every peak into `#mountains-root`. Markup comes from the factories in `js/components/mountain.js` (`makeMountainTitle` / `makeInfoPanel`).
- `js/components/cloud.js` → generates cloud DOM; `js/cloudsParallax-script.js` → horizontal drift engine (depth-aware speed, wrap-around, honors `prefers-reduced-motion`).
- `js/components/illustration.js` — illustration DOM + hover info panels.
- `js/ashesAnimation-script.js` — canvas ashes effect. `rainAnimation-script.js` / `snowAnimation-script.js` are empty placeholders.
- `css/` — `main-styles.css` (globals, altitude gradient with hardcoded px stops), `components/*.css`, `layout/*.css` (placement), plus responsive styles split as `media-common.css` (declarations shared by all breakpoints, loaded at every width) and six breakpoint files (`media-0-390.css` … `media-1950.css`) holding only per-width overrides. Edit shared values in `media-common.css` once; a breakpoint file only needs a rule when that width genuinely differs.

### How a mountain works (important)

Content and layout are decoupled:

1. **Data** — add a row to `mountains` in `js/mountainsData-script.js` (`n`, `slug`, `title`, `height`, `location`, …). `n` preserves original ordering identity (note the 18 → 20 → 19 quirk); rows past #25 may have no SVG yet — WIP, not bugs.
2. **Asset** — SVG referenced from CSS as a background image.
3. **Layout** — bespoke CSS rules keyed by the slug class (`.mountain-svg.<slug>-svg`, `.mountain-N`, `.data-container.m-N`) set `top`/`left`/size/`z-index` in `css/layout/mountain-placement.css`, `main-styles.css`, and the media breakpoint files.

Info panels are pure CSS (`.mountain-data:hover .mountain-info`) — no JS hover wiring.

## Conventions

- Playwright tests live in `tests/`; run against the local http.server. Add/extend a spec when changing user-visible behavior.
- Media stylesheets are loaded per-breakpoint via `media=` attributes in `index.html`.
- Site text is Spanish; keep new UI copy in Spanish.
- Commits: no AI co-author trailer.
