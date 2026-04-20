import z from "zod";

export const documentationProgramTypeSchema = z.enum([
  "biofloc_thematic",
  "minapadi_thematic",
  "isf",
]);

export const documentationFormRowSchema = z.object({
  image_before_paths: z
    .array(z.string().min(1))
    .min(1, "Foto sebelum wajib diunggah")
    .default([]),
  image_after_paths: z
    .array(z.string().min(1))
    .min(1, "Foto sesudah wajib diunggah")
    .default([]),
});

export const documentationFormSchema = z.object({
  documentations: z.array(documentationFormRowSchema).optional(),
});

export const documentationInsertRowSchema = z.object({
  program_type: documentationProgramTypeSchema,
  program_id: z.number().int().positive(),
  group_id: z.number().int().positive(),
  type: z.enum(["before", "after"]),
  path: z.string().min(1, "Path wajib diisi"),
});

export type DocumentationFormInput = z.input<typeof documentationFormSchema>;
export type DocumentationFormValue = z.output<typeof documentationFormSchema>;
export type DocumentationProgramType = z.infer<
  typeof documentationProgramTypeSchema
>;
export type DocumentationInsertRow = z.infer<
  typeof documentationInsertRowSchema
>;

export type DocumentationGroup = NonNullable<
  DocumentationFormInput["documentations"]
>[number];

// Using for append documentation groups
export const DEFAULT_GROUP: DocumentationGroup = {
  image_before_paths: [],
  image_after_paths: [],
};
