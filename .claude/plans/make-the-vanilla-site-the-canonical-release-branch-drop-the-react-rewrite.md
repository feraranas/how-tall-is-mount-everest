# Make the vanilla site the canonical `release` branch (drop the React rewrite)

## Context

The repo has two divergent lines from merge-base `f7e97db`:

- **`main`** = an incomplete React + Vite + TypeScript rewrite (`src/components/…`, the architecture `CLAUDE.md` currently describes). By CLAUDE.md's own admission it has stub animations and placeholder/duplicated mountain data.
- **`backup-v1`** = the **original vanilla HTML/CSS/JS** site — complete and polished (6 responsive breakpoints, working animations, real content). It also carries tooling: `.beads/`, `.claude/plans/`, `docs/`, a stale `dist/`, and standalone experiments.

For a **static, asset-heavy scroll site with essentially zero interactivity** (one scroll listener driving an altitude readout; everything else is absolute-positioned SVGs on a 50,000px canvas), React buys almost nothing it actually uses. The finished vanilla site is the better foundation.

**Decision (confirmed with user):** the new canonical branch **`release`** is built from the **vanilla site (`backup-v1`)**; the React rewrite is **dropped** (kept only in git history). The one good idea on the React side — data-driven mountains — is captured as a future enhancement note, not ported now.

⚠️ The working tree is currently on `main` with uncommitted React-refactor changes + untracked tooling. These must be **preserved in history first** (user choice) before anything else.

Outcome: `release` is the polished vanilla site, internally consistent (accurate `CLAUDE.md`, sane `package.json`, no stale build artifacts or dead duplicate files), and becomes the actual `main` going forward.

---

## Phase A — Preserve in-progress React work (do this FIRST, lose nothing)

From the current dirty `main`:

1. `git switch -c wip/react-refactor` (carries the uncommitted changes onto a new branch).
2. Stage tracked modifications + the new file: `git add -u` and `git add src/config/scene.ts`.
3. Commit: `"wip: in-progress data-driven refactor of React version (preserved)"`.
4. `git push -u origin wip/react-refactor` (off-machine safety).

After this, the React rewrite lives in `main`, `wip/react-refactor`, and on `origin` — safe to drop from the canonical line.

The untracked tooling left in the working dir (`.beads/`, `.claude/`, `CLAUDE.md`, `dist/`, `docs/`) is tracked on `backup-v1`; reconcile per-file in Phase B (commit anything genuinely newer onto `wip`, otherwise let the `release` checkout adopt backup-v1's versions). Verify with `git status` that nothing unique is discarded.

## Phase B — Create `release` from the vanilla site

1. `git switch -c release backup-v1`. If git refuses due to differing untracked files, reconcile them (Phase A note) — never `clean` until `wip` + `origin` confirm the content is preserved.
2. `git push -u origin release`.

## Phase C — Clean up `release` so it's internally consistent

These are the substantive edits; each is independent.

1. **Rewrite `CLAUDE.md`** to describe the *vanilla* architecture, replacing the React description:
   - Static site, no build/framework. Served directly: `index.html` loads `./css/*.css` + `./js/*.js`.
   - Scroll/altitude-metronome logic lives in `js/script.js`; mountain data in `js/mountainsData-script.js`; ash/cloud animations in `js/ashesAnimation-script.js` + `css/`.
   - Responsiveness via the 6 `css/media-*.css` breakpoints wired in `index.html`.
   - The 50,000px canvas + altitude-positioning concept (the genuinely useful part of the old doc) stays.
2. **Fix `package.json`** — currently lists React/Vite/TS/Tailwind *and* webpack/gulp but the site needs no build. Trim to a minimal static setup: a dev-server script (e.g. `live-server`/`serve`) and, only if minification is wanted, keep the gulp/webpack path. Remove the React/Vite/TS/Tailwind deps. *(Build story is a small decision — see Open question.)*
3. **Remove stale React `dist/`** (a Vite build of the dropped app, `<div id="root">`) and add `dist/`, `.DS_Store`, `node_modules/` to `.gitignore` (it currently ignores none of these, which is why `dist/` got committed).
4. **Delete unreferenced duplicates** top-level `script.js` (370L) and `styles.css` (4295L) — `index.html` references `js/script.js` (158L) + `css/*.css`, not these. Diff once to confirm they hold nothing the live files lack, then remove.
5. **Resolve empty animation stubs** `js/rainAnimation-script.js` and `js/snowAnimation-script.js` (0 bytes, but `<script>`-tagged in `index.html`): either implement them or drop the two `<script>` tags.
6. **Organize experiments** `butterflies/`, `src/sun/`, `src/starlights/`, `src/ashes/` (standalone HTML demos, not part of the main page) into a `prototypes/` folder, or drop them. Recommend keeping under `prototypes/` — they may inform future animation work.
7. **Repurpose `.claude/plans/REFACTOR_PLAN.md`** — it targets the React app. Rewrite it as a vanilla-applicable note: drive the mountain DOM/CSS from `js/mountainsData-script.js` + an asset folder so adding a mountain is a one-line data edit (this is the "best of main" idea, ported in concept). Keep `.beads/`, `docs/`, `.claude/skills/` tooling.

Commit Phase C as a focused cleanup commit (or a few small ones).

## Phase D — Make `release` the actual `main`

- Switch the GitHub **default branch** to `release` (repo Settings → Branches, or `gh`). **Outward-facing change — confirm before doing it.**
- Optional follow-up once stable: rename `main` → `main-react-legacy` and `release` → `main` so the canonical branch is literally named `main`.

## Critical files

- `CLAUDE.md` — rewrite for vanilla architecture.
- `package.json` / `.gitignore` — trim deps; ignore `dist/`, `.DS_Store`, `node_modules/`.
- `index.html` — only if dropping the empty rain/snow `<script>` tags (Phase C.5).
- Remove: top-level `script.js`, `styles.css`, committed `dist/`.
- Live site (unchanged, the render source of truth): `js/script.js`, `js/mountainsData-script.js`, `js/ashesAnimation-script.js`, `css/main-styles.css` + `css/media-*.css`.

## Verification (end-to-end)

1. From `release`, serve statically: `python3 -m http.server 8000` (or `npx live-server`), open `http://localhost:8000`.
2. Confirm the polished behavior is intact: altitude **metronome updates on scroll**; the 25 mountains are positioned correctly down the canvas; cloud/ash animations run; resize across the breakpoints (≤390, 391–428, 429–768, 769–1440, 1441–1950, ≥1951) behaves. Should match `backup-v1` exactly, since cleanup doesn't touch render code.
3. `grep -rn "script.js\|styles.css" index.html` and a repo grep to confirm the deleted top-level duplicates and `dist/` are referenced nowhere.
4. `git log --oneline wip/react-refactor` to confirm the React work is preserved.

## Open question (small, can decide during execution)

- **Build story for the static site:** zero-build (serve files as-is, simplest) vs. keep a light minify pipeline (gulp/webpack already present). Recommend zero-build unless you want minified production assets.
