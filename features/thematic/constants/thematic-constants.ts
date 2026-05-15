import { TABLES } from "@/lib/constants/tables";

export type ThematicProgramType = "biofloc_thematic" | "minapadi_thematic";

export interface ThematicMetadata {
  programType: ThematicProgramType;
  proposalTable: string;
  programTable: string;
  docType: string;
  basePath: string;
  label: string;
  groupLabel: string;
}

/**
 * Konfigurasi statis untuk program tematik.
 * Memusatkan semua metadata tabel dan label agar mudah dikelola.
 */
export const THEMATIC_CONFIG: Record<ThematicProgramType, ThematicMetadata> = {
  biofloc_thematic: {
    programType: "biofloc_thematic",
    proposalTable: TABLES.PROPOSAL_BIOFLOC_THEMATIC_PROGRAMS,
    programTable: TABLES.BIOFLOC_THEMATIC_PROGRAMS,
    docType: "proposal_biofloc_thematic",
    basePath: "/biofloc-thematic",
    label: "Bioflok",
    groupLabel: "Nama KDMP",
  },
  minapadi_thematic: {
    programType: "minapadi_thematic",
    proposalTable: TABLES.PROPOSAL_MINAPADI_THEMATIC_PROGRAMS,
    programTable: TABLES.MINAPADI_THEMATIC_PROGRAMS,
    docType: "proposal_minapadi_thematic",
    basePath: "/minapadi-thematic",
    label: "Minapadi",
    groupLabel: "Nama Pokdaka",
  },
};

/**
 * Helper untuk menentukan metadata tematik berdasarkan scope (dari session) atau string tipe.
 * Ini menangani pemetaan dari scope 'biofloc'/'minapadi' ke config '_thematic'.
 */
export function resolveThematicMetadata(
  scopeOrType?: string | null,
): ThematicMetadata {
  const isMinapadi = scopeOrType?.toLowerCase().includes("minapadi");
  const type: ThematicProgramType = isMinapadi
    ? "minapadi_thematic"
    : "biofloc_thematic";

  return THEMATIC_CONFIG[type];
}
