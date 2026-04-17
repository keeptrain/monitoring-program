"use server";

import { STEP_COLORS, STEPS } from "@/features/isf/constants/isf-step";
import { createClient } from "@/utils/supabase";
import { LocationType } from "@/features/dashboard/actions/available-locations";
import {
  getPublicThematicProgram,
  PublicThematicProgram,
} from "@/features/thematic/actions/public-thematic-programs";

/**
 * Registry of return types for different location types.
 * This can be used for type safety across the monitoring feature.
 */
export type MonitoringDetailTypeMap = {
  biofloc_thematic: PublicThematicProgram;
  minapadi_thematic: PublicThematicProgram;
  isf: null; // Add PublicIsfProgram here when available
};

type IsfLogRow = {
  step_id: number;
  progress_percent: number;
  progress_date: string;
  total_worker: number;
  status: string;
  updated_at: string | null;
  created_at: string | null;
};

export type IsfDashboardZone = {
  step_id: number;
  name: string;
  progress_percent: number;
  total_worker: number;
  status: string;
  updated_at: string | null;
  log_count: number;
};

export type IsfDashboardLinePoint = {
  name: string;
  date: string;
  z1?: number;
  z2?: number;
  z3?: number;
  z4?: number;
  z5?: number;
  z6?: number;
  z7?: number;
};
type IsfZoneLineKey = `z${1 | 2 | 3 | 4 | 5 | 6 | 7}`;

export type PublicIsfMonitoringDashboard = {
  overall_progress: number;
  workforce_total: number;
  active_zone_count: number;
  total_logs: number;
  updated_at: string | null;
  zones: IsfDashboardZone[];
  pie_chart: Array<{
    step_id: number;
    name: string;
    value: number;
    fill: string;
  }>;
  line_chart: IsfDashboardLinePoint[];
};

const STEP_HEX_COLORS: Record<number, string> = {
  1: "#3b82f6",
  2: "#10b981",
  3: "#f59e0b",
  4: "#f43f5e",
  5: "#8b5cf6",
  6: "#06b6d4",
  7: "#14b8a6",
};

function normalizeLineDate(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
  });
}

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

export async function getPublicIsfMonitoringDashboard(): Promise<PublicIsfMonitoringDashboard> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("isf_program_logs")
    .select(
      "step_id, progress_percent, progress_date, total_worker, status, updated_at, created_at",
    )
    .order("progress_date", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as IsfLogRow[];
  const latestByStep = new Map<number, IsfDashboardZone>();
  const logCountByStep = new Map<number, number>();

  for (const row of rows) {
    logCountByStep.set(row.step_id, (logCountByStep.get(row.step_id) ?? 0) + 1);
    latestByStep.set(row.step_id, {
      step_id: row.step_id,
      name: STEPS.find((step) => step.id === row.step_id)?.name ?? `Zona ${row.step_id}`,
      progress_percent: row.progress_percent ?? 0,
      total_worker: row.total_worker ?? 0,
      status: row.status ?? "-",
      updated_at: row.updated_at,
      log_count: logCountByStep.get(row.step_id) ?? 0,
    });
  }

  const zones: IsfDashboardZone[] = STEPS.map((step) => {
    const latest = latestByStep.get(step.id);
    return {
      step_id: step.id,
      name: step.name,
      progress_percent: latest?.progress_percent ?? 0,
      total_worker: latest?.total_worker ?? 0,
      status: latest?.status ?? "Belum Mulai",
      updated_at: latest?.updated_at ?? null,
      log_count: logCountByStep.get(step.id) ?? 0,
    };
  });

  const totalProgress = zones.reduce((acc, item) => acc + item.progress_percent, 0);
  const overallProgress = zones.length ? Math.round(totalProgress / zones.length) : 0;

  const pieChart = zones.map((zone) => ({
    step_id: zone.step_id,
    name: `Zona ${zone.step_id}`,
    value: zone.progress_percent,
    fill: STEP_HEX_COLORS[zone.step_id] ?? STEP_COLORS[zone.step_id] ?? "#64748b",
  }));

  const groupedByDate = new Map<
    string,
    Partial<Record<IsfZoneLineKey, number>>
  >();
  for (const row of rows) {
    const dateKey = row.progress_date.slice(0, 10);
    const updates = groupedByDate.get(dateKey) ?? {};
    const zoneKey = `z${row.step_id}` as IsfZoneLineKey;
    updates[zoneKey] = row.progress_percent;
    groupedByDate.set(dateKey, updates);
  }

  const sortedDateKeys = Array.from(groupedByDate.keys()).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );

  const latestValues: Record<IsfZoneLineKey, number> = {
    z1: 0,
    z2: 0,
    z3: 0,
    z4: 0,
    z5: 0,
    z6: 0,
    z7: 0,
  };

  const lineChart = sortedDateKeys
    .map((dateKey) => {
      const updates = groupedByDate.get(dateKey) ?? {};
      (Object.keys(latestValues) as IsfZoneLineKey[]).forEach((zoneKey) => {
        if (updates[zoneKey] !== undefined) {
          latestValues[zoneKey] = updates[zoneKey] as number;
        }
      });

      return {
        name: normalizeLineDate(dateKey),
        date: dateKey,
        ...latestValues,
      } as IsfDashboardLinePoint;
    })
    .slice(-12);

  const workforceTotal = zones.reduce((acc, zone) => acc + zone.total_worker, 0);
  const updatedAt = zones
    .map((zone) => zone.updated_at)
    .filter(Boolean)
    .sort()
    .at(-1) as string | null | undefined;

  return {
    overall_progress: overallProgress,
    workforce_total: workforceTotal,
    active_zone_count: zones.filter((zone) => zone.progress_percent > 0).length,
    total_logs: rows.length,
    updated_at: updatedAt ?? null,
    zones,
    pie_chart: pieChart,
    line_chart: lineChart,
  };
}
