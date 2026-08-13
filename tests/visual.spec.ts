import { test, expect } from './fixtures';

const STABLE_CANVAS_CSS = `
  .clouds-container,
  .illustrations,
  #mountains-root,
  .ashes,
  .stars,
  .metronomo-wrapper,
  .dividers-container,
  .background-offroad,
  .floor,
  .man-1,
  .woman-1,
  .rock-boulder,
  .rock-boulder-2,
  .title,
  .end-title {
    visibility: hidden !important;
  }
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
  }
  .main-container::before {
    background-image: url('/images/grid.svg') !important;
  }
  .main-container::after {
    background-image: url('/images/gridBlack.svg') !important;
  }
`;

test('canvas background remains stable at representative altitudes', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'one canonical visual baseline is enough');

  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    window.onload = null;
  });
  await page.addStyleTag({ content: STABLE_CANVAS_CSS });

  for (const y of [0, 25_000, 49_000]) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await expect(page).toHaveScreenshot(`canvas-${y}.png`, {
      animations: 'disabled',
      caret: 'hide',
    });
  }
});
