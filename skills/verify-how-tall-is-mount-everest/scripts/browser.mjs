// browser.mjs — Playwright (playwright-core + system Chrome) journeys for the Everest site.
// Usage (via sitectl): node browser.mjs <altimeter-scroll|mountain-cards>
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import path from "node:path";
const require = createRequire(path.join(process.env.NODE_PATH, "x.js"));
const { chromium } = require("playwright-core");

const URL = process.env.SITE_URL, OUT = process.env.EVIDENCE_DIR, journey = process.argv[2];
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on("pageerror", e => errors.push(String(e)));
const save = async (name, extra = {}) => {
  await page.screenshot({ path: path.join(OUT, `${name}.png`) });
  const aria = await page.locator("body").ariaSnapshot().catch(e => `aria error: ${e}`);
  writeFileSync(path.join(OUT, `${name}.aria.txt`), aria);
  return extra;
};
// The altimeter is the fixed div at the top whose text is 5 digits + "m".
const altimeter = async () => page.evaluate(() => {
  const el = [...document.querySelectorAll("div.fixed")].find(d => /^\d{5}m$/.test(d.textContent.trim()) || d.className.includes("z-[99]"));
  return el ? { text: el.textContent.trim(), active: el.classList.contains("active"), scrollY: window.scrollY } : null;
});
const result = { journey, url: URL, steps: [] };
let pass = true;
await page.goto(URL, { waitUntil: "networkidle" });
result.title = await page.title();

if (journey === "altimeter-scroll") {
  result.steps.push({ step: "load", altimeter: await altimeter() }); await save("01-top");
  for (const [i, y] of [[2, 1000], [3, 10000], [4, 25000]]) {
    await page.mouse.wheel(0, y - (await page.evaluate(() => window.scrollY)));
    await page.waitForFunction(t => Math.abs(window.scrollY - t) < 50 || window.scrollY + innerHeight >= document.documentElement.scrollHeight - 2, y, { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(300);
    const a = await altimeter(); result.steps.push({ step: `scroll-${y}`, altimeter: a }); await save(`0${i}-scroll-${y}`);
  }
  const vals = result.steps.slice(1).map(s => s.altimeter?.text);
  pass = vals.every(v => /^\d{5}m$/.test(v ?? "")) && new Set(vals).size === vals.length && result.steps[2].altimeter.active === true;
} else if (journey === "mountain-cards") {
  const names = await page.getByText("mount-everest", { exact: true }).count();
  await page.getByText("Bhutan-China Border").first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  result.steps.push({ step: "cards", mountEverestTitles: names, firstCardVisible: await page.getByText("Bhutan-China Border").first().isVisible() });
  await save("01-first-card");
  pass = names > 0 && result.steps[0].firstCardVisible;
} else { console.error("unknown journey"); process.exit(2); }

result.pageErrors = errors; result.pass = pass && errors.length === 0;
writeFileSync(path.join(OUT, "result.json"), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
await browser.close();
process.exit(result.pass ? 0 : 1);
