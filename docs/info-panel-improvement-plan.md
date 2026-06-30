# Mountain hover info-panel — improvement plan (TDD)

## Context

Each mountain has a small `i` tab (`.fa-info`) that reveals a ~5-row panel (`.mountain-info`:
Ubicación, Altura, Prominencia, [Cordillera], Año de primer ascenso, Dificultad) on hover. It is
**buggy and not sleek**. This is a **vanilla JS + static-file** app; the regression gate is the
**Playwright smoke suite**, not `npm run build`/`lint` (both vestigial — no tsconfig/eslint/vite
config). We work **test-first**: every bead writes failing Playwright tests, watches them go red
against the current code, then implements to green.

> Note: the data-driven structure below (`js/mountainsData-script.js` generating `#mountains-root`)
> lands with the `refactor-v2-ulv` stack (PRs #61–#64). These beads target that post-merge state.

### Root causes (verified)

Bugs — `js/mountainsData-script.js`:
- **Dead debounce**: `debouncedShow(e)` returns `debounce(showInfo(e),100)` — it calls `showInfo(e)`
  immediately and discards the wrapper. No debounce runs.
- **Stuck-panel race**: `showInfo` adds `.show-info` via `setTimeout(…,100)`; `hideInfo` removes it
  synchronously with no cancel. Leave the icon within 100 ms → hide no-ops, queued show fires →
  panel sticks open with no cursor.
- **`e.srcElement`** is deprecated/non-standard; no null guards.
- **Hover region is only the 20×18 px icon**; the panel sits ~19 px below as a sibling, so moving
  the cursor into the panel fires the icon's `mouseleave` and the panel vanishes — unreadable.

Not sleek — `css/main-styles.css` (`.mountain-info`/`.fa-info`/`.show-info`): opacity-only fade, no
`pointer-events`/`visibility` management, flat `<ul>` (no label/value hierarchy), English
`Mountain range:` amid Spanish labels, no keyboard/ARIA.

Other: `.fa-info-illustration` tabs render in `index.html` but have **no JS** (dead); the 6
`css/media-*.css` files have **empty** `.mountain-info`/`.fa-info` placeholder blocks.

## Decisions

- **Four beads**: fix → sleek → a11y → illustration-tabs (beads 2–4 `blocks`-depend on bead 1).
- **CSS-first — delete the broken JS** (drive the panel via `:hover`/`:focus-within`; no JS race).
- Include **keyboard + ARIA** (own bead) and **fix the dead illustration tabs** (own bead).
- **TDD**: failing Playwright tests first, per bead.

## Test harness notes

- Site served at `http://localhost:5599/`; the page auto-scrolls to the bottom on load. To exercise a
  tab, `locator('.mountain-1 .fa-info').scrollIntoViewIfNeeded()` then `.hover()`. Everest =
  `.mountain-1`, panel `.mountain-1 .mountain-info` (`data-key="1"`).
- **Playwright `toBeVisible()` treats `opacity:0` as visible** — assert the *computed opacity* instead:
  ```ts
  const panelOpacity = (p, sel) => p.locator(sel).evaluate(el => getComputedStyle(el).opacity);
  ```
- New tests live in `tests/info-panel.spec.ts` (a11y in the same file). `tests/smoke.spec.ts` must
  stay green throughout.

---

## Bead 1 — `info-panel-fix` (bug): robust hover, kill the stuck-panel race

**RED — write first; must fail against current code:**
1. `hovering the icon opens the panel` — hover `.mountain-1 .fa-info` → `expect.poll(panelOpacity)` → `'1'`.
2. `moving the cursor into the panel keeps it open` — hover icon, then hover `.mountain-1 .mountain-info`;
   opacity stays `'1'`. *(Fails now: icon `mouseleave` hides it.)*
3. `panel does not stick open after a quick enter→leave (race)` — `dispatchEvent('mouseenter')` then
   immediately `dispatchEvent('mouseleave')` on the icon, wait 300 ms, opacity is `'0'`.
   *(Fails now: the 100 ms `setTimeout` show fires after the synchronous hide.)*
4. `leaving the panel closes it` — open, move mouse to `(0,0)`, `expect.poll(panelOpacity)` → `'0'`.

**GREEN — minimal:**
- CSS: show `.mountain-info` when hovering icon **or** panel, e.g.
  `.mountain-data:hover .mountain-info { opacity:1; visibility:visible; pointer-events:auto; }` with
  default `.mountain-info { visibility:hidden; pointer-events:none; }`. Close the `bottom:-19px` dead
  zone so icon + panel form one continuous hover region.
- Delete `showInfo`/`hideInfo`/`debounce`/`debouncedShow`/`debouncedHide`/`wireInfoTabs` and the
  `wireInfoTabs()` bootstrap call from `js/mountainsData-script.js` (keep `renderMountains()`).
- **REFACTOR:** drop the now-unused `.show-info` class.

---

## Bead 2 — `info-panel-sleek` (depends on 1): visual + motion + content

**RED first:**
1. `range label is Spanish "Cordillera:" not "Mountain range:"` — for a mountain with a range, the
   `<li>` text contains `Cordillera:` and not `Mountain range:`. *(Fails now.)*
2. `each info row exposes a distinct label and value` — e.g. `.mountain-1 .mountain-info li .info-label`
   count > 0. *(Fails now: plain text rows.)*
3. `respects prefers-reduced-motion` — `page.emulateMedia({ reducedMotion:'reduce' })`, open panel,
   assert computed `transition-duration`/`animation-duration` is `0s`. *(Fails now: 0.3s always.)*

**GREEN:** restyle `.mountain-info` (label/value hierarchy via `.info-label`/`.info-value` spans in
`infoListItems()`, refined spacing, subtle shadow + radius + arrow, readable widths); entrance =
opacity + small `translateY`/scale gated behind `@media (prefers-reduced-motion: reduce)`; change
`Mountain range:` → `Cordillera:` in `infoListItems()`. Capture breakpoint screenshots
(~375/1000/1600 px) as evidence (not assertions).

---

## Bead 3 — `info-panel-a11y` (depends on 1): keyboard + ARIA

**RED first:**
1. `trigger is keyboard-focusable` — `.mountain-1 .fa-info` focusable; `locator.focus()` then
   `expect(locator).toBeFocused()`. *(Fails now: `<i>` not focusable.)*
2. `focusing the trigger opens the panel (:focus-within)` — focus trigger → `panelOpacity` `'1'`. *(Fails now.)*
3. `trigger exposes aria-controls + aria-expanded` — attributes present; `aria-expanded` flips to
   `"true"` when open. *(Fails now.)*
4. `Escape / blur closes the panel` — open via focus, blur (or Esc) → opacity `'0'`.

**GREEN:** render the trigger as `<button class="fa-info" aria-expanded="false" aria-controls="minfo-N">`
and give the panel `id="minfo-N"` in `mountainMarkup()`; reveal on `:focus-within` in CSS; a tiny JS
toggle for `aria-expanded` is acceptable here (the one intentionally-interactive element in the ulv.3
inert scene). Keep the rest of the scene inert.

---

## Bead 4 — `illustration-info-tabs` (depends on 1): wire or remove the dead tabs

Default = **remove** (no illustration info content exists); wire into the bead-1 panel system only if
content is provided.

**RED first:**
1. `no dead illustration info tabs remain` — `expect(page.locator('.fa-info-illustration')).toHaveCount(0)`.
   *(Fails now: the icons exist with no behavior.)* If wiring is chosen instead, replace with: hovering
   an illustration tab opens its panel (opacity `'1'`).

**GREEN:** remove the `.tab-arrow-illustration` + `.fa-info-illustration` markup from the illustration
blocks in `index.html` (and any now-dead `css/illustrations.css` rules), or wire them up.

---

## Execution order

Per the close-bead workflow: branch off `release`, **write the failing tests first**, implement to
green, stack PRs (fix first, then sleek/a11y/illustration on top), Playwright smoke as the gate.
