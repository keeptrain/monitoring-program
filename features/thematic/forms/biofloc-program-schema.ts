import { locationFormSchemaPattern } from "@/components/shared/location-schema";
import { documentationFormSchema } from "@/features/documentation/forms/documentation-schema";
import { sCurveSchema } from "@/features/documentation/forms/scurve-schema";
import { z } from "zod";

export const bioflocBaseProgramSchema = z.object({
  name: z.string().min(1, "Nama KDMP dibutuhkan"),
  progress_percent: z.coerce
    .number()
    .min(0, "Pastikan persentasi lebih besar dari laporan sebelumnya")
    .max(100, "Persentase maksimal 100"),
  commodity_aid: z.string().min(1, "Komoditas dibutuhkan"),
  commodity_potential: z.string().optional(),
  land_area: z.string().min(1, "Luas Lahan dibutuhkan"),
  production_value: z.string().min(1, "Produksi dibutuhkan"),
  total_management: z.coerce.number().int().min(0, "Minimal 0 pengurus"),
  total_members: z.coerce.number().int().min(0, "Minimal 0 anggota"),
  sppg_partner: z.string().min(1, "Mitra SPPG dibutuhkan"),
  distribution_amount: z.coerce.number().int().min(0, "Minimal 0 distribusi"),
});

export const bioflocProgramSchema = bioflocBaseProgramSchema
  .extend({ s_curve_path: sCurveSchema.shape.s_curve_path.optional() })
  .extend(locationFormSchemaPattern)
  .extend({
    documentations: documentationFormSchema.shape.documentations.optional(),
  });

export type BioflocProgramFormInput = z.input<typeof bioflocProgramSchema>;
export type BioflocProgramFormValues = z.output<typeof bioflocProgramSchema>;
export type BioflocDocumentationValues = z.infer<
  typeof documentationFormSchema
>;
