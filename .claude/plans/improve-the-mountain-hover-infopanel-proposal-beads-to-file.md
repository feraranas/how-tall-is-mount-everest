# Improve the mountain hover info-panel — proposal + beads to file

## Context

Each mountain has a small `i` tab (`.fa-info`) that, on hover, reveals a panel
(`.mountain-info`) of ~5 rows (Ubicación, Altura, Prominencia, [Cordillera], Año de
primer ascenso, Dificultad). The current implementation is **buggy and not sleek**, and
the user wants it improved. This is a **vanilla JS + static-file** app (see memory
`beads-describe-nonexistent-react-stack`); the regression gate is the Playwright smoke
suite, not `npm run build`/`lint` (both vestigial).

### Root causes (verified)

Bugs — `js/mountainsData-script.js`:
- **Dead debounce** (lines 139–152): `debouncedShow(e)` returns `debounce(showInfo(e), 100)`
  — it calls `showInfo(e)` *immediately* and discards the returned wrapper. No debounce runs.
- **Stuck-panel race**: `showInfo` adds `.show-info` via `setTimeout(…,100)`; `hideInfo`
  removes it synchronously with no way to cancel the pending show. Leaving the icon within
  100 ms → hide is a no-op, then the queued show fires → panel sticks open with no cursor.
- **`e.srcElement`** (lines 128, 135) is a deprecated non-standard alias; no null guards.
- **Hover region is only the 20×18 px icon**; the panel is a sibling ~19 px below, so moving
  the cursor into the panel triggers the icon's `mouseleave` and the panel disappears — you
  can't read/interact with it.

Not sleek — `css/main-styles.css:298–353`:
- Opacity-only fade (no motion), no `pointer-events`/`visibility` management, flat `<ul>` with
  no label/value hierarchy, English `Mountain range:` amid Spanish labels, no keyboard/ARIA.

Other findings:
- Illustration tabs `.fa-info-illustration` (`data-illustration-key`) render in `index.html`
  but have **no JS** — currently dead.
- The 6 `css/media-*.css` files have **empty** `.mountain-info`/`.fa-info` placeholder blocks,
  so a redesign is driven almost entirely from `css/main-styles.css`.

## Decisions (from the user)

- **Four beads**: fix → sleek → a11y → illustration tabs (the last three depend on the fix).
- Interaction model: **CSS-first — delete the broken JS** (drive the panel from
  `:hover`/`:focus-within`; no JS state, no race). Pairs with the ulv.3 inert-scene goal.
- Include **keyboard + ARIA** (its own bead) and **fix the dead illustration tabs** (its own bead).

## Beads to file

All P2, under the `how-tall-is-mount-everest` tracker. The fix is the root; the other three
declare a `blocks` dependency on it so they're worked after it lands.

### Bead 1 — `info-panel-fix` (bug): robust hover, kill the stuck-panel race
- Replace the JS toggle with a **CSS-driven** panel: show `.mountain-info` while hovering the
  trigger **or** the panel (e.g. `.mountain-data:hover .mountain-info`, or a `:hover` group that
  covers icon + panel). Manage `visibility`/`pointer-events` (hidden: `pointer-events:none`,
  `visibility:hidden`; shown: both active) so a 0-opacity panel never captures input or sticks.
- **Remove** `showInfo`/`hideInfo`/`debounce`/`debouncedShow`/`debouncedHide`/`wireInfoTabs`
  and the `wireInfoTabs()` bootstrap call from `js/mountainsData-script.js` (keep
  `renderMountains()`). The generated markup keeps the `.fa-info`/`.mountain-info` structure.
- Files: `css/main-styles.css` (`.mountain-info`, `.show-info`→hover, `.fa-info`, `.mountain-data`),
  `js/mountainsData-script.js` (delete interaction block).
- Acceptance: hovering the icon opens the panel; moving into the panel keeps it open; leaving
  both closes it; **no panel stays open after the pointer leaves**; works chromium/firefox/webkit.
- Verify: extend `tests/smoke.spec.ts` with a hover-open / move-into-panel / leave-closes test;
  smoke green 15→18.

### Bead 2 — `info-panel-sleek` (enhancement, depends on Bead 1): visual + motion
- Restyle `.mountain-info`: label/value typographic hierarchy (bold label / regular value or a
  two-column row), refined padding/row rhythm, subtle shadow + rounded corners + arrow, readable
  width across breakpoints (fill the empty `media-*.css` blocks only if needed).
- Entrance: opacity + small `translateY`/scale via the existing `transition`, gated behind
  `@media (prefers-reduced-motion: reduce)`.
- Content fix: `Mountain range:` → `Cordillera:` in `infoListItems()` to match the Spanish labels.
- Files: `css/main-styles.css`, `js/mountainsData-script.js` (`infoListItems` label), optional `css/media-*.css`.
- Verify: screenshot artifacts at ~375 / ~1000 / ~1600 px; reduced-motion respected; smoke green.

### Bead 3 — `info-panel-a11y` (enhancement, depends on Bead 1): keyboard + ARIA
- Make the trigger a focusable control (render `<button class="fa-info">` or add
  `tabindex="0"` + `role="button"`), with `aria-expanded`/`aria-controls` pointing at the panel
  (`id` per mountain), and reveal on `:focus-within` (pairs with the CSS hover from Bead 1).
- Note: this is the *one* intentionally-interactive element inside the ulv.3 inert scene — keep
  the rest inert.
- Files: `js/mountainsData-script.js` (`mountainMarkup` trigger + ids), `css/main-styles.css`
  (`:focus-within`, focus ring).
- Verify: Tab to the trigger → panel opens; Esc/blur closes; smoke green.

### Bead 4 — `illustration-info-tabs` (depends on Bead 1): wire or remove the dead tabs
- The `.fa-info-illustration` icons have no behavior. Either wire them into the same CSS-driven
  panel system (if illustrations should expose info) **or** remove the dead tab markup. Decide at
  implementation; default to removal unless illustration info content exists.
- Files: `index.html` (illustration blocks), `css/illustrations.css`, possibly
  `js/mountainsData-script.js`.
- Verify: no dead/non-functional icons remain; smoke green.

## Execution (on approval)

1. `br create` the four beads above (P2) with `--slug` matching the names and `--deps
   blocks:<bead1-id>` on beads 2–4. Bodies capture the root-cause + acceptance criteria above.
2. Commit the bead-store change (`.beads/issues.jsonl`) — message `chore: file info-panel
   improvement beads`, no AI co-author trailer (per memory). No code changes in this step.

This task only **files** the beads. Implementation happens later per the close-bead workflow
(branch off `release`, stack PRs, Playwright smoke as the regression gate).
