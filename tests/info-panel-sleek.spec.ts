import { test, expect, type Page } from '@playwright/test';

/**
 * "Sleek" info-panel: Spanish range label, structured label/value rows, and
 * motion that respects prefers-reduced-motion.
 *
 * K2 (`.mountain-2`) is the sample peak that carries a `range` field.
 */

const K2_PANEL = '.mountain-2 .mountain-info';

test.describe('info-panel — sleek', () => {
  test('range row uses the Spanish label "Cordillera:" not "Mountain range:"', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    const txt = (await page.locator(K2_PANEL).textContent()) ?? '';
    expect(txt).toContain('Cordillera:');
    expect(txt).not.toContain('Mountain range:');
  });

  test('each info row exposes a distinct label and value element', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    const labels = page.locator(`${K2_PANEL} .info-label`);
    const values = page.locator(`${K2_PANEL} .info-value`);
    expect(await labels.count()).toBeGreaterThan(0);
    expect(await values.count()).toBe(await labels.count());
  });

  test('respects prefers-reduced-motion (no entrance transition/animation)', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/', { waitUntil: 'load' });
    const durations = await page.locator(K2_PANEL).evaluate((el) => {
      const s = getComputedStyle(el);
      return { transition: s.transitionDuration, animation: s.animationDuration };
    });
    expect(durations.transition).toBe('0s');
    expect(durations.animation).toBe('0s');
  });
});
