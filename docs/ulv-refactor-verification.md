# ULV refactor — final verification (bead ulv.5)

Final verification of the `refactor-v2-ulv` epic (ulv.1–ulv.4) against the actual
**vanilla JS + static-file** site. The bead's acceptance criteria were written for a
React + Vite + TS stack that does not exist in this repo; each is mapped below to its
real-world equivalent and result.

Date: 2026-06-30 · Branch: `refactor/ulv.5-verification` (stacked on ulv.4 → ulv.3 → ulv.2).

## Architecture reality (why the criteria are adapted)

The served site is `index.html` loading `./js/*.js` + `./css/*.css` directly (no bundling).
It is served as static files (Playwright runs against `python3 -m http.server 5599`).
There is **no `tsconfig.json`, no Vite config, and no ESLint config** — the
`package.json` `build`/`lint`/`dev`/`preview` scripts target a never-realized React app.
The real regression gate is the **Playwright smoke suite** (`tests/smoke.spec.ts`).

## Verification matrix

| Bead criterion (React-worded) | Vanilla result | Evidence |
|---|---|---|
| `npm run build` passes | **N/A — vestigial.** `tsc -b` fails: no `tsconfig.json`. No build step exists; the site is static. | `npm run build` → `error TS5083: Cannot read file '.../tsconfig.json'` |
| `npm run lint` clean | **N/A — vestigial.** `eslint .` has no config. | `npm run lint` → no eslint config found |
| All mountain SVGs render | **PASS** — 41 (not 25) `.mountain-svg` nodes render from the data array. | runtime: `svgCount: 41` |
| Breaking a filename triggers a missing-asset error | **N/A by design.** Mountain art is a CSS `background-image: url(...)`; a missing background fails **silently** (no console/network error). The "throws on missing import" behavior was specific to the React `import.meta.glob` approach. | smoke `KNOWN_ERROR_PATTERNS` already tolerates absent images |
| Scrolling updates the metronome; active toggles at edges | **PASS** | smoke: `metronome altitude changes across scroll checkpoints` (3 distinct readings); `REAL scrolling moves the viewport` |
| Mountains can't be drag-selected / drag-ghosted; labels can't be highlighted | **PASS** (ulv.3) | `.scene-layer{user-select:none}`; 41/41 svgs+titles `aria-hidden`+`draggable=false`; info tabs stay `pointer-events:auto` |
| No console errors | **PASS** | smoke: `loads with no unexpected console/page errors` |
| Vertical spacing is even | **N/A.** Positions are bespoke artistic per-breakpoint CSS, not formulaic spacing (criterion dropped in the ulv.2 plan). | — |
| Throwaway 26th mountain appears with no other edits, then reverted | **PASS** — adding **one data row** (no HTML edits) produced a 42nd rendered mountain; reverted. | runtime: `svgCount:42, has42:true, node42text:"VERIFY THROWAWAY"`, then `git checkout` → back to 41 |

## Regression gate

`npx playwright test` → **15 passed** (chromium / firefox / webkit), repeated green this
session (firefox scroll flake fixed in ulv.2 via condition-based waiting).

## Findings / follow-ups (not in scope here)

- **Vestigial `package.json` scripts** (`build`/`lint`/`dev`/`preview`) point at a
  non-existent React/Vite/ESLint setup and all fail. Candidate for a future cleanup bead
  (make them honest for the static site, or remove).
- **Missing `<meta charset="utf-8">`** in `index.html` causes flag-emoji mojibake;
  pre-existing on `release`. Tracked separately:
  `how-tall-is-mount-everest-refactor-epic-charset-meta-mojibake-l2c`.
- The beads + `CLAUDE.md` describe a React/TS/Tailwind app; the repo is vanilla JS.
  Worth reconciling the docs so future beads stop describing a stack that isn't there.
