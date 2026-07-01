# Run
To run playwright tests: `npx playwright test`

- The config has a webServer that serves the static site via `python3 -m http.server`

# Config
- tests/smoke.spec.ts
- playwright.config.ts

Tests:
1. Page loads with no unexpected console/page errors (known image 404s + ORB are allowlisted).
2. --page-height resolves to 50000px and body/.main-container are ≥ 50000px tall.
3. Real wheel + keyboard scroll moves window.pageYOffset (not just programmatic scrollTo).
4. Metronome altitude text changes across scroll checkpoints (summit ~2500m).
5. Visual screenshots captured at 5 scroll depths (artifacts in the HTML report).
