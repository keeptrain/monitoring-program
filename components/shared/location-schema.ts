import { z } from "zod";

export const locationCoordinateSchema = z.object({
  latitude: z.coerce.number().min(-90).max(90, "Latitude tidak valid"),
  longitude: z.coerce.number().min(-180).max(180, "Longitude tidak valid"),
});

export const locationCoordinateSchemaPattern = {
  latitude: z.coerce.number().min(-90).max(90, "Latitude tidak valid"),
  longitude: z.coerce.number().min(-180).max(180, "Longitude tidak valid"),
};

export const locationAdministrativeSchemaPattern = {
  province_id: z.string().optional(),
  regency_id: z.string().optional(),
};

export const requiredLocationAdministrativeSchemaPattern = {
  province_id: z.string().min(1, "Provinsi wajib diisi"),
  regency_id: z.string().min(1, "Kabupaten/Kota wajib diisi"),
};

export const locationFormSchemaPattern = {
  ...locationAdministrativeSchemaPattern,
  ...locationCoordinateSchemaPattern,
};

export type LocationFields = z.infer<typeof locationCoordinateSchemaPattern>;
