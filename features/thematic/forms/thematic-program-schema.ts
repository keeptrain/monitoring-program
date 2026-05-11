import { sCurveSchema } from "@/features/documentation/forms/scurve-schema";
import { z } from "zod";

export const thematicProgramBaseSchema = z.object({
  progress_percent: z.coerce
    .number()
    .min(0, "Persentase progres tidak boleh negatif")
    .max(100, "Persentase progres tidak boleh lebih dari 100"),
  commodity_aid: z.string().min(1, "Komoditas pendukung wajib diisi"),
  commodity_potential: z.string().optional().default(""),
  land_area: z.string().min(1, "Luas lahan wajib diisi"),
  production_value: z.string().min(1, "Nilai produksi wajib diisi"),
  total_management: z.coerce
    .number()
    .min(0, "Jumlah pengelolaan tidak boleh negatif"),
  total_members: z.coerce.number().min(0, "Jumlah anggota tidak boleh negatif"),
  distribution_amount: z.coerce
    .number()
    .min(0, "Jumlah distribusi wajib diisi"),
  sppg_partner: z.string().min(1, "Mitra SPPG wajib diisi"),
});

export const thematicProgramSchema = thematicProgramBaseSchema.extend(
  sCurveSchema.shape,
);

export type ThematicProgramFormInput = z.input<typeof thematicProgramSchema>;
export type ThematicProgramFormValues = z.output<typeof thematicProgramSchema>;
