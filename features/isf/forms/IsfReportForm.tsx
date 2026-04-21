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
import { Loader2 } from "lucide-react";
import { IsfProgramLog } from "../types/isf";
import DocumentationsFormSection from "@/features/documentation/DocumentationsFormSection";
import SCurveFormSection from "@/features/documentation/SCurveFormSection";
import { useIsMutating } from "@tanstack/react-query";
import { getDocumentationsUploadMutationKey } from "@/features/documentation/hooks/useDocumentationsUpload";

export default function IsfReportForm({
  zone,
  initialData,
  initialMinDate,
  initialMaxDate,
}: {
  zone: string;
  initialData?: IsfProgramLog;
  initialMinDate?: string;
  initialMaxDate?: string;
}) {
  const isEdit = !!initialData;

  const {
    form,
    onSubmit,
    isPending: isFormPending,
    documentationError,
  } = useIsfReportForm(zone, initialData, initialMinDate, initialMaxDate);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 space-y-1">
        <p className="text-muted-foreground mb-1 text-xs font-medium tracking-widest uppercase">
          Dashboard / ISF / Laporan / {isEdit ? "Ubah" : "Buat"}
        </p>
        <h2 className="text-foreground text-2xl font-semibold tracking-tight">
          {isEdit
            ? `Ubah Laporan Zona ${zone}`
            : `Tambah Laporan untuk Zona ${zone ?? "-"}`}
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
              minDate={initialMinDate}
              maxDate={initialMaxDate}
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
            <CardDescription>Unggah lampiran kurva S</CardDescription>
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
                Unggah dokumentasi pengerjaan program (Sebelum & Sesudah)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentationsFormSection
                mode="create"
                form={form}
                externalErrorMessage={documentationError}
                storageBasePath="isf"
              />
            </CardContent>
          </Card>
        )}

        <SubmitButton isPending={isFormPending} isEdit={isEdit} />
      </form>
    </div>
  );
}

function SubmitButton({
  isPending,
  isEdit,
}: {
  isPending: boolean;
  isEdit: boolean;
}) {
  const isUploading =
    useIsMutating({
      mutationKey: getDocumentationsUploadMutationKey(),
    }) > 0;

  const isSaving = isPending || isUploading;

  return (
    <Button type="submit" disabled={isSaving} className="w-full">
      {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
      {isEdit ? "Simpan Perubahan" : "Simpan Laporan"}
    </Button>
  );
}
