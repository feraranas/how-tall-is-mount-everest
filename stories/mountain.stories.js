/* Mountain title + info tooltip stories. Markup from js/components/mountain.js
   (the same factories the site renders with); skin from
   css/components/mountain-title.css and css/components/info-tooltip.css. */

import "../js/components/mountain.js";

const makeMountainTitle = globalThis.makeMountainTitle;
const makeInfoPanel = globalThis.makeInfoPanel;

/* Sample rows lifted from js/mountainsData-script.js. */
const SAMPLES = {
  "mount-everest": { n: 1, slug: "mount-everest", title: "MOUNT EVEREST 🇨🇳", height: "8,849m", location: "China 🇨🇳", altitude: "8,849m", prominence: "8,848m", firstAscent: "1953", difficulty: "Extremo" },
  "k2 (with range)": { n: 2, slug: "k2", title: "K2 🇵🇰🇨🇳", height: "8,611m", location: "Pakistan 🇵🇰 & China 🇨🇳", altitude: "8,611m", prominence: "4,020m", range: "Karakoram", firstAscent: "1954", difficulty: "Extremo" },
  "popocatepetl (long name)": { n: 24, slug: "popocatepetl", title: "VOLCAN POPOCATEPETL 🇲🇽", height: "5,393m", location: "Puebla, México 🇲🇽", altitude: "5,393m", prominence: "3,020m", firstAscent: "[Pendiente]", difficulty: "Básico Intermedio" },
  "half-dome (pendiente fields)": { n: 41, slug: "half-dome", title: "HALF DOME 🇺🇸", height: "2,696m", location: "North America 🇲🇺🇸", altitude: "2,696m", prominence: "[Pendiente]", firstAscent: "[Pendiente]", difficulty: "Muy fácil" },
};

function host(html, { width = 500, height = 300 } = {}) {
  const el = document.createElement("div");
  // Recreate the .data-container structure the site provides (its canvas
  // anchoring lives in layout css, excluded from stories by design).
  el.style.cssText = `position: relative; display: grid; grid-template-rows: 145px 75px; width: ${width}px; height: ${height}px;`;
  el.innerHTML = html;
  return el;
}

export default {
  title: "Design System/Mountain",
  argTypes: {
    sample: { control: "select", options: Object.keys(SAMPLES) },
  },
  args: { sample: "mount-everest" },
};

/* Name + dashed underline + height. */
export const Title = {
  render: ({ sample }) => host(makeMountainTitle(SAMPLES[sample])),
};

/* The black "i" chip; hover it to open the data panel (pure CSS :hover,
   exactly as on the site — no JS wiring). */
export const InfoTooltip = {
  render: ({ sample }) => {
    const el = host(makeInfoPanel(SAMPLES[sample]), { height: 420 });
    const hint = document.createElement("small");
    hint.textContent = "hover the chip ⓘ to open the panel";
    hint.style.cssText = "font-family: monospace; display: block;";
    el.prepend(hint);
    return el;
  },
};

/* The full composite as rendered per peak on the site. */
export const TitleWithTooltip = {
  render: ({ sample }) => {
    const m = SAMPLES[sample];
    return host(`${makeMountainTitle(m)}\n${makeInfoPanel(m)}`, { height: 420 });
  },
};
