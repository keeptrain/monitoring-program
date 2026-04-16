import z from "zod";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";
import { handleGeoCoordinateValueChange } from "@/lib/utils";

export const locationFormSchemaPattern = {
  location_name: z.string().min(1, "Nama lokasi harus diisi"),
  latitude: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.coerce
      .number({ error: "Latitude harus diisi" })
      .min(-90, "Latitude minimal -90")
      .max(90, "Latitude maksimal 90"),
  ),
  longitude: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.coerce
      .number({ error: "Longitude harus diisi" })
      .min(-180, "Longitude minimal -180")
      .max(180, "Longitude maksimal 180"),
  ),
};

export const locationFormSchema = z.object(locationFormSchemaPattern);

export default function LocationFormSection<T extends FieldValues>({
  form,
}: {
  form: UseFormReturn<T>;
}) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Field className="col-span-2">
        <FieldLabel>Nama Lokasi</FieldLabel>
        <Input
          {...register("location_name" as Path<T>)}
          aria-invalid={!!errors["location_name"]}
          placeholder="Masukkan Nama Lokasi"
        />
        <FieldError>
          {errors["location_name"]?.message as string | undefined}
        </FieldError>
      </Field>

      <Field>
        <FieldLabel>Latitude</FieldLabel>
        <Input
          {...register("latitude" as Path<T>, {
            onChange: handleGeoCoordinateValueChange,
          })}
          defaultValue={"12"}
          pattern="^-?[0-9]*\.?[0-9]*$"
          inputMode="decimal"
          aria-invalid={!!errors["latitude"]}
          placeholder="-1.2345"
        />
        <FieldError>
          {errors["latitude"]?.message as string | undefined}
        </FieldError>
      </Field>

      <Field>
        <FieldLabel>Longitude</FieldLabel>
        <Input
          {...register("longitude" as Path<T>, {
            onChange: handleGeoCoordinateValueChange,
          })}
          pattern="^-?[0-9]*\.?[0-9]*$"
          inputMode="decimal"
          aria-invalid={!!errors["longitude"]}
          placeholder="6.7890"
        />
        <FieldError>
          {errors["longitude"]?.message as string | undefined}
        </FieldError>
      </Field>
    </div>
  );
}
