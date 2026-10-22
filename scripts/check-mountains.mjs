// Checks that the five hand-maintained lists of mountains agree:
//   1. SVG files in src/assets/mountains/<n>-<NAME>.svg
//   2. backgroundImage "mountain-<n>" entries in tailwind.config.js
//   3. the MountainID union in src/components/Mountains/Mountains.tsx
//   4. mountainVariants in src/components/Mountains/Mountain.tsx
//   5. ids in src/components/Mountains/mountainsInfo.ts
// Usage: npm run check:mountains   Exit 1 on any mismatch; overlapping
// `top-[...]` positions are reported as warnings only.
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(path.join(root, p), "utf8");
const errors = [];
const warnings = [];

const assets = new Map(
  readdirSync(path.join(root, "src/assets/mountains"))
    .map((f) => f.match(/^(\d+)-[A-Z0-9-]+\.svg$/))
    .filter(Boolean)
    .map((m) => [`mountain-${m[1]}`, `src/assets/mountains/${m[0]}`]),
);

const tailwind = new Map(
  [...read("tailwind.config.js").matchAll(/"(mountain-\d+)":\s*'url\("([^"]+)"\)'/g)].map((m) => [m[1], m[2]]),
);

const union = read("src/components/Mountains/Mountains.tsx").match(/type MountainID =([^;]+);/);
const unionIds = new Set(union ? [...union[1].matchAll(/'(mountain-\d+)'/g)].map((m) => m[1]) : []);
if (!union) errors.push("MountainID union not found in Mountains.tsx");

const variants = new Map(
  [...read("src/components/Mountains/Mountain.tsx").matchAll(/"(mountain-\d+)":\s*"([^"]+)"/g)].map((m) => [m[1], m[2]]),
);

const infoIds = [...read("src/components/Mountains/mountainsInfo.ts").matchAll(/id:\s*"(mountain-\d+)"/g)].map((m) => m[1]);

const all = new Set([...assets.keys(), ...tailwind.keys(), ...unionIds, ...variants.keys(), ...infoIds]);
for (const id of [...all].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))) {
  if (!assets.has(id)) errors.push(`${id}: no src/assets/mountains/${id.slice(9)}-*.svg`);
  if (!tailwind.has(id)) errors.push(`${id}: no backgroundImage entry in tailwind.config.js`);
  else if (assets.has(id) && tailwind.get(id) !== assets.get(id))
    errors.push(`${id}: tailwind points at ${tailwind.get(id)}, asset is ${assets.get(id)}`);
  if (!unionIds.has(id)) errors.push(`${id}: missing from MountainID union`);
  if (!variants.has(id)) errors.push(`${id}: missing from mountainVariants`);
  else if (!variants.get(id).split(/\s+/).includes(`bg-${id}`))
    errors.push(`${id}: variant does not use bg-${id}`);
  const n = infoIds.filter((x) => x === id).length;
  if (n === 0) errors.push(`${id}: no entry in mountainsInfo.ts`);
  if (n > 1) errors.push(`${id}: ${n} entries in mountainsInfo.ts`);
}

const byTop = new Map();
for (const [id, cls] of variants) {
  const top = cls.match(/top-\[(\d+)px\]/)?.[1];
  if (top) byTop.set(top, [...(byTop.get(top) ?? []), id]);
}
for (const [top, ids] of byTop) if (ids.length > 1) warnings.push(`top-[${top}px] shared by ${ids.join(", ")}`);

for (const w of warnings) console.log(`warning: ${w}`);
for (const e of errors) console.log(`error: ${e}`);
console.log(`checked ${all.size} mountains: ${errors.length} error(s), ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
