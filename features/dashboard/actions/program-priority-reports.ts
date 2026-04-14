"use server";

import { createClient } from "@/utils/supabase";
import { ProgramPriorityFormValues } from "../forms/program-priority-schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface ProgramPriorityReports {
  id: string;
  available_location_id: number; // Foreign Key to available_locations table
  name: string;
  provider_type: string;
  percentage_of_work: number;
  status: string;
  constraints: string;
  follow_up: string;
  documentations: {
    id: string;
    image_before_path: string;
    image_after_path: string;
    created_at: string;
    updated_at: string;
  }[];
  created_at: string;
}

export type ProgramPriorityReportIndex = Pick<
  ProgramPriorityReports,
  | "id"
  | "available_location_id"
  | "name"
  | "percentage_of_work"
  | "created_at"
  | "status"
> & {
  available_locations: {
    name: string;
  };
};

export async function getProgramPriorityReports() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("program_priority_reports")
    .select(
      `
      id,
      available_location_id,
      name,
      percentage_of_work,
      status,
      created_at,
      available_locations (
        name
      )
      `
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data as unknown as ProgramPriorityReportIndex[];
}

export async function createProgramPriorityReports(
  data: ProgramPriorityFormValues
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("program_priority_reports")
    .insert(data);

  if (error) {
    console.error("Error creating program priority report:", error);
    return;
  }

  revalidatePath("/dashboard/program-priority-report");
  redirect("/dashboard/program-priority-report");
}
