# CI gates + illustrations polish

## Context

Follow-up to the design-system epic (PRs #74–#82). Two threads, in order:

1. **CI** — every gate so far (Playwright suite, storybook smoke) ran manually
   on the author's machine. A GitHub Actions workflow makes them automatic on
   PRs to `release`, protecting all future work.
2. **Illustrations polish** — two defects surfaced during the design-system
   work: broken local sprites 404 on every load, and the illustration
   i-tooltips are inert (all share `data-illustration-key="1"`, nothing
   consumes it — unlike the mountains, whose hover panels work). Now that
   `illustrations_data` + factories exist, both are cheap to fix in the same
   files.

## Epic A — CI (GitHub Actions)

### A.1 Playwright workflow
- `.github/workflows/ci.yml`, trigger: `pull_request` → `release` (+ `push`
  to `release`).
- Job: checkout → setup-node (LTS, npm cache) → `npm ci` →
  `npx playwright install --with-deps chromium` →
  `npx playwright test --project=chromium --workers=2`.
- **chromium only** in CI (firefox/webkit stay local-optional; keeps runtime
  and flake surface down; the suite's known contention issue is why we pin
  `--workers=2`).
- Upload `playwright-report/` as artifact on failure.

### A.2 Storybook smoke job
- Second job in the same workflow: `npm run build-storybook` →
  `npm run check-storybook` (needs chromium from the same setup; runs the
  10-story render check).

### A.3 Branch protection / verification
- Verify both jobs go green on a no-op PR; recommend (not enforce — owner
  decision) making the checks required on `release` via repo settings.

## Epic B — Illustrations polish

### B.1 Fix broken sprites (404s)
- `images/clouds/cloudsv8.png` — used by clouds 8/16/17/19/27/38
  (`css/components/cloud.css`); `images/illustrations/snowFlinch.png` —
  `bird-snow-flinch`.
- Fix: repoint to existing assets. cloudsv8 references sit alongside
  commented CDN urls for other variants — pick the closest CDN/local variant
  per cloud (visual check per cloud band). For snowFlinch, no CDN url is
  recorded anywhere → substitute a visually appropriate existing bird sprite
  or source the original asset from the owner (**ask before substituting**).
- Gate: zero 404s in the Playwright console-error smoke + visual checkpoints.

### B.2 Illustration info data
- Extend `illustrations_data` (js/components/illustration.js) with per-item
  facts mirroring the mountain pattern: common/species or model name,
  typical altitude, one-liner. Keys become unique per item (fixing the
  shared `key: "1"`).

### B.3 makeIllustrationInfo panel + hover behavior
- New factory in js/components/illustration.js reusing the info-tooltip skin
  (`css/components/info-tooltip.css` classes or a light
  `.illustration-info` variant) and the same pure-CSS `:hover` mechanism —
  no JS wiring, mirroring `.mountain-data:hover .mountain-info`.
- Panel opens from the existing `.fa-info-illustration` chip.

### B.4 Tests + story
- Playwright spec: hovering an illustration chip shows its panel with the
  right content; panel closes on leave (mirror `tests/info-panel.spec.ts`).
- Update `stories/illustration.stories.js`: tooltip visible in the Single
  story; check-storybook stays 10/10 (11 with any new story).

## Order & gating

Epic A first (protects B). Within B: B.1 independent; B.2 → B.3 → B.4.
Every PR gated on the full suite; B's PRs additionally on check-storybook —
which by then CI runs automatically.

## Non-goals

- Dead-code deletion (styles.css, React tree, webpack/gulp deps) — separate
  future epic.
- Long-tail component extraction (metronome, dividers, screens) — separate.
- Mountain data typos (ACACONCAGUA, ILLLIMANI, …) — small standalone bead,
  can ride along with B if desired.
