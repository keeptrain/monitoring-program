export interface MapIslandRegion {
  code: string;
  name: string;
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
}

/**
 * Simplified Province Polygons for Java Island
 * Used for hover interactions and regional data aggregation.
 */
export const JAVA_PROVINCE_REGIONS: MapIslandRegion[] = [
  {
    code: "36",
    name: "Banten",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [105.1, -5.9],
          [106.8, -5.9],
          [106.8, -7.2],
          [105.1, -7.2],
          [105.1, -5.9],
        ],
      ],
    },
  },
  {
    code: "32",
    name: "Jawa Barat",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [106.37, -5.92],
          [108.85, -6.35],
          [108.85, -7.82],
          [106.37, -7.82],
          [106.37, -5.92],
        ],
      ],
    },
  },
  {
    code: "33",
    name: "Jawa Tengah",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [108.55, -6.35],
          [111.68, -6.58],
          [111.68, -8.22],
          [108.85, -8.22],
          [108.55, -6.35],
        ],
      ],
    },
  },
  {
    code: "35",
    name: "Jawa Timur",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [110.89, -6.70],
          [114.77, -7.00],
          [114.77, -9.00],
          [110.89, -9.00],
          [110.89, -6.70],
        ],
      ],
    },
  },
];
