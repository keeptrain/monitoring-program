export const ThematicProgramStatus: Record<string, string> = {
  potential: "Potensial",
  active: "Aktif",
  inactive: "Tidak Aktif",
};

export type ThematicProgramStatusType =
  (typeof ThematicProgramStatus)[keyof typeof ThematicProgramStatus];

export type BioflocScope = "internal" | "public";

export interface ThematicPrograms {
  id: string; // UUID
  entity_id: number;
  location_id: number;
  proposal_id: string | null;
  status: string;
  progress_percent: number;
  commodity_aid: string;
  commodity_potential: string | null;
  land_area: string;
  production_value: string;
  distribution_amount: number;
  sppg_partner: string;
  address: string;
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
  name: string;
  kusuka_number: string;
  nib: string;
  legal_entity_number: string;
  chairman_name: string;
  chairman_phone: string;
  companion_name: string;
  companion_phone: string;
  total_management: number;
  total_members: number;
  location_name: string;
  latitude: number;
  longitude: number;
  province_code: string;
  regency_code: string;
  district_code: string;
  village_code: string;
  available_locations: {
    name: string;
    latitude: number;
    longitude: number;
    province_id?: string | null;
    regency_id?: string | null;
    province_code?: string;
    province_name?: string;
    regency_code?: string;
    district_code?: string;
    village_code?: string;
  };
  proposal_biofloc_thematic_programs: {
    land_slope: number | null;
  } | null;
  kdmp_entities: {
    name: string;
    kusuka_number: string;
    nib: string | null;
    legal_entity_number: string | null;
    chairman_name: string | null;
    chairman_phone: string | null;
    member_count: number;
    board_member_count: number;
  };
};

export type ThematicProgramIndex = Pick<
  ThematicPrograms,
  | "id"
  | "entity_id"
  | "location_id"
  | "commodity_aid"
  | "progress_percent"
  | "created_at"
  | "updated_at"
> & {
  available_locations: {
    name: string;
  };
  kdmp_entities: {
    name: string;
    kusuka_number: string;
  };
};

export interface BioflocProgramListItem {
  id: string; // UUID
  status: string;
  entity_name: string;
  location_name: string;
  commodity_aid: string;
  progress_percent: number;
  distribution_amount: number;
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
