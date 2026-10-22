# Sky animations

Background layers of clouds, stars and ash (`src/components/Animations`) move or appear across the page.

## Sub-features

- `anim-clouds` cloud images (`src/assets/clouds/cloudsv1-4.png`).
- `anim-stars` star images.
- `anim-ashes` ash particles.

## How to get to it (user POV)

- Scroll through the page; layers appear at their depths.

## Driving it with sitectl

Preconditions:

- Launched, doctor `OK`.

- **Not yet scripted.** Add a journey to `browser.mjs` that screenshots the depths where each layer sits, and compares two screenshots taken a moment apart to prove motion.

## Gotchas

- Not proved. Motion needs two captures over time, not one screenshot.
