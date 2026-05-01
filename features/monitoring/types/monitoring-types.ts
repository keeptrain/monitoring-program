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

export type PublicMonitoringIsf = {
  data: (IsfDetailSheet | null)[];
  overall_progress: number;
  overall_summary: Record<number, number>;
  total_workers: number;
};

export type IsfChartPoint = {
  name: string;
  date: string;
  [key: string]: string | number | null;
};
