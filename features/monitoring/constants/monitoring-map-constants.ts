export const INDONESIA_CENTER: [number, number] = [-1.2, 118] as const;
export const INDONESIA_BOUNDS: [[number, number], [number, number]] = [
  [-11.5, 94.5],
  [6.5, 141.5],
] as const;

export const typeMap: Record<string, "biofloc_thematic" | "minapadi_thematic"> =
  {
    "/biofloc-thematic": "biofloc_thematic",
    "/minapadi-thematic": "minapadi_thematic",
  };
