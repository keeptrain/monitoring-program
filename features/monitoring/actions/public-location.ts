"use server";

import { STEPS } from "@/features/isf/constants/isf-step";
import { createClient } from "@/utils/supabase";
import { TABLES } from "@/lib/constants/tables";
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

export async function getPublicBiofloc(id: number): Promise<{ data: any }> {
  const supabase = await createClient();

  // 1. Fetch program data with locations
  const { data: program, error: programError } = await supabase
    .from(TABLES.BIOFLOC_THEMATIC_PROGRAMS)
    .select(
      `
      *,
      available_locations (
        name,
        latitude,
        longitude
      )
    `,
    )
    .eq("id", id)
    .single();

  if (programError) {
    console.error("Error fetching biofloc data:", programError);
    throw programError;
  }

  // 2. Fetch documentations from the documentations table
  const { data: docs, error: docsError } = await supabase
    .from("documentations")
    .select("*")
    .eq("program_type", "biofloc_thematic")
    .eq("program_id", id);

  if (docsError) {
    console.error("Error fetching documentations:", docsError);
  }

  // 3. Group documentations by group_id
  interface DocGroup {
    id: string;
    image_before_path: string | null;
    image_after_path: string | null;
    created_at: string;
    updated_at: string;
  }
  const docGroups: Record<string, DocGroup> = {};
  (docs || []).forEach((d) => {
    if (!docGroups[d.group_id]) {
      docGroups[d.group_id] = {
        id: d.group_id,
        image_before_path: null,
        image_after_path: null,
        created_at: d.created_at,
        updated_at: d.updated_at,
      };
    }
    if (d.type === "before") {
      docGroups[d.group_id].image_before_path = d.path;
    } else {
      docGroups[d.group_id].image_after_path = d.path;
    }
  });

  return {
    data: {
      ...program,
      documentations: Object.values(docGroups),
    },
  };
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
      step_id: zoneNumber,
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
