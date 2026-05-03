"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { UseFormReturn, FieldValues, Path, useWatch } from "react-hook-form";
import { handleGeoCoordinateValueChange } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useCallback, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import type { MapPinPickerValue } from "@/components/shared/MapPinPicker";

const MapPinPicker = dynamic(() => import("@/components/shared/MapPinPicker"), {
  ssr: false,
  loading: () => <Skeleton className="h-[320px] w-full rounded-md" />,
});

// Isolated coordinate watcher (prevents parent re-render)
function CoordinateMapSync<T extends FieldValues>({
  form,
}: {
  form: UseFormReturn<T>;
  isManualInput: boolean;
}) {
  const latitude = useWatch({
    control: form.control,
    name: "latitude" as Path<T>,
  });
  const longitude = useWatch({
    control: form.control,
    name: "longitude" as Path<T>,
  });

  const mapValue = useMemo<MapPinPickerValue>(
    () => ({
      latitude: Number(latitude) || 0,
      longitude: Number(longitude) || 0,
    }),
    [latitude, longitude],
  );

  const handleMapChange = useCallback(
    (value: MapPinPickerValue) => {
      form.setValue("latitude" as Path<T>, String(value.latitude) as never, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("longitude" as Path<T>, String(value.longitude) as never, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [form],
  );

  return <MapPinPicker value={mapValue} onChange={handleMapChange} />;
}

// Main Component
export default function ProposalLocationFormSection<T extends FieldValues>({
  form,
  isReadOnly = false,
}: {
  form: UseFormReturn<T>;
  isReadOnly?: boolean;
}) {
  const [isManualInput, setIsManualInput] = useState(false);

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-4">
      <CoordinateMapSync form={form} isManualInput={isReadOnly} />

      {!isReadOnly && (
        <Field orientation="horizontal">
          <Checkbox
            id="toggle-checkbox"
            name="toggle-checkbox"
            checked={isManualInput}
            onCheckedChange={(checked) => setIsManualInput(checked === true)}
          />
          <FieldLabel htmlFor="toggle-checkbox">
            Input koordinat manual
          </FieldLabel>
        </Field>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {isManualInput && (
          <>
            <Field>
              <FieldLabel>Latitude</FieldLabel>
              <Input
                {...register("latitude" as Path<T>, {
                  onChange: handleGeoCoordinateValueChange,
                })}
                pattern="^-?[0-9]*\.?[0-9]*$"
                inputMode="decimal"
                aria-invalid={!!errors["latitude"]}
                disabled={!isManualInput || isReadOnly}
              />
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
                disabled={!isManualInput || isReadOnly}
              />
            </Field>
          </>
        )}
      </div>
    </div>
  );
}
