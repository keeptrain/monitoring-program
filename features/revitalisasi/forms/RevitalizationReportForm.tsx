"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRevitalizationReportForm } from "../hooks/useRevitalizationReportForm";
import RevitalizationInformationBasicFormSection from "../components/RevitalizationInformationBasicFormSection";
import RevitalizationDetailRingkasanFormSection from "../components/RevitalizationDetailRingkasanFormSection";
import RevitalizationProductionAndMeasurementFormSection from "../components/RevitalizationProductionAndMeasurementFormSection";
import { Loader2 } from "lucide-react";
import { RevitalizationProgramLog } from "../types/revitalization";
import DocumentationsFormSection from "@/features/documentation/DocumentationsFormSection";
import { useIsMutating } from "@tanstack/react-query";
import { getDocumentationsUploadMutationKey } from "@/features/documentation/hooks/useDocumentationsUpload";
import { REVITALIZATION_BREADCRUMBS } from "../constants/revitalization-breadcrumbs";
import BreadcrumbHeader from "@/components/shared/BreadcrumbHeader";

/**
 * Komponen formulir untuk membuat atau mengubah laporan revitalisasi.
 * Digunakan pada rute:
 * - /dashboard/revitalisasi/[area]/create
 * - /dashboard/revitalisasi/report/[id]/edit
 */
export default function RevitalizationReportForm({
  areaId,
  initialData,
}: {
  areaId: number;
  initialData?: RevitalizationProgramLog;
}) {
  const isEdit = !!initialData;

  const {
    form,
    onSubmit,
    isPending: isFormPending,
    documentationError,
  } = useRevitalizationReportForm(areaId, initialData);

  const areaName = ["", "Bekasi", "Karawang", "Subang", "Indramayu"][areaId];

  const breadcrumbItems = [
    REVITALIZATION_BREADCRUMBS.DASHBOARD,
    REVITALIZATION_BREADCRUMBS.REVITALISASI,
    {
      label: areaName,
      href: `/dashboard/revitalisasi/${areaName.toLowerCase()}`,
    },
    { label: "Buat laporan" },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 space-y-1">
        <BreadcrumbHeader items={breadcrumbItems} />
        <h2 className="text-foreground text-2xl font-semibold tracking-tight">
          {isEdit
            ? `Ubah Laporan Area ${areaName}`
            : `Tambah Laporan untuk Area ${areaName ?? "-"}`}
        </h2>
        <p className="text-muted-foreground text-sm">
          Silahkan isi aktivitas program Revitalisasi Tambak Pantura di bawah
          ini
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-10">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Dasar & Kinerja</CardTitle>
            <CardDescription>
              Isi informasi dasar dan kinerja pelaporan area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RevitalizationInformationBasicFormSection
              form={form}
              isEdit={isEdit}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produksi & Batas Pengukuran</CardTitle>
            <CardDescription>
              Masukkan rincian kuantitas dan nilai produksi, batas pal, serta batas ukur koordinat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RevitalizationProductionAndMeasurementFormSection form={form} />
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
            <RevitalizationDetailRingkasanFormSection form={form} />
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
                storageBasePath="documentations/revitalization"
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
