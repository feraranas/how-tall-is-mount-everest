import { test, expect, type Page } from '@playwright/test';

/**
 * Illustration hover info-panel (mirrors tests/info-panel.spec.ts).
 *
 * Each illustration's i-chip (.fa-info-illustration) opens a panel
 * (.illustration-info) on hover — pure CSS (.illustration-data:hover), no JS.
 * Panels carry unique per-item content from illustrations_data
 * (js/components/illustration.js); keys were a shared placeholder "1" before.
 */

const CONTAINER = '.bird-golden-eagle-container';
const CHIP = `${CONTAINER} .fa-info-illustration`;
const PANEL = `${CONTAINER} .illustration-info`;

async function open(page: Page) {
  await page.goto('/', { waitUntil: 'load' });
  await page.locator(CHIP).scrollIntoViewIfNeeded();
}

test.describe('illustration hover info-panel', () => {
  test('hovering the chip opens the panel with the right content', async ({ page }) => {
    await open(page);
    await expect(page.locator(PANEL)).toBeHidden();
    await page.locator(CHIP).hover();
    await expect(page.locator(PANEL)).toBeVisible();
    await expect(page.locator(PANEL)).toContainText('Águila real');
    await expect(page.locator(PANEL)).toContainText('3,352.8m');
  });

  test('moving the cursor into the panel keeps it open', async ({ page }) => {
    await open(page);
    await page.locator(CHIP).hover();
    await expect(page.locator(PANEL)).toBeVisible();
    await page.locator(PANEL).hover();
    await expect(page.locator(PANEL)).toBeVisible();
  });

  test('leaving closes the panel', async ({ page }) => {
    await open(page);
    await page.locator(CHIP).hover();
    await expect(page.locator(PANEL)).toBeVisible();
    await page.mouse.move(10, 10);
    await expect(page.locator(PANEL)).toBeHidden();
  });

  test('panels are unique per illustration (no shared key content)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    const keys = await page.$$eval('.illustration-info', (els) =>
      els.map((el) => el.getAttribute('data-key'))
    );
    expect(keys.length).toBeGreaterThan(0);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
