# Re-validate PR #56 (ulv.1) through the smoke suite

## Context

PR #56 (`refactor/ulv.1-canvas-constants`) centralizes the canvas constants into
`js/scene.js` and — critically — moves `--page-height` from a hardcoded CSS `:root`
value to **runtime injection** by `scene.js` at boot. When that PR was opened and its
bead closed, our only verification was a weak, programmatic `window.scrollTo` check
with no baseline. We've since built a real regression harness (PR #59 smoke suite) and
fixed a pre-existing scroll bug (PR #58). The goal now is to prove that `ulv.1`, in the
post-merge world (release + #58 + #59), still passes the full smoke suite — especially
the `--page-height` / body-height assertions that its runtime-injection change could
break.

Two facts established (read-only `git merge-tree`):
- `ulv.1` merges into current `release` (`a3c5179`) with **no conflict**, but it's based
  on the stale `f541d3b`, so its GitHub diff misleadingly appears to delete the
  playwright scaffolding. Rebasing fixes that.
- `ulv.1` + `fix/vanilla-scroll` auto-merge cleanly (same file, different regions).

## Approach

Build a throwaway validation branch that simulates the fully-merged world, run the smoke
suite, and only if green, refresh PR #56 by rebasing it onto current `release`.

### Step 1 — Build the validation branch (throwaway)
- `validate/ulv1` from `test/vanilla-smoke` (already = release + smoke suite).
- Merge `fix/vanilla-scroll` (clean; this combo was already proven 5/5 earlier).
- Merge `refactor/ulv.1-canvas-constants` (clean; `css/main-styles.css` auto-merges).

This branch = current release + smoke tests + scroll fix + ulv.1 = the post-merge state.

### Step 2 — Run the smoke suite
- `npx playwright test --project=chromium --reporter=line` (config's `webServer` serves
  the static site via `python3 -m http.server`).
- **Expect 5/5 green.** Pay special attention to:
  - The `--page-height` / `body ≥ 50000px` test — confirms `scene.js` runtime injection
    resolves before the test reads it (the main risk of the ulv.1 change).
  - The real wheel-scroll test — confirms ulv.1's CSS changes didn't reintroduce the
    `overflow` trap that #58 fixed.

### Step 3 — Interpret
- **Green (5/5):** ulv.1 is validated against the real suite. Proceed to Step 4.
- **Red:** capture the failing assertion + output, report it, and **do not touch PR #56**.
  Likely suspect would be injection timing (var not set before first paint/read).

### Step 4 — Refresh PR #56 (only if green)
- Rebase `refactor/ulv.1-canvas-constants` onto `origin/release` (`a3c5179`). Expected
  clean. This makes the PR's diff honest: only the 5 ulv.1 files (`js/scene.js`,
  `js/script.js`, `index.html`, `css/main-styles.css`, deleted `src/config/scene.ts`,
  `.beads/issues.jsonl`), no phantom scaffolding deletions.
- `git push --force-with-lease origin refactor/ulv.1-canvas-constants` to update PR #56.
- `gh pr view 56 --json mergeable,mergeStateStatus` → confirm `MERGEABLE / CLEAN`.
- Add a short PR #56 comment noting it was re-validated against the smoke suite (5/5,
  post-#58/#59) and rebased onto current release.

### Step 5 — Cleanup
- Delete the throwaway `validate/ulv1` branch.
- Leave working tree on `release`, clean.

## Notes / boundaries
- PR #56 stays scoped to the ulv.1 changes only — it does **not** absorb the smoke tests
  (#59) or scroll fix (#58); those are separate PRs. The validation branch is throwaway.
- Commits/force-push follow the no-Claude-co-author preference. The force-push only
  rewrites the ulv.1 branch (rebase), not shared branches.
- Nothing here merges any PR — that remains your call. Recommended merge order stays
  #58 → #59 → #56.

## Verification
The smoke suite run **is** the verification: 5/5 green on the validation branch proves
ulv.1 survives the post-merge world. Final confirmation = `gh pr view 56` shows
`MERGEABLE / CLEAN` after rebase.
