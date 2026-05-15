import { TABLES } from "@/lib/constants/tables";

export type ThematicProgramType = "biofloc_thematic" | "minapadi_thematic";

export interface ThematicMetadata {
  programType: ThematicProgramType;
  proposalTable: string;
  programTable: string;
  docType: string;
  basePath: string;
  label: string;
}

/**
 * Resolves thematic program metadata based on program scope or type string
 */
export function resolveThematicMetadata(
  scopeOrType?: string | null,
): ThematicMetadata {
  const isMinapadi = scopeOrType?.includes("minapadi");

  if (isMinapadi) {
    return {
      programType: "minapadi_thematic",
      proposalTable: TABLES.PROPOSAL_MINAPADI_THEMATIC_PROGRAMS,
      programTable: TABLES.MINAPADI_THEMATIC_PROGRAMS,
      docType: "proposal_minapadi_thematic",
      basePath: "/minapadi-thematic",
      label: "Minapadi",
    };
  }

  return {
    programType: "biofloc_thematic",
    proposalTable: TABLES.PROPOSAL_BIOFLOC_THEMATIC_PROGRAMS,
    programTable: TABLES.BIOFLOC_THEMATIC_PROGRAMS,
    docType: "proposal_biofloc_thematic",
    basePath: "/biofloc-thematic",
    label: "Bioflok",
  };
}
