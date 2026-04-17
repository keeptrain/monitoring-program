export interface IsfProgramLog {
  id: number;
  step_id: number;
  progress_percent: number;
  progress_date: string;
  name: string;
  status: string;
  provider_name: string;
  production: string;
  intervention: string;
  total_worker: number;
  outcome: string;
  constraints: string;
  follow_up: string;
  created_at: string;
  updated_at: string;
}

export type IsfProgramLogListItem = Pick<
  IsfProgramLog,
  | "id"
  | "name"
  | "status"
  | "progress_date"
  | "progress_percent"
  | "created_at"
  | "updated_at"
>;

export interface IsfStepSummary {
  step_id: number;
  name: string;
  progress_percent: number;
  updated_at: string | null;
}
