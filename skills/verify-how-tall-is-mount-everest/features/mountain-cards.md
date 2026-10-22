# Mountain cards

Twenty-five mountain cards are placed down the page, each with a name, altitude and an information block (location, prominence, range, first ascent, difficulty).

## Sub-features

- `card-title` shows the name and altitude.
- `card-info` shows location, prominence, range, first ascent and difficulty.

## How to get to it (user POV)

- Scroll down; the first card is about 2500px down.

## Driving it with sitectl

Preconditions:

- Launched, doctor `OK`.

- **Cards.** Run `sitectl journey mountain-cards`. `result.json`: `mountEverestTitles: 25`, `firstCardVisible: true`; `01-first-card.png` shows `mount-everest` and `7570`.

## Gotchas

- All 25 entries in `mountainsInfo.ts` currently carry the same placeholder data (`mount-everest`, 7570, `Bhutan-China Border`). Do not treat distinct names as a precondition.
- Cards 19–25 share `top-[12500px]` and overlap card 5. A per-card visibility check for those will be ambiguous.
