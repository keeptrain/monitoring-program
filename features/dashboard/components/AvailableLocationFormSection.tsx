"use client";

import { UseFormReturn } from "react-hook-form";
import { AvailableLocationFormValues } from "../forms/available-location-schema";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

interface LocationFormProps {
  form: UseFormReturn<AvailableLocationFormValues>;
}

export default function AvailableLocationFormSection({
  form,
}: LocationFormProps) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Simulation mapping
    const lat = Number((-6.2 + (y / rect.height) * 0.1).toFixed(4));
    const long = Number((106.8 + (x / rect.width) * 0.1).toFixed(4));

    setValue("latitude", lat, { shouldDirty: true, shouldValidate: true });
    setValue("longitude", long, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <Field>
        <FieldLabel htmlFor="name">Nama Lokasi</FieldLabel>
        <Input
          {...register("name")}
          id="name"
          placeholder="e.g. Kantor Wilayah DJPb"
          aria-invalid={!!errors.name}
        />
        <FieldError>{errors.name?.message}</FieldError>
      </Field>

      <input type="hidden" {...register("latitude", { valueAsNumber: true })} />
      <input
        type="hidden"
        {...register("longitude", { valueAsNumber: true })}
      />

      <Field>
        <FieldLabel>Pilih Titik Lokasi (Map Mockup)</FieldLabel>
        <div
          onClick={handleMapClick}
          className="relative aspect-video w-full bg-neutral-100 border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center overflow-hidden cursor-crosshair hover:bg-neutral-200 transition-colors"
        >
          <div className="absolute inset-0 bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] bg-size-[16px_16px] opacity-50" />
          <MapPin className="size-12 text-neutral-400 mb-2 animate-bounce" />
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-widest">
            Klik untuk menandai lokasi di peta
          </p>
          <div className="absolute bottom-4 right-4 bg-white px-2 py-1 text-[10px] font-mono border border-neutral-200 shadow-sm">
            LAT: {watch("latitude")}, LONG: {watch("longitude")}
          </div>
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground uppercase font-bold">
          * Fitur peta sedang dalam pengembangan (Mockup Only)
        </p>
      </Field>
    </div>
  );
}
