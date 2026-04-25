import { z } from "zod";

export const bioflocScopeSchema = z.enum(["internal", "public"]);

export const bioflocProgramsPaginatedSchema = z.object({
  scope: bioflocScopeSchema,
  page: z.coerce.number().int().min(1),
  pageSize: z.coerce.number().int().min(1).max(100),
  search: z.string().trim().optional().default(""),
  province: z.string().trim().optional().default(""),
  year: z.coerce.number().int().optional(),
});

export type BioflocProgramsPaginatedInput = z.input<
  typeof bioflocProgramsPaginatedSchema
>;
export type BioflocProgramsPaginatedParams = z.output<
  typeof bioflocProgramsPaginatedSchema
>;
