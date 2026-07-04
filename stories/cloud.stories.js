/* Cloud component stories. Skin comes from css/components/cloud.css (imported
   globally in .storybook/preview.js); the factory from js/components/cloud.js.
   On the canvas a cloud's box comes from `padding: 400px 800px` in the media
   files (layout css, excluded here), so stories size the stage explicitly. */

import "../js/components/cloud.js";

const makeCloud = globalThis.makeCloud;

/* Give the cloud the box the media-file padding would give it on-site. */
function stage(el, { width = 800, height = 500 } = {}) {
  const wrap = document.createElement("div");
  wrap.style.cssText = `position: relative; width: ${width}px; height: ${height}px;`;
  el.style.width = `${width}px`;
  el.style.height = `${height}px`;
  wrap.appendChild(el);
  return wrap;
}

export default {
  title: "Design System/Cloud",
  argTypes: {
    n: { control: { type: "range", min: 0, max: 50, step: 1 }, description: "cloud-N skin variant" },
    brightness: { control: { type: "range", min: 0, max: 2, step: 0.1 } },
    opacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    flip: { control: "boolean", description: "mirror horizontally (scaleX(-1))" },
  },
};

/* One cloud, every knob. */
export const Single = {
  args: { n: 13, brightness: 1, opacity: 1, flip: false },
  render: ({ n, brightness, opacity, flip }) => {
    const cloud = makeCloud({ n });
    cloud.style.filter = `brightness(${brightness})`;
    cloud.style.opacity = String(opacity);
    if (flip) cloud.style.transform = "scaleX(-1)";
    return stage(cloud);
  },
};

/* The distinct skin variants side by side (one per unique background). */
export const Variants = {
  render: () => {
    const grid = document.createElement("div");
    grid.style.cssText =
      "display: grid; grid-template-columns: repeat(3, 420px); gap: 8px;";
    // Representative cloud-N per distinct background-image in cloud.css.
    for (const n of [0, 6, 9, 11, 12, 13, 21, 22, 23, 28, 29, 32, 33, 36, 37]) {
      const cell = document.createElement("div");
      cell.style.cssText = "position: relative; height: 260px; overflow: hidden;";
      const label = document.createElement("small");
      label.textContent = `cloud-${n}`;
      label.style.cssText = "font-family: monospace; position: absolute; z-index: 999;";
      const cloud = makeCloud({ n });
      cloud.style.cssText += "width: 420px; height: 260px;";
      cell.append(label, cloud);
      grid.appendChild(cell);
    }
    return grid;
  },
};

/* Drift-motion demo: same translate3d transform the site engine
   (js/cloudsParallax-script.js) writes, at a demo-friendly speed. The real
   engine is covered end-to-end by tests/cloud-drift.spec.ts. */
export const DriftDemo = {
  render: () => {
    const wrap = stage(makeCloud({ n: 13 }), { width: 900, height: 400 });
    wrap.style.overflow = "hidden";
    const cloud = wrap.firstChild;
    let x = -900, last = 0, raf;
    const frame = (now) => {
      const dt = last ? (now - last) / 1000 : 0;
      last = now;
      x += 60 * dt; // demo speed; site speed is 8–22 px/s keyed by z-index depth
      if (x > 900) x = -900; // wrap-around, as on the site
      cloud.style.transform = `translate3d(${x}px, 0, 0)`;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return wrap;
  },
};
