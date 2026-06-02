# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

An interactive single-page site visualizing the world's tallest mountains and volcanoes by altitude. Built with Vite + React 18 + TypeScript + Tailwind CSS v3.

## Commands

```bash
npm install      # install deps
npm run dev      # Vite dev server with HMR
npm run build    # tsc -b (typecheck) then vite build → dist/
npm run lint     # eslint over the repo
npm run preview  # serve the production build
```

There is no test suite. `npm run build` is the type-check gate (run `tsc -b` before assuming TS is clean).

## Architecture

The whole experience is **one tall scrollable canvas** (50,000px). There is no router and no state management — the visualization is driven entirely by absolute positioning along the Y axis and a single scroll listener.

- `index.html` — sets `<body>` to `--page-height` (50000px) tall and paints the `bg-floor-to-sky-2` gradient as the altitude backdrop. The `::before`/`::after` pseudo-elements draw the grid overlays (`gridWhite`/`gridBlack`).
- `src/App.tsx` — composition root. Renders `Metronome`, `Animations`, `Mountains`, `Illustrations` as flat siblings (no layout wrapper).
- `src/components/Metronome/Metronome.tsx` — fixed altitude readout. The only interactive logic: a `scroll` listener maps `window.scrollY` over the page height to a meters value and toggles an `active` class. `totalHeight` (50000) and `mapHeight` (6800) here must stay in sync with the page height in `index.html`/`index.css`.
- `src/components/Mountains/` — `Mountains.tsx` maps over the `mountains` array and renders a `Mountain` per entry; each `Mountain` wraps a `DataContainer` (→ `MountainTitle` + `MountainInformation`).
- `src/components/Animations/` — `Stars`, `Ashes`, `Clouds`. These are mostly stubs/placeholders right now.

### How a mountain is positioned (important)

Adding or moving a mountain requires **several coordinated edits**, because the data, the SVG, and the layout are decoupled:

1. **Asset** — SVG in `src/assets/mountains/N-NAME.svg`.
2. **Tailwind background** — register it as `bg-mountain-N` under `theme.extend.backgroundImage` in `tailwind.config.js` (paths are relative to project root, e.g. `url("src/assets/mountains/...")`).
3. **Layout variant** — `mountainVariants` in `src/components/Mountains/Mountain.tsx` is a hardcoded map from `MountainID` → Tailwind classes that set the `top-[Npx]` scroll position, size, `bg-mountain-N`, and `z` index. This is the source of truth for *where* each mountain sits on the canvas.
4. **Type** — extend the `MountainID` union in `src/components/Mountains/Mountains.tsx`.
5. **Data** — add the entry to `mountains` in `src/components/Mountains/mountainsInfo.ts` (shape is `mountainConfig`).

Note: `mountainsInfo.ts` currently holds **placeholder/duplicated data** (many entries are copies of mountain-1), and several `mountainVariants` `top-[...]` values past mountain-18 still point at `12500px` — these are works in progress, not bugs to "fix" blindly.

### Styling conventions

- Styling is Tailwind utility classes inline in JSX; there is almost no hand-written CSS beyond `src/index.css` (CSS custom properties + resets).
- Layout relies heavily on arbitrary values (`top-[2500px]`, `w-[500px]`, `z-[99]`). Because positions are arbitrary-value classes keyed dynamically (`bg-mountain-${id}`), they must exist as literal strings somewhere Tailwind's content scanner can see them — keep the full class strings in `mountainVariants`/`backgroundImage`, don't build them by string concatenation.
- CSS variables (`--page-height`, `--half-page-height`, `--primary-color`) live in `:root` in `src/index.css`.
