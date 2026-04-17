import { locationFormSchemaPattern } from "@/components/shared/LocationFormSection";
import { z } from "zod";

export const documentationSchema = z.object({
  image_before_path: z.string().min(1, "Foto sebelum wajib diunggah"),
  image_after_path: z.string().min(1, "Foto sesudah wajib diunggah"),
});

export const thematicProgramSchema = z
  .object({
    name: z.string().min(1, "Nama KDMP dibutuhkan"),
    percentage_of_work: z.coerce
      .number()
      .int()
      .min(0, "Minimum 0%")
      .max(100, "Maximum 100%"),
    commodity: z.string().min(1, "Komoditas dibutuhkan"),
    land_area: z.string().min(1, "Luas Lahan dibutuhkan"),
    production: z.string().min(1, "Produksi dibutuhkan"),
    total_admin: z.coerce.number().int().min(0, "Minimal 0 admin"),
    distribution_amount: z.coerce.number().int().min(0, "Minimal 0 distribusi"),
    sppg_partner: z.string().min(1, "Mitra SPPG dibutuhkan"),
    s_curve_path: z.string().min(1, "Kurva S wajib diunggah"),
    documentations: z
      .array(documentationSchema)
      .min(1, "Dokumentasi dibutuhkan"),
  })
  .extend(locationFormSchemaPattern);

export type ThematicProgramFormInput = z.input<typeof thematicProgramSchema>;
export type ThematicProgramFormValues = z.output<typeof thematicProgramSchema>;
export type ThematicDocumentationValues = z.infer<typeof documentationSchema>;
