"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useThematicProgramForm } from "../hooks/useThematicProgramForm";
import ThematicInformationBasicFormSection from "../components/ThematicInformationBasicFormSection";
import { ThematicProgramDetail } from "../types/thematic";
import { Loader2 } from "lucide-react";
import LocationFormSection from "@/components/shared/LocationFormSection";
import SCurveFormSection from "@/features/documentation/SCurveFormSection";
import DocumentationsFormSection from "@/features/documentation/DocumentationsFormSection";

export default function BioflocProgramForm({
  initialData,
}: {
  initialData?: ThematicProgramDetail | null;
}) {
  const isEdit = !!initialData;
  const { form, onSubmit, isPending } = useThematicProgramForm(initialData);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 space-y-1">
        <p className="text-muted-foreground mb-1 text-xs font-medium tracking-widest uppercase">
          Dashboard / Tematik / {isEdit ? "Ubah" : "Buat"}
        </p>
        <h2 className="text-foreground text-2xl font-semibold tracking-tight">
          {isEdit ? "Ubah KDMP" : "Tambah KDMP Baru"}
        </h2>
        <p className="text-muted-foreground text-sm">
          Silahkan isi informasi KDMP di bawah ini
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Dasar</CardTitle>
            <CardDescription>Isi informasi dasar program KDMP</CardDescription>
          </CardHeader>
          <CardContent>
            <ThematicInformationBasicFormSection form={form} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lokasi</CardTitle>
            <CardDescription>Isi informasi lokasi program</CardDescription>
          </CardHeader>
          <CardContent>
            <LocationFormSection form={form} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kurva S</CardTitle>
            <CardDescription>
              Unggah visualisasi kurva S program
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SCurveFormSection form={form} />
          </CardContent>
        </Card>

        {!isEdit && (
          <Card>
            <CardHeader>
              <CardTitle>Dokumentasi</CardTitle>
              <CardDescription>
                Unggah dokumentasi pengerjaan program
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentationsFormSection
                mode="create"
                form={form}
                storageBasePath="thematic"
              />
            </CardContent>
          </Card>
        )}

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
          {isEdit ? "Simpan Perubahan" : "Simpan"}
        </Button>
      </form>
    </div>
  );
}
