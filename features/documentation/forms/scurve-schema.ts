import { z } from "zod";

export const sCurveSchema = z.object({
  s_curve_path: z.string().min(1, "Kurva S wajib diunggah"),
});

export type SCurveFormInput = z.input<typeof sCurveSchema>;
export type SCurveFormValue = z.output<typeof sCurveSchema>;
