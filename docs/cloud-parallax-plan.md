# Cloud parallax on scroll — plan (TDD)

## Context

The site is one 50,000px scrollable canvas. Clouds currently sit still: `index.html` has a
`.clouds-container` with ~51 static `.cloud.cloud-N` divs; `css/clouds.css` gives each a
`background-image` + `z-index` (depth ~8–150) over a base `.cloud { position:absolute; left:50%;
transform:translateX(-50%) }`. **No JS animates the clouds today** (only `ashes`/`rain`/`snow`/
`scene`/`script`/`mountainsData` scripts exist). The single scroll signal lives in `js/script.js`
(`onScroll` → `requestAnimationFrame` → `updateMetronomo`), reading `window.pageYOffset`.

We want clouds to drift slowly and smoothly as the user scrolls, with nearer layers moving more than
far ones, so ascending feels dynamic. **Vanilla JS + CSS**; regression gate is the Playwright smoke
suite (not `npm run build`). Work test-first.

### Decisions
- **Bidirectional** parallax (drifts with scroll position both up and down — most natural/sleek; the
  scroll-up ascent still reads as dynamic).
- **Scroll-only** — no always-on idle drift (simpler, cheaper, deterministically testable).
- **Depth-layered speed**, **slow** (clouds lag the scroll), **motion-safe** (`prefers-reduced-motion`).

## Approach (vanilla JS + CSS)

- **New `js/cloudsParallax-script.js`** (own file per the per-feature script convention; add a
  `<script>` to `index.html` after `js/scene.js`).
  - Passive `scroll` listener → single `requestAnimationFrame` loop (mirror `js/script.js`'s
    `onScroll` pattern; coalesce events, no layout thrash).
  - Per cloud apply `transform: translate3d(-50%, <offsetY>px, 0)` — **preserve the `-50%` X
    centering**, GPU-composited; **never animate `top`**.
  - `offsetY = (REFERENCE_SCROLL - window.pageYOffset) * factor`, bidirectional.
  - `factor` derived from each cloud's existing `z-index` (closer/higher z ⇒ larger factor),
    normalized and scaled by a small `PARALLAX_MAX ≈ 0.15` so motion stays slow and clouds *lag* the
    scroll (parallax slower than the scroll delta).
  - **Sleek:** rAF lerp toward the target offset (gentle trailing easing) rather than snapping.
  - **`prefers-reduced-motion: reduce` ⇒ parallax disabled** (clouds static); use
    `matchMedia('(prefers-reduced-motion: reduce)')` and skip updates.
  - Tunables (`PARALLAX_MAX`, `LERP`, `REFERENCE_SCROLL`) centralized at the top of the file.
- **`css/clouds.css`:** add `will-change: transform;` to `.cloud` (compositor hint).

## Test harness notes

- Site served at `http://localhost:5599/`; auto-scrolls to the bottom on load.
- Drive scroll deterministically: `await page.evaluate(y => window.scrollTo(0, y), Y)` then nudge
  (`page.mouse.wheel(0,1)`) and settle a rAF tick so the handler runs.
- Measure a cloud's vertical parallax via the computed transform matrix (`m42` = translateY), not
  bounding box (the page itself scrolls):
  ```ts
  const cloudTy = (p, sel) =>
    p.locator(sel).evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m42);
  ```
- New tests live in `tests/cloud-parallax.spec.ts`. `tests/smoke.spec.ts` must stay green. Note: the
  smoke suite already tolerates the broken `cloudsv8.png`/`imagedelivery.net` cloud assets via
  `KNOWN_ERROR_PATTERNS` — fixing those is **out of scope** here.

## Bead — `cloud-parallax` (task, P2)

**RED — write first; must fail against current (static) clouds:**
1. **shifts on scroll** — a cloud's `cloudTy` differs between two scroll positions. *(Fails now: constant.)*
2. **bidirectional** — scrolling up then back down moves the offset back toward origin (sign reverses). *(Fails now.)*
3. **layered** — two clouds of different depth move by different amounts over the same scroll delta. *(Fails now: both 0.)*
4. **slow/subtle** — `0 < |Δoffset| < |scrollΔ|` (clouds lag the scroll). *(Fails now.)*
5. **reduced-motion guard** — with `emulateMedia({ reducedMotion:'reduce' })`, `cloudTy` is unchanged
   across the same scroll. *(Guard — must stay green after implementation.)*
6. **smoke stays green** — no new console/page errors.

**GREEN — minimal:** implement `js/cloudsParallax-script.js` + wire `<script>` + `will-change` to satisfy
1–6. **REFACTOR:** extract the `z-index → factor` mapping into a small pure helper.

## Verification / gate

- `tests/cloud-parallax.spec.ts` + `tests/smoke.spec.ts` green ×3 browsers (`--retries=0`).
- Close-bead Gate 4: capture a runtime screenshot of clouds at two scroll positions showing the shift
  (artifact under `evidence/`).

## Scope guardrails

One bead = one branch = one PR off `release`. **Out of scope:** idle drift, redesigning cloud art or
positions, fixing the 0×0 invisible clouds, and the broken `cloudsv8.png`/imagedelivery assets — flag
if any block the work.
