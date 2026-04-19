"use server";

import { STEPS } from "@/features/isf/constants/isf-step";
import { createClient } from "@/utils/supabase";
import { LocationType } from "@/features/dashboard/actions/available-locations";
import { getPublicThematicProgram } from "@/features/thematic/actions/public-thematic-programs";

import {
  MonitoringDetailTypeMap,
  PublicMonitoringIsf,
} from "../types/monitoring-types";

export async function getPublicLocationDetail<T extends LocationType>(
  type: T,
  id: number,
): Promise<MonitoringDetailTypeMap[T] | null> {
  if (!Number.isFinite(id) || id === 0) {
    return null;
  }

  if (type === "biofloc_thematic") {
    return (await getPublicThematicProgram(id)) as
      | MonitoringDetailTypeMap[T]
      | null;
  }

  // Placeholder for ISF
  if (type === "isf") {
    // return getPublicIsfProgram(id);
    return null;
  }

  return null;
}

export async function getPublicMonitoringIsf(): Promise<PublicMonitoringIsf> {
  const supabase = await createClient();
  const stepIds = STEPS.map((step) => step.id);

  // Get all latest data from each step_id
  const { data, error } = await supabase
    .from("latest_isf_logs")
    .select("*")
    .in("step_id", stepIds);

  if (error) {
    console.error("Error fetching ISF monitoring data:", error);
    throw error;
  }

  // Because .in() takes ALL rows, we filter in memory MacBook/Vercel
  // to get the latest from each step_id
  const latestRows = stepIds.map(
    (id) => data.find((row) => row.step_id === id) || null,
  );

  const overallProgress = +(
    latestRows.reduce((acc, row) => acc + (row?.progress_percent || 0), 0) /
    latestRows.length
  ).toFixed(1);

  const overallSummary = latestRows.reduce(
    (acc, row, index) => {
      acc[index + 1] = row?.progress_percent || 0;
      return acc;
    },
    {} as Record<number, number>,
  );

  return {
    data: latestRows,
    overall_progress: overallProgress,
    overall_summary: overallSummary,
  };
}
