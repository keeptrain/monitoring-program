"use server";

import { REVITALIZATION_AREAS } from "@/features/revitalisasi/constants/revitalization-area";
import { createClient } from "@/utils/supabase";
import {
  MonitoringRevitalization,
  RevitalizationDetailSheet,
} from "../types/monitoring-types";

export async function getMonitoringRevitalization(): Promise<MonitoringRevitalization> {
  const supabase = await createClient();
  const areaIds = REVITALIZATION_AREAS.map((area) => area.id);

  const { data, error } = await supabase
    .from("latest_revitalization_logs")
    .select("*")
    .in("area_id", areaIds);

  if (error) {
    console.error("Error fetching revitalization monitoring data:", error);
    throw error;
  }

  const latestRows = areaIds.map(
    (id) => data.find((row) => row.area_id === id) || null,
  );

  const overallProgress = +(
    latestRows.reduce(
      (acc, row) => acc + (row?.progress_percent || 0),
      0,
    ) / latestRows.length
  ).toFixed(1);

  const overallSummary = latestRows.reduce(
    (acc, row, index) => {
      acc[index + 1] = row?.progress_percent || 0;
      return acc;
    },
    {} as Record<number, number>,
  );

  const { data: allWorkersData } = await supabase
    .from("revitalization_program_logs")
    .select("total_worker");

  const totalWorkers =
    allWorkersData?.reduce(
      (acc, row) => acc + (row.total_worker || 0),
      0,
    ) || 0;

  const mappedData: (RevitalizationDetailSheet | null)[] = latestRows.map(
    (row, idx) => {
      if (!row) return null;
      return {
        id: row.id,
        area_id: row.area_id,
        area_name: REVITALIZATION_AREAS[idx].name,
        progress_percent: row.progress_percent,
        progress_date: row.progress_date,
        total_worker: row.total_worker,
        status: row.status,
        updated_at: row.updated_at,
      };
    },
  );

  return {
    data: mappedData,
    overall_progress: overallProgress,
    overall_summary: overallSummary,
    total_workers: totalWorkers,
  };
}

export async function getRevitalizationPerMonthByArea(areaId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("revitalization_program_logs")
    .select(
      "id, progress_date, progress_percent, reporting_week, status, production, intervention, total_worker, outcome, constraints, follow_up",
    )
    .eq("area_id", areaId)
    .order("progress_date", { ascending: false });

  if (error) {
    console.error("Error fetching revitalization per month by area:", error);
    throw error;
  }

  const datas = data.map((row) => {
    return {
      id: row.id,
      area_id: areaId,
      progress_date: row.progress_date,
      reporting_week: row.reporting_week,
      progress_percent: row.progress_percent,
      status: row.status,
      production: row.production,
      intervention: row.intervention,
      total_worker: row.total_worker,
      outcome: row.outcome,
      constraints: row.constraints,
      follow_up: row.follow_up,
      month: new Date(row.reporting_week).getMonth() + 1,
    };
  });

  const getAllMondaysInMonth = (monthNum: number) => {
    const year = new Date(
      data?.[0]?.reporting_week || new Date(),
    ).getFullYear();
    const mondays: string[] = [];
    const date = new Date(year, monthNum - 1, 1);

    while (date.getMonth() === monthNum - 1) {
      if (date.getDay() === 1) {
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
