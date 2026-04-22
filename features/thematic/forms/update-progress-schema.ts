import { documentationFormSchema } from "@/features/documentation/forms/documentation-schema";
import { z } from "zod";

export const updateBaseProgressSchema = z.object({
  percentage_of_work: z.coerce
    .number({ error: "Persentase harus berupa angka" })
    .int()
    .min(0, "Minimum 0%")
    .max(100, "Maximum 100%"),
});

export const updateProgressSchema = updateBaseProgressSchema.extend({
  documentations: documentationFormSchema.shape.documentations
    .optional()
    .default([]),
});

export type UpdateProgressFormInput = z.input<typeof updateProgressSchema>;
export type UpdateProgressFormValues = z.output<typeof updateProgressSchema>;
