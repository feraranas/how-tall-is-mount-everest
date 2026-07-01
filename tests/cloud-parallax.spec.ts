import { test, expect, type Page } from '@playwright/test';

/**
 * Depth-layered cloud parallax on scroll.
 *
 * Clouds (`.cloud.cloud-N`) get a vertical `translateY` that tracks scroll,
 * scaled by depth (z-index): nearer/higher-z clouds move more. Motion is slow
 * (clouds LAG the scroll) and disabled under prefers-reduced-motion.
 *
 * We measure the computed transform's translateY (matrix m42) rather than the
 * bounding box, because the page itself scrolls.
 *
 * cloud-32 has the highest z-index (150, "near"); cloud-49 the lowest (7, "far").
 */

const NEAR = '.cloud-32';
const FAR = '.cloud-49';

const cloudTy = (p: Page, sel: string) =>
  p.locator(sel).evaluate(
    (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m42
  );

// Scroll to Y and let the passive scroll -> rAF handler run.
async function scrollTo(page: Page, y: number) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.evaluate(
    () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())))
  );
}

test.describe('cloud parallax', () => {
  test('a cloud shifts vertically as the page scrolls', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await scrollTo(page, 10000);
    const a = await cloudTy(page, NEAR);
    await scrollTo(page, 30000);
    const b = await cloudTy(page, NEAR);
    expect(a).not.toBeCloseTo(b, 1);
  });

  test('parallax is bidirectional (sign of the delta reverses)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await scrollTo(page, 20000);
    const base = await cloudTy(page, NEAR);
    await scrollTo(page, 30000);
    const down = await cloudTy(page, NEAR);
    await scrollTo(page, 10000);
    const up = await cloudTy(page, NEAR);
    // Moving the scroll the opposite way moves the offset the opposite way.
    expect(Math.sign(down - base)).toBe(-Math.sign(up - base));
    expect(down - base).not.toBeCloseTo(0, 1);
  });

  test('nearer clouds move more than far clouds (depth-layered)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await scrollTo(page, 10000);
    const near0 = await cloudTy(page, NEAR);
    const far0 = await cloudTy(page, FAR);
    await scrollTo(page, 30000);
    const near1 = await cloudTy(page, NEAR);
    const far1 = await cloudTy(page, FAR);
    const nearDelta = Math.abs(near1 - near0);
    const farDelta = Math.abs(far1 - far0);
    expect(nearDelta).toBeGreaterThan(farDelta);
  });

  test('motion is slow: 0 < |offset delta| < |scroll delta|', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await scrollTo(page, 10000);
    const a = await cloudTy(page, NEAR);
    await scrollTo(page, 30000);
    const b = await cloudTy(page, NEAR);
    const offsetDelta = Math.abs(b - a);
    const scrollDelta = 20000;
    expect(offsetDelta).toBeGreaterThan(0);
    expect(offsetDelta).toBeLessThan(scrollDelta);
  });

  test('respects prefers-reduced-motion (no parallax)', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/', { waitUntil: 'load' });
    await scrollTo(page, 10000);
    const a = await cloudTy(page, NEAR);
    await scrollTo(page, 30000);
    const b = await cloudTy(page, NEAR);
    expect(a).toBeCloseTo(b, 1);
  });
});
