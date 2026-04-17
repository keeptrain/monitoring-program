import { z } from "zod";

export const isfDocumentationSchema = z.object({
  image_before_path: z.string().min(1, "Foto sebelum wajib diunggah"),
  image_after_path: z.string().min(1, "Foto sesudah wajib diunggah"),
});

export const isfReportSchema = z.object({
  progress_date: z.string().min(1, "Tanggal harus diisi"),
  step_id: z.coerce.number().min(1).max(7, "Tahapan tidak valid"),
  status: z.string().min(1, "Status harus dipilih"),
  progress_percent: z.coerce
    .number()
    .min(0)
    .max(100, "Persentase minimal 0 dan maksimal 100"),
  provider_name: z.string().min(1, "Nama penyedia harus diisi"),
  name: z.string().min(1, "Nama laporan harus diisi"),
  intervention: z.string().min(1, "Intervensi harus diisi"),
  total_worker: z.coerce.number().min(1, "Serapan tenaga kerja harus diisi"),
  production: z.string().min(1, "Produksi harus diisi"),
  outcome: z.string().min(1, "Outcome harus diisi"),
  constraints: z.string().optional(),
  follow_up: z.string().optional(),
  s_curve_path: z.string().min(1, "Kurva S wajib diunggah"),
  documentations: z
    .array(isfDocumentationSchema)
    .min(1, "Dokumentasi dibutuhkan"),
});

export type IsfReportFormInput = z.input<typeof isfReportSchema>;
export type IsfReportFormValues = z.output<typeof isfReportSchema>;
