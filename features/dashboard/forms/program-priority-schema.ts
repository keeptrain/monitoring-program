import { z } from "zod";

export const documentationSchema = z.object({
  id: z.string().optional(),
  image_before_path: z.string().optional(),
  image_after_path: z.string().optional(),
  created_at: z.string().optional(),
});

export const programPrioritySchema = z.object({
  available_location_id: z
    .preprocess(
      (val) => (val === "" ? undefined : val),
      z.coerce
        .number({
          error: "Silahkan pilih lokasi",
        })
        .positive()
    )
    .optional(),
  name: z.string().min(1, "Nama program dibutuhkan"),
  provider_type: z
    .preprocess(
      (val) => (val === "" ? undefined : val),
      z.enum(["private", "institution"], {
        error: "Silahkan pilih jenis provider",
      })
    )
    .optional(),
  percentage_of_work: z.coerce
    .number()
    .int()
    .min(0, "Minimum 0%")
    .max(100, "Maximum 100%"),
  status: z
    .preprocess(
      (val) => (val === "" ? undefined : val),
      z.enum(["HUB", "NON-HUB"], {
        error: "Silahkan pilih status",
      })
    )
    .optional(),
  constraints: z.string().min(1, "Kendala dibutuhkan"),
  follow_up: z.string().min(1, "Tindak lanjut dibutuhkan"),
  documentations: z.array(documentationSchema).min(1, "Dokumentasi dibutuhkan"),
});

export type ProgramPriorityFormInput = z.input<typeof programPrioritySchema>;
export type ProgramPriorityFormValues = z.output<typeof programPrioritySchema>;
export type DocumentationValues = z.infer<typeof documentationSchema>;
