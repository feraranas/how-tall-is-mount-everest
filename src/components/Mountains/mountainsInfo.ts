import { mountainConfig } from "./Mountains";

// Every value is taken from the Wikipedia article named in the trailing comment (fetched 2026-10-21).
// null = the source gives no value; the UI shows "unknown". "difficulty" holds the infobox "Easiest route".
export const mountains: mountainConfig[] = [
    { id: "mountain-1", name: "mount-everest", altitude: 8848.86, location: "Nepal / China (Tibet)", prominence: 8848.86, range: "Mahalangur Himal, Himalayas", firstAscent: 1953, difficulty: null }, // en:Mount_Everest; prominence: en:List_of_mountain_peaks_by_prominence
    { id: "mountain-2", name: "k2", altitude: 8611, location: "Pakistan-administered Kashmir / China", prominence: 4020, range: "Karakoram", firstAscent: 1954, difficulty: "Abruzzi Spur" }, // en:K2
    { id: "mountain-3", name: "kangchenjunga", altitude: 8586, location: "Nepal / Sikkim, India", prominence: 3922, range: "Himalayas", firstAscent: 1955, difficulty: "glacier/snow/ice climb" }, // en:Kangchenjunga
    { id: "mountain-4", name: "lhotse", altitude: 8516, location: "Nepal / China (Tibet)", prominence: 610, range: "Mahalangur Himal, Himalayas", firstAscent: 1956, difficulty: "glacier/snow/ice climb" }, // en:Lhotse
    { id: "mountain-5", name: "makalu", altitude: 8485, location: "Nepal / China (Tibet)", prominence: 2386, range: "Mahalangur Himalayas", firstAscent: 1955, difficulty: "snow/ice climb" }, // en:Makalu (elevation from article lead)
    { id: "mountain-6", name: "aconcagua", altitude: 6967.16, location: "Argentina", prominence: 6967.16, range: "Principal Cordillera, Andes", firstAscent: 1897, difficulty: "Scramble (Northwest)" }, // en:Aconcagua
    { id: "mountain-7", name: "ojos-del-salado", altitude: 6893, location: "Argentina / Chile", prominence: 3688, range: "Andes", firstAscent: 1937, difficulty: "Scramble" }, // en:Ojos_del_Salado
    { id: "mountain-8", name: "monte-pissis", altitude: 6792, location: "La Rioja and Catamarca, Argentina", prominence: 2145, range: "Andes", firstAscent: 1937, difficulty: "Hike, east side" }, // en:Monte_Pissis
    { id: "mountain-9", name: "huascaran", altitude: 6768, location: "Yungay, Peru", prominence: 2776, range: "Cordillera Blanca, Andes", firstAscent: 1932, difficulty: "glacier/snow/ice climb" }, // en:Huascarán (Huascarán Sur first ascent 20 July 1932)
    { id: "mountain-10", name: "cerro-bonete", altitude: 6759, location: "La Rioja, Argentina", prominence: 1480, range: "Andes", firstAscent: null, difficulty: null }, // en:Cerro_Bonete
    { id: "mountain-11", name: "tres-cruces", altitude: 6748, location: "Argentina / Chile", prominence: 1424, range: "Andes", firstAscent: null, difficulty: null }, // en:Nevado_Tres_Cruces (location/range from article lead)
    { id: "mountain-12", name: "denali", altitude: 6190, location: "Alaska, US", prominence: 6144, range: "Alaska Range", firstAscent: 1913, difficulty: "West Buttress Route (glacier/snow climb)" }, // en:Denali (20,310 ft / 6,190 m; prominence 20,156 ft / 6,144 m as rendered)
    { id: "mountain-13", name: "kilimanjaro", altitude: 5895, location: "Kilimanjaro Region, Tanzania", prominence: 5895, range: "Eastern Rift mountains", firstAscent: 1889, difficulty: null }, // en:Mount_Kilimanjaro
    { id: "mountain-14", name: "pico-de-orizaba", altitude: 5636, location: "Veracruz, Mexico", prominence: 4922, range: null, firstAscent: 1848, difficulty: "moderate snow/ice climb" }, // en:Pico_de_Orizaba
    { id: "mountain-15", name: "mount-elbrus", altitude: 5642, location: "Russia", prominence: 4741, range: "Lateral Range, Caucasus Mountains", firstAscent: 1874, difficulty: "Basic snow/ice climb" }, // en:Mount_Elbrus (West summit 1874)
    { id: "mountain-16", name: "popocatepetl", altitude: 5393, location: "Mexico, Puebla and Morelos, Mexico", prominence: 3020, range: null, firstAscent: null, difficulty: "rock/snow climb" }, // en:Popocatépetl
    { id: "mountain-17", name: "mount-foraker", altitude: 5300, location: "Alaska, US", prominence: 2210, range: "Alaska Range", firstAscent: 1934, difficulty: "basic snow/ice" }, // en:Mount_Foraker (17,400 ft / 5,300 m as rendered)
    { id: "mountain-18", name: "iztaccihuatl", altitude: 5230, location: "México and Puebla, Mexico", prominence: 1530, range: null, firstAscent: 1889, difficulty: "rock/snow climb" }, // en:Iztaccihuatl
    { id: "mountain-19", name: "dykh-tau", altitude: 5205, location: "Kabardino-Balkaria, Russia", prominence: 2002, range: "Lateral Range, Caucasus Mountains", firstAscent: null, difficulty: null }, // en:Dykh-Tau
    { id: "mountain-20", name: "nevado-de-toluca", altitude: 4680, location: "Texcaltitlán, México, Mexico", prominence: 2210, range: null, firstAscent: null, difficulty: "road, hiking trail" }, // en:Nevado_de_Toluca
    { id: "mountain-21", name: "teyotl", altitude: 4660, location: "Puebla, Mexico", prominence: null, range: "Eje Neovolcánico", firstAscent: null, difficulty: null }, // es:Pico_Teyotl (infobox Altitud 4660; lead says 4600)
    { id: "mountain-22", name: "la-malinche", altitude: 4461, location: "Tlaxcala / Puebla, Mexico", prominence: 1920, range: "Cordillera Anahuac", firstAscent: null, difficulty: "hiking trail" }, // en:Malinche_(volcano)
    { id: "mountain-23", name: "cofre-de-perote", altitude: 4220, location: "Veracruz, Mexico", prominence: 1340, range: null, firstAscent: null, difficulty: "rock climb" }, // en:Cofre_de_Perote
    { id: "mountain-24", name: "cerro-negro", altitude: null, location: "Tlaxiaco, Oaxaca, Mexico", prominence: null, range: null, firstAscent: null, difficulty: null }, // es:Geografía_de_Oaxaca (names Cerro Negro among Tlaxiaco's main peaks; no elevation given)
    { id: "mountain-25", name: "nevado-de-colima", altitude: 4260, location: "Jalisco, Mexico", prominence: null, range: "Eje Neovolcánico", firstAscent: null, difficulty: null }, // es:Nevado_de_Colima
];
