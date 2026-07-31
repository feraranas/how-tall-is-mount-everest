import { test, expect } from './fixtures';

/**
 * Regression for the missing <meta charset="utf-8">: without it the UTF-8 flag
 * emoji in the mountain titles are mis-decoded (mojibake, e.g. "ðŸ‡¨ðŸ‡³").
 * The China flag 🇨🇳 is two regional-indicator code points (U+1F1E8 U+1F1F3).
 */
test.describe('document character encoding', () => {
  test('Everest title renders the real China flag emoji (no mojibake)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const title = await page.locator('.mountain-1 .mountain-title').textContent();
    expect(title).toContain('\u{1F1E8}\u{1F1F3}'); // 🇨🇳
    expect(title).not.toContain('Ã'); // "Ã" — the tell-tale Latin-1 mojibake byte
  });

  test('the document declares a UTF-8 charset', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const charset = await page.evaluate(() => document.characterSet);
    expect(charset.toUpperCase()).toBe('UTF-8');
  });
});
