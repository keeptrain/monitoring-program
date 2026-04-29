"use server";

import { createClient } from "@/utils/supabase";

export async function getIsfAvailableDatesByMonth(
  zoneId: number,
  year: number,
  month: number,
) {
  const supabase = await createClient();

  // Create start and end date for the target month
  // month is 1-indexed for logic locally, but Date constructor uses 0-indexed.
  // Wait, if month parameter is 1-12:
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0); // Last day of the month

  const { data, error } = await supabase
    .from("isf_program_logs")
    .select("id, progress_date")
    .eq("step_id", zoneId)
    .gte("progress_date", startDate.toLocaleDateString("en-CA")) // YYYY-MM-DD
    .lte("progress_date", endDate.toLocaleDateString("en-CA"));

  if (error) {
    console.error("Error fetching available dates:", error);
    throw error;
  }

  return data;
}

export async function getIsfReportByDate(zoneId: number, date: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("isf_program_logs")
    .select("*")
    .eq("step_id", zoneId)
    .eq("progress_date", date)
    .single();

  if (error) {
    console.error("Error fetching report by date:", error);
    throw error;
  }
  return data;
}
