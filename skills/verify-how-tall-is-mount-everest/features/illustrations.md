# Illustrations

Mountaineer artwork (`src/components/Illustrations`, `src/assets/*Mountaineer*.svg`) placed on the page.

## Sub-features

- `illus-mountaineers` the man and woman mountaineer SVGs render.

## How to get to it (user POV)

- Scroll to the page sections that show the climbers.

## Driving it with sitectl

Preconditions:

- Launched, doctor `OK`.

- **Not yet scripted.** Add a journey that finds the rendered SVG/background elements, scrolls each into view and screenshots it; prove each asset request returned 200.

## Gotchas

- Not proved. Assets are CSS backgrounds or imported SVGs, so `getByRole('img')` may not find them.
