/* Design-tokens reference page, rendered as a plain HTML story (MDX docs and
   html-vite don't mix cleanly in Storybook 10; this keeps the vanilla ethos). */

export default {
  title: "Design System/Tokens",
};

const table = (rows, header) => `
  <table style="border-collapse: collapse; margin: 8px 0 24px;">
    <thead><tr>${header.map((h) => `<th style="text-align:left; border-bottom: 2px solid #333; padding: 4px 16px 4px 0;">${h}</th>`).join("")}</tr></thead>
    <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td style="border-bottom: 1px solid #ddd; padding: 4px 16px 4px 0;">${c}</td>`).join("")}</tr>`).join("")}</tbody>
  </table>`;

export const Tokens = () => {
  const el = document.createElement("div");
  el.style.cssText = "font-family: 'Playfair Display', serif; max-width: 760px; font-size: 1.6rem;";
  el.innerHTML = `
    <h1>Design tokens</h1>
    <p>The site is one 50,000px absolutely-positioned canvas — vanilla
    HTML/CSS/JS, no framework, no production build step.</p>

    <h2>CSS custom properties</h2>
    ${table(
      [
        ["<code>--page-height</code>", "<code>50000px</code>", "injected at boot by <code>js/scene.js</code>"],
        ["<code>--half-page-height</code>", "<code>25000px</code>", "injected at boot by <code>js/scene.js</code>"],
        ["<code>:root font-size</code>", "<code>10px</code>", "<code>css/main-styles.css</code> (1rem = 10px)"],
      ],
      ["Token", "Value", "Source"]
    )}

    <h2>Typography</h2>
    ${table(
      [
        ["Titles, mountain labels, tooltips", "<code>'Playfair Display', serif</code>"],
        ["Metronome digits / code accents", "<code>'Source Code Pro'</code>"],
        ["Misc", "<code>'Oswald'</code>"],
      ],
      ["Use", "Stack"]
    )}
    <p>Mountain titles render at <code>2.5rem</code> (25px); tooltip body at
    <code>1.5rem</code>.</p>

    <h2>z-index bands</h2>
    ${table(
      [
        ["Backgrounds / grids", "0–3", "body gradient, <code>.main-container::before/::after</code>"],
        ["Mountain SVGs", "8–11", "per-slug rules in <code>css/main-styles.css</code>"],
        ["Clouds", "7–150", "<b>doubles as drift depth</b>: engine scales speed by z/maxZ"],
        ["UI / icons / metronome", "150–200", "<code>.metronomo-wrapper</code> at 200"],
      ],
      ["Band", "Range", "Notes"]
    )}

    <h2>Breakpoints (six media stylesheets, placement only)</h2>
    ${table(
      [
        ["<code>css/media-0-390.css</code>", "≤ 390px"],
        ["<code>css/media-391-428.css</code>", "391–428px"],
        ["<code>css/media-429-768.css</code>", "429–768px"],
        ["<code>css/media-769-1440.css</code>", "769–1440px"],
        ["<code>css/media-1441-1950.css</code>", "1441–1950px"],
        ["<code>css/media-1950.css</code>", "> 1950px"],
      ],
      ["File", "Range"]
    )}
    <p>Component skin lives in <code>css/components/*</code>; canvas anchoring
    in <code>css/layout/*</code>.</p>

    <h2>Altitude gradient</h2>
    <p>The background gradient (see the Backgrounds toolbar swatches) walks
    from summit white (0px) through bone white, the night band
    (~21,000–27,500px, where the stars twinkle), Popocatépetl lava red
    (~28,200px), charcoal, baby blue, and sky blue at ground level (50,000px).</p>`;
  return el;
};
