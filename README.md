# How tall is Mount Everest?

An interactive, 50,000-pixel altitude journey through mountains and volcanoes
from Mexico and around the world. The experience starts at the bottom of the
page and gains altitude as you scroll upward.

The production site is intentionally vanilla HTML, CSS, and JavaScript. It is
served as static files without a framework, bundler, or production build step.
Playwright provides browser regression coverage, while Storybook documents the
reusable visual components.

## Requirements

- Node.js LTS
- npm
- Python 3, used by the local static server

## Setup

```bash
npm ci
npx playwright install
```

## Development

```bash
npm run dev
```

Open `http://localhost:5599`. The development and preview commands serve the
repository root directly.

## Verification

```bash
npm test
npm run build-storybook
npm run check-storybook
```

`npm test` is the product regression gate and covers Chromium, Firefox, and
WebKit locally. CI runs the Chromium project with two workers, plus the built
Storybook render smoke.

Run the component catalog during development with:

```bash
npm run storybook
```

## Architecture

- `index.html` is the static page shell and establishes stylesheet/script load
  order.
- `js/scene.js` owns the shared canvas constants.
- `js/mountainsData-script.js` contains the mountain data and renders each peak.
- `js/components/` contains the markup factories shared by the site and
  Storybook.
- `css/components/` contains visual component styles; `css/layout/` and the
  responsive stylesheets contain canvas placement.
- `tests/` contains Playwright behavior and regression coverage.
- `stories/` contains the vanilla Storybook catalog.

See [CLAUDE.md](./CLAUDE.md) for the detailed canvas model, file responsibilities,
and contribution conventions.

## Adding or editing a mountain

Update the data row in `js/mountainsData-script.js`, provide its visual asset or
background rule, and update the corresponding placement selectors. Mountain
content and layout are deliberately separate. Add or update a Playwright test
when the change affects visible behavior.

## Branches

The maintained vanilla site currently targets `release`; pull requests should
use that branch as their base until the repository default is reconciled.
