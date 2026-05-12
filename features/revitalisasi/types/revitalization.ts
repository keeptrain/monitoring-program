export interface RevitalizationProgramLog {
  id: string;
  area_id: number;
  name: string;
  progress_percent: number;
  progress_date: string;
  reporting_week: string;
  status: string;
  provider_name: string;
  production: string;
  intervention: string;
  total_worker: number;
  total_production_value: number;
  limit_point_measurement: string;
  limit_pal: number;
  outcome: string;
  constraints: string;
  follow_up: string;
  design_path: string | null;
  created_at: string;
  updated_at: string;
}

export type RevitalizationProgramLogListItem = Pick<
  RevitalizationProgramLog,
  "id" | "name" | "status" | "progress_date" | "progress_percent" | "updated_at"
>;

export interface RevitalizationProgramLogsByAreaResult {
  data: RevitalizationProgramLogListItem[];
  areaId: number;
}

export interface RevitalizationAreaSummary {
  area_id: number;
  name: string;
  progress_percent: number;
  updated_at: string | null;
}
