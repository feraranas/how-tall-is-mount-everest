# Branch and release policy

## Current state

The maintained vanilla HTML/CSS/JavaScript site lives on `release`. The GitHub
default branch still points to `main`, whose unique commits are the earlier
React/Vite experiment. Until the repository setting is reconciled, pull
requests for the maintained site target `release`.

CI is intentionally defined once, in `.github/workflows/ci.yml`, and runs for
pushes and pull requests to both `release` and `main`. This keeps both branch
lines protected while the default-branch change is pending without maintaining
two workflows that can drift.

## Repository-setting follow-up

Changing the default branch and branch-protection rules is an administrative
GitHub operation, so it is not performed by this code change. A repository
administrator should:

1. Preserve the current React/Vite `main` line under an explicitly named
   archive branch such as `archive/react-migration`.
2. Make `release` the default branch for the maintained vanilla site.
3. Require the `playwright` and `storybook` jobs from the `ci` workflow on the
   default branch.
4. Update any deployment integration that still follows `main`.
5. After the new default has been stable, decide whether to keep the name
   `release` or rename it to `main`. Do not delete the archive until its history
   is confirmed reachable on GitHub.

## Pull-request policy

- One bead maps to one branch and one pull request.
- Feature branches start from the maintained default branch (`release` until
  the administrative change above is complete).
- Pull requests must pass the Chromium Playwright regression gate and the
  Storybook build/render smoke.
- Firefox and WebKit remain local/full-suite verification unless a later CI
  policy explicitly promotes them.
