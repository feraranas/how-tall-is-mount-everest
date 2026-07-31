import { test, expect, type Page, type TestInfo } from '@playwright/test';

/**
 * Visual + behavioral regression SMOKE test for the static vanilla site.
 *
 * The page is one 50,000px-tall scrollable canvas. window.onload scrolls to
 * the BOTTOM, so the site "starts" at the summit (~2500m). Scrolling UP the
 * page increases altitude shown in the `.metronomo` readout.
 *
 */

const PAGE_HEIGHT = 50000;

// The product currently depends on these third-party asset hosts. Network
// failures from them are outside the local regression gate; every local URL is
// still required to resolve successfully.
const ALLOWED_EXTERNAL_HOSTS = new Set([
  'imagedelivery.net',
  'fonts.cdnfonts.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'kit.fontawesome.com',
  'ka-f.fontawesome.com',
]);

function isAllowedExternal(url: string): boolean {
  try {
    return ALLOWED_EXTERNAL_HOSTS.has(new URL(url).hostname);
  } catch {
    return false;
  }
}

function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    // Resource failures are checked below with their full request URL. Browser
    // console messages for those failures omit the URL and cannot be safely
    // allowlisted on their own.
    if (msg.type() === 'error' && !/Failed to load resource/i.test(msg.text())) {
      errors.push(`console: ${msg.text()}`);
    }
  });
  page.on('pageerror', (err) => {
    errors.push(`pageerror: ${err.message}`);
  });
  page.on('requestfailed', (request) => {
    if (!isAllowedExternal(request.url())) {
      errors.push(`requestfailed: ${request.url()} — ${request.failure()?.errorText ?? 'unknown'}`);
    }
  });
  page.on('response', (response) => {
    if (response.status() >= 400 && !isAllowedExternal(response.url())) {
      errors.push(`response: ${response.status()} ${response.url()}`);
    }
  });
  return errors;
}

// Let layout, scroll handlers, and a paint settle.
async function settle(page: Page) {
  await page.evaluate(
    () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())))
  );
}

function skipOnTouch(testInfo: TestInfo) {
  test.skip(testInfo.project.use.hasTouch === true, 'mouse and keyboard input do not apply to touch');
}

async function metronomeMeters(page: Page): Promise<number> {
  const txt = await page.locator('.metronomo').textContent();
  const n = parseInt((txt ?? '').replace(/[^0-9]/g, ''), 10);
  return Number.isNaN(n) ? -1 : n;
}

test.describe('mount-everest static site smoke', () => {
  test('loads with no unexpected console/page errors', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await settle(page);
    expect(errors, `Unexpected errors:\n${errors.join('\n')}`).toEqual([]);
  });

  test('page is 50000px tall and --page-height resolves', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
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

  test('REAL scrolling moves the viewport (wheel + keyboard)', async ({ page }, testInfo) => {
    skipOnTouch(testInfo);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    // Set the initial state directly so this behavior test does not depend on
    // window.onload waiting for third-party fonts and icon scripts.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await settle(page);

    // Go to a known mid point first via wheel up.
    await page.mouse.move(640, 360);

    const startY = await page.evaluate(() => window.pageYOffset);

    // Wheel UP (negative deltaY) should decrease pageYOffset. Firefox applies
    // input-driven scrolling asynchronously, so poll for the change instead of
    // reading once after a fixed rAF tick (which races the scroll landing).
    await page.mouse.wheel(0, -4000);
    await expect
      .poll(() => page.evaluate(() => window.pageYOffset), {
        message: 'wheel up should change scroll position',
      })
      .toBeLessThan(startY);
    const afterWheel = await page.evaluate(() => window.pageYOffset);

    // Keyboard PageUp should also move the viewport.
    await page.keyboard.press('PageUp');
    await expect
      .poll(() => page.evaluate(() => window.pageYOffset), {
        message: 'PageUp should change scroll position',
      })
      .toBeLessThan(afterWheel);
  });

  test('metronome altitude changes across scroll checkpoints', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await settle(page);

    // BOTTOM (summit).
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await settle(page);
    const bottomMeters = await metronomeMeters(page);

    // MIDDLE (~25000px from top).
    await page.evaluate((y) => window.scrollTo(0, y), 25000);
    await settle(page);
    const midMeters = await metronomeMeters(page);

    // TOP-ish.
    await page.evaluate(() => window.scrollTo(0, 600));
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

});
