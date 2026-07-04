/* ///////////////////////////////////////////////// */
/* ///////////// ILLUSTRATION COMPONENT //////////// */
/* ///////////////////////////////////////////////// */
/* Factory + data for the illustration layer: planes, helicopters, drones,   */
/* the air balloon and the birds, each with its i-tooltip chip.              */
/* Skin lives in css/components/illustration.css (sprite keyed by `name`);   */
/* canvas placement in css/layout/illustration-placement.css + the           */
/* css/media-*.css files (`.<name>-container { top: … }`).                   */
/* Renders into `.illustrations` — see the <script> order in index.html.     */

/* `altitude` is documentation (matches the old HTML comments); `key` feeds   */
/* data-illustration-key (all instances currently share key "1").             */
const illustrations_data = [
  { name: "plane-1",                     altitude: "9000m",    key: "1" },
  { name: "hellicopter-2",               altitude: "8000m",    key: "1" },
  { name: "plane-3",                     altitude: "7500m",    key: "1" },
  { name: "plane-2",                     altitude: "7000m",    key: "1" },
  { name: "bird-alpine-cough",           altitude: "6500m",    key: "1" },
  { name: "evo2-dron",                   altitude: "7000m",    key: "1" },
  { name: "dragonfish-dron",             altitude: "6000m",    key: "1" },
  { name: "hellicopter-1",               altitude: "6000m",    key: "1" },
  { name: "hellicopter-3",               altitude: "6000m",    key: "1" },
  { name: "dji-dron",                    altitude: "5900m",    key: "1" },
  { name: "air-balloon",                 altitude: "5000m",    key: "1" },
  { name: "bird-wallcreeper",            altitude: "5100m",    key: "1" },
  { name: "bird-himalayan-snowcock",     altitude: "4876.8m",  key: "1" },
  { name: "bird-andean-flamingo",        altitude: "4500.72m", key: "1" },
  { name: "bird-mountain-hawk-eagle",    altitude: "4000m",    key: "1" },
  { name: "bird-golden-eagle",           altitude: "3352.8m",  key: "1" },
  { name: "bird-snow-flinch",            altitude: "3200m",    key: "1" },
  { name: "bird-white-cheeked-nuthatch", altitude: "3200m",    key: "1" },
  { name: "bird-bald-eagle",             altitude: "3000m",    key: "1" },
  { name: "bird-rufous-bellied-niltava", altitude: "2700m",    key: "1" },
  { name: "bird-snowy-owl",              altitude: "2500m",    key: "1" },
  { name: "bird-pigeon",                 altitude: "1828m",    key: "1" },
];

/* Build one illustration (sprite + i-tooltip). Dependency-free so Storybook
   stories can call it directly. */
function makeIllustration({ name, altitude, key }) {
  return `
        <!-- ${altitude} -->
        <div class="illustration-container ${name}-container">
          <div class="illustration-data">
            <div class="tab-arrow-illustration"></div>
            <i class="fa-solid fa-info-illustration" data-illustration-key="${key}"></i>
          </div>
          <div class="illustration ${name}"></div>
        </div>`;
}

function renderIllustrations() {
  const root = document.querySelector(".illustrations");
  if (!root) {
    throw new Error(".illustrations not found — cannot render illustrations");
  }
  root.innerHTML = illustrations_data.map(makeIllustration).join("\n");
}

renderIllustrations();
