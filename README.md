<h3>🌿 A site dedicated to my love 💚 for mountains & volcanoes 🌋</h3>

A single scrolling page, 50,000 px tall, that compares mountains by height. As you scroll, an altimeter fixed at the top of the screen shows the altitude in meters. Each mountain is drawn at its position on the page, with a card that shows its name, altitude, location, prominence, range, first ascent and difficulty.

Built with React 18, TypeScript, Vite 5 and Tailwind CSS 3.

## Run locally

Requires Node.js 18 or later (Vite 5).

```bash
npm install
npm run dev        # dev server with hot reload, http://localhost:5173
```

Other scripts:

```bash
npm run build      # type-check (tsc -b), then production build into dist/
npm run preview    # serve dist/ locally
npm run lint       # ESLint
```

## Where things live

```text
index.html                         page shell: page height, sky gradient and grid backgrounds
src/index.css                      Tailwind directives and CSS variables (--page-height)
tailwind.config.js                 background images: mountains, clouds, grids, sky gradients
src/components/Metronome/          the fixed altimeter
src/components/Mountains/          mountainsInfo.ts (card data), Mountain.tsx (position and image per mountain)
src/components/DataContainer/      a mountain's card: MountainTitle + MountainInformation
src/components/Animations/         stars, ashes and clouds layers
src/assets/mountains/              one SVG per mountain, named <n>-<NAME>.svg
```

### Add or change a mountain

A mountain is identified by `mountain-<n>`. Keep these in step:

1. Add the SVG as `src/assets/mountains/<n>-<NAME>.svg`.
2. Add `"mountain-<n>": 'url("src/assets/mountains/<n>-<NAME>.svg")'` to `backgroundImage` in `tailwind.config.js`.
3. Add `'mountain-<n>'` to the `MountainID` type in `src/components/Mountains/Mountains.tsx`.
4. Add a `mountainVariants` entry with its `top-[…px]` position and `bg-mountain-<n>` in `src/components/Mountains/Mountain.tsx`.
5. Add its card data to `src/components/Mountains/mountainsInfo.ts`.

Tailwind only generates classes it finds as literal strings in the source, so write the `bg-mountain-<n>` and `top-[…px]` classes out in full.
