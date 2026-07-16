/* ///////////////////////////////////////////////// */
/* /////// MOUNTAIN TITLE + INFO TOOLTIP /////////// */
/* ///////////////////////////////////////////////// */
/* Markup factories for the mountain composite (design-system components).   */
/* Skin lives in css/components/mountain-title.css and                       */
/* css/components/info-tooltip.css; the .data-container canvas anchor in     */
/* css/layout/mountain-placement.css. Consumed by js/mountainsData-script.js */
/* (which must load AFTER this file) and, later, by Storybook stories.       */

/* Title block: name + height with the dashed underline. */
function makeMountainTitle(m) {
  return `<div class="mountain ${m.slug}-title">
            <div class="mountain-title">${m.title}</div>
            <div class="mountain-height">${m.height}</div>
          </div>`;
}

/* Info tooltip: the black "i" chip that opens the data panel on hover
   (pure CSS :hover — no JS wiring). */
function makeInfoPanel(m) {
  const lines = [
    `Ubicación: ${m.location}`,
    `Altura: ${m.altitude}`,
    `Prominencia: ${m.prominence}`,
  ];
  if (m.range != null) lines.push(`Mountain range: ${m.range}`);
  lines.push(`Año de primer ascenso: ${m.firstAscent}`);
  lines.push(`Dificultad: ${m.difficulty}`);
  const items = lines.map((t) => `<li>${t}</li>`).join("\n                ");

  return `<div class="mountain-data ${m.slug}-data">
            <div class="tab-arrow"></div>
            <i class="fa-solid fa-info" data-mountain-key="${m.n}" tabindex="0"
               aria-label="Información de ${m.title}" aria-describedby="mountain-info-${m.n}"></i>
            <div class="mountain-info" data-key="${m.n}" id="mountain-info-${m.n}" role="tooltip">
              <ul>
                ${items}
              </ul>
              <div class="bottom-row"></div>
            </div>
          </div>`;
}

/* Dual-mode: globals for the site's classic <script>, explicit attach for ES
   module imports (Storybook/Vite). */
globalThis.makeMountainTitle = makeMountainTitle;
globalThis.makeInfoPanel = makeInfoPanel;
