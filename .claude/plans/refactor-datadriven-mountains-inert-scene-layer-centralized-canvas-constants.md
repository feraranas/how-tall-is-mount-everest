# Refactor: data-driven mountains, inert scene layer, centralized canvas constants

## Context

`how-tall-is-mount-everest` is a single 50,000px scrollable canvas (by design — kept as-is) that
visualizes mountains by altitude. Three structural problems make it hard to extend before adding
features:

1. **Adding a mountain takes 5 coordinated edits** across the SVG asset, a `bg-mountain-N` entry in
   `tailwind.config.js`, the `mountainVariants` map in `Mountain.tsx`, the `MountainID` union in
   `Mountains.tsx`, and the data row in `mountainsInfo.ts`. These can drift out of sync (they already
   have — `mountainVariants` entries past `mountain-18` all point at `top-[12500px]`).
2. **The mountain layer is only loosely inert** — a single `pointer-events-none` on each `Mountain`
   div, with no formal decorative layer. The user wants mountains provably non-interactive (no drag,
   no text selection, no pointer capture), sitting behind any future interactive layer.
3. **Canvas dimensions are duplicated magic numbers** — `50000`/`6800`/`2500`/`350` are hardcoded in
   `Metronome.tsx`, and `--page-height`/`--half-page-height` are separately hardcoded in `index.css`,
   so the canvas height is defined in three places.

Outcome: adding a mountain becomes "drop an SVG in the folder + add one data row"; the mountain layer
is a single inert scene; and the canvas height is defined once in TypeScript.

## 1. Data-driven mountain system (eliminate the 5-edit gotcha)

Make `src/components/Mountains/mountainsInfo.ts` the single source of truth and derive everything else.

- **Asset discovery via Vite glob.** Replace the tailwind `bg-mountain-N` registrations with a glob in
  the mountains module:
  ```ts
  const svgUrls = import.meta.glob('../../assets/mountains/*.svg', {
    eager: true, query: '?url', import: 'default',
  }) as Record<string, string>;
  ```
  Build a lookup keyed by filename (e.g. `1-MOUNT-EVEREST.svg`). Each data row references its asset by
  filename; resolve to URL through the lookup and throw a clear error if a filename is missing.
- **Derive position from order, not hardcoded per-mountain.** Compute `top = SUMMIT_OFFSET + index * MOUNTAIN_SPACING`
  and `zIndex = index + 1` from the array index. This deletes the entire `mountainVariants` map.
- **Drop the `MountainID` union.** Use the asset filename (unique) as the React `key`; no per-id typing
  to maintain. Rename the `mountainConfig` interface to `MountainConfig` (PascalCase) and reshape to
  `{ asset, name, altitude, location, prominence, range, firstAscent, difficulty }`.

Files:
- `src/components/Mountains/mountainsInfo.ts` — glob lookup + reshaped data array (asset-keyed).
- `src/components/Mountains/Mountains.tsx` — remove `MountainID`; pass resolved `src`, `top`, `zIndex`
  (derived from index) to `Mountain`; export `MountainConfig`.
- `src/components/Mountains/Mountain.tsx` — delete `mountainVariants`; apply position/image via inline
  `style={{ top: `${top}px`, zIndex, backgroundImage: `url(${src})` }}`; keep static size/`bg-cover`
  classes. Add `draggable={false}` (see §2).
- `tailwind.config.js` — remove the 25 `bg-mountain-N` lines (keep clouds, grids, and the
  `floor-to-sky-*` gradients).

Result: adding a mountain = drop `N-NAME.svg` in `src/assets/mountains/` + add one row to
`mountainsInfo.ts`. (Note: existing data rows are placeholder duplicates of mount-everest — fixing the
real metadata is now a one-file content edit, out of scope here unless requested.)

## 2. Non-interactive scene layer (lock it down robustly)

Introduce one decorative wrapper around the mountains (and the stub animation layers) so the whole
scene is provably inert and sits behind future interactive UI.

- In `Mountains.tsx` (or a thin new `Scene` wrapper rendered in `App.tsx`), wrap the mapped mountains
  in:
  ```tsx
  <div aria-hidden className="absolute top-0 left-0 w-full h-full pointer-events-none select-none">
  ```
  `absolute ... h-full` keeps the wrapper out of normal flow (so it doesn't double the body height) and
  gives absolutely-positioned mountains an explicit positioned ancestor.
- Add `draggable={false}` on each `Mountain` div as belt-and-suspenders against native drag ghosts.
- Keep `Metronome` (z-`[99]`) outside this layer as the interactive/UI layer above the scene.

## 3. Centralize canvas constants

Create `src/config/scene.ts` as the single source for canvas dimensions:
```ts
export const PAGE_HEIGHT = 50000;
export const MAP_HEIGHT = 6800;
export const SUMMIT_OFFSET = 2500;     // first mountain top + metronome base reading
export const MOUNTAIN_SPACING = 2500;  // vertical gap between mountains
```
- `Metronome.tsx` — import these instead of the literal `50000`/`6800`/`2500`; keep the `350`/`100`
  scroll-edge thresholds as named locals. Wrap the scroll handler body in a `requestAnimationFrame`
  guard (ticking flag) so it isn't recomputed on every scroll event.
- `main.tsx` — on boot, inject the CSS vars from the constant so CSS and TS can't drift:
  ```ts
  document.documentElement.style.setProperty('--page-height', `${PAGE_HEIGHT}px`);
  document.documentElement.style.setProperty('--half-page-height', `${PAGE_HEIGHT / 2}px`);
  ```
  Remove the hardcoded `--page-height`/`--half-page-height` from `:root` in `src/index.css` (leave the
  rest of `:root` intact). `index.html` keeps using `var(--page-height)` — no change there.

## 4. Remove dead / stub code

Proposed disposition (flagging for veto): **stub cleanly, don't delete the scaffolding.**
- `Stars.tsx`, `Ashes.tsx`, `Clouds.tsx`, `Illustrations.tsx` — return `null` instead of debug text
  like `<div>Clouds</div>` so they inject nothing into the DOM, but keep the files since the names map
  to clearly-intended future effects.
- `Metronome.tsx` — remove the six leftover empty `<div>` children inside the text ref.
- `App.tsx` — remove the commented-out `Dividers` import/usage (the `Dividers.tsx` file can stay).

## Verification

- `npm run build` — must pass (validates the glob typing, `MountainConfig` reshape, and removal of
  `MountainID`/`mountainVariants`).
- `npm run lint` — clean.
- `npm run dev` and in the browser:
  - All 25 mountain SVGs render (confirms the glob resolved every asset; intentionally break one
    filename reference to confirm the missing-asset error fires).
  - Scrolling updates the Metronome meter readout and the `active` toggle behaves at the top/bottom
    edges as before.
  - Mountains cannot be drag-selected or drag-ghosted; the data labels can't be highlighted.
  - No console errors; mountain vertical spacing is even (index-derived positions).
- Sanity: add a throwaway 26th SVG + one data row, confirm it appears at the next position with no
  other edits, then revert.
