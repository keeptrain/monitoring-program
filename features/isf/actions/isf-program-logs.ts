"use server";

import { createClient } from "@/utils/supabase";
import { revalidatePath } from "next/cache";
import { IsfReportFormValues } from "../forms/isf-report-schema";
import {
  IsfProgramLog,
  IsfProgramLogListItem,
  IsfProgramLogsByStepResult,
  IsfStepSummary,
} from "../types/isf";
import { STEPS } from "../constants/isf-step";
import { insertDocumentations } from "@/features/documentation/actions";
import { getReportBounds } from "../utils/report-date-window";

async function assertProgressNotRegressing(
  stepId: number,
  progressPercent: number,
  excludeId?: number,
) {
  const supabase = await createClient();
  let query = supabase
    .from("isf_program_logs")
    .select("id, progress_percent")
    .eq("step_id", stepId)
    .order("progress_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1);

  if (excludeId !== undefined) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  const latest = data?.[0];
  if (latest && progressPercent < latest.progress_percent) {
    throw new Error(
      `Progress terbaru tidak boleh lebih kecil dari progress terakhir (${latest.progress_percent}%).`,
    );
  }
}

function toDbPayload(data: IsfReportFormValues) {
  return {
    step_id: data.step_id,
    progress_percent: data.progress_percent,
    progress_date: data.progress_date,
    name: data.name,
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

export async function getIsfProgramLogsByStep(
  stepId: number,
): Promise<IsfProgramLogsByStepResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("isf_program_logs")
    .select(
      "id, name, status, progress_date, progress_percent, updated_at, created_at",
    )
    .eq("step_id", stepId)
    .order("progress_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching ISF program logs by step:", error);
    throw error;
  }

  const mappedData: IsfProgramLogListItem[] = (data ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    status: item.status,
    progress_percent: item.progress_percent,
    progress_date: item.progress_date,
    updated_at: item.updated_at,
  }));

  const latestReport = data?.[0];
  const dateWindow = getReportBounds(latestReport?.progress_date ?? null);

  return {
    data: mappedData,
    availableDate: dateWindow,
  };
}

export async function getIsfProgramLogById(id: number): Promise<IsfProgramLog> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("isf_program_logs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data as IsfProgramLog;
}

export async function getIsfStepSummaries(): Promise<IsfStepSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("isf_program_logs")
    .select("step_id, progress_percent, updated_at, progress_date, created_at")
    .order("step_id", { ascending: true })
    .order("progress_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const latestByStep = new Map<number, IsfStepSummary>();
  for (const row of data ?? []) {
    if (!latestByStep.has(row.step_id)) {
      latestByStep.set(row.step_id, {
        step_id: row.step_id,
        name: STEPS.find((s) => s.id === row.step_id)?.name || "",
        progress_percent: row.progress_percent ?? 0,
        updated_at: row.updated_at ?? null,
      });
    }
  }

  return STEPS.map((step) => {
    const latest = latestByStep.get(step.id);
    return {
      step_id: step.id,
      name: step.name,
      progress_percent: latest?.progress_percent ?? 0,
      updated_at: latest?.updated_at ?? null,
    };
  });
}

export async function createIsfProgramLog(data: IsfReportFormValues) {
  const createWindow = await getCreateDateWindow(data.step_id);
  if (!createWindow.canCreate) {
    throw new Error(
      createWindow.errorMessage ??
        "Laporan minggu ini dan minggu depan sudah terisi.",
    );
  }

  if (data.progress_date > createWindow.maxDate) {
    throw new Error(
      `Tanggal laporan tidak boleh melebihi batas: ${createWindow.maxDate}.`,
    );
  }

  if (createWindow.minDate && data.progress_date < createWindow.minDate) {
    throw new Error(
      `Tanggal laporan tidak boleh lebih kecil dari batas: ${createWindow.minDate}.`,
    );
  }

  await assertProgressNotRegressing(data.step_id, data.progress_percent);

  const supabase = await createClient();
  const { data: createdLog, error } = await supabase
    .from("isf_program_logs")
    .insert(toDbPayload(data))
    .select("id, step_id")
    .single();

  if (error) {
    throw error;
  }

  if (!createdLog) {
    throw new Error("Gagal membuat laporan ISF.");
  }

  if (data.documentations.length > 0) {
    const savedDocumentations = await insertDocumentations(
      supabase,
      createdLog.id as number,
      "isf",
      data.documentations,
    );
    if (!savedDocumentations.success) {
      throw new Error(
        savedDocumentations.error ??
          "Gagal menyimpan dokumentasi ISF saat create.",
      );
    }
  }

  revalidatePath("/dashboard/isf");
  revalidatePath(`/dashboard/isf/${data.step_id}`);
  return {
    id: createdLog.id as number,
    stepId: createdLog.step_id as number,
  };
}

export async function updateIsfProgramLog(
  id: number,
  data: IsfReportFormValues,
) {
  await assertProgressNotRegressing(data.step_id, data.progress_percent, id);

  const supabase = await createClient();
  const { error } = await supabase
    .from("isf_program_logs")
    .update({
      ...toDbPayload(data),
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
      "isf",
      data.documentations,
    );
    if (!savedDocumentations.success) {
      throw new Error(
        savedDocumentations.error ??
          "Gagal menyimpan dokumentasi ISF saat update.",
      );
    }
  }

  revalidatePath("/dashboard/isf");
  revalidatePath(`/dashboard/isf/${data.step_id}`);
  revalidatePath(`/dashboard/isf/report/${id}`);
  revalidatePath(`/dashboard/isf/report/${id}/edit`);
  return { id, stepId: data.step_id };
}

export async function deleteIsfProgramLog(id: number, stepId: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("isf_program_logs")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  revalidatePath("/dashboard/isf");
  revalidatePath(`/dashboard/isf/${stepId}`);
}

interface IsfCreateDateWindow {
  minDate: string | null;
  maxDate: string;
  canCreate: boolean;
  errorMessage?: string;
}

async function getCreateDateWindow(
  stepId: number,
): Promise<IsfCreateDateWindow> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("isf_program_logs")
    .select("progress_date")
    .eq("step_id", stepId)
    .order("progress_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  const dateWindow = getReportBounds(data?.progress_date ?? null);

  return {
    minDate: dateWindow.minDate,
    maxDate: dateWindow.maxDate,
    canCreate: dateWindow.canCreate,
    errorMessage: dateWindow.errorMessage,
  };
}
