# PLANNING_BEADS

## Context

`/Users/kiwi/repositories/external/beads_rust` is Jeffrey Emanuel's Rust port of
Steve Yegge's beads. Important details:

- The CLI is `br`, not `bd` (deliberately renamed to coexist with the original).
- `br` is a dependency-aware issue tracker (SQLite + JSONL). A refactor plan
  decomposes naturally into an epic + tasks + dependency edges, which is exactly
  beads' sweet spot.
- beads tracks issues for a repo, so the beads DB should live in the
  `how-tall-is-mount-everest` repo (`br init` there), not inside `beads_rust`.
  `beads_rust` is just the tool.

## Prompt

You have the `br` CLI available (beads_rust, Steve Yegge's beads — note the
command is `br`, not `bd`). I want to turn the attached refactor plan
(`REFACTOR.md`) into a beads issue graph.

Steps:

1. Run `br init` in the `how-tall-is-mount-everest` repo (skip if `.beads`
   already exists).
2. Read `REFACTOR.md`, then check `br create --help` and `br dep --help` so you
   use the correct flags for this version — do not guess flag names.
3. Create ONE epic bead for the overall refactor, then a task bead per numbered
   section (§1–§4) plus a final verification bead. For each task set:
   - a clear title and a description with the concrete file list and acceptance
     criteria from that section,
   - priority (foundational/blocking work = higher priority),
   - dependency edges so the graph reflects the real ordering (below).
4. Wire these dependencies (blocking edges):
   - §3 "Centralize canvas constants" blocks §1 (data-driven mountains imports
     `SUMMIT_OFFSET` / `MOUNTAIN_SPACING` from the new `src/config/scene.ts`).
   - §1 "Data-driven mountain system" blocks §2 (the inert scene layer wraps the
     mapped mountains).
   - §4 "Remove dead/stub code" is independent — no blockers (can run in
     parallel).
   - The Verification bead depends on §1, §2, §3, and §4.
5. Run `br ready` to show which beads are unblocked and ready to start, and
   `br sync --flush-only` to export to JSONL.
6. Print the resulting issue list with their dependencies so I can sanity-check.

Do NOT start implementing the refactor — only build the plan in beads.

## The graph it should produce

```
EPIC: data-driven mountains / inert scene / centralized constants
 ├─ §3 Canvas constants (scene.ts, Metronome, main.tsx, index.css)  [no deps, P1]
 │     └─ blocks → §1 Data-driven mountain system                   [needs §3]
 │                    └─ blocks → §2 Non-interactive scene layer    [needs §1]
 ├─ §4 Remove dead/stub code                                        [independent, parallel]
 └─ Verification (build, lint, browser checks)                      [needs §1,§2,§3,§4]
```

That ordering matters and is the main value of putting it in beads: `br ready`
will tell you to start with §3 and §4 (the two unblocked nodes), not §1.
