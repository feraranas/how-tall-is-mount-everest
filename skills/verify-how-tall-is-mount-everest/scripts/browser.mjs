// browser.mjs — Playwright (playwright-core + system Chrome) journeys for the Everest site.
// Usage (via sitectl): node browser.mjs <altimeter-scroll|mountain-cards|sky-layers>
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
  // Bottom of the page: the meter reads 02500m and drops the active class.
  await page.mouse.wheel(0, 60000);
  await page.waitForFunction(() => window.scrollY + innerHeight >= document.documentElement.scrollHeight - 2, null, { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(300);
  const bottom = await altimeter(); result.steps.push({ step: "scroll-bottom", altimeter: bottom }); await save("05-scroll-bottom");
  pass = vals.every(v => /^\d{5}m$/.test(v ?? "")) && new Set(vals).size === vals.length && result.steps[2].altimeter.active === true
    && bottom?.active === false;
} else if (journey === "mountain-cards") {
  // No test ids: each card is the only <ul> in its DataContainer; the dashed div above it holds the name, its sibling the altitude.
  const cards = await page.evaluate(() => [...document.querySelectorAll("ul")].map(u => {
    const box = u.closest("div.absolute.grid"), title = box?.querySelector("div.border-dashed"), card = box?.parentElement;
    return { name: title?.textContent.trim(), altitude: title?.nextElementSibling?.textContent.trim(),
      info: [...u.querySelectorAll("li")].map(l => l.textContent.trim()),
      top: card ? Math.round(card.getBoundingClientRect().top + window.scrollY) : null,
      background: card ? getComputedStyle(card).backgroundImage : null,
      infoOpacity: getComputedStyle(u.parentElement).opacity };
  }));
  // Each card's mountain SVG must actually load.
  const svgStatus = {};
  for (const c of cards) {
    const url = c.background?.match(/url\("?([^")]+)"?\)/)?.[1];
    c.svg = url ? url.replace(URL, "/") : null;
    if (url) svgStatus[c.svg] = (await page.request.get(url)).status();
  }
  const shots = [["01-first-card", cards[0]?.name], ["02-unknown-altitude", cards.find(c => c.altitude === "unknown")?.name], ["03-last-card", cards.at(-1)?.name]];
  const visible = {};
  for (const [file, name] of shots) {
    if (!name) continue;
    const el = page.getByText(name, { exact: true }).first();
    await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(300);
    visible[name] = await el.isVisible(); await save(file);
  }
  const tops = cards.map(c => c.top);
  result.steps.push({ step: "cards", count: cards.length, distinctNames: new Set(cards.map(c => c.name)).size,
    distinctTops: new Set(tops).size, visible, svgStatus, cards });
  pass = cards.length === 25 && new Set(cards.map(c => c.name)).size === 25 && new Set(tops).size === 25
    && cards.every(c => c.info.length === 5 && c.altitude) && Object.values(svgStatus).length === 25
    && Object.values(svgStatus).every(s => s === 200) && Object.values(visible).every(Boolean);
} else if (journey === "sky-layers") {
  // Stars/Ashes/Clouds currently render placeholder text only; record what is there and whether any sky image loads.
  const skyRequests = [];
  page.on("request", r => { if (/\/assets\/(clouds|stars)\//.test(r.url())) skyRequests.push(r.url()); });
  await page.reload({ waitUntil: "networkidle" });
  const layers = await page.evaluate(() => ["Stars", "Ashes", "Clouds"].map(t => {
    const el = [...document.querySelectorAll("#root > div")].find(d => d.textContent.trim() === t);
    return { text: t, present: !!el, color: el ? getComputedStyle(el).color : null, img: el ? el.querySelectorAll("img").length : null };
  }));
  await save("01-top");
  result.steps.push({ step: "layers", layers, skyRequests });
  pass = layers.every(l => l.present);} else { console.error("unknown journey"); process.exit(2); }

result.pageErrors = errors; result.pass = pass && errors.length === 0;
writeFileSync(path.join(OUT, "result.json"), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
await browser.close();
process.exit(result.pass ? 0 : 1);
