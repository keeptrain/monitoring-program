"use server";

import { createClient } from "@/utils/supabase";
import { IsfChartPoint } from "../types/monitoring-types";

export async function getProgressChartIsf(): Promise<IsfChartPoint[]> {
  const supabase = await createClient();

  // Ambil semua log, urutkan berdasarkan tanggal
  const { data: logs, error } = await supabase
    .from("isf_program_logs")
    .select("step_id, progress_percent, progress_date")
    .order("progress_date", { ascending: true });

  if (error) throw error;

  // Identifikasi zona mana saja yang benar-benar memiliki data laporan
  const activeStepIds = new Set(logs?.map((log) => log.step_id));

  // Grup data berdasarkan tanggal
  const groupedByDate = new Map<string, Record<string, number>>();

  // Kita hanya melacak progres untuk zona yang sudah aktif
  const latestValues: Record<string, number> = {};
  activeStepIds.forEach((id) => (latestValues[`z${id}`] = 0));

  logs?.forEach((log) => {
    const dateKey = log.progress_date.slice(0, 10); // YYYY-MM-DD
    const zoneKey = `z${log.step_id}`;

    // Update nilai terbaru untuk zona ini
    latestValues[zoneKey] = log.progress_percent;

    // Simpan snapshot untuk tanggal ini
    groupedByDate.set(dateKey, { ...latestValues });
  });

  // Konversi ke format Recharts
  const chartData: IsfChartPoint[] = Array.from(groupedByDate.entries())
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
    .slice(-12); // Batasi 12 titik terakhir agar ringan

  return chartData;
}
