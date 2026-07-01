import { test, expect, type Page } from '@playwright/test';

/**
 * Info-panel accessibility: the `.fa-info` trigger must be keyboard-focusable,
 * open the panel on focus (:focus-within), expose aria-controls/aria-expanded,
 * and close on Escape/blur. Everest = `.mountain-1`.
 */

const TRIGGER = '.mountain-1 .fa-info';
const PANEL = '.mountain-1 .mountain-info';

const panelOpacity = (p: Page) =>
  p.locator(PANEL).evaluate((el) => getComputedStyle(el).opacity);

async function load(page: Page) {
  await page.goto('/', { waitUntil: 'load' });
  await page.locator(TRIGGER).scrollIntoViewIfNeeded();
}

test.describe('info-panel — a11y', () => {
  test('trigger is keyboard-focusable', async ({ page }) => {
    await load(page);
    await page.locator(TRIGGER).focus();
    await expect(page.locator(TRIGGER)).toBeFocused();
  });

  test('focusing the trigger opens the panel', async ({ page }) => {
    await load(page);
    await page.locator(TRIGGER).focus();
    await expect.poll(() => panelOpacity(page), { timeout: 3000 }).toBe('1');
  });

  test('trigger exposes aria-controls + aria-expanded that flips when open', async ({ page }) => {
    await load(page);
    const trigger = page.locator(TRIGGER);
    const controls = await trigger.getAttribute('aria-controls');
    expect(controls).toBeTruthy();
    // aria-controls must reference the real panel id.
    await expect(page.locator(`#${controls}`)).toHaveClass(/mountain-info/);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await trigger.focus();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  test('Escape / blur closes the panel', async ({ page }) => {
    await load(page);
    await page.locator(TRIGGER).focus();
    await expect.poll(() => panelOpacity(page), { timeout: 3000 }).toBe('1');
    await page.locator(TRIGGER).blur();
    await expect.poll(() => panelOpacity(page), { timeout: 3000 }).toBe('0');
    await expect(page.locator(TRIGGER)).toHaveAttribute('aria-expanded', 'false');
  });
});
