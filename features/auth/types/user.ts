export type UserRole = "admin" | "officer" | "leader" | "viewer" | "pmo";

export type ProgramScope =
  | "biofloc"
  | "minapadi"
  | "isf"
  | "revitalization"
  | "all"
  | "none";

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
  role: UserRole;
  program_scope: ProgramScope;
}
