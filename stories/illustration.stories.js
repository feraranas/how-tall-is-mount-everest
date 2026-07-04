/* Illustration stories: planes, helicopters, drones, air balloon, birds —
   each with its i-tooltip chip. Markup from js/components/illustration.js;
   skin from css/components/illustration.css. */

import "../js/components/illustration.js";

const makeIllustration = globalThis.makeIllustration;
const illustrations_data = globalThis.illustrations_data;

function host(html) {
  const el = document.createElement("div");
  // .illustration-container is position:absolute on-site (layout css);
  // provide a relative stage so it renders in place here.
  el.style.cssText = "position: relative; width: 150px; height: 170px;";
  el.innerHTML = html;
  const container = el.querySelector(".illustration-container");
  if (container) container.style.position = "relative";
  return el;
}

export default {
  title: "Design System/Illustration",
  argTypes: {
    name: { control: "select", options: illustrations_data.map((i) => i.name) },
  },
};

export const Single = {
  args: { name: "bird-golden-eagle" },
  render: ({ name }) => {
    const item = illustrations_data.find((i) => i.name === name);
    return host(makeIllustration(item));
  },
};

/* Every illustration at its altitude, high to low. */
export const All = {
  render: () => {
    const grid = document.createElement("div");
    grid.style.cssText =
      "display: grid; grid-template-columns: repeat(6, 150px); gap: 12px; font-family: monospace;";
    for (const item of illustrations_data) {
      const cell = document.createElement("div");
      const label = document.createElement("small");
      label.textContent = `${item.name} (${item.altitude})`;
      cell.append(host(makeIllustration(item)), label);
      grid.appendChild(cell);
    }
    return grid;
  },
};
