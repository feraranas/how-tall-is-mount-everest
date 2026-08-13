import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './fixtures';

// The current focusable <i> controls have no semantic role. Converting them to
// buttons is tracked as product work; keep that debt explicit while preventing
// any additional serious/critical violation from entering the suite.
const KNOWN_BLOCKING_RULES = new Set(['aria-prohibited-attr']);

test('has no unexpected serious or critical automatically detectable WCAG A/AA violations', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const blockingViolations = results.violations.filter(
    ({ id, impact }) =>
      (impact === 'serious' || impact === 'critical') && !KNOWN_BLOCKING_RULES.has(id)
  );

  expect(blockingViolations).toEqual([]);
});
