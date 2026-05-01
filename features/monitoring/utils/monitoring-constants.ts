export const LINE_SERIES: Array<{
  key: `z${1 | 2 | 3 | 4 | 5 | 6 | 7}`;
  color: string;
  dash: string;
  dotRadius: number;
}> = [
  { key: "z1", color: "#3b82f6", dash: "0", dotRadius: 4 },
  { key: "z2", color: "#10b981", dash: "0", dotRadius: 4 },
  { key: "z3", color: "#f59e0b", dash: "0", dotRadius: 4 },
  { key: "z4", color: "#f43f5e", dash: "0", dotRadius: 4 },
  { key: "z5", color: "#8b5cf6", dash: "0", dotRadius: 4 },
  { key: "z6", color: "#06b6d4", dash: "0", dotRadius: 4 },
  { key: "z7", color: "#14b8a6", dash: "0", dotRadius: 4 },
];

export const PIN_LOCATIONS: Record<number, { x: string; y: string }> = {
  1: { x: "80.12%", y: "43.20%" },
  2: { x: "71.88%", y: "61.50%" },
  3: { x: "56.16%", y: "83.20%" },
  4: { x: "43.06%", y: "57.18%" },
  5: { x: "22.14%", y: "35.88%" },
  6: { x: "45.75%", y: "15.82%" },
  7: { x: "31.60%", y: "29.40%" },
};
