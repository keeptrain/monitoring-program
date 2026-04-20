import { documentationFormSchema } from "@/features/documentation/forms/documentation-schema";
import { sCurveSchema } from "@/features/documentation/forms/scurve-schema";
import { z } from "zod";

const isfReportBaseSchema = z.object({
  progress_date: z.string().min(1, "Tanggal laporan tidak boleh kosong"),
  status: z.string().min(1, "Status harus dipilih"),
  progress_percent: z.coerce
    .number()
    .min(1, "Pastikan persentasi lebih besar dari laporan sebelumnya")
    .max(100, "Persentase maksimal 100"),
  provider_name: z.string().min(1, "Nama penyedia harus diisi"),
  name: z.string().min(1, "Nama laporan harus diisi"),
  intervention: z.string().min(1, "Intervensi harus diisi"),
  total_worker: z.coerce
    .number()
    .min(1, "Jumlah serapan tenaga kerja harus diisi"),
  production: z.string().min(1, "Produksi harus diisi"),
  outcome: z.string().min(1, "Outcome harus diisi"),
  constraints: z.string().optional().default(""),
  follow_up: z.string().optional().default(""),
});

export const isfReportSchema = isfReportBaseSchema
  .extend(sCurveSchema.shape)
  .extend({
    documentations: documentationFormSchema.shape.documentations
      .optional()
      .default([]),
  });

export type IsfReportFormInput = z.input<typeof isfReportSchema>;
export type IsfReportFormValues = z.output<typeof isfReportSchema>;
