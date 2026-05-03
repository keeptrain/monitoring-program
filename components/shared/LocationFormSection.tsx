"use client";

import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import {
  UseFormReturn,
  FieldValues,
  Path,
  useWatch,
  Control,
  Controller,
} from "react-hook-form";
import { handleGeoCoordinateValueChange } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { useCallback, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import dynamic from "next/dynamic";
import type { MapPinPickerValue } from "./MapPinPicker";
import ProvinceSelect from "./ProvinceSelect";

const MapPinPicker = dynamic(() => import("./MapPinPicker"), {
  ssr: false,
  loading: () => <Skeleton className="h-[320px] w-full rounded-md" />,
});

// Isolated coordinate watcher (prevents parent re-render)
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

// Main Component
export default function LocationFormSection<T extends FieldValues>({
  form,
  isReadOnly = false,
  showAdministrativeFields = false,
}: {
  form: UseFormReturn<T>;
  isReadOnly?: boolean;
  showAdministrativeFields?: boolean;
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
      {showAdministrativeFields && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>Provinsi</FieldLabel>
            <Controller
              control={control}
              name={"province_id" as Path<T>}
              render={({ field }) => (
                <ProvinceSelect
                  value={(field.value as string) ?? ""}
                  onChange={field.onChange}
                  allLabel="Pilih Provinsi"
                  showAll
                  className="w-full"
                  aria-invalid={!!errors["province_id"]}
                />
              )}
            />
            <FieldError>
              {errors["province_id"]?.message as string | undefined}
            </FieldError>
          </Field>

          <Field>
            <FieldLabel>Kabupaten/Kota</FieldLabel>
            <Input
              {...register("regency_id" as Path<T>)}
              aria-invalid={!!errors["regency_id"]}
              placeholder="Contoh: Sidoarjo"
              disabled={isReadOnly}
            />
            <FieldError>
              {errors["regency_id"]?.message as string | undefined}
            </FieldError>
          </Field>
        </div>
      )}

      <CoordinateMapSync
        control={control}
        setValue={setValue}
        isManualInput={isManualInput || isReadOnly}
      />

      {!isReadOnly && (
        <div className="flex items-center gap-2">
          <Checkbox
            id="manual-input"
            checked={isManualInput}
            onCheckedChange={(checked) => setIsManualInput(checked === true)}
          />
          <label
            htmlFor="manual-input"
            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Input manual koordinat
          </label>
        </div>
      )}

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
            disabled={!isManualInput || isReadOnly}
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
            disabled={!isManualInput || isReadOnly}
          />
          <FieldError>
            {errors["longitude"]?.message as string | undefined}
          </FieldError>
        </Field>
      </div>
    </div>
  );
}
