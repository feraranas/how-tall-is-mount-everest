# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

An interactive single-page site visualizing the world's tallest mountains and volcanoes by altitude. Built with Vite + React 18 + TypeScript + Tailwind CSS v3.

## Commands

```bash
npm install      # install deps
npm run dev      # Vite dev server with HMR
npm run build    # tsc -b (typecheck) then vite build → dist/
npm run lint     # eslint over the repo
npm run preview  # serve the production build
```

There is no test suite. `npm run build` is the type-check gate (run `tsc -b` before assuming TS is clean).

## Architecture

The whole experience is **one tall scrollable canvas** (50,000px). There is no router and no state management — the visualization is driven entirely by absolute positioning along the Y axis and a single scroll listener.

- `index.html` — sets `<body>` to `--page-height` (50000px) tall and paints the `bg-floor-to-sky-2` gradient as the altitude backdrop. The `::before`/`::after` pseudo-elements draw the grid overlays (`gridWhite`/`gridBlack`).
- `src/App.tsx` — composition root. Renders `Metronome`, `Animations`, `Mountains`, `Illustrations` as flat siblings (no layout wrapper).
- `src/components/Metronome/Metronome.tsx` — fixed altitude readout. The only interactive logic: a `scroll` listener maps `window.scrollY` over the page height to a meters value and toggles an `active` class. `totalHeight` (50000) and `mapHeight` (6800) here must stay in sync with the page height in `index.html`/`index.css`.
- `src/components/Mountains/` — `Mountains.tsx` maps over the `mountains` array and renders a `Mountain` per entry; each `Mountain` wraps a `DataContainer` (→ `MountainTitle` + `MountainInformation`).
- `src/components/Animations/` — `Stars`, `Ashes`, `Clouds`. These are mostly stubs/placeholders right now.

### How a mountain is positioned (important)

Adding or moving a mountain requires **several coordinated edits**, because the data, the SVG, and the layout are decoupled:

1. **Asset** — SVG in `src/assets/mountains/N-NAME.svg`.
2. **Tailwind background** — register it as `bg-mountain-N` under `theme.extend.backgroundImage` in `tailwind.config.js` (paths are relative to project root, e.g. `url("src/assets/mountains/...")`).
3. **Layout variant** — `mountainVariants` in `src/components/Mountains/Mountain.tsx` is a hardcoded map from `MountainID` → Tailwind classes that set the `top-[Npx]` scroll position, size, `bg-mountain-N`, and `z` index. This is the source of truth for *where* each mountain sits on the canvas.
4. **Type** — extend the `MountainID` union in `src/components/Mountains/Mountains.tsx`.
5. **Data** — add the entry to `mountains` in `src/components/Mountains/mountainsInfo.ts` (shape is `mountainConfig`).

Note: `mountainsInfo.ts` currently holds **placeholder/duplicated data** (many entries are copies of mountain-1), and several `mountainVariants` `top-[...]` values past mountain-18 still point at `12500px` — these are works in progress, not bugs to "fix" blindly.

### Styling conventions

- Styling is Tailwind utility classes inline in JSX; there is almost no hand-written CSS beyond `src/index.css` (CSS custom properties + resets).
- Layout relies heavily on arbitrary values (`top-[2500px]`, `w-[500px]`, `z-[99]`). Because positions are arbitrary-value classes keyed dynamically (`bg-mountain-${id}`), they must exist as literal strings somewhere Tailwind's content scanner can see them — keep the full class strings in `mountainVariants`/`backgroundImage`, don't build them by string concatenation.
- CSS variables (`--page-height`, `--half-page-height`, `--primary-color`) live in `:root` in `src/index.css`.

<!-- bv-agent-instructions-v2 -->

---

## Beads Workflow Integration

This project uses [beads_rust](https://github.com/Dicklesworthstone/beads_rust) (`br`) for issue tracking and [beads_viewer](https://github.com/Dicklesworthstone/beads_viewer) (`bv`) for graph-aware triage. Issues are stored in `.beads/` and tracked in git.

### Using bv as an AI sidecar

bv is a graph-aware triage engine for Beads projects (.beads/beads.jsonl). Instead of parsing JSONL or hallucinating graph traversal, use robot flags for deterministic, dependency-aware outputs with precomputed metrics (PageRank, betweenness, critical path, cycles, HITS, eigenvector, k-core).

**Scope boundary:** bv handles *what to work on* (triage, priority, planning). `br` handles creating, modifying, and closing beads.

**CRITICAL: Use ONLY --robot-* flags. Bare bv launches an interactive TUI that blocks your session.**

#### The Workflow: Start With Triage

**`bv --robot-triage` is your single entry point.** It returns everything you need in one call:
- `quick_ref`: at-a-glance counts + top 3 picks
- `recommendations`: ranked actionable items with scores, reasons, unblock info
- `quick_wins`: low-effort high-impact items
- `blockers_to_clear`: items that unblock the most downstream work
- `project_health`: status/type/priority distributions, graph metrics
- `commands`: copy-paste shell commands for next steps

```bash
bv --robot-triage        # THE MEGA-COMMAND: start here
bv --robot-next          # Minimal: just the single top pick + claim command

# Token-optimized output (TOON) for lower LLM context usage:
bv --robot-triage --format toon
```

Before claiming, verify current state with `br show <id> --json` or `br ready --json`. `recommendations` can include graph-important blocked or assigned work; only `quick_ref.top_picks` and non-empty `claim_command` fields represent claimable work.

#### Other bv Commands

| Command | Returns |
|---------|---------|
| `--robot-plan` | Parallel execution tracks with unblocks lists |
| `--robot-priority` | Priority misalignment detection with confidence |
| `--robot-insights` | Full metrics: PageRank, betweenness, HITS, eigenvector, critical path, cycles, k-core |
| `--robot-alerts` | Stale issues, blocking cascades, priority mismatches |
| `--robot-suggest` | Hygiene: duplicates, missing deps, label suggestions, cycle breaks |
| `--robot-diff --diff-since <ref>` | Changes since ref: new/closed/modified issues |
| `--robot-graph [--graph-format=json\|dot\|mermaid]` | Dependency graph export |

#### Scoping & Filtering

```bash
bv --robot-plan --label backend              # Scope to label's subgraph
bv --robot-insights --as-of HEAD~30          # Historical point-in-time
bv --recipe actionable --robot-plan          # Pre-filter: ready to work (no blockers)
bv --recipe high-impact --robot-triage       # Pre-filter: top PageRank scores
```

### br Commands for Issue Management

```bash
br ready              # Show issues ready to work (no blockers)
br list --status=open # All open issues
br show <id>          # Full issue details with dependencies
br create --title="..." --type=task --priority=2
br update <id> --status=in_progress
br close <id> --reason="Completed"
br close <id1> <id2>  # Close multiple issues at once
br sync --flush-only  # Export DB to JSONL
```

### Workflow Pattern

1. **Triage**: Run `bv --robot-triage` to find the highest-impact actionable work
2. **Claim**: Use `br update <id> --status=in_progress`
3. **Work**: Implement the task
4. **Complete**: Use `br close <id>`
5. **Sync**: Always run `br sync --flush-only` at session end

### Key Concepts

- **Dependencies**: Issues can block other issues. `br ready` shows only unblocked work.
- **Priority**: P0=critical, P1=high, P2=medium, P3=low, P4=backlog (use numbers 0-4, not words)
- **Types**: task, bug, feature, epic, chore, docs, question
- **Blocking**: `br dep add <issue> <depends-on>` to add dependencies

### Session Protocol

```bash
git status              # Check what changed
git add <files>         # Stage code changes
br sync --flush-only    # Export beads changes to JSONL
git commit -m "..."     # Commit everything
git push                # Push to remote
```

<!-- end-bv-agent-instructions -->
