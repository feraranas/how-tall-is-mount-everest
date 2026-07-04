/** Global decorators/parameters for the design-system catalog.
 *
 *  IMPORTANT: only COMPONENT css is imported here (css/components/*). Layout
 *  css (css/layout/*, css/media-*.css) positions things on the 50,000px
 *  canvas and must never leak into isolation rendering. */

import "./preview-globals.css";
import "../css/components/cloud.css";
import "../css/components/mountain-title.css";
import "../css/components/info-tooltip.css";
import "../css/components/illustration.css";

/* Altitude-band swatches from the canvas gradient in css/main-styles.css, so
   components can be previewed against the sky they actually sit on. */
const altitudeBackgrounds = {
  "summit white": "#ffffff",
  "off white": "rgb(250, 249, 246)",
  "bone white": "rgb(249, 246, 238)",
  night: "rgb(0, 0, 0)",
  licorice: "rgb(27, 18, 18)",
  purplish: "rgb(48, 25, 52)",
  lava: "rgb(123, 24, 24)",
  charcoal: "rgb(54, 69, 79)",
  "baby blue": "rgb(137, 207, 240)",
  "sky blue": "rgb(175, 231, 254)",
};

/** @type {import('@storybook/html-vite').Preview} */
export default {
  parameters: {
    backgrounds: {
      options: Object.fromEntries(
        Object.entries(altitudeBackgrounds).map(([name, value]) => [
          name,
          { name, value },
        ])
      ),
    },
    viewport: {
      options: {
        // Mirror the six css/media-*.css breakpoints.
        "phone-small (≤390)": { name: "phone-small (≤390)", styles: { width: "390px", height: "844px" } },
        "phone (391–428)": { name: "phone (391–428)", styles: { width: "428px", height: "926px" } },
        "tablet (429–768)": { name: "tablet (429–768)", styles: { width: "768px", height: "1024px" } },
        "laptop (769–1440)": { name: "laptop (769–1440)", styles: { width: "1280px", height: "800px" } },
        "desktop (1441–1950)": { name: "desktop (1441–1950)", styles: { width: "1680px", height: "1050px" } },
        "wide (>1950)": { name: "wide (>1950)", styles: { width: "2200px", height: "1200px" } },
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: "sky blue" },
  },
};
