import { locationFormSchemaPattern } from "@/components/shared/LocationFormSection";
import { documentationFormSchema } from "@/features/documentation/forms/documentation-schema";
import { sCurveSchema } from "@/features/documentation/forms/scurve-schema";
import { z } from "zod";

export const bioflocBaseProgramSchema = z.object({
  name: z.string().min(1, "Nama KDMP dibutuhkan"),
  progress_percent: z.coerce
    .number()
    .min(0, "Pastikan persentasi lebih besar dari laporan sebelumnya")
    .max(100, "Persentase maksimal 100"),
  commodity: z.string().min(1, "Komoditas dibutuhkan"),
  land_area: z.string().min(1, "Luas Lahan dibutuhkan"),
  production: z.string().min(1, "Produksi dibutuhkan"),
  total_admin: z.coerce.number().int().min(0, "Minimal 0 admin"),
  distribution_amount: z.coerce.number().int().min(0, "Minimal 0 distribusi"),
  sppg_partner: z.string().min(1, "Mitra SPPG dibutuhkan"),
});

export const bioflocProgramSchema = bioflocBaseProgramSchema
  .extend(locationFormSchemaPattern)
  .extend(sCurveSchema.shape)
  .extend({
    documentations: documentationFormSchema.shape.documentations.optional(),
  });

export type BioflocProgramFormInput = z.input<typeof bioflocProgramSchema>;
export type BioflocProgramFormValues = z.output<typeof bioflocProgramSchema>;
export type BioflocDocumentationValues = z.infer<
  typeof documentationFormSchema
>;
