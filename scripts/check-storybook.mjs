/* Smoke-check the BUILT storybook: every story renders without page errors.
   Usage: npm run build-storybook && node scripts/check-storybook.mjs */

import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join } from "node:path";

const ROOT = new URL("../storybook-static", import.meta.url).pathname;
const PORT = 6116;

const MIME = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2" };

const server = createServer(async (req, res) => {
  try {
    const path = join(ROOT, decodeURIComponent(new URL(req.url, "http://x").pathname));
    const file = (await stat(path)).isDirectory() ? join(path, "index.html") : path;
    res.setHeader("Content-Type", MIME[extname(file)] ?? "application/octet-stream");
    res.end(await readFile(file));
  } catch {
    res.statusCode = 404;
    res.end("not found");
  }
}).listen(PORT);

const index = JSON.parse(await readFile(join(ROOT, "index.json"), "utf8"));
const stories = Object.values(index.entries).filter((e) => e.type === "story");

const browser = await chromium.launch();
const page = await browser.newPage();
let failures = 0;

for (const s of stories) {
  const errors = [];
  const onError = (e) => errors.push(e.message);
  page.on("pageerror", onError);
  await page.goto(`http://localhost:${PORT}/iframe.html?id=${s.id}`, { waitUntil: "load" });
  await page.waitForTimeout(400);
  const hasContent = await page.evaluate(
    () => document.querySelector("#storybook-root")?.childElementCount > 0
  );
  page.off("pageerror", onError);
  const ok = hasContent && errors.length === 0;
  if (!ok) failures++;
  console.log(`${ok ? "✓" : "✗"} ${s.id}${errors.length ? ` — ${errors.join("; ")}` : ""}${!hasContent ? " — EMPTY ROOT" : ""}`);
}

await browser.close();
server.close();
console.log(failures ? `\n${failures} story(ies) failed` : `\nall ${stories.length} stories render clean`);
process.exit(failures ? 1 : 0);
