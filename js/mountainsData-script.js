/* ///////////////////////////////////////////////// */
/* ////////////// DATA-DRIVEN MOUNTAINS //////////// */
/* ///////////////////////////////////////////////// */
/* Single source of truth for mountain CONTENT.        */
/* The DOM for every peak is generated from this array  */
/* into #mountains-root. Layout (top / left / size /    */
/* z-index / background-image) stays in CSS, keyed by   */
/* the `slug` class (.mountain-svg.<slug>-svg, etc.),   */
/* so adding a peak = drop the SVG + add one data row + */
/* add the bespoke CSS positioning rule(s).             */
/*                                                      */
/* `n` preserves the original source order/identity     */
/* (note the 18 -> 20 -> 19 ordering quirk and that     */
/* many rows past #25 have no SVG asset yet — WIP).     */

const mountains = [
  { n: 1,  slug: "mount-everest",   title: "MOUNT EVEREST 🇨🇳",        height: "8,849m", location: "China 🇨🇳", altitude: "8,849m", prominence: "8,848m", firstAscent: "1953", difficulty: "Extremo" },
  { n: 2,  slug: "k2",              title: "K2 🇵🇰🇨🇳",                height: "8,611m", location: "Pakistan 🇵🇰 & China 🇨🇳", altitude: "8,611m", prominence: "4,020m", range: "Karakoram", firstAscent: "1954", difficulty: "Extremo" },
  { n: 3,  slug: "kangchenjunga",   title: "KANGCHENJUNGA 🇳🇵🇮🇳",      height: "8,586m", location: "Nepal 🇳🇵& India 🇮🇳", altitude: "8,586m", prominence: "3,922m", range: "Himalayas", firstAscent: "[Pendiente]", difficulty: "Básico Intermedio" },
  { n: 4,  slug: "lhotse",          title: "LHOTSE 🇳🇵",               height: "8,516m", location: "Nepal 🇳🇵", altitude: "8,516m", prominence: "610m", range: "Himalayas, Mahalangur Himal", firstAscent: "1956", difficulty: "Extremo" },
  { n: 5,  slug: "makalu",          title: "MAKALU 🇳🇵",               height: "8,481m", location: "Nepal 🇳🇵", altitude: "8,481m", prominence: "2,386m", range: "Himalayas, Mahalangur Hima", firstAscent: "1955", difficulty: "Extremo" },
  { n: 6,  slug: "nanga-parbat",    title: "NANGA PARBAT",            height: "8,126m", location: "Gilgit–Baltistan, Pakistan", altitude: "8,126m", prominence: "4,608m", range: "Himalayas, Western Himalayas", firstAscent: "", difficulty: "Extremo" },
  { n: 7,  slug: "annapurna-ii",    title: "ANNAPURNA II 🇳🇵",         height: "7,937m", location: "Nepal 🇳🇵", altitude: "7,937m", prominence: "2,437m", range: "Himalayas", firstAscent: "1960", difficulty: "Extremo" },
  { n: 8,  slug: "chogolisa",       title: "CHOGOLISA",               height: "7,665m", location: "Gilgit–Baltistan, Pakistan ", altitude: "7,665m", prominence: "", range: "Karakoram, Masherbrum Range", firstAscent: "", difficulty: "Avanzado" },
  { n: 9,  slug: "kangkar-punzum",  title: "KANGKAR PÜNZUM",          height: "7,570m", location: "Bhutan–China border ", altitude: "7,570m", prominence: "", range: "Pamir Mountains in Central Asia, 'Roof of the World'", firstAscent: "", difficulty: "Avanzado" },
  { n: 10, slug: "ismoil-somoni",   title: "ISMOIL SOMONI 🇹🇯",        height: "7,495m", location: "Tajikistan 🇹🇯 ", altitude: "7,495m", prominence: "", range: "Pamir Mountains in Central Asia, 'Roof of the World'", firstAscent: "", difficulty: "Avanzado" },
  { n: 11, slug: "lenin-peak",      title: "LENIN PEAK ",             height: "7,134m", location: "Kyrgyzstan–Tajikistan border ", altitude: "7,134m", prominence: "", range: "Pamir Mountains in Central Asia 'Roof of the World'", firstAscent: "", difficulty: "Avanzado" },
  { n: 12, slug: "acaconcagua",     title: "ACACONCAGUA 🇦🇷",          height: "6,961m", location: "Mendoza Province, Argentina 🇦🇷", altitude: "6,961m", prominence: "6,962m", range: "Andes, Cordillera Principal", firstAscent: "1897", difficulty: "Avanzado" },
  { n: 13, slug: "ojos-salado",     title: "OJOS DEL SALADO 🇨🇱🇦🇷",    height: "6,893m", location: "Cordillera de los Andes [Chile 🇨🇱, Argentina 🇦🇷]", altitude: "6,893m", prominence: "3,688m", firstAscent: "1937", difficulty: "Avanzado" },
  { n: 14, slug: "monte-pissis",    title: "MONTE PISSIS 🇦🇷",         height: "6,792m", location: "La Rioja y Catamarca, Argentina 🇦🇷", altitude: "6,792m", prominence: "2,145m", range: "Andes", firstAscent: "1937", difficulty: "Avanzado" },
  { n: 15, slug: "huascaran",       title: "HUASCARAN 🇵🇪",            height: "6,768m", location: "Yungay, Peru 🇵🇪", altitude: "6,768m", prominence: "2,776m", firstAscent: "1932", difficulty: "Avanzado" },
  { n: 16, slug: "cerro-bonete",    title: "CERRO BONETE 🇦🇷",         height: "6,759m", location: "La Rioja, Argentina, 🇦🇷", altitude: "6,759m", prominence: "1,459m", firstAscent: "[Pendiente]", difficulty: "Avanzado" },
  { n: 17, slug: "tres-cruces",     title: "TRES CRUCES 🇨🇱🇦🇷",        height: "6,748m", location: "Cordillera de los Andes [Chile 🇨🇱, Argentina 🇦🇷] ", altitude: "6,748m", prominence: "1422 m", firstAscent: "[Pendiente]", difficulty: "Avanzado" },
  { n: 18, slug: "illimani",        title: "ILLLIMANI 🇧🇴",            height: "6,438m", location: "Bolivia 🇧🇴", altitude: "6,438m", prominence: "", range: "Cordillera Real, Andes Bolivia", firstAscent: "", difficulty: "Difícil" },
  { n: 20, slug: "mount-denali",    title: "MOUNT DENALI 🇺🇸",         height: "6,190m", location: "Denali, USA 🇺🇸 ", altitude: "6,190m", prominence: "6,144m", range: "Alaska Range, American Cordillera, North American Cordillera", firstAscent: "1913", difficulty: "Difícil" },
  { n: 19, slug: "rasac",           title: "RASAC ",                  height: "6,017m", location: "Perú 🇺🇸 ", altitude: "6,017m", prominence: "", range: "Cordillera Huayhuash, Peruvian Andes", firstAscent: "", difficulty: "Difícil" },
  { n: 21, slug: "kilimanjaro",     title: "KILIMANJARO 🇹🇿",          height: "5,895m", location: "United Republic of Tanzania 🇹🇿", altitude: "5,895m", prominence: "5,885m", range: "Eastern Rift mountains", firstAscent: "1889", difficulty: "Avanzado" },
  { n: 22, slug: "pico-orizaba",    title: "PICO DE ORIZABA 🇲🇽",      height: "5,636m", location: "México ", altitude: "5,636m", prominence: "4,922m", firstAscent: "1848", difficulty: "Intermedio" },
  { n: 23, slug: "mount-elbrus",    title: "MOUNT ELBRUS 🇷🇺",         height: "5,642m", location: "Russia 🇷🇺", altitude: "5,642m", prominence: "4,741m", range: "Caucasus Mountains", firstAscent: "[Pendiente]", difficulty: "Intermedio" },
  { n: 24, slug: "popocatepetl",    title: "VOLCAN POPOCATEPETL 🇲🇽",  height: "5,393m", location: "Puebla, México 🇲🇽", altitude: "5,393m", prominence: "3,020m", firstAscent: "[Pendiente]", difficulty: "Básico Intermedio" },
  { n: 25, slug: "mount-fraker",    title: "MOUNT FRAKER 🇺🇸",         height: "5,304m", location: "Alaska, USA 🇺🇸 ", altitude: "5,304m", prominence: "2,209m", firstAscent: "[Pendiente]", difficulty: "Básico Intermedio" },
  { n: 26, slug: "iztlaccihuatl",   title: "IZTLACCIHUATL 🇲🇽",        height: "5,230m", location: "México 🇲🇽", altitude: "5,230m", prominence: "1,560m", firstAscent: "[Pendiente]", difficulty: "Básico Intermedio" },
  { n: 27, slug: "dykh-tau",        title: "DYKH TAU 🇷🇺",             height: "5,205m", location: "Russia 🇷🇺", altitude: "5,205m", prominence: "2,002m", firstAscent: "Básico Intermedio", difficulty: "Fácil" },
  { n: 28, slug: "alam-kuh",        title: "ALAM KUH 🇮🇷",             height: "4,850m", location: "IRAN 🇮🇷", altitude: "4,850m", prominence: "--- ", firstAscent: "[Pendiente]", difficulty: "Fácil" },
  { n: 29, slug: "nevado-toluca",   title: "NEVADO DE TOLUCA 🇲🇽",     height: "4,680m", location: "México 🇲🇽", altitude: "4,680m", prominence: "2,210m", firstAscent: "[Pendiente]", difficulty: "Fácil" },
  { n: 30, slug: "teyotl",          title: "PICO TEYOTL 🇲🇽",          height: "4,660m", location: "México 🇲🇽", altitude: "4,660m", prominence: "[Pendiente]", firstAscent: "[Pendiente]", difficulty: "Fácil" },
  { n: 31, slug: "volcan-malintzin",title: "VOLCAN LA MALINCHE 🇲🇽",   height: "4,461m", location: "México 🇲🇽", altitude: "4,461m", prominence: "[Pendiente]", firstAscent: "[Pendiente]", difficulty: "Fácil" },
  { n: 32, slug: "cofre-perote",    title: "COFRE DE PEROTE 🇲🇽",      height: "4,282m", location: "México 🇲🇽", altitude: "4,282m", prominence: "[Pendiente]", firstAscent: "[Pendiente]", difficulty: "Fácil" },
  { n: 33, slug: "jbel-toubkal",    title: "JBEL TOUBKAL 🇲🇦",         height: "4,167m", location: "Morocco 🇲🇦", altitude: "4,167m", prominence: "[Pendiente]", firstAscent: "[Pendiente]", difficulty: "Fácil" },
  { n: 34, slug: "tochal",          title: "TOCHAL 🇮🇷",               height: "3,963m", location: "IRAN 🇮🇷", altitude: "3,963m", prominence: "[Pendiente]", firstAscent: "[Pendiente]", difficulty: "Fácil" },
  { n: 35, slug: "cerro-nube-oax",  title: "CERRO NUBE OAXACA 🇲🇽",    height: "3,720m", location: "México 🇲🇽", altitude: "3,720m", prominence: "[Pendiente]", firstAscent: "[Pendiente]", difficulty: "Fácil" },
  { n: 36, slug: "mafadi",          title: "MAFADI 🇿🇦",               height: "3,446m", location: "South Africa ", altitude: "3,446m", prominence: "[Pendiente]", firstAscent: "[Pendiente]", difficulty: "Fácil" },
  { n: 37, slug: "cerro-mohonira",  title: "CERRO MOHONIRA",          height: "3,300m", location: "México", altitude: "3,300m", prominence: "873m", firstAscent: "[Pendiente]", difficulty: "Fácil" },
  { n: 38, slug: "mount-sefton",    title: "MOUNT SEFTON 🇳🇿",         height: "3,151m", location: "New Zealand 🇳🇿", altitude: "3,151m", prominence: "[Pendiente]", firstAscent: "[Pendiente]", difficulty: "Fácil" },
  { n: 39, slug: "cathedral-peak",  title: "CATHEDRAL PEAK 🇿🇦",       height: "3,004m", location: "South Africa ", altitude: "3,004m", prominence: "[Pendiente]", firstAscent: "[Pendiente]", difficulty: "Fácil" },
  { n: 40, slug: "nevado-colima",   title: "NEVADO DE COLIMA 🇲🇽",     height: "2,720m", location: "México 🇲🇽", altitude: "2,720m", prominence: "[Pendiente]", firstAscent: "[Pendiente]", difficulty: "Muy fácil" },
  { n: 41, slug: "half-dome",       title: "HALF DOME 🇺🇸",            height: "2,696m", location: "North America 🇲🇺🇸", altitude: "2,696m", prominence: "[Pendiente]", firstAscent: "[Pendiente]", difficulty: "Muy fácil" },
];

/* ///////////////////////////////////////////////// */
/* ////////////////// DOM BUILDER ////////////////// */
/* ///////////////////////////////////////////////// */

function infoListItems(m) {
  const lines = [
    `Ubicación: ${m.location}`,
    `Altura: ${m.altitude}`,
    `Prominencia: ${m.prominence}`,
  ];
  if (m.range != null) lines.push(`Mountain range: ${m.range}`);
  lines.push(`Año de primer ascenso: ${m.firstAscent}`);
  lines.push(`Dificultad: ${m.difficulty}`);
  return lines.map((t) => `<li>${t}</li>`).join("\n                ");
}

function mountainMarkup(m) {
  return `
      <!-- MOUNTAIN ${m.n} - ${m.slug} -->
      <div class="mountain-${m.n}">
        <div class="data-container m-${m.n}">
          <div class="mountain ${m.slug}-title">
            <div class="mountain-title">${m.title}</div>
            <div class="mountain-height">${m.height}</div>
          </div>

          <div class="mountain-data ${m.slug}-data">
            <div class="tab-arrow"></div>
            <i class="fa-solid fa-info" data-mountain-key="${m.n}"></i>
            <div class="mountain-info" data-key="${m.n}">
              <ul>
                ${infoListItems(m)}
              </ul>
              <div class="bottom-row"></div>
            </div>
          </div>
        </div>

        <div class="mountain-svg ${m.slug}-svg"></div>
      </div>`;
}

function renderMountains() {
  const root = document.getElementById("mountains-root");
  if (!root) {
    throw new Error("#mountains-root not found — cannot render mountains");
  }
  root.innerHTML = mountains.map(mountainMarkup).join("\n");
}

/* ///////////////////////////////////////////////// */
/* /////////////////// BOOTSTRAP /////////////////// */
/* ///////////////////////////////////////////////// */

// The info panel is driven entirely by CSS (`.mountain-data:hover
// .mountain-info` in css/main-styles.css) — no JS hover wiring, so there is
// no stuck-panel race. Just generate the DOM.
renderMountains();
