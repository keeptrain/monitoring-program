"use server";

import { STEPS } from "@/features/isf/constants/isf-step";
import { createClient } from "@/utils/supabase";

export async function getIsfStats() {
  const supabase = await createClient();
  const stepIds = STEPS.map((step) => step.id);

  // 1. Get latest log for each step
  const { data: latestData, error: latestError } = await supabase
    .from("latest_isf_logs")
    .select("step_id, progress_percent")
    .in("step_id", stepIds);

  if (latestError) throw latestError;

  const latestRows = stepIds.map(
    (id) => latestData.find((row) => row.step_id === id) || null,
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

  // 2. Get all logs chronologically for chart
  const { data: logs, error: logsError } = await supabase
    .from("isf_program_logs")
    .select("step_id, progress_percent, progress_date")
    .order("progress_date", { ascending: true });

  if (logsError) throw logsError;

  const groupedByDate = new Map<string, Record<string, number>>();
  const latestValues: Record<string, number> = {};
  stepIds.forEach((id) => (latestValues[`z${id}`] = 0));

  logs?.forEach((log) => {
    const dateKey = log.progress_date.slice(0, 10);
    const zoneKey = `z${log.step_id}`;
    latestValues[zoneKey] = log.progress_percent;
    groupedByDate.set(dateKey, { ...latestValues });
  });

  const chartData = Array.from(groupedByDate.entries())
    .map(([date, values]) => {
      const parsedDate = new Date(date);
      return {
        name: parsedDate.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
        }),
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
