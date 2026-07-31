import { test, expect, type Page } from './fixtures';

/**
 * Keyboard accessibility for the info panels.
 *
 * The `.fa-info` / `.fa-info-illustration` chips carry tabindex="0"; focusing
 * one opens its panel via :focus-within (same CSS mechanism as :hover), and
 * Escape blurs the chip, closing the panel.
 *
 * Playwright `toBeVisible()` treats opacity:0 as visible, so we assert the
 * COMPUTED opacity instead (same convention as info-panel.spec.ts).
 */

const M_ICON = '.mountain-1 .fa-info';
const M_PANEL = '.mountain-1 .mountain-info';
const I_ICON = '.plane-1-container .fa-info-illustration';
const I_PANEL = '.plane-1-container .illustration-info';

const panelOpacity = (p: Page, sel: string) =>
  p.locator(sel).evaluate((el) => getComputedStyle(el).opacity);

async function open(page: Page, icon: string) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    window.onload = null;
  });
  await page.locator(icon).scrollIntoViewIfNeeded();
}

test.describe('keyboard access to info panels', () => {
  test('focusing the mountain chip opens the panel; Escape closes it', async ({ page }) => {
    await open(page, M_ICON);
    await page.locator(M_ICON).focus();
    await expect.poll(() => panelOpacity(page, M_PANEL), { timeout: 3000 }).toBe('1');
    await page.keyboard.press('Escape');
    await expect.poll(() => panelOpacity(page, M_PANEL), { timeout: 3000 }).toBe('0');
  });

  test('focusing an illustration chip opens the panel; Escape closes it', async ({ page }) => {
    await open(page, I_ICON);
    await page.locator(I_ICON).focus();
    await expect.poll(() => panelOpacity(page, I_PANEL), { timeout: 3000 }).toBe('1');
    await page.keyboard.press('Escape');
    await expect.poll(() => panelOpacity(page, I_PANEL), { timeout: 3000 }).toBe('0');
  });

  test('chips are reachable and wired to their tooltip panels', async ({ page }) => {
    await open(page, M_ICON);
    const icon = page.locator(M_ICON);
    await expect(icon).toHaveAttribute('tabindex', '0');
    await expect(icon).toHaveAttribute('aria-label', /Información de/);
    const describedBy = await icon.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    await expect(page.locator(`#${describedBy}`)).toHaveAttribute('role', 'tooltip');
  });
});
