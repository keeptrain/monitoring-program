import { z } from "zod";
import {
  locationCoordinateSchemaPattern,
  requiredLocationAdministrativeSchemaPattern,
} from "@/components/shared/location-schema";
import { documentationImageSchema } from "@/features/documentation/forms/documentation-schema";

const proposalDocumentationRowSchema = z.object({
  image_before_paths: z
    .array(documentationImageSchema)
    .min(1, "Dokumentasi proposal wajib diunggah")
    .default([]),
  image_after_paths: z.array(documentationImageSchema).default([]),
});

export const proposalBioflocSchema = z
  .object({
    name: z.string().min(1, "Nama KDMP wajib diisi"),
    ...requiredLocationAdministrativeSchemaPattern,
    district: z.string().min(1, "Kelurahan wajib diisi"),
    village: z.string().min(1, "Desa wajib diisi"),
    proposal_path: z.string().min(1, "File proposal wajib diunggah"),
    documentations: z
      .array(proposalDocumentationRowSchema)
      .min(1, "Minimal satu grup dokumentasi wajib diunggah"),
  })
  .extend({
    ...locationCoordinateSchemaPattern,
  });

export type ProposalBioflocFormInput = z.input<typeof proposalBioflocSchema>;
export type ProposalBioflocFormValues = z.output<typeof proposalBioflocSchema>;
