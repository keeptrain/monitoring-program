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
  total_production_value: z.coerce
    .number()
    .min(1, "Nilai total produksi harus diisi"),
  limit_point_measurement: z.string().min(1, "Batas ukur titik/koordinat harus diisi"),
  limit_pal: z.coerce.number().min(1, "Batas pal harus diisi"),
  outcome: z.string().min(1, "Outcome harus diisi"),
  constraints: z.string().optional().default(""),
  follow_up: z.string().optional().default(""),
  design_path: z.string().nullable().optional().default(null),
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
