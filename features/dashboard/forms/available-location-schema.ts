import { z } from "zod";

export const availableLocationSchema = z.object({
  name: z.string().min(1, "Nama lokasi dibutuhkan"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type AvailableLocationFormValues = z.infer<
  typeof availableLocationSchema
>;
