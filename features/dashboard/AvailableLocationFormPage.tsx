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

export default function AvailableLocationFormPage() {
  const { form, onSubmit } = useAvailableLocationForm();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Dashboard / Lokasi / Buat
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Tambah Lokasi Monitoring
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Daftarkan lokasi baru untuk dipantau dalam program prioritas.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
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

        <Button
          type="submit"
          className="w-full mt-4 h-12 text-sm font-bold uppercase tracking-widest"
        >
          Simpan Lokasi
        </Button>
      </form>
    </div>
  );
}
