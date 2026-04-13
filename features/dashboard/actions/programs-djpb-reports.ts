"use server";

import { createClient } from "@/utils/supabase";

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
  const supabase = createClient();
  const { data, error } = await supabase
    .from<"programs_djpb_reports", ProgramsDjpbReports>("programs_djpb_reports")
    .select("*");
  if (error) {
    throw error;
  }
  return data;
}
