/* ///////////////////////////////////////////////// */
/* ///////////// ILLUSTRATION COMPONENT //////////// */
/* ///////////////////////////////////////////////// */
/* Factory + data for the illustration layer: planes, helicopters, drones,   */
/* the air balloon and the birds, each with its i-tooltip chip.              */
/* Skin lives in css/components/illustration.css (sprite keyed by `name`);   */
/* canvas placement in css/layout/illustration-placement.css + the           */
/* css/media-*.css files (`.<name>-container { top: … }`).                   */
/* Renders into `.illustrations` — see the <script> order in index.html.     */

/* `altitude` is where the sprite sits on the canvas (matches the old HTML    */
/* comments). `key` feeds data-illustration-key and is unique per item (it    */
/* was a shared placeholder "1" before the tooltips worked). `label`/`facts`  */
/* feed the hover info panel (makeIllustrationInfo).                          */
const illustrations_data = [
  { name: "plane-1",                     altitude: "9000m",    key: "plane-1",                     label: "Dassault Mirage 2000",        facts: ["Tipo: caza de reacción", "Techo de servicio: ≈17,000m", "En vuelo a: 9,000m"] },
  { name: "hellicopter-2",               altitude: "8000m",    key: "hellicopter-2",               label: "Aérospatiale SA 315B Lama",   facts: ["Tipo: helicóptero de gran altitud", "Récord absoluto de altitud: 12,442m (1972)", "En vuelo a: 8,000m"] },
  { name: "plane-3",                     altitude: "7500m",    key: "plane-3",                     label: "Antonov An-2",                facts: ["Tipo: biplano utilitario", "Techo de servicio: ≈4,400m", "En vuelo a: 7,500m"] },
  { name: "plane-2",                     altitude: "7000m",    key: "plane-2",                     label: "Lockheed U-2 “Dragon Lady”",  facts: ["Tipo: avión de reconocimiento", "Techo de servicio: >21,000m", "En vuelo a: 7,000m"] },
  { name: "bird-alpine-cough",           altitude: "6500m",    key: "bird-alpine-cough",           label: "Chova piquigualda (Alpine chough)", facts: ["Ave de montaña euroasiática", "Vista siguiendo alpinistas por encima de 8,000m en el Everest", "Aquí: 6,500m"] },
  { name: "evo2-dron",                   altitude: "7000m",    key: "evo2-dron",                   label: "Autel EVO II",                facts: ["Tipo: dron cuadricóptero", "Altitud máxima de servicio: ≈7,000m", "En vuelo a: 7,000m"] },
  { name: "dragonfish-dron",             altitude: "6000m",    key: "dragonfish-dron",             label: "Autel Dragonfish",            facts: ["Tipo: dron VTOL de ala fija", "Techo: ≈6,000m", "En vuelo a: 6,000m"] },
  { name: "hellicopter-1",               altitude: "6000m",    key: "hellicopter-1",               label: "Eurocopter AS350 Écureuil",   facts: ["Tipo: helicóptero ligero", "Aterrizó en la cima del Everest en 2005 (8,848m)", "En vuelo a: 6,000m"] },
  { name: "hellicopter-3",               altitude: "6000m",    key: "hellicopter-3",               label: "Eurocopter EC130",            facts: ["Tipo: helicóptero ligero", "Techo de servicio: ≈4,800m", "En vuelo a: 6,000m"] },
  { name: "dji-dron",                    altitude: "5900m",    key: "dji-dron",                    label: "DJI Mavic 2",                 facts: ["Tipo: dron cuadricóptero", "Altitud máxima de despegue: 6,000m", "En vuelo a: 5,900m"] },
  { name: "air-balloon",                 altitude: "5000m",    key: "air-balloon",                 label: "Globo aerostático",           facts: ["Vuelo típico: 150–900m sobre el terreno", "Récord de altitud: 21,027m (2005)", "En vuelo a: 5,000m"] },
  { name: "bird-wallcreeper",            altitude: "5100m",    key: "bird-wallcreeper",            label: "Treparriscos (Wallcreeper)",  facts: ["Ave de riscos de las montañas de Eurasia", "Cría entre 1,000 y 3,000m", "Aquí: 5,100m"] },
  { name: "bird-himalayan-snowcock",     altitude: "4876.8m",  key: "bird-himalayan-snowcock",     label: "Perdigallo himalayo (Himalayan snowcock)", facts: ["Habita praderas alpinas del Himalaya", "Rango típico: 4,000–5,000m", "Aquí: 4,876.8m"] },
  { name: "bird-andean-flamingo",        altitude: "4500.72m", key: "bird-andean-flamingo",        label: "Flamenco andino",             facts: ["Habita lagunas salinas del altiplano andino", "Rango típico: 2,300–4,500m", "Aquí: 4,500.72m"] },
  { name: "bird-mountain-hawk-eagle",    altitude: "4000m",    key: "bird-mountain-hawk-eagle",    label: "Águila-azor montañesa (Mountain hawk-eagle)", facts: ["Rapaz de bosques montanos de Asia", "Rango típico: hasta ≈4,000m", "Aquí: 4,000m"] },
  { name: "bird-golden-eagle",           altitude: "3352.8m",  key: "bird-golden-eagle",           label: "Águila real (Golden eagle)",  facts: ["Una de las rapaces más extendidas del hemisferio norte", "Caza y planea hasta ≈3,500m", "Aquí: 3,352.8m"] },
  { name: "bird-white-cheeked-nuthatch", altitude: "3200m",    key: "bird-white-cheeked-nuthatch", label: "Trepador cariblanco (White-cheeked nuthatch)", facts: ["Bosques de coníferas del Himalaya occidental", "Rango típico: 1,800–3,350m", "Aquí: 3,200m"] },
  { name: "bird-bald-eagle",             altitude: "3000m",    key: "bird-bald-eagle",             label: "Águila calva (Bald eagle)",   facts: ["Rapaz de Norteamérica, símbolo de EE. UU.", "Planea en térmicas hasta ≈3,000m", "Aquí: 3,000m"] },
  { name: "bird-rufous-bellied-niltava", altitude: "2700m",    key: "bird-rufous-bellied-niltava", label: "Niltava ventrirrufa (Rufous-bellied niltava)", facts: ["Bosques húmedos del Himalaya", "Rango típico: 1,500–2,700m", "Aquí: 2,700m"] },
  { name: "bird-snowy-owl",              altitude: "2500m",    key: "bird-snowy-owl",              label: "Búho nival (Snowy owl)",      facts: ["Ave de la tundra ártica", "Migra a campo abierto en invierno", "Aquí: 2,500m"] },
  { name: "bird-pigeon",                 altitude: "1828m",    key: "bird-pigeon",                 label: "Paloma bravía (Rock pigeon)", facts: ["Origen: acantilados; hoy, ciudades de todo el mundo", "Vuelo típico bajo, hasta cientos de metros", "Aquí: 1,828m"] },
];

/* Info panel opened by hovering the i-chip. Same pure-CSS mechanism as the
   mountain tooltip (.illustration-data:hover .illustration-info) — chip and
   panel share the hover region, so moving into the panel keeps it open. */
function makeIllustrationInfo({ name, label, facts, key }) {
  const items = (facts ?? []).map((t) => `<li>${t}</li>`).join("\n                ");
  return `<div class="illustration-info" data-key="${key}">
              <div class="illustration-info-title">${label ?? name}</div>
              <ul>
                ${items}
              </ul>
            </div>`;
}

/* Build one illustration (sprite + i-tooltip). Dependency-free so Storybook
   stories can call it directly. */
function makeIllustration(item) {
  const { name, altitude, key } = item;
  return `
        <!-- ${altitude} -->
        <div class="illustration-container ${name}-container">
          <div class="illustration-data">
            <div class="tab-arrow-illustration"></div>
            <i class="fa-solid fa-info-illustration" data-illustration-key="${key}"></i>
            ${makeIllustrationInfo(item)}
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

/* Dual-mode: globals for the site's classic <script>, explicit attach for ES
   module imports (Storybook/Vite). Only boot when the site container exists. */
globalThis.makeIllustration = makeIllustration;
globalThis.makeIllustrationInfo = makeIllustrationInfo;
globalThis.illustrations_data = illustrations_data;
if (document.querySelector(".illustrations")) renderIllustrations();
