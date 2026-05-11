"use server";

import { createClient } from "@/utils/supabase";
import { revalidatePath } from "next/cache";
import { RevitalizationReportFormValues } from "../forms/revitalization-report-schema";
import {
  RevitalizationProgramLog,
  RevitalizationProgramLogListItem,
  RevitalizationProgramLogsByAreaResult,
} from "../types/revitalization";
import { insertDocumentations } from "@/features/documentation/actions";
import { SupabaseClient } from "@supabase/supabase-js";
import { uuidv7 } from "uuidv7";
import { REVITALIZATION_AREAS } from "../constants/revitalization-area";

async function validateSandwichProgress(
  supabase: SupabaseClient,
  areaId: number,
  progressDate: string,
  progressPercent: number,
  excludeId?: string,
) {
  let prevQuery = supabase
    .from("revitalization_program_logs")
    .select("progress_percent")
    .eq("area_id", areaId)
    .lt("progress_date", progressDate)
    .order("progress_date", { ascending: false })
    .limit(1);

  if (excludeId !== undefined) {
    prevQuery = prevQuery.neq("id", excludeId);
  }

  const { data: prevData, error: prevError } = await prevQuery;
  if (prevError) throw prevError;

  let nextQuery = supabase
    .from("revitalization_program_logs")
    .select("progress_percent")
    .eq("area_id", areaId)
    .gt("progress_date", progressDate)
    .order("progress_date", { ascending: true })
    .limit(1);

  if (excludeId !== undefined) {
    nextQuery = nextQuery.neq("id", excludeId);
  }

  const { data: nextData, error: nextError } = await nextQuery;
  if (nextError) throw nextError;

  const prevReport = prevData?.[0];
  const nextReport = nextData?.[0];

  const minProgress = prevReport ? prevReport.progress_percent : 0;
  const maxProgress = nextReport ? nextReport.progress_percent : 100;

  if (progressPercent < minProgress || progressPercent > maxProgress) {
    throw new Error(
      `Nilai progress harus di antara ${minProgress}% dan ${maxProgress}% sesuai urutan laporan.`,
    );
  }
}

function getMondayDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const monday = new Date(date);
  monday.setDate(date.getDate() - diff);

  const yyyy = monday.getFullYear();
  const mm = String(monday.getMonth() + 1).padStart(2, "0");
  const dd = String(monday.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function toDbPayload(data: RevitalizationReportFormValues) {
  return {
    name: data.name,
    progress_percent: data.progress_percent,
    progress_date: data.progress_date,
    reporting_week: getMondayDate(data.progress_date),
    status: data.status,
    provider_name: data.provider_name,
    production: data.production,
    intervention: data.intervention,
    total_worker: data.total_worker,
    outcome: data.outcome,
    constraints: data.constraints,
    follow_up: data.follow_up,
  };
}

export async function getRevitalizationProgramLogsByArea(
  areaId: number,
): Promise<RevitalizationProgramLogsByAreaResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("revitalization_program_logs")
    .select(
      "id, name, status, progress_date, progress_percent, updated_at, created_at",
    )
    .eq("area_id", areaId)
    .order("progress_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching revitalization program logs by area:", error);
    throw error;
  }

  const mappedData: RevitalizationProgramLogListItem[] = (data ?? []).map(
    (item) => ({
      id: item.id,
      name: item.name,
      status: item.status,
      progress_percent: item.progress_percent,
      progress_date: item.progress_date,
      updated_at: item.updated_at,
    }),
  );

  return {
    data: mappedData,
    areaId,
  };
}

import { toPreviewUrl } from "@/lib/utils";

export async function getRevitalizationProgramLogById(id: string) {
  const supabase = await createClient();
  const { data: log, error } = await supabase
    .from("revitalization_program_logs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching revitalization program log by ID:", error);
    throw error;
  }

  // Fetch documentation
  const { data: docs } = await supabase
    .from("documentations")
    .select("path, type")
    .eq("program_type", "revitalization")
    .eq("program_id", id);

  const beforeUrls =
    docs?.filter((d) => d.type === "before").map((d) => toPreviewUrl(d.path)) ||
    [];
  const afterUrls =
    docs?.filter((d) => d.type === "after").map((d) => toPreviewUrl(d.path)) ||
    [];

  return {
    data: {
      ...log,
      beforeUrls,
      afterUrls,
    } as RevitalizationProgramLog,
  };
}

export async function getRevitalizationAreaSummaries() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("revitalization_program_logs")
    .select("area_id, progress_percent, updated_at, progress_date, created_at")
    .order("area_id", { ascending: true })
    .order("progress_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const latestByArea = new Map<
    number,
    { progress_percent: number; updated_at: string }
  >();
  for (const row of data ?? []) {
    if (!latestByArea.has(row.area_id)) {
      latestByArea.set(row.area_id, {
        progress_percent: row.progress_percent ?? 0,
        updated_at: row.updated_at ?? null,
      });
    }
  }

  return REVITALIZATION_AREAS.map((area) => {
    const latest = latestByArea.get(area.id);
    return {
      area_id: area.id,
      name: area.name,
      progress_percent: latest?.progress_percent ?? 0,
      updated_at: latest?.updated_at ?? null,
    };
  });
}

export async function createRevitalizationProgramLog(
  areaId: number,
  data: RevitalizationReportFormValues,
) {
  const supabase = await createClient();
  await validateSandwichProgress(
    supabase,
    areaId,
    data.progress_date,
    data.progress_percent,
  );

  // Check if a report already exists for this area + date
  const { data: existing } = await supabase
    .from("revitalization_program_logs")
    .select("id")
    .eq("area_id", areaId)
    .eq("progress_date", data.progress_date)
    .maybeSingle();

  if (existing) {
    throw new Error(
      `Laporan untuk tanggal ${data.progress_date} sudah ada. Silakan pilih tanggal lain atau ubah laporan yang sudah ada.`,
    );
  }

  const { data: createdLog, error } = await supabase
    .from("revitalization_program_logs")
    .insert({ ...toDbPayload(data), id: uuidv7(), area_id: areaId })
    .select("id, area_id")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error(
        `Laporan untuk tanggal ${data.progress_date} sudah ada. Silakan pilih tanggal lain atau ubah laporan yang sudah ada.`,
      );
    }
    throw error;
  }

  if (!createdLog) {
    throw new Error("Gagal membuat laporan revitalisasi.");
  }

  if (data.documentations.length > 0) {
    const savedDocumentations = await insertDocumentations(
      supabase,
      createdLog.id,
      "revitalization",
      data.documentations,
    );
    if (!savedDocumentations.success) {
      throw new Error(
        savedDocumentations.error ??
          "Gagal menyimpan dokumentasi revitalisasi saat create.",
      );
    }
  }

  revalidatePath("/dashboard/revitalisasi");
  revalidatePath(`/dashboard/revitalisasi/${areaId}`);
  revalidatePath("/monitoring");

  return {
    id: createdLog.id,
    areaId: createdLog.area_id as number,
  };
}

export async function updateRevitalizationProgramLog(
  id: string,
  areaId: number,
  data: RevitalizationReportFormValues,
) {
  const supabase = await createClient();
  await validateSandwichProgress(
    supabase,
    areaId,
    data.progress_date,
    data.progress_percent,
    id,
  );

  const { error } = await supabase
    .from("revitalization_program_logs")
    .update({
      ...toDbPayload(data),
      area_id: areaId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw error;
  }

  if (data.documentations.length > 0) {
    const savedDocumentations = await insertDocumentations(
      supabase,
      id,
      "revitalization",
      data.documentations,
    );
    if (!savedDocumentations.success) {
      throw new Error(
        savedDocumentations.error ??
          "Gagal menyimpan dokumentasi revitalisasi saat update.",
      );
    }
  }

  revalidatePath("/dashboard/revitalisasi");
  revalidatePath(`/dashboard/revitalisasi/${areaId}`);
  revalidatePath(`/dashboard/revitalisasi/report/${id}`);
  revalidatePath(`/dashboard/revitalisasi/report/${id}/edit`);
  return { id, areaId };
}

export async function deleteRevitalizationProgramLog(
  id: string,
  areaId: number,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("revitalization_program_logs")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  revalidatePath("/dashboard/revitalisasi");
  revalidatePath(`/dashboard/revitalisasi/${areaId}`);
}
