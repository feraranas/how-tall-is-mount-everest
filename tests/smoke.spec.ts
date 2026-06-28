import { test, expect, type Page } from '@playwright/test';

/**
 * Visual + behavioral regression SMOKE test for the static vanilla site.
 *
 * The page is one 50,000px-tall scrollable canvas. window.onload scrolls to
 * the BOTTOM, so the site "starts" at the summit (~2500m). Scrolling UP the
 * page increases altitude shown in the `.metronomo` readout.
 *
 * NOTE: on the current vanilla `release` branch REAL scrolling is known to be
 * broken (being fixed separately). Scroll-dependent assertions encode the
 * DESIRED behavior and may currently fail — that is expected (red -> green).
 */

const PAGE_HEIGHT = 50000;

// Errors we knowingly tolerate (pre-existing missing assets / external ORB blocks).
const KNOWN_ERROR_PATTERNS = [
  /cloudsv8\.png/i,
  /snowFlinch\.png/i,
  /imagedelivery\.net/i,
  /ERR_BLOCKED_BY_ORB/i,
  /net::ERR_/i,
  /Failed to load resource/i,
  /favicon/i,
  /fontawesome|fontawe|kit\.fontawesome/i,
  /the server responded with a status of 404/i,
];

function isKnownError(text: string): boolean {
  return KNOWN_ERROR_PATTERNS.some((re) => re.test(text));
}

function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !isKnownError(msg.text())) {
      errors.push(`console: ${msg.text()}`);
    }
  });
  page.on('pageerror', (err) => {
    if (!isKnownError(err.message)) {
      errors.push(`pageerror: ${err.message}`);
    }
  });
  return errors;
}

// Settle: let the load-time scrollTo(bottom) + a rAF tick happen.
async function settle(page: Page) {
  await page.evaluate(
    () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())))
  );
}

async function metronomeMeters(page: Page): Promise<number> {
  const txt = await page.locator('.metronomo').textContent();
  const n = parseInt((txt ?? '').replace(/[^0-9]/g, ''), 10);
  return Number.isNaN(n) ? -1 : n;
}

test.describe('mount-everest static site smoke', () => {
  test('loads with no unexpected console/page errors', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/', { waitUntil: 'load' });
    await settle(page);
    expect(errors, `Unexpected errors:\n${errors.join('\n')}`).toEqual([]);
  });

  test('page is 50000px tall and --page-height resolves', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await settle(page);

    const pageHeightVar = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--page-height').trim()
    );
    expect(pageHeightVar).toBe(`${PAGE_HEIGHT}px`);

    const heights = await page.evaluate(() => ({
      body: document.body.scrollHeight,
      doc: document.documentElement.scrollHeight,
      main: document.querySelector('.main-container')?.scrollHeight ?? 0,
    }));
    expect(heights.body).toBeGreaterThanOrEqual(PAGE_HEIGHT);
    expect(heights.main).toBeGreaterThanOrEqual(PAGE_HEIGHT - 1);
  });

  test('REAL scrolling moves the viewport (wheel + keyboard)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await settle(page);

    // Site starts at the bottom. Go to a known mid point first via wheel up.
    await page.mouse.move(640, 360);

    const startY = await page.evaluate(() => window.pageYOffset);

    // Wheel UP (negative deltaY) should decrease pageYOffset.
    await page.mouse.wheel(0, -4000);
    await settle(page);
    const afterWheel = await page.evaluate(() => window.pageYOffset);
    expect(afterWheel, 'wheel up should change scroll position').toBeLessThan(startY);

    // Keyboard PageUp should also move the viewport.
    await page.keyboard.press('PageUp');
    await settle(page);
    const afterKey = await page.evaluate(() => window.pageYOffset);
    expect(afterKey, 'PageUp should change scroll position').toBeLessThan(afterWheel);
  });

  test('metronome altitude changes across scroll checkpoints', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await settle(page);

    // BOTTOM (summit): site auto-scrolled here on load. Trigger a scroll event.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.mouse.move(640, 360);
    await page.mouse.wheel(0, -1);
    await settle(page);
    const bottomMeters = await metronomeMeters(page);

    // MIDDLE (~25000px from top).
    await page.evaluate((y) => window.scrollTo(0, y), 25000);
    await page.mouse.wheel(0, 1);
    await settle(page);
    const midMeters = await metronomeMeters(page);

    // TOP-ish.
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.mouse.wheel(0, -1);
    await settle(page);
    const topMeters = await metronomeMeters(page);

    // Plausibility: summit ~2500m, all readings within the map range.
    expect(bottomMeters).toBeGreaterThanOrEqual(2400);
    expect(bottomMeters).toBeLessThanOrEqual(2700);
    expect(midMeters).toBeGreaterThan(2700);

    // The three checkpoints must differ from one another.
    const distinct = new Set([bottomMeters, midMeters, topMeters]);
    expect(distinct.size, `expected 3 distinct altitudes, got ${[...distinct]}`).toBe(3);
  });

  test('visual checkpoints down the canvas (screenshot artifacts)', async ({ page }, testInfo) => {
    await page.goto('/', { waitUntil: 'load' });
    await settle(page);

    const checkpoints = [0, 12500, 25000, 37500, 49000];
    for (const y of checkpoints) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.mouse.wheel(0, 1); // nudge to fire scroll handler
      await settle(page);
      const shot = await page.screenshot();
      await testInfo.attach(`scroll-${y}px`, { body: shot, contentType: 'image/png' });
    }
  });
});
