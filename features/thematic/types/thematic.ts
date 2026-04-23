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
