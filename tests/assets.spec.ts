import { test, expect } from '@playwright/test';

test('declares a local favicon that resolves successfully', async ({ page, request }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const href = await page.locator('link[rel~="icon"]').getAttribute('href');

  expect(href).toBe('/images/favicon.svg');
  const response = await request.get(href!);
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toContain('image/svg+xml');
});
