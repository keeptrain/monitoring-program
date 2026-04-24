export type IslandGroup =
  | "Sumatera"
  | "Jawa"
  | "Kalimantan"
  | "Sulawesi"
  | "Bali & Nusa Tenggara"
  | "Maluku"
  | "Papua";

export type IndonesiaProvince = {
  region_id: string;
  name: string;
  island: IslandGroup;
};

export const INDONESIA_PROVINCES: IndonesiaProvince[] = [
  // Sumatera
  { region_id: "11", name: "Aceh", island: "Sumatera" },
  { region_id: "12", name: "Sumatera Utara", island: "Sumatera" },
  { region_id: "13", name: "Sumatera Barat", island: "Sumatera" },
  { region_id: "14", name: "Riau", island: "Sumatera" },
  { region_id: "15", name: "Jambi", island: "Sumatera" },
  { region_id: "16", name: "Sumatera Selatan", island: "Sumatera" },
  { region_id: "17", name: "Bengkulu", island: "Sumatera" },
  { region_id: "18", name: "Lampung", island: "Sumatera" },
  { region_id: "19", name: "Kepulauan Bangka Belitung", island: "Sumatera" },
  { region_id: "21", name: "Kepulauan Riau", island: "Sumatera" },

  // Jawa
  { region_id: "31", name: "DKI Jakarta", island: "Jawa" },
  { region_id: "32", name: "Jawa Barat", island: "Jawa" },
  { region_id: "33", name: "Jawa Tengah", island: "Jawa" },
  { region_id: "34", name: "DI Yogyakarta", island: "Jawa" },
  { region_id: "35", name: "Jawa Timur", island: "Jawa" },
  { region_id: "36", name: "Banten", island: "Jawa" },

  // Bali & Nusa Tenggara
  { region_id: "51", name: "Bali", island: "Bali & Nusa Tenggara" },
  {
    region_id: "52",
    name: "Nusa Tenggara Barat",
    island: "Bali & Nusa Tenggara",
  },
  {
    region_id: "53",
    name: "Nusa Tenggara Timur",
    island: "Bali & Nusa Tenggara",
  },

  // Kalimantan
  { region_id: "61", name: "Kalimantan Barat", island: "Kalimantan" },
  { region_id: "62", name: "Kalimantan Tengah", island: "Kalimantan" },
  { region_id: "63", name: "Kalimantan Selatan", island: "Kalimantan" },
  { region_id: "64", name: "Kalimantan Timur", island: "Kalimantan" },
  { region_id: "65", name: "Kalimantan Utara", island: "Kalimantan" },

  // Sulawesi
  { region_id: "71", name: "Sulawesi Utara", island: "Sulawesi" },
  { region_id: "72", name: "Sulawesi Tengah", island: "Sulawesi" },
  { region_id: "73", name: "Sulawesi Selatan", island: "Sulawesi" },
  { region_id: "74", name: "Sulawesi Tenggara", island: "Sulawesi" },
  { region_id: "75", name: "Gorontalo", island: "Sulawesi" },
  { region_id: "76", name: "Sulawesi Barat", island: "Sulawesi" },

  // Maluku
  { region_id: "81", name: "Maluku", island: "Maluku" },
  { region_id: "82", name: "Maluku Utara", island: "Maluku" },

  // Papua
  { region_id: "91", name: "Papua", island: "Papua" },
  { region_id: "92", name: "Papua Barat", island: "Papua" },
  { region_id: "93", name: "Papua Selatan", island: "Papua" },
  { region_id: "94", name: "Papua Tengah", island: "Papua" },
  { region_id: "95", name: "Papua Pegunungan", island: "Papua" },
  { region_id: "96", name: "Papua Barat Daya", island: "Papua" },
];

/** All unique island groups in display order */
export const ISLAND_GROUPS: IslandGroup[] = [
  "Sumatera",
  "Jawa",
  "Bali & Nusa Tenggara",
  "Kalimantan",
  "Sulawesi",
  "Maluku",
  "Papua",
];

/** Provinces grouped by island for select/dropdown components */
export const PROVINCES_BY_ISLAND = ISLAND_GROUPS.map((island) => ({
  island,
  provinces: INDONESIA_PROVINCES.filter((p) => p.island === island),
}));
