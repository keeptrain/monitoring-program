"use client";

import z from "zod";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import {
  UseFormReturn,
  FieldValues,
  Path,
  useWatch,
  Control,
} from "react-hook-form";
import { handleGeoCoordinateValueChange } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { useCallback, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import dynamic from "next/dynamic";
import type { MapPinPickerValue } from "./MapPinPicker";

const MapPinPicker = dynamic(() => import("./MapPinPicker"), {
  ssr: false,
  loading: () => <Skeleton className="h-[320px] w-full rounded-md" />,
});

// ─── Schema patterns (reusable across different form schemas) ────────
export const locationCoordinateSchemaPattern = {
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

export const locationFormSchemaPattern = {
  location_name: z.string().min(1, "Nama lokasi harus diisi"),
  ...locationCoordinateSchemaPattern,
};

export const locationFormSchema = z.object(locationFormSchemaPattern);

// ─── Isolated coordinate watcher (prevents parent re-render) ────────
function CoordinateMapSync<T extends FieldValues>({
  control,
  setValue,
  isManualInput,
}: {
  control: Control<T>;
  setValue: UseFormReturn<T>["setValue"];
  isManualInput: boolean;
}) {
  const latitude = useWatch({ control, name: "latitude" as Path<T> });
  const longitude = useWatch({ control, name: "longitude" as Path<T> });

  const mapValue: MapPinPickerValue = {
    latitude: Number(latitude) || 0,
    longitude: Number(longitude) || 0,
  };

  const handleMapChange = useCallback(
    (value: MapPinPickerValue) => {
      setValue("latitude" as Path<T>, String(value.latitude) as never, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("longitude" as Path<T>, String(value.longitude) as never, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue],
  );

  return (
    <MapPinPicker
      value={mapValue}
      onChange={handleMapChange}
      disabled={isManualInput}
    />
  );
}

// ─── Main Component ─────────────────────────────────────────────────
export default function LocationFormSection<T extends FieldValues>({
  form,
}: {
  form: UseFormReturn<T>;
}) {
  const [isManualInput, setIsManualInput] = useState(false);

  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-4">
      <CoordinateMapSync
        control={control}
        setValue={setValue}
        isManualInput={isManualInput}
      />

      <div className="flex items-center gap-2">
        <Checkbox
          checked={isManualInput}
          onCheckedChange={setIsManualInput}
          label="Input manual koordinat"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel>Latitude</FieldLabel>
          <Input
            {...register("latitude" as Path<T>, {
              onChange: handleGeoCoordinateValueChange,
            })}
            pattern="^-?[0-9]*\.?[0-9]*$"
            inputMode="decimal"
            aria-invalid={!!errors["latitude"]}
            placeholder="-6.93095"
            disabled={!isManualInput}
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
            placeholder="107.46755"
            disabled={!isManualInput}
          />
          <FieldError>
            {errors["longitude"]?.message as string | undefined}
          </FieldError>
        </Field>
      </div>
    </div>
  );
}
