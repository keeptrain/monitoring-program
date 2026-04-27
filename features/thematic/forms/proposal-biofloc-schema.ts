import { z } from "zod";
import { locationCoordinateSchemaPattern } from "@/components/shared/LocationFormSection";

export const proposalBioflocSchema = z
  .object({
    name: z.string().min(1, "Nama KDMP wajib diisi"),
    province_id: z.string().min(1, "Provinsi wajib diisi"),
    regency_id: z.string().min(1, "Kabupaten/Kota wajib diisi"),
    district: z.string().min(1, "Kelurahan wajib diisi"),
    village: z.string().min(1, "Desa wajib diisi"),
    proposal_path: z.string().min(1, "File proposal wajib diunggah"),
  })
  .extend({
    ...locationCoordinateSchemaPattern,
  });

export type ProposalBioflocFormInput = z.input<typeof proposalBioflocSchema>;
export type ProposalBioflocFormValues = z.output<typeof proposalBioflocSchema>;
