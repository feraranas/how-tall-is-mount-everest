import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

// Font Awesome's runtime marks the existing focusable <i> controls aria-hidden.
// Keep that known semantics debt explicit until those controls become buttons;
// any other serious/critical WCAG A/AA violation still fails this gate.
const KNOWN_BLOCKING_RULES = new Set(['aria-hidden-focus']);

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
