/* ///////////////////////////////////////////////// */
/* //////////////// CLOUD COMPONENT //////////////// */
/* ///////////////////////////////////////////////// */
/* Factory + data for the cloud layer (design-system component).             */
/* A cloud's look (background variant, filter, opacity, depth z-index) is    */
/* keyed by its `cloud-N` class in css/components/cloud.css; its canvas      */
/* placement lives in css/layout/cloud-placement.css + the media files.      */
/* The drift engine (js/cloudsParallax-script.js) animates every `.cloud`,   */
/* so this script must run BEFORE it (see the <script> order in index.html). */

/* Data-driven cloud list (mirrors the mountains pattern). One entry per      */
/* cloud instance; `n` keys the cloud-N skin/placement classes.               */
const clouds_data = Array.from({ length: 51 }, (_, n) => ({ n }));

/* Build one cloud element. Kept dependency-free so a Storybook story can     */
/* call it directly. */
function makeCloud({ n }) {
  const el = document.createElement("div");
  el.className = `cloud cloud-${n}`;
  return el;
}

function renderClouds() {
  const root = document.querySelector(".clouds-container");
  if (!root) {
    throw new Error(".clouds-container not found — cannot render clouds");
  }
  root.replaceChildren(...clouds_data.map(makeCloud));
}

/* Dual-mode: as a classic <script> these are globals already; when imported
   as an ES module (Storybook/Vite) top-level declarations are module-scoped,
   so attach explicitly. Only boot on the site (Storybook has no container). */
globalThis.makeCloud = makeCloud;
globalThis.clouds_data = clouds_data;
if (document.querySelector(".clouds-container")) renderClouds();
