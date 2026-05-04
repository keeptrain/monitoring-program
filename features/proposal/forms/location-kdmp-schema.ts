import { locationCoordinateSchema } from "@/components/shared/location-schema";
import z from "zod";

export const locationKdmpSchema = z.object({
  latitude: z.preprocess(
    (v) => (v === "" ? undefined : v),
    locationCoordinateSchema.shape.latitude,
  ),
  longitude: z.preprocess(
    (v) => (v === "" ? undefined : v),
    locationCoordinateSchema.shape.longitude,
  ),

  landSlope: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.coerce.number("Harus berupa angka").min(0, "Minimal 0%"),
  ),
  province_code: z.string().min(1, "Provinsi wajib diisi"),
  province_name: z.string().optional(),
  regency_code: z.string().min(1, "Kabupaten/Kota wajib diisi"),
  regency_name: z.string().optional(),
  district_code: z.string().min(1, "Kecamatan wajib diisi"),
  district_name: z.string().optional(),
  village_code: z.string().min(1, "Desa/Kelurahan wajib diisi"),
  village_name: z.string().optional(),
});

export type LocationKdmpInput = z.input<typeof locationKdmpSchema>;
export type LocationKdmpValues = z.infer<typeof locationKdmpSchema>;
