## Verification

To prove what a visitor sees on the site, use the verification skill at `skills/verify-how-tall-is-mount-everest/SKILL.md` (also linked from `.cursor/skills/` and `.claude/skills/`):

```bash
export RUN_ID=$(date +%s)
skills/verify-how-tall-is-mount-everest/scripts/sitectl launch
skills/verify-how-tall-is-mount-everest/scripts/sitectl doctor
skills/verify-how-tall-is-mount-everest/scripts/sitectl journey altimeter-scroll
skills/verify-how-tall-is-mount-everest/scripts/sitectl cleanup
```

It runs vite on its own port and drives headless Chrome through playwright-core installed outside the repo. Feature recipes are in `skills/verify-how-tall-is-mount-everest/features/`.
