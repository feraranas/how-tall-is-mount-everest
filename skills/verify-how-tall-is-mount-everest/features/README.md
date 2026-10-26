# How tall is Mount Everest verification map

This directory is the maintained source for verifying what a visitor sees on the site.

## Baseline preconditions

- `sitectl launch` printed `READY`, `sitectl doctor` all `OK`.
- Fresh page load at scroll 0, viewport 1280×800.

## Driving conventions

- Scroll with the mouse wheel (`page.mouse.wheel`), not `window.scrollTo`, so scroll listeners fire as for a user.
- The app has no ARIA roles or test ids; use visible text and the altimeter pattern `^\d{5}m$`.

## Proof and skip reporting

- Each step: screenshot + ARIA snapshot + values in `result.json`.
- Any uncaught page error fails the journey.

## Features

- [Scroll altimeter](./altimeter.md): the fixed meter readout that changes as you scroll.
- [Mountain cards](./mountain-cards.md): 25 cards with real per-mountain name, altitude, location, prominence, range, first ascent, difficulty and a mountain SVG.
- [Sky layers](./animations.md): Stars/Ashes/Clouds components, currently placeholder text (no images, no motion).
