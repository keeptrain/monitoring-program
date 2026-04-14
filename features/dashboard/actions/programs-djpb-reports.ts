"use server";

import { createClient } from "@/utils/supabase";
import { ProgramPriorityFormValues } from "../forms/program-priority-schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface ProgramsDjpbReports {
  id: string;
  location_id: number; // Foreign Key to available_locations table
  name: string;
  status: string;
  constraint: string;
  follow_up: string;
  description: string;
  documentations: {
    id: string;
    image_before_path: string;
    image_after_path: string;
    created_at: string;
    updated_at: string;
  }[];
  created_at: string;
  updated_at: string;
}

export async function getProgramsDjpbReports() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from<"programs_djpb_reports", ProgramsDjpbReports>("programs_djpb_reports")
    .select("*");
  if (error) {
    throw error;
  }
  return data;
}

export async function createProgramsDjpbReports(
  data: ProgramPriorityFormValues
) {
  const supabase = await createClient();
  const { error } = await supabase.from("programs_djpb_reports").insert(data);

  if (error) {
    console.error("Error creating program priority report:", error);
    return;
  }

  revalidatePath("/dashboard/program-priority-report");
  redirect("/dashboard/program-priority-report");
}
