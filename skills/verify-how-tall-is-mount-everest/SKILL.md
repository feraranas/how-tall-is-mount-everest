---
name: verify-how-tall-is-mount-everest
description: Launch the "How tall is Mount Everest" Vite + React scroll site on its own port and drive it with headless Chrome (playwright-core) to prove the scroll altimeter and mountain cards. Use when you must show what a user actually sees on this site, not just that it builds.
---

# Verify how-tall-is-mount-everest

The user surface is a single-page web site (`index.html` → `src/App.tsx`): a 50000px-tall page the user scrolls through, with a fixed altimeter at the top (`Metronome`), 25 mountain cards with real per-mountain data and a mountain SVG each (`Mountains` → `DataContainer`, data in `mountainsInfo.ts`), and `Animations` (Stars/Ashes/Clouds), which currently render placeholder text only. There is no backend, no auth and no runtime data fetching (card data is bundled). All driving goes through `scripts/sitectl`, which resolves its own real path (works from `skills/`, `.cursor/skills/` or `.claude/skills/`).

## Launch

```bash
export RUN_ID=$(date +%s)          # state in /tmp/verify-everest-$RUN_ID
export SITE_PORT=15173             # change for a second instance
skills/verify-how-tall-is-mount-everest/scripts/sitectl launch
```

Runs `npm ci` if `node_modules` is missing, installs `playwright-core` into `$STATE/tools` (not into the repo), then starts `npx vite --host 127.0.0.1 --port $SITE_PORT --strictPort` in its own process group. Ready = `READY url=...`, printed only after vite logs `Local:` and the page serves `<title>How tall is Mount Everest</title>`. It refuses to start if the port is already taken.

## Doctor

```bash
skills/verify-how-tall-is-mount-everest/scripts/sitectl doctor
```

Read-only. All `OK`: our vite pid alive, port listening, page title correct, `/src/main.tsx` compiles (200), Chrome found (`/usr/bin/google-chrome` or `CHROME_PATH`), playwright-core installed.

## Drive

`sitectl journey <name>` runs `scripts/browser.mjs` (headless Chrome, viewport 1280×800):

- `altimeter-scroll`: load, then scroll with the mouse wheel to y = 1000, 10000, 25000 and the page bottom. Reads the altimeter (the fixed `div.fixed` with class `z-[99]` whose text matches `^\d{5}m$`) and its `active` class at each step.
- `mountain-cards`: reads every card (name, altitude, the five info lines, position, background SVG), checks that the 25 SVGs return 200, and scrolls the first card, the `unknown`-altitude card and the last card into view.
- `sky-layers`: records the Stars/Ashes/Clouds elements and any request for `assets/clouds|stars` images.

There are no ARIA roles or test ids in the app; the stable handles are the visible card text, the card structure (one `<ul>` per card) and the altimeter text pattern. Recipes: [features/README.md](features/README.md).

Isolation: one instance per `SITE_PORT`; distinct `RUN_ID` + port can run side by side.

## Evidence

`skills/verify-how-tall-is-mount-everest/evidence/$RUN_ID/<journey>/` (override with `SITE_VERIFY_EVIDENCE`; the default dir is not gitignored, so don't commit per-run evidence by accident): one `NN-step.png` and `NN-step.aria.txt` per step, plus `result.json` (each step's values: altimeter text/`active`/`scrollY`, or per-card data, or sky layers; any page errors; `pass`). A journey fails on any uncaught page error.

Proof standards: drive by real scrolling, not by setting state. Capture before and after each scroll. There are no side effects to verify (static site, no network beyond the dev server). Committed reference proof: `evidence/final/`.

## Cleanup

```bash
skills/verify-how-tall-is-mount-everest/scripts/sitectl cleanup
```

Kills only the process group whose leader pid is in `$STATE/vite.pid`, waits for it to exit, warns if the port is still in use, and removes `$STATE`. Evidence is kept.

## Helpers

- `scripts/sitectl launch | doctor | journey <altimeter-scroll|mountain-cards|sky-layers> | cleanup` (env `RUN_ID`, `SITE_PORT`, `CHROME_PATH`, `SITE_VERIFY_EVIDENCE`).
- `npm run check:mountains` (repo script) statically checks that the five per-mountain lists agree. It does not render anything; use `journey mountain-cards` for what a visitor sees.
- `scripts/browser.mjs <journey>`: called by `sitectl journey`; needs `NODE_PATH`, `SITE_URL`, `CHROME_PATH`, `EVIDENCE_DIR`.

## Maintenance

Use `/maintain-verification-skill` to keep `features/` in step with the site.
