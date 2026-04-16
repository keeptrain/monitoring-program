import { z } from "zod";
import { documentationSchema } from "./thematic-program-schema";

export const updateProgressSchema = z.object({
  percentage_of_work: z.coerce
    .number({ error: "Persentase harus berupa angka" })
    .int()
    .min(0, "Minimum 0%")
    .max(100, "Maximum 100%"),
  documentations: z.array(documentationSchema).optional(),
});

export type UpdateProgressFormInput = z.input<typeof updateProgressSchema>;
export type UpdateProgressFormValues = z.output<typeof updateProgressSchema>;
