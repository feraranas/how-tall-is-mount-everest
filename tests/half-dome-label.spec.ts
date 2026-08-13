import { test, expect } from './fixtures';

/**
 * Regression: Half Dome (#41) must be labeled exactly once.
 *
 * The data-driven mountain builder used to emit an extra `m-41-container`
 * summary header (title + height) on top of the standard data-container
 * title block, so "HALF DOME 🇺🇸 / 2,696m" appeared twice around the
 * 47,550px band (metronome ≈ 2,756m).
 */

test.describe('half dome label', () => {
  test('renders exactly one HALF DOME title and no m-41-container', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Exactly one leaf element carries the Half Dome title text.
    const titleCount = await page.evaluate(
      () =>
        Array.from(document.querySelectorAll('body *')).filter(
          (el) => el.children.length === 0 && el.textContent!.includes('HALF DOME')
        ).length
    );
    expect(titleCount).toBe(1);

    // The legacy duplicate header block is gone.
    await expect(page.locator('.m-41-container')).toHaveCount(0);

    // The standard title block (same pattern as every other peak) survives.
    await expect(page.locator('.half-dome-title .mountain-title')).toHaveText(/HALF DOME/);
  });
});
