"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsfReportForm } from "../hooks/useIsfReportForm";
import IsfInformationBasicFormSection from "../components/IsfInformationBasicFormSection";
import IsfDetailRingkasanFormSection from "../components/IsfDetailRingkasanFormSection";
import IsfSCurveFormSection from "../components/IsfSCurveFormSection";
import { Loader2 } from "lucide-react";
import { IsfProgramLog } from "../types/isf";
import DocumentationsFormSection from "@/features/documentation/DocumentationsFormSection";

export default function IsfReportForm({
  initialStep,
  initialData,
  initialMinDate,
  initialMaxDate,
}: {
  initialStep?: string;
  initialData?: IsfProgramLog;
  initialMinDate?: string;
  initialMaxDate?: string;
}) {
  const { form, onSubmit, isPending, documentationError } = useIsfReportForm(
    initialStep,
    initialData,
    initialMinDate,
    initialMaxDate,
  );

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 space-y-1">
        <p className="text-muted-foreground mb-1 text-xs font-medium tracking-widest uppercase">
          Dashboard / ISF / Laporan / {initialData ? "Ubah" : "Buat"}
        </p>
        <h2 className="text-foreground text-2xl font-semibold tracking-tight">
          {initialData
            ? `Ubah Laporan Zona ${initialData.step_id}`
            : `Tambah Laporan untuk Zona ${initialStep ?? "-"}`}
        </h2>
        <p className="text-muted-foreground text-sm">
          Silahkan isi aktivitas program Integrated Shrimp Farming (ISF) di
          bawah ini
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-10">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Dasar & Kinerja</CardTitle>
            <CardDescription>
              Isi informasi dasar dan kinerja pelaporan tahapan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IsfInformationBasicFormSection
              form={form}
              minDate={initialData ? undefined : initialMinDate}
              maxDate={initialData ? undefined : initialMaxDate}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detail Capaian</CardTitle>
            <CardDescription>
              Uraian naratif mengenai hasil, kendala, dan tindak lanjut
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IsfDetailRingkasanFormSection form={form} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kurva S</CardTitle>
            <CardDescription>Unggah lampiran kurva S tahapan</CardDescription>
          </CardHeader>
          <CardContent>
            <IsfSCurveFormSection form={form} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dokumentasi</CardTitle>
            <CardDescription>
              Unggah dokumentasi pengerjaan program (Sebelum & Sesudah)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentationsFormSection
              form={form}
              externalErrorMessage={documentationError}
              storageBasePath="isf"
            />
          </CardContent>
        </Card>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
          {initialData ? "Simpan Perubahan" : "Simpan Laporan"}
        </Button>
      </form>
    </div>
  );
}
