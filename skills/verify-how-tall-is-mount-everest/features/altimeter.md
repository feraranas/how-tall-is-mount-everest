# Scroll altimeter

A fixed panel at the top of the screen shows a five-digit altitude in metres that changes as the visitor scrolls, and is shown as `active` only in the middle of the page.

## Sub-features

- `alt-blank-on-load` shows no reading before the first scroll.
- `alt-reading` shows `NNNNNm` after scrolling, a different value at each depth.
- `alt-active` adds class `active` when scrollY is above 350 and below the page bottom.

## How to get to it (user POV)

- Open the site and scroll down with the wheel, trackpad or keys.

## Driving it with sitectl

Preconditions:

- Launched, doctor `OK`, page at scroll 0.

- **Load.** Run `sitectl journey altimeter-scroll`. Step `load`: text `""`, `active: false`.
- **Scroll.** Same journey scrolls to 1000, 10000, 25000. Observed in `evidence/final`: `09162m`, `07918m`, `05845m`, all `active: true`. Each value is distinct and matches `^\d{5}m$`.
- **Proof.** `03-scroll-10000.png` shows the readout `0 7 9 1 8 m` above the first mountain card.

## Gotchas

- Readings depend on `document.scrollHeight` and `innerHeight` measured at mount. A different viewport gives different numbers; assert the format and change, not exact values, unless the viewport is 1280×800.
- The value goes down as you scroll down.
- The page height is computed once; resizing after load makes readings drift.
