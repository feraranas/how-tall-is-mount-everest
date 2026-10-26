# Scroll altimeter

A fixed panel at the top of the screen shows a five-digit altitude in metres that changes as the visitor scrolls, and is shown as `active` only in the middle of the page.

## Sub-features

- `alt-blank-on-load` shows no reading before the first scroll.
- `alt-reading` shows `NNNNNm` after scrolling, a different value at each depth.
- `alt-active` adds class `active` when scrollY is above 350 and below the page bottom.
- `alt-bottom` at the page bottom reads `02500m` and drops `active`.

## How to get to it (user POV)

- Open the site and scroll down with the wheel, trackpad or keys.

## Driving it with sitectl

Preconditions:

- Launched, doctor `OK`, page at scroll 0.

- **Load.** Run `sitectl journey altimeter-scroll`. Step `load`: text `""`, `active: false`.
- **Scroll.** Same journey scrolls to 1000, 10000, 25000. Observed in `evidence/final`: `09162m`, `07918m`, `05845m`, all `active: true`. Each value is distinct and matches `^\d{5}m$`.
- **Bottom.** Same journey then wheels to the bottom (scrollY 49200): `02500m`, `active: false`.
- **Proof.** `03-scroll-10000.png` shows the readout `0 7 9 1 8 m` over the top of a mountain SVG. Values re-observed 2026-10-26 at HEAD aabd7d0 (unchanged by the real-data cards; the page height comes from `--page-height: 50000px`).

## Gotchas

- Readings depend on `document.scrollHeight` and `innerHeight` measured at mount. A different viewport gives different numbers; assert the format and change, not exact values, unless the viewport is 1280×800.
- The value goes down as you scroll down.
- The page height is computed once; resizing after load makes readings drift.
