import { MountainConfig } from "./Mountains";

const svgUrls = import.meta.glob('../../assets/mountains/*.svg', {
    eager: true,
    query: '?url',
    import: 'default',
}) as Record<string, string>;

function resolveSvg(filename: string): string {
    const key = `../../assets/mountains/${filename}`;
    const url = svgUrls[key];
    if (!url) throw new Error(`Missing mountain SVG asset: ${filename}`);
    return url;
}

const mountainData: Omit<MountainConfig, 'src'>[] = [
    { asset: "1-MOUNT-EVEREST.svg", name: "Mount Everest", altitude: 8849, location: "Nepal–China Border", prominence: 8849, range: "Mahalangur Himal, Himalayas", firstAscent: 1953, difficulty: "hard" },
    { asset: "2-K2.svg", name: "K2", altitude: 8611, location: "Pakistan–China Border", prominence: 4017, range: "Karakoram", firstAscent: 1954, difficulty: "hard" },
    { asset: "3-KANCHENJUNGA.svg", name: "Kangchenjunga", altitude: 8586, location: "Nepal–India Border", prominence: 3922, range: "Kangchenjunga Himal, Himalayas", firstAscent: 1955, difficulty: "hard" },
    { asset: "4-LHOTSE.svg", name: "Lhotse", altitude: 8516, location: "Nepal–China Border", prominence: 610, range: "Mahalangur Himal, Himalayas", firstAscent: 1956, difficulty: "hard" },
    { asset: "5-MAKALU.svg", name: "Makalu", altitude: 8485, location: "Nepal–China Border", prominence: 2386, range: "Mahalangur Himal, Himalayas", firstAscent: 1955, difficulty: "hard" },
    { asset: "6-ACACONCAGUA.svg", name: "Aconcagua", altitude: 6961, location: "Argentina", prominence: 6961, range: "Andes", firstAscent: 1897, difficulty: "moderate" },
    { asset: "7-OJOS-DEL-SALADO.svg", name: "Ojos del Salado", altitude: 6893, location: "Chile–Argentina Border", prominence: 3247, range: "Andes", firstAscent: 1937, difficulty: "moderate" },
    { asset: "8-MONTE-PISSIS.svg", name: "Monte Pissis", altitude: 6793, location: "Argentina", prominence: 1972, range: "Andes", firstAscent: 1937, difficulty: "moderate" },
    { asset: "9-HUASCARAN.svg", name: "Huascarán", altitude: 6768, location: "Peru", prominence: 6768, range: "Andes", firstAscent: 1908, difficulty: "moderate" },
    { asset: "10-CERRO-BONETE.svg", name: "Cerro Bonete", altitude: 6759, location: "Argentina", prominence: 1691, range: "Andes", firstAscent: 1913, difficulty: "moderate" },
    { asset: "11-TRES-CRUCES.svg", name: "Tres Cruces", altitude: 6748, location: "Chile–Argentina Border", prominence: 1821, range: "Andes", firstAscent: 1937, difficulty: "moderate" },
    { asset: "12-MOUNT-DENALI.svg", name: "Denali", altitude: 6190, location: "Alaska, USA", prominence: 6190, range: "Alaska Range", firstAscent: 1913, difficulty: "hard" },
    { asset: "13-KILIMANJARO.svg", name: "Kilimanjaro", altitude: 5895, location: "Tanzania", prominence: 5895, range: "Eastern Rift mountains", firstAscent: 1889, difficulty: "moderate" },
    { asset: "14-PICO-ORIZABA.svg", name: "Pico de Orizaba", altitude: 5636, location: "Mexico", prominence: 5636, range: "Sierra Madre Oriental", firstAscent: 1848, difficulty: "moderate" },
    { asset: "15-MOUNT-ELBRUS.svg", name: "Mount Elbrus", altitude: 5642, location: "Russia", prominence: 5642, range: "Caucasus", firstAscent: 1874, difficulty: "moderate" },
    { asset: "16-POPOCATEPETL.svg", name: "Popocatépetl", altitude: 5426, location: "Mexico", prominence: 3020, range: "Trans-Mexican Volcanic Belt", firstAscent: 1519, difficulty: "moderate" },
    { asset: "17-MOUNT-FRAKER.svg", name: "Mount Foraker", altitude: 5304, location: "Alaska, USA", prominence: 1674, range: "Alaska Range", firstAscent: 1934, difficulty: "hard" },
    { asset: "18-IZTLACCIHUATL.svg", name: "Iztaccíhuatl", altitude: 5230, location: "Mexico", prominence: 1430, range: "Trans-Mexican Volcanic Belt", firstAscent: 1889, difficulty: "moderate" },
    { asset: "19-DYKH-TAU.svg", name: "Dykh-Tau", altitude: 5205, location: "Russia", prominence: 2002, range: "Caucasus", firstAscent: 1888, difficulty: "hard" },
    { asset: "20-NEVADO-TOLUCA.svg", name: "Nevado de Toluca", altitude: 4680, location: "Mexico", prominence: 2070, range: "Trans-Mexican Volcanic Belt", firstAscent: 1827, difficulty: "easy" },
    { asset: "21-TEYOTL.svg", name: "Teyotl", altitude: 4600, location: "Mexico", prominence: 500, range: "Trans-Mexican Volcanic Belt", firstAscent: 1900, difficulty: "easy" },
    { asset: "22-VOLCAN-MALINTZIN.svg", name: "Volcán Malintzin", altitude: 4462, location: "Mexico", prominence: 1482, range: "Trans-Mexican Volcanic Belt", firstAscent: 1519, difficulty: "easy" },
    { asset: "23-COFRE-DE-PEROTE.svg", name: "Cofre de Perote", altitude: 4282, location: "Mexico", prominence: 1982, range: "Sierra Madre Oriental", firstAscent: 1739, difficulty: "easy" },
    { asset: "24-CERRO-NEGRO-OAX.svg", name: "Cerro Negro", altitude: 3396, location: "Oaxaca, Mexico", prominence: 1196, range: "Sierra Madre del Sur", firstAscent: 1900, difficulty: "easy" },
    { asset: "25-NEVADO-DE-COLIMA.svg", name: "Nevado de Colima", altitude: 4339, location: "Mexico", prominence: 2009, range: "Trans-Mexican Volcanic Belt", firstAscent: 1875, difficulty: "easy" },
];

export const mountains: MountainConfig[] = mountainData.map((m) => ({
    ...m,
    src: resolveSvg(m.asset),
}));
