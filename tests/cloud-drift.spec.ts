import { test, expect, type Page } from '@playwright/test';

/**
 * Horizontal cloud drift (js/cloudsParallax-script.js).
 *
 * Clouds (`.cloud.cloud-N`) drift horizontally independent of scroll: each moves
 * left or right at a randomized, gentle speed, exits one screen edge and
 * re-enters from the opposite edge (wrap-around). Motion is per-cloud random
 * (mixed directions, varied speed) and depth-aware — nearer/higher-z clouds
 * drift faster. Disabled under prefers-reduced-motion.
 *
 * We measure the computed transform's translateX (matrix m41). The drift engine
 * writes `translate3d(x,0,0) scaleX(..) scaleY(..)`, so m41 is the live x.
 */

const NEAR = '.cloud-32'; // z-index 150 (highest / nearest)
const FAR = '.cloud-49'; // z-index 7 (lowest / farthest)

const cloudTx = (p: Page, sel: string) =>
  p.locator(sel).evaluate(
    (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41
  );

// Read every cloud's current translateX in one shot.
const allTx = (p: Page) =>
  p.locator('.cloud').evaluateAll((els) =>
    els.map((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41)
  );

// Let the rAF drift loop advance for `ms` of wall-clock time.
async function advance(page: Page, ms: number) {
  await page.evaluate(
    (delay) => new Promise<void>((r) => setTimeout(r, delay)),
    ms
  );
}

test.describe('cloud horizontal drift', () => {
  test('a cloud drifts horizontally over time (no scroll)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const a = await cloudTx(page, NEAR);
    await advance(page, 300);
    const b = await cloudTx(page, NEAR);
    expect(a).not.toBeCloseTo(b, 1);
  });

  test('clouds move differently from one another (randomness)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const before = await allTx(page);
    await advance(page, 300);
    const after = await allTx(page);
    const deltas = after.map((x, i) => x - before[i]);
    // Not every cloud moved by the same amount (mixed directions + varied speed).
    const unique = new Set(deltas.map((d) => d.toFixed(1)));
    expect(unique.size).toBeGreaterThan(1);
  });

  test('nearer (higher-z) clouds drift faster than far clouds', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    // Accumulate distance travelled over several short steps, discarding the
    // big jumps produced when a cloud wraps edge-to-edge (so a wrap during the
    // window doesn't corrupt the measured speed).
    const travel = async (sel: string) => {
      let prev = await cloudTx(page, sel);
      let dist = 0;
      for (let i = 0; i < 8; i++) {
        await advance(page, 80);
        const cur = await cloudTx(page, sel);
        const step = Math.abs(cur - prev);
        if (step < 1000) dist += step; // ignore wrap jumps
        prev = cur;
      }
      return dist;
    };
    const nearDist = await travel(NEAR);
    const farDist = await travel(FAR);
    expect(nearDist).toBeGreaterThan(farDist);
  });

  test('drift stays within the wrap span (never runs away)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    // Max span for any cloud is halfViewport + its own width. Measure a generous
    // upper bound: half the viewport plus the widest cloud box.
    const bound = await page.evaluate(() => {
      const widest = Array.from(document.querySelectorAll('.cloud')).reduce(
        (m, el) => Math.max(m, el.getBoundingClientRect().width),
        0
      );
      return window.innerWidth / 2 + widest;
    });
    let maxSeen = 0;
    for (let i = 0; i < 6; i++) {
      await advance(page, 200);
      const xs = await allTx(page);
      maxSeen = Math.max(maxSeen, ...xs.map((x) => Math.abs(x)));
    }
    // Allow a small tolerance for a single frame's step past the edge.
    expect(maxSeen).toBeLessThanOrEqual(bound + 50);
  });

  test('respects prefers-reduced-motion (no drift)', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const a = await cloudTx(page, NEAR);
    await advance(page, 400);
    const b = await cloudTx(page, NEAR);
    expect(a).toBeCloseTo(b, 1);
  });
});
