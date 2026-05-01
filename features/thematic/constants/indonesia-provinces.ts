export type IslandGroup =
  | "Sumatera"
  | "Jawa"
  | "Kalimantan"
  | "Sulawesi"
  | "Bali & Nusa Tenggara"
  | "Maluku"
  | "Papua";

export type IndonesiaProvince = {
  province_id: string;
  name: string;
  island: IslandGroup;
};

export const INDONESIA_PROVINCES: IndonesiaProvince[] = [
  // Sumatera
  { province_id: "11", name: "Aceh", island: "Sumatera" },
  { province_id: "12", name: "Sumatera Utara", island: "Sumatera" },
  { province_id: "13", name: "Sumatera Barat", island: "Sumatera" },
  { province_id: "14", name: "Riau", island: "Sumatera" },
  { province_id: "15", name: "Jambi", island: "Sumatera" },
  { province_id: "16", name: "Sumatera Selatan", island: "Sumatera" },
  { province_id: "17", name: "Bengkulu", island: "Sumatera" },
  { province_id: "18", name: "Lampung", island: "Sumatera" },
  { province_id: "19", name: "Kepulauan Bangka Belitung", island: "Sumatera" },
  { province_id: "21", name: "Kepulauan Riau", island: "Sumatera" },

  // Jawa
  { province_id: "31", name: "DKI Jakarta", island: "Jawa" },
  { province_id: "32", name: "Jawa Barat", island: "Jawa" },
  { province_id: "33", name: "Jawa Tengah", island: "Jawa" },
  { province_id: "34", name: "DI Yogyakarta", island: "Jawa" },
  { province_id: "35", name: "Jawa Timur", island: "Jawa" },
  { province_id: "36", name: "Banten", island: "Jawa" },

  // Bali & Nusa Tenggara
  { province_id: "51", name: "Bali", island: "Bali & Nusa Tenggara" },
  {
    province_id: "52",
    name: "Nusa Tenggara Barat",
    island: "Bali & Nusa Tenggara",
  },
  {
    province_id: "53",
    name: "Nusa Tenggara Timur",
    island: "Bali & Nusa Tenggara",
  },

  // Kalimantan
  { province_id: "61", name: "Kalimantan Barat", island: "Kalimantan" },
  { province_id: "62", name: "Kalimantan Tengah", island: "Kalimantan" },
  { province_id: "63", name: "Kalimantan Selatan", island: "Kalimantan" },
  { province_id: "64", name: "Kalimantan Timur", island: "Kalimantan" },
  { province_id: "65", name: "Kalimantan Utara", island: "Kalimantan" },

  // Sulawesi
  { province_id: "71", name: "Sulawesi Utara", island: "Sulawesi" },
  { province_id: "72", name: "Sulawesi Tengah", island: "Sulawesi" },
  { province_id: "73", name: "Sulawesi Selatan", island: "Sulawesi" },
  { province_id: "74", name: "Sulawesi Tenggara", island: "Sulawesi" },
  { province_id: "75", name: "Gorontalo", island: "Sulawesi" },
  { province_id: "76", name: "Sulawesi Barat", island: "Sulawesi" },

  // Maluku
  { province_id: "81", name: "Maluku", island: "Maluku" },
  { province_id: "82", name: "Maluku Utara", island: "Maluku" },

  // Papua
  { province_id: "91", name: "Papua", island: "Papua" },
  { province_id: "92", name: "Papua Barat", island: "Papua" },
  { province_id: "93", name: "Papua Selatan", island: "Papua" },
  { province_id: "94", name: "Papua Tengah", island: "Papua" },
  { province_id: "95", name: "Papua Pegunungan", island: "Papua" },
  { province_id: "96", name: "Papua Barat Daya", island: "Papua" },
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
