# One thing that Beads is difficult at the beginning is

- Where do I start. How can I plan my beads correctly? 
- Should I start with a PLAN.md artifact and then combine Beads for richer planning?

This sums up my concerns initially:

```
Individual beads are intentionally small (often just a one-line title), which makes sense for tracking execution and dependencies. However, in my workflow I often start with a detailed planning session that produces a document describing multiple phases, steps, constraints, and acceptance criteria.

I’d like to use Beads to represent those steps and dependencies without losing the context and guidance captured in the planning doc.
```

## Teachings from the community

1. Once you have a plan (produced by Claude Code's plan mode or otherwise), you can have an agent read through it and create beads issues from it, following some kind of structure.
2. Attached is my 'plan-to-beads' conversion agent. https://gist.github.com/phate45/f30019c1c35693173d5050a4d927ef15 See [plan to beads skill](/Users/kiwi/repositories/internal/how-tall-is-mount-everest/.claude/skills/plan-to-beads/SKILL.md)

- It has some 'quirks' from my setup, but it's easy enough to iteratively improve on/specialize from it with your local AI assistant.

## Teachings from actual practice

Using the prompt `PLANNING_BEADS` from .claude/plans/PLANNING_BEADS.md gave me an initial beads structure. Afterwards, running the skill `plan-to-beads` gave me a second structure. Running `beads graph` shows 2 components:

```bash
Component 1 (6 issues, roots: how-tall-is-mount-everest-refactor-v2-ulv)                                 │
│   how-tall-is-mount-everest-refactor-v2-ulv Refactor: data-driven mountains, iner... [P1] [open] (root)  │
│     how-tall-is-mount-everest-refactor-v2-ulv.1 Centralize canvas constants (scene.ts... [P1] [open] dep │
│     how-tall-is-mount-everest-refactor-v2-ulv.4 Remove dead / stub code [P2] [open] depends on: how-tall │
│       how-tall-is-mount-everest-refactor-v2-ulv.2 Data-driven mountain system (eliminat... [P1] [open] d │
│         how-tall-is-mount-everest-refactor-v2-ulv.3 Non-interactive scene layer (lock it ... [P2] [open] │
│           how-tall-is-mount-everest-refactor-v2-ulv.5 Verification (build, lint, browser ch... [P2] [open]

Component 2 (6 issues, roots: how-tall-is-mount-everest-refactor-epic-w8u)                               │
│   how-tall-is-mount-everest-refactor-epic-w8u Refactor: data-driven mountains, iner... [P1] [open] (root │
│     how-tall-is-mount-everest-refactor-epic-w8u.1 Centralize canvas constants (scene.ts... [P1] [open] d │
│     how-tall-is-mount-everest-refactor-epic-w8u.4 Remove dead / stub code [P2] [open] depends on: how-ta │
│       how-tall-is-mount-everest-refactor-epic-w8u.2 Data-driven mountain system (eliminat... [P1] [open] │
│         how-tall-is-mount-everest-refactor-epic-w8u.3 Non-interactive scene layer (lock it ... [P2] [ope │
│           how-tall-is-mount-everest-refactor-epic-w8u.5 Verification (build, lint, browser ch... [P2] [open]
```

How can I drop 1 component manually?

`br delete <id>`

- I ran the project with Sonnet 4.6.

# References

- official best practices thread - https://github.com/gastownhall/beads/issues/976
- `br` https://github.com/Dicklesworthstone/beads_rust# is different from `bd`, for the official `bd` repo: https://github.com/gastownhall/beads
- some guys created an observability tool for beads - https://github.com/steveyegge/gastown-otel
- interesting dev: https://github.com/anupamchugh?tab=stars
