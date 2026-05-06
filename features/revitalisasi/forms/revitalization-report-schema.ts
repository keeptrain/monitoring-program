import { documentationFormSchema } from "@/features/documentation/forms/documentation-schema";
import { z } from "zod";

const revitalizationReportBaseSchema = z.object({
  name: z.string().min(1, "Nama laporan harus diisi"),
  progress_date: z.string().min(1, "Tanggal laporan tidak boleh kosong"),
  status: z.string().min(1, "Status harus dipilih"),
  progress_percent: z.coerce
    .number()
    .min(0, "Pastikan persentasi tidak kurang dari 0")
    .max(100, "Persentase maksimal 100"),
  provider_name: z.string().min(1, "Nama penyedia harus diisi"),
  production: z.string().min(1, "Produksi harus diisi"),
  intervention: z.string().min(1, "Intervensi harus diisi"),
  total_worker: z.coerce
    .number()
    .min(1, "Jumlah serapan tenaga kerja harus diisi"),
  outcome: z.string().min(1, "Outcome harus diisi"),
  constraints: z.string().optional().default(""),
  follow_up: z.string().optional().default(""),
});

export const revitalizationReportSchema = revitalizationReportBaseSchema.extend(
  {
    documentations: documentationFormSchema.shape.documentations
      .optional()
      .default([]),
  },
);

export type RevitalizationReportFormInput = z.input<
  typeof revitalizationReportSchema
>;
export type RevitalizationReportFormValues = z.output<
  typeof revitalizationReportSchema
>;
