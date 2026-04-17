"use server";

import { createClient } from "@/utils/supabase";
import { ProgramPriorityFormValues } from "../forms/program-priority-schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface ProgramPriorityReports {
  id: number;
  available_location_id: number; // Foreign Key to available_locations table
  name: string;
  provider_type: string;
  percentage_of_work: number;
  status: string;
  constraints: string;
  follow_up: string;
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

export type ProgramPriorityReportDetail = ProgramPriorityReports & {
  available_locations: {
    name: string;
  };
};

export type ProgramPriorityReportIndex = Pick<
  ProgramPriorityReports,
  | "id"
  | "available_location_id"
  | "name"
  | "status"
  | "percentage_of_work"
  | "created_at"
  | "updated_at"
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
      updated_at,
      available_locations (
        name
      )
      `,
    )
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data as unknown as ProgramPriorityReportIndex[];
}

export async function getProgramPriorityReportById(id: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("program_priority_reports")
    .select(
      `
      *,
      available_locations (
        name
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function createProgramPriorityReports(
  data: ProgramPriorityFormValues,
) {
  const now = new Date().toISOString();
  const documentations = normalizeDocumentations(data.documentations);

  const supabase = await createClient();
  const { error } = await supabase.from("program_priority_reports").insert({
    ...data,
    documentations,
    created_at: now,
    updated_at: now,
  });

  if (error) {
    console.error("Error creating program priority report:", error);
    return;
  }

  revalidatePath("/dashboard/program-priority-report");
  redirect("/dashboard/program-priority-report");
}

export async function updateProgramPriorityReports(
  id: number,
  data: ProgramPriorityFormValues,
) {
  const documentations = normalizeDocumentations(data.documentations);

  const supabase = await createClient();
  const { error } = await supabase
    .from("program_priority_reports")
    .update({
      ...data,
      documentations,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating program priority report:", error);
    return;
  }

  revalidatePath("/dashboard/program-priority-report");
  revalidatePath(`/dashboard/program-priority-report/${id}`);
  revalidatePath(`/dashboard/program-priority-report/form/${id}`);
  redirect("/dashboard/program-priority-report");
}

function normalizeDocumentations(
  data: ProgramPriorityFormValues["documentations"],
) {
  const now = new Date().toISOString();
  return data.map((doc) => ({
    id: crypto.randomUUID(),
    image_before_path: doc.image_before_path ?? "",
    image_after_path: doc.image_after_path ?? "",
    created_at: now,
    updated_at: now,
  }));
}
