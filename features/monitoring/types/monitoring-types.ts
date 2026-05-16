import { PublicThematicProgram } from "@/features/thematic/actions/public-thematic-programs";

/**
 * Registry of return types for different location types.
 * This can be used for type safety across the monitoring feature.
 */
export type MonitoringDetailTypeMap = {
  biofloc_thematic: PublicThematicProgram;
  minapadi_thematic: PublicThematicProgram;
  isf: null; // Add PublicIsfProgram here when available
  revitalization: PublicThematicProgram;
};

export type IsfDetailSheet = {
  id: number;
  step_id: number;
  name: string;
  progress_percent: number;
  progress_date: string;
  total_worker: number;
  status: string;
  updated_at: string;
};

export type IsfDashboardLinePoint = {
  name: string;
  date: string;
  z1?: number | null;
  z2?: number | null;
  z3?: number | null;
  z4?: number | null;
  z5?: number | null;
  z6?: number | null;
  z7?: number | null;
};

export type MonitoringIsf = {
  data: (IsfDetailSheet | null)[];
  total_workers: number;
  latest_documentation_urls?: string[];
};

export type IsfStats = {
  overallProgress: number;
  summary: Record<number, number>;
  chartData: IsfChartPoint[];
};

export type IsfChartPoint = {
  name: string;
  date: string;
  [key: string]: string | number | null;
};

export type RevitalizationDetailSheet = {
  id: string;
  area_id: number;
  area_name: string;
  progress_percent: number;
  progress_date: string;
  total_worker: number;
  production: string;
  total_production_value: number;
  limit_point_measurement: string;
  limit_pal: number;
  design_path: string | null;
  status: string;
  updated_at: string;
};

export type MonitoringRevitalization = {
  data: (RevitalizationDetailSheet | null)[];
  total_workers: number;
  latest_documentation_urls?: string[];
};

export type ThematicProgram = {
  id: string;
  location_id: number;
  progress_percent: number;
  commodity_aid: string;
  commodity_potential: string | null;
  land_area: string;
  production_value: string;
  distribution_amount: number;
  sppg_partner: string;
  s_curve_path: string;
  updated_at: string;

  full_location?: string;

  kdmp_entities: {
    name: string;
    kusuka_number: string | null;
    nib: string | null;
    legal_entity_number: string | null;
    board_member_count: number | null;
    member_count: number | null;
  } | null;
  available_locations: {
    name: string | null;
    latitude: number | null;
    longitude: number | null;
    ref_provinces?: { name: string } | null;
    ref_regencies?: { name: string } | null;
    ref_districts?: { name: string } | null;
    ref_villages?: { name: string } | null;
  } | null;
};
