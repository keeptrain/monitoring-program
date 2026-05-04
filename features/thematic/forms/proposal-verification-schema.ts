import { z } from "zod";

export const proposalVerificationSchema = z
  .object({
    status: z.enum(["approved", "rejected"]),
    rejectionReason: z.string().nullable(),
  })
  .refine((data) => {
    if (data.status === "rejected" && !data.rejectionReason) {
      return false;
    }
    return true;
  });

export type ProposalVerificationFormValues = z.infer<
  typeof proposalVerificationSchema
>;
