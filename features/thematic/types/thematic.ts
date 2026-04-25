export type ProposalBioflocStatus = "pending" | "approved" | "rejected";

export type BioflocScope = "internal" | "public";

export interface ThematicPrograms {
  id: number;
  location_id: number;
  name: string;
  progress_percent: number;
  commodity: string;
  land_area: string;
  production: string;
  total_admin: number;
  distribution_amount: number;
  sppg_partner: string;
  s_curve_path: string;
  documentations: {
    id: string;
    image_before_path: string | null;
    image_after_path: string | null;
    created_at: string;
    updated_at: string;
  }[];
  created_at: string;
  updated_at: string;
}

export type ThematicProgramDetail = ThematicPrograms & {
  available_locations: {
    name: string;
    latitude: number;
    longitude: number;
  };
};

export type ThematicProgramIndex = Pick<
  ThematicPrograms,
  | "id"
  | "location_id"
  | "name"
  | "commodity"
  | "progress_percent"
  | "created_at"
  | "updated_at"
> & {
  available_locations: {
    name: string;
  };
};

export interface BioflocProgramListItem {
  id: number;
  name: string;
  location_name: string;
  commodity: string;
  progress_percent: number;
  distribution_amount: number;
  total_admin: number;
  created_at: string;
  updated_at: string;
  year: number;
  kusuka_number?: string;
}

export interface BioflocProgramsPaginatedResult {
  data: BioflocProgramListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
