import { test, expect } from '@playwright/test';

/**
 * The `.fa-info-illustration` icons render in index.html but have NO JS behavior
 * and no content — they are dead. Decision: remove them (and their arrows).
 */
test.describe('illustration info-tabs', () => {
  test('no dead illustration info-tabs remain', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await expect(page.locator('.fa-info-illustration')).toHaveCount(0);
    await expect(page.locator('.tab-arrow-illustration')).toHaveCount(0);
  });
});
