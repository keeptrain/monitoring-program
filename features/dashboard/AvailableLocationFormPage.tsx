"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useAvailableLocationForm from "./hooks/useAvailableLocationForm";
import AvailableLocationFormSection from "./components/AvailableLocationFormSection";
import { useTransition } from "react";
import { AvailableLocationFormValues } from "./forms/available-location-schema";

export default function AvailableLocationFormPage({
  initialValues,
  locationId,
}: {
  initialValues?: AvailableLocationFormValues;
  locationId?: number;
}) {
  const [isPending, startTransition] = useTransition();
  const { form, onSubmit } = useAvailableLocationForm(initialValues, locationId);

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    startTransition(() => {
      onSubmit();
    });
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Dashboard / Lokasi / {locationId ? "Ubah" : "Buat"}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {locationId ? "Ubah Lokasi Monitoring" : "Tambah Lokasi Monitoring"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {locationId
            ? "Perbarui data lokasi untuk dipantau dalam program prioritas."
            : "Daftarkan lokasi baru untuk dipantau dalam program prioritas."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Detail Lokasi</CardTitle>
            <CardDescription>
              Tentukan nama dan koordinat lokasi monitoring.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AvailableLocationFormSection form={form} />
          </CardContent>
        </Card>

        <Button type="submit" className="w-full mt-4" disabled={isPending}>
          {isPending ? "Menyimpan..." : locationId ? "Ubah" : "Submit"}
        </Button>
      </form>
    </div>
  );
}
