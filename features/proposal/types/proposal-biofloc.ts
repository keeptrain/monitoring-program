export type ProposalBioflocStatus =
  | "pending"
  | "approved"
  | "converted"
  | "rejected"
  | "revision";

export type ProposalBioflocThematicProgram = {
  id: string; // UUID
  status: ProposalBioflocStatus;
  entity_id: number;
  location_id: number;
  proposal_path: string;
  created_at: string;
  updated_at: string;
  land_slope: number | null;
  has_land_preparation_letter: boolean;
  proposed_commodity: string | null;
  has_experienced_member: boolean;
  commodity_potentials: string[];
  other_commodity_potential: string | null;
  fiscal_year: number;
  rejection_reason?: string | null;
  admin_notes?: string | null;
  kdmp_entities: {
    name: string;
    kusuka_number: string;
    nib?: string | null;
    legal_entity_number?: string | null;
    chairman_name?: string | null;
    chairman_phone?: string | null;
    board_member_count?: number;
    member_count?: number;
  };
};

export type ProposalBioflocDetail = ProposalBioflocThematicProgram & {
  available_locations: {
    latitude: number;
    longitude: number;
    province_code?: string | null;
    province_name?: string | null;
  } | null;
};

export type ProposalBioflocPaginationParams = {
  page: number;
  pageSize: number;
  search?: string;
  province?: string;
};

export type PaginatedProposalBioflocResult = {
  data: ProposalBioflocThematicProgram[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type ProposalBioflocProvinceSummary = {
  proposal_total: number;
  proposal_count_by_province: Record<string, number>;
};
