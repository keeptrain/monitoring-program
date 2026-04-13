"use server";

import {
  programPrioritySchema,
  ProgramPriorityFormValues,
} from "@/features/dashboard/forms/program-priority-schema";
import { revalidatePath } from "next/cache";
import { createClient, uploadToPriorityBucket } from "@/utils/supabase";

export async function uploadImageAction(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file provided");
  }

  const path = await uploadToPriorityBucket(file);
  return path;
}

export async function createReport(data: ProgramPriorityFormValues) {
  // Validate data on server side
  const validatedFields = programPrioritySchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields provided",
      details: validatedFields.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("program_priority_reports").insert({
    available_location_id: data.available_location_id,
    name: data.name,
    provider_type: data.provider_type,
    percentage_of_work: data.percentage_of_work,
    status: data.status,
    constraints: data.constraints,
    follow_up: data.follow_up,
    documentations: data.documentations,
  });

  if (error) {
    console.error("Database error:", error);
    return { error: `Failed to create report: ${error.message}` };
  }

  revalidatePath("/dashboard/program-priority-report");
  return { success: true };
}
