export interface MapIslandRegion {
  code: string;
  name: string;
  coordinates: [number, number][];
}

/**
 * Province Polygons
 * Used for hover interactions and regional data aggregation.
 */
export const PROVINCE_REGIONS: MapIslandRegion[] = [
  {
    code: "36",
    name: "Banten",
    coordinates: [
      [105.1, -5.9],
      [106.8, -5.9],
      [106.8, -7.2],
      [105.1, -7.2],
      [105.1, -5.9],
    ],
  },
  {
    code: "32",
    name: "Jawa Barat",
    coordinates: [
      [106.37, -5.92],
      [108.85, -6.35],
      [108.85, -7.82],
      [106.37, -7.82],
      [106.37, -5.92],
    ],
  },
  {
    code: "33",
    name: "Jawa Tengah",
    coordinates: [
      [108.55, -6.35],
      [111.68, -6.58],
      [111.68, -8.22],
      [108.85, -8.22],
      [108.55, -6.35],
    ],
  },
  {
    code: "34",
    name: "DI Yogyakarta",
    coordinates: [
      [110.0, -7.5],
      [110.85, -7.5],
      [110.85, -8.25],
      [110.0, -8.25],
      [110.0, -7.5],
    ],
  },
  {
    code: "35",
    name: "Jawa Timur",
    coordinates: [
      [110.89, -6.7],
      [114.77, -7.0],
      [114.77, -9.0],
      [110.89, -9.0],
      [110.89, -6.7],
    ],
  },
  {
    code: "51",
    name: "Bali",
    coordinates: [
      [114.4, -8.0],
      [115.8, -8.0],
      [115.8, -9.0],
      [114.4, -9.0],
      [114.4, -8.0],
    ],
  },
  {
    code: "52",
    name: "Nusa Tenggara Barat",
    coordinates: [
      [115.8, -8.0],
      [119.3, -8.0],
      [119.3, -9.1],
      [115.8, -9.1],
      [115.8, -8.0],
    ],
  },
];
