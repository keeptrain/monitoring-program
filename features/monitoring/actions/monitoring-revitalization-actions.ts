"use server";

import { REVITALIZATION_AREAS } from "@/features/revitalisasi/constants/revitalization-area";
import { createClient } from "@/utils/supabase";
import {
  MonitoringRevitalization,
  RevitalizationDetailSheet,
} from "../types/monitoring-types";
import { TABLES } from "@/lib/constants/tables";
import { toPreviewUrl } from "@/lib/utils";

/**
 * Mengambil data ringkasan monitoring revitalisasi untuk seluruh area.
 * Digunakan untuk menampilkan poin-poin pada peta, total progress akumulatif,
 * dan total serapan tenaga kerja pada dashboard monitoring publik.
 */
export async function getMonitoringRevitalization(): Promise<MonitoringRevitalization> {
  const supabase = await createClient();
  const areaIds = REVITALIZATION_AREAS.map((area) => area.id);

  // 1. Get latest logs for each area
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

  // 2. Fetch documentations for these specific latest reports
  const reportIds = latestRows.map((r) => r?.id).filter(Boolean) as string[];
  const { data: docs } = await supabase
    .from("documentations")
    .select("program_id, type, path")
    .eq("program_type", "revitalization")
    .in("program_id", reportIds);

  const { data: allWorkersData } = await supabase
    .from(TABLES.REVITALIZATION_LOGS)
    .select("total_worker");

  const totalWorkers =
    allWorkersData?.reduce((acc, row) => acc + (row.total_worker || 0), 0) || 0;

  const mappedData: (RevitalizationDetailSheet | null)[] = latestRows.map(
    (row, idx) => {
      if (!row) return null;

      // Filter docs for this specific report
      const reportDocs = docs?.filter((d) => d.program_id === row.id) || [];
      const beforeUrls = reportDocs
        .filter((d) => d.type === "before")
        .map((d) => toPreviewUrl(d.path));
      const afterUrls = reportDocs
        .filter((d) => d.type === "after")
        .map((d) => toPreviewUrl(d.path));

      return {
        id: row.id,
        area_id: row.area_id,
        area_name: REVITALIZATION_AREAS[idx].name,
        status: row.status,
        progress_percent: row.progress_percent,
        progress_date: row.progress_date,
        total_worker: row.total_worker,
        production: row.production,
        total_production_value: row.total_production_value,
        limit_point_measurement: row.limit_point_measurement,
        limit_pal: row.limit_pal,
        design_path: row.design_path,
        updated_at: row.updated_at,
        beforeUrls,
        afterUrls,
      };
    },
  );

  // 3. Get images for the most recent report across all areas for the main carousel
  const mostRecentReport = [...(data || [])].sort(
    (a, b) =>
      new Date(b.progress_date).getTime() - new Date(a.progress_date).getTime(),
  )[0];

  let overallImages: string[] = [];
  if (mostRecentReport) {
    const reportDocs =
      docs?.filter((d) => d.program_id === mostRecentReport.id) || [];
    const beforeUrls = reportDocs
      .filter((d) => d.type === "before")
      .map((d) => toPreviewUrl(d.path));
    const afterUrls = reportDocs
      .filter((d) => d.type === "after")
      .map((d) => toPreviewUrl(d.path));
    overallImages = [...beforeUrls, ...afterUrls];
  }

  return {
    data: mappedData,
    total_workers: totalWorkers,
    latest_documentation_urls: overallImages,
  };
}

export async function getRevitalizationPerMonthByArea(areaId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.REVITALIZATION_LOGS)
    .select(
      "id, name, progress_date, progress_percent, reporting_week, status, provider_name, production, intervention, total_worker, outcome, constraints, follow_up, total_production_value, limit_point_measurement, limit_pal, design_path",
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
      name: row.name,
      progress_date: row.progress_date,
      reporting_week: row.reporting_week,
      progress_percent: row.progress_percent,
      status: row.status,
      provider_name: row.provider_name,
      production: row.production,
      intervention: row.intervention,
      total_worker: row.total_worker,
      total_production_value: row.total_production_value,
      limit_point_measurement: row.limit_point_measurement,
      limit_pal: row.limit_pal,
      design_path: row.design_path,
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

export async function getRevitalizationAvailableDatesByMonth(
  areaId: number,
  year: number,
  month: number,
) {
  const supabase = await createClient();

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const { data, error } = await supabase
    .from(TABLES.REVITALIZATION_LOGS)
    .select("id, progress_date")
    .eq("area_id", areaId)
    .gte("progress_date", startDate.toLocaleDateString("en-CA"))
    .lte("progress_date", endDate.toLocaleDateString("en-CA"));

  if (error) {
    console.error("Error fetching revitalization available dates:", error);
    throw error;
  }

  return data;
}

export async function getRevitalizationStats() {
  const supabase = await createClient();

  // 1. Ambil data log terbaru untuk summary & overall progress
  const areaIds = REVITALIZATION_AREAS.map((area) => area.id);

  const { data: latestData, error: latestError } = await supabase
    .from("latest_revitalization_logs")
    .select("area_id, progress_percent")
    .in("area_id", areaIds);

  if (latestError) {
    console.error("Error fetching latest revitalization logs:", latestError);
    throw latestError;
  }

  const latestRows = areaIds.map(
    (id) => latestData.find((row) => row.area_id === id) || null,
  );

  const overallProgress =
    +(
      latestRows.reduce((acc, row) => acc + (row?.progress_percent || 0), 0) /
      latestRows.length
    ).toFixed(1) || 0;

  const summary = latestRows.reduce(
    (acc, row, index) => {
      acc[index + 1] = row?.progress_percent || 0;
      return acc;
    },
    {} as Record<number, number>,
  );

  // 2. Ambil semua log secara kronologis untuk chart
  const { data: logs, error: logsError } = await supabase
    .from(TABLES.REVITALIZATION_LOGS)
    .select("area_id, progress_percent, progress_date")
    .order("progress_date", { ascending: true });

  if (logsError) {
    console.error("Error fetching all revitalization logs:", logsError);
    throw logsError;
  }

  // Grup data berdasarkan tanggal
  const groupedByDate = new Map<string, Record<string, number>>();

  // Inisialisasi nilai awal 0 untuk tiap area
  const latestValues: Record<string, number> = {};
  areaIds.forEach((id) => (latestValues[`z${id}`] = 0));

  logs?.forEach((log) => {
    const dateKey = log.progress_date.slice(0, 10);
    const zoneKey = `z${log.area_id}`;

    // Update progress terakhir untuk area ini
    latestValues[zoneKey] = log.progress_percent;

    // Simpan snapshot untuk tanggal tersebut
    groupedByDate.set(dateKey, { ...latestValues });
  });

  const chartData = Array.from(groupedByDate.entries())
    .map(([date, values]) => {
      const parsedDate = new Date(date);
      const name = parsedDate.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      });

      return {
        name,
        date,
        ...values,
      };
    })
    .slice(-12);

  return {
    overallProgress,
    summary,
    chartData,
  };
}
