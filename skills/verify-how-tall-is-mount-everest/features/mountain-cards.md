# Mountain cards

Twenty-five mountain cards are placed down the page, 1800px apart and highest first. Each card has a name, an altitude, an information block (location, prominence, range, first ascent, difficulty) and a mountain SVG background. The data comes from `src/components/Mountains/mountainsInfo.ts`.

## Sub-features

- `card-title` shows the name (slug, e.g. `mount-everest`) and the altitude; a missing altitude shows `unknown`.
- `card-info` shows `Location:`, `Prominence:`, `Mountain Ranges:`, `First Ascent:`, `Difficulty:`; missing values show `unknown`.
- `card-image` each card's background is `src/assets/mountains/<n>-<NAME>.svg`.
- `card-layout` cards sit at `top` 2500, 4300, … 45700px, so none overlap.

## How to get to it (user POV)

- Scroll down; the first card (`mount-everest`, `8848.86`) is 2500px down, then one every 1800px.

## Driving it with sitectl

Preconditions:

- Launched, doctor `OK`.

- **Cards.** Run `sitectl journey mountain-cards`. `result.json` step `cards`: `count: 25`, `distinctNames: 25`, `distinctTops: 25`, every `svgStatus` `200`, and `visible` true for `mount-everest`, `cerro-negro` and `nevado-de-colima`.
- **Proof.** `01-first-card.png` shows `mount-everest` / `8848.86`; `02-unknown-altitude.png` shows `cerro-negro` / `unknown`; `03-last-card.png` shows `nevado-de-colima` / `4260`.
- **Static cross-check.** `npm run check:mountains` prints `checked 25 mountains: 0 error(s), 0 warning(s)`.

## Gotchas

- The info block has Tailwind `opacity-5` (computed `0.05`), so the info text is barely legible on screen. It is in the DOM and ARIA snapshot; assert it there, not from screenshots. See product notes in the maintenance PR.
- Altitudes are rendered as-is (`8848.86`, `6967.16`), not rounded.
- Order is list order, not strictly by altitude: `pico-de-orizaba` (5636) comes before `mount-elbrus` (5642), and `cerro-negro` (unknown) and `nevado-de-colima` (4260) come after `cofre-de-perote` (4220).
