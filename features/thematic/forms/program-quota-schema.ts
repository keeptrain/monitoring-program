import { z } from "zod";

export const PROGRAM_QUOTA_YEAR = 2026 as const;
export const PROGRAM_QUOTA_TYPE = "biofloc_thematic" as const;

export const programQuotaUpdateSchema = z.object({
  quota_limit: z.coerce
    .number({ error: "Kuota harus berupa angka" })
    .int()
    .min(0, "Kuota minimal 0"),
});

export type ProgramQuotaUpdateInput = z.input<typeof programQuotaUpdateSchema>;
export type ProgramQuotaUpdateValues = z.output<typeof programQuotaUpdateSchema>;
