import z from "zod";

export const documentationProgramTypeSchema = z.enum([
  "biofloc_thematic",
  "minapadi_thematic",
  "isf",
  "revitalization",
  "proposal_biofloc_thematic",
]);

export const documentationImageSchema = z.object({
  path: z.string().min(1),
  file_name: z.string().min(1),
});

export const documentationFormRowSchema = z.object({
  image_before_paths: z
    .array(documentationImageSchema)
    .min(1, "Foto sebelum wajib diunggah")
    .default([]),
  image_after_paths: z
    .array(documentationImageSchema)
    .min(1, "Foto sesudah wajib diunggah")
    .default([]),
});

export const proposalDocumentationFormRowSchema = z.object({
  image_before_paths: z
    .array(documentationImageSchema)
    .min(1, "Dokumentasi proposal wajib diunggah")
    .default([]),
  image_after_paths: z.array(documentationImageSchema).default([]),
});

export const documentationFormSchema = z.object({
  documentations: z.array(documentationFormRowSchema).optional(),
});

export const documentationInsertRowSchema = z.object({
  program_type: documentationProgramTypeSchema,
  program_id: z.union([z.number(), z.string()]),
  group_id: z.string().min(1), // Changed to string for flexibility
  type: z.enum(["before", "after", "proposal_before"]),
  path: z.string().min(1, "Path wajib diisi"),
  file_name: z.string().min(1, "Nama file wajib diisi"),
});

export type DocumentationImage = z.infer<typeof documentationImageSchema>;
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
