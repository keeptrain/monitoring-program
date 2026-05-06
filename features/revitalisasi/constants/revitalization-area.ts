export const REVITALIZATION_AREAS = [
  { id: 1, name: "Kabupaten Bekasi", slug: "bekasi" },
  { id: 2, name: "Kabupaten Karawang", slug: "karawang" },
  { id: 3, name: "Kabupaten Subang", slug: "subang" },
  { id: 4, name: "Kabupaten Indramayu", slug: "indramayu" },
];

export const REVITALIZATION_AREA_COLORS: Record<number, string> = {
  1: "bg-blue-500",
  2: "bg-emerald-500",
  3: "bg-amber-500",
  4: "bg-rose-500",
} as const;

export const REVITALIZATION_AREA_HEX_COLORS: Record<number, string> = {
  1: "#3b82f6",
  2: "#10b981",
  3: "#f59e0b",
  4: "#f43f5e",
} as const;
