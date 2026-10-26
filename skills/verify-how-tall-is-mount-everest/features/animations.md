# Sky layers

`src/components/Animations` renders `Stars`, `Ashes` and `Clouds` directly under the altimeter. Each one is currently a placeholder `<div>` holding only its own name. There are no images and no motion.

## Sub-features

- `sky-placeholders` three top-level divs with the text `Stars`, `Ashes`, `Clouds`.
- `sky-no-assets` no `src/assets/clouds/*` or `src/assets/stars/*` image is requested, even though the assets and `bg-cloud-*` Tailwind classes exist.

## How to get to it (user POV)

- Open the page. The placeholder text is white (`rgba(255, 255, 255, 0.87)`) on the light grid background, so a visitor effectively sees nothing.

## Driving it with sitectl

Preconditions:

- Launched, doctor `OK`.

- **Layers.** Run `sitectl journey sky-layers`. `result.json` step `layers`: all three `present: true`, `img: 0`; `skyRequests: []`.
- **Proof.** `01-top.aria.txt` lists `Stars`, `Ashes`, `Clouds` as text.

## Gotchas

- If real animations land, replace this recipe: take two captures over time to prove motion, and check that the sky images return 200.
