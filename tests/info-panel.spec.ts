import { test, expect, type Page, type TestInfo } from './fixtures';

/**
 * Mountain hover info-panel behavior.
 *
 * Each mountain has an `.fa-info` icon that reveals a `.mountain-info` panel.
 * The panel + icon live inside `.mountain-data`. Everest is `.mountain-1`.
 *
 * IMPORTANT: Playwright `toBeVisible()` treats opacity:0 as visible, so we
 * assert the COMPUTED opacity instead.
 */

const ICON = '.mountain-1 .fa-info';
const PANEL = '.mountain-1 .mountain-info';

const panelOpacity = (p: Page, sel: string) =>
  p.locator(sel).evaluate((el) => getComputedStyle(el).opacity);

function skipOnTouch(testInfo: TestInfo) {
  test.skip(testInfo.project.use.hasTouch === true, 'hover behavior does not apply to touch input');
}

async function open(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator(ICON).scrollIntoViewIfNeeded();
}

test.describe('mountain hover info-panel', () => {
  test('hovering the icon opens the panel', async ({ page }, testInfo) => {
    skipOnTouch(testInfo);
    await open(page);
    await page.locator(ICON).hover();
    await expect.poll(() => panelOpacity(page, PANEL), { timeout: 3000 }).toBe('1');
  });

  test('moving the cursor into the panel keeps it open', async ({ page }, testInfo) => {
    skipOnTouch(testInfo);
    await open(page);
    await page.locator(ICON).hover();
    await expect.poll(() => panelOpacity(page, PANEL), { timeout: 3000 }).toBe('1');
    // Move into the panel itself — it must stay open (no icon-mouseleave hide).
    await page.locator(PANEL).hover();
    // Wait past the 0.3s fade: on the buggy code the icon-mouseleave fires a
    // hide, so after settling the panel is gone. It must remain fully open.
    await page.waitForTimeout(600);
    expect(await panelOpacity(page, PANEL)).toBe('1');
  });

  test('a quick enter->leave on the icon does not stick the panel open', async ({ page }) => {
    await open(page);
    // Synthetic enter then immediate leave: the old JS queued a 100ms show
    // after a synchronous hide, leaving the panel stuck. It must stay closed.
    await page.locator(ICON).dispatchEvent('mouseenter');
    await page.locator(ICON).dispatchEvent('mouseleave');
    await page.waitForTimeout(300);
    expect(await panelOpacity(page, PANEL)).toBe('0');
  });

  test('leaving the panel closes it', async ({ page }, testInfo) => {
    skipOnTouch(testInfo);
    await open(page);
    await page.locator(ICON).hover();
    await expect.poll(() => panelOpacity(page, PANEL), { timeout: 3000 }).toBe('1');
    await page.mouse.move(0, 0);
    await expect.poll(() => panelOpacity(page, PANEL), { timeout: 3000 }).toBe('0');
  });
});
