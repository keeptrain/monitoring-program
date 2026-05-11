import { z } from "zod";

export const sCurveSchema = z.object({
  s_curve_path: z.string(),
});

export type SCurveFormInput = z.input<typeof sCurveSchema>;
export type SCurveFormValue = z.output<typeof sCurveSchema>;
