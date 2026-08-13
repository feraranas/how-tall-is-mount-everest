import { test as base, expect } from '@playwright/test';

export type { Page, TestInfo } from '@playwright/test';
export { expect };

// Regression tests own the repository's local HTML, CSS, JavaScript, and
// assets. Remote fonts, icons, and imagery are deliberately removed from the
// gate so CDN latency or availability cannot make local behavior flaky.
export const EXTERNAL_ASSET_HOSTS = new Set([
  'imagedelivery.net',
  'fonts.cdnfonts.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'kit.fontawesome.com',
  'ka-f.fontawesome.com',
]);

export function isExternalAsset(url: string): boolean {
  try {
    return EXTERNAL_ASSET_HOSTS.has(new URL(url).hostname);
  } catch {
    return false;
  }
}

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('**/*', (route) =>
      isExternalAsset(route.request().url()) ? route.abort('blockedbyclient') : route.continue()
    );
    await use(page);
  },
});
