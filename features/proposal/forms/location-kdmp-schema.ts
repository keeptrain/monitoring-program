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
  province_id: z.string().min(1, "Provinsi wajib diisi"),
  regency_id: z.string().min(1, "Kabupaten/Kota wajib diisi"),
  district_id: z.string().min(1, "Kecamatan wajib diisi"),
  village_id: z.string().min(1, "Desa/Kelurahan wajib diisi"),
});

export type LocationKdmpInput = z.input<typeof locationKdmpSchema>;
export type LocationKdmpValues = z.infer<typeof locationKdmpSchema>;
