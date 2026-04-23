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

  if (
    type === "biofloc_thematic" ||
    type === "minapadi_thematic" ||
    type === "revitalization"
  ) {
    const data = await getPublicThematicProgram(id);
    return data as MonitoringDetailTypeMap[T] | null;
  }

  // Placeholder for ISF
  if (type === "isf") {
    // return getPublicIsfProgram(id);
    return null;
  }

  return null;
}

type PublicBiofloc = {
  id: number;
  location_id: number;
  name: string;
  percentage_of_work: number;
  commodity: string;
  land_area: string;
  production: string;
  total_admin: number;
  distribution_amount: number;
  sppg_partner: string;
  s_curve_path: string;
  documentations: string;
  created_at: string;
  updated_at: string;
};

export async function getPublicBiofloc(id: number): Promise<any> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("thematic_programs")
    .select("*")
    .eq("id", id)
    .limit(1);

  if (error) {
    console.error("Error fetching biofloc data:", error);
    throw error;
  }

  return data || "";
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

  // Get cumulative workers from all historical rows
  const { data: allWorkersData } = await supabase
    .from("isf_program_logs")
    .select("total_worker");

  const totalWorkers =
    allWorkersData?.reduce((acc, row) => acc + (row.total_worker || 0), 0) || 0;

  return {
    data: latestRows,
    overall_progress: overallProgress,
    overall_summary: overallSummary,
    total_workers: totalWorkers,
  };
}

export async function getIsfPerMonthByZone(zoneNumber: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("isf_program_logs")
    .select(
      "id, progress_date, progress_percent, reporting_week, provider_name, production, intervention, total_worker, outcome, constraints, follow_up",
    )
    .eq("step_id", zoneNumber)
    .order("progress_date", { ascending: false });

  if (error) {
    console.error("Error fetching ISF per month by zone:", error);
    throw error;
  }

  const datas = data.map((row) => {
    return {
      id: row.id,
      progress_date: row.progress_date,
      reporting_week: row.reporting_week,
      progress_percent: row.progress_percent,
      provider_name: row.provider_name,
      production: row.production,
      intervention: row.intervention,
      total_worker: row.total_worker,
      outcome: row.outcome,
      constraints: row.constraints,
      follow_up: row.follow_up,
      month: new Date(row.reporting_week).getMonth() + 1,
    };
  });

  // Fungsi pembantu mencari semua hari Senin dalam sebulan
  const getAllMondaysInMonth = (monthNum: number) => {
    const year = new Date(
      data?.[0]?.reporting_week || new Date(),
    ).getFullYear();
    const mondays: string[] = [];
    const date = new Date(year, monthNum - 1, 1);

    while (date.getMonth() === monthNum - 1) {
      if (date.getDay() === 1) {
        // 1 = Senin
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        mondays.push(`${yyyy}-${mm}-${dd}`);
      }
      date.setDate(date.getDate() + 1);
    }
    return mondays;
  };

  const uniqueMonths = Array.from(new Set(datas.map((d) => d.month))).sort(
    (a, b) => a - b,
  );

  const availableMonths = uniqueMonths.map((m) => ({
    month: m,
    mondays: getAllMondaysInMonth(m),
  }));

  return {
    data: datas,
    available_months: availableMonths,
  };
}
