# ulv.2 — Data-driven mountain system (vanilla JS adaptation)

## Context

The `refactor-v2-ulv` epic has one bead closed (**ulv.1**, canvas constants → `js/scene.js`, PR #56) and **ulv.2 is the next ready P1**. Its goal: kill the gotcha where adding/changing a mountain requires many coordinated edits across files that drift out of sync.

**Important divergence:** the beads and `CLAUDE.md` describe a Vite + React + TS + Tailwind app (`src/config/scene.ts`, `mountainVariants`, `MountainID`, `import.meta.glob`, `tailwind.config.js`). **That stack does not exist.** The real app is **vanilla JS + webpack**. ulv.1 was already adapted this way (`js/scene.js`, not `.ts`). ulv.2's React-flavored design must likewise be reinterpreted. The user chose **"Adapt to vanilla JS."**

**Reality of the gotcha in this repo** — adding/editing a mountain today touches:
1. SVG asset in `images/mountains/N-NAME.svg` (25 present).
2. A ~33-line markup block in `index.html` (peaks 1–25 live at lines ~111–1245, flat siblings inside `.main-container`).
3. Per-peak CSS in `css/main-styles.css` **and** in all 6 `css/media-*.css` breakpoint files (~41 `mountain-svg.` rules each) — this is bespoke artistic positioning (`top`, `left`/`right`, `width`, `height`, `z-index`), not formulaic spacing. The bead's "even index-derived spacing" criterion is **wrong for this layout** and must be dropped.

So the *mechanical, duplicated* edits we can eliminate are the **HTML block** and the **info-panel content** (Spanish text repeated per peak). Bespoke responsive CSS positioning is genuine design work and stays in CSS, keyed by the existing slug classes.

## Approach

Make `js/mountainsData-script.js` the single source of truth for mountain **content** and **generate the DOM** from it, keeping the existing slug-based CSS classes so all current positioning (base + 6 breakpoints) keeps working untouched.

### 1. Data array — `js/mountainsData-script.js`
Add a `mountains` array, one object per peak (order = render order), e.g.:
```js
const mountains = [
  { key: 1, slug: "mount-everest", title: "MOUNT EVEREST", flag: "🇨🇳",
    height: "8,849m",
    info: { location: "China 🇨🇳", altitude: "8,849m", prominence: "8,848m",
            range: null, firstAscent: "1953", difficulty: "Extremo" } },
  // ...25 entries, transcribed verbatim from current index.html blocks
];
```
- `slug` must equal the existing CSS class stem (`mount-everest`, `k2`, `kangchenjunga`, …, `nevado-colima`) so `.mountain-svg.<slug>-svg`, `.mountain.<slug>-title`, `.mountain-data.<slug>-data` rules still apply. **Transcribe slugs exactly** from the current markup (note quirks: `acaconcagua`, `ojos-salado`, `cerro-nube-oax` vs asset `24-CERRO-NEGRO-OAX`, `teyotl`, etc.) — verify each against `css/main-styles.css`.
- `range` is optional (only some peaks list "Mountain range").

### 2. Render function — same file
A `renderMountains()` that builds each block's HTML string matching the **exact current structure** (`.mountain-N` › `.data-container.m-N` › `.mountain.<slug>-title` + `.mountain-data.<slug>-data` › `.mountain-info[data-key]` `<ul>` + `.bottom-row`; sibling `.mountain-svg.<slug>-svg`) and injects into a single anchor.
- In `index.html`, replace the 25 markup blocks (lines ~111–1245) with one placeholder: `<div id="mountains-root"></div>` at that spot inside `.main-container`.
- Render must run before the info-tab listeners wire up. Currently `mountainsData-script.js` attaches `mouseenter`/`mouseleave` to `.fa-info` at load — restructure so render happens first, then listener attachment (move attachment into / after `renderMountains()`).
- Build the `<li>` list conditionally (skip `range` when null) to reproduce existing panels exactly.

### 3. Asset wiring
Keep `background-image: url(./images/mountains/N-NAME.svg)` in CSS (it's part of the bespoke `.mountain-svg.<slug>-svg` rule). Do **not** move image URLs into JS — that would split positioning from imagery across two files and reintroduce drift. Adding a mountain = drop SVG + add data row + add the CSS positioning rule(s). The data row replaces the whole HTML block.

### 4. Out of scope (call out, don't do)
- Data-driving the bespoke per-breakpoint CSS positions — inherent design, not boilerplate; not part of this bead.
- Removing legacy root `styles.css` / root `script.js` (unreferenced by `index.html`, which loads `js/script.js` + `css/main-styles.css`) — that's **ulv.4** (dead code).

## Critical files
- `js/mountainsData-script.js` — add `mountains` array + `renderMountains()`; reorder listener wiring.
- `index.html` — delete blocks ~111–1245, insert `<div id="mountains-root"></div>`; script already loaded at line 1507.
- (read-only reference) `css/main-styles.css` + `css/media-*.css` — confirm slug classes; **not edited**.

## Verification
1. `npm run build` (webpack) succeeds; open the built site / `npm run dev`.
2. Visually diff against pre-change: all 25 peaks render at the same positions/sizes across breakpoints (spot-check ≥3 widths: ~375px, ~1000px, ~1600px). Use the Playwright smoke suite already in `tests/` (see `docs/playwright101.md`) — run it before and after; output must match.
3. Hover each `.fa-info` → correct info panel shows/hides (debounced behavior unchanged); `data-key`/`data-mountain-key` still align.
4. Confirm DOM count: exactly 25 `.mountain-svg` nodes generated.
5. Then `br close` per the close-bead skill (regression + mergeable PR linking the bead).

## After ulv.2
ulv.3 (inert scene layer) unblocks. ulv.4 (remove legacy root `styles.css`/`script.js` + stubs) is independently ready. Consider updating the epic/bead notes + `CLAUDE.md` to reflect the real vanilla-JS architecture so future beads stop describing a React app.
