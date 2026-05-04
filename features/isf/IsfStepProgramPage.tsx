"use client";

import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Datatable from "@/components/datatable/datatable";
import {
  IsfReport,
  IsfStepProgramTableColumns,
} from "./components/IsfStepProgramTableColumns";
import { STEPS } from "./constants/isf-step";
import { useRouter } from "next/navigation";
import { IsfReportDateWindow } from "./utils/report-date-window";
import ManageDocumentationsSheet from "@/features/documentation/components/ManageDocumentationsSheet";
import { deleteIsfProgramLog } from "@/features/isf/actions/isf-program-logs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FieldError } from "@/components/ui/field";
import { toast } from "sonner";

export default function IsfStepProgramPage({
  step,
  data,
  availableDate,
}: {
  step: number;
  data: IsfReport[];
  availableDate: IsfReportDateWindow;
}) {
  const router = useRouter();
  const [openSheet, setOpenSheet] = useState<boolean | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const stepData = STEPS.find((s) => s.id === step);
  const {
    minDate,
    maxDate,
    canCreate: isCanCreateReport,
    errorMessage,
  } = availableDate;

  const handleUpdateDocumentations = useCallback((id: string) => {
    setSelectedReportId(id);
    setOpenSheet(true);
  }, []);

  const handleDeleteReport = useCallback(
    async (id: string) => {
      if (window.confirm("Apakah Anda yakin ingin menghapus laporan ini?")) {
        try {
          // Note: using 'step' which is the zone id
          await deleteIsfProgramLog(id, step);
          router.refresh();
          toast.success("Laporan berhasil dihapus.");
        } catch (error) {
          console.error(error);
          alert("Gagal menghapus laporan.");
        }
      }
    },
    [step, router],
  );

  const columns = useMemo(
    () =>
      IsfStepProgramTableColumns({
        onUpdateDocumentations: handleUpdateDocumentations,
        onDeleteReport: handleDeleteReport,
      }),
    [handleUpdateDocumentations, handleDeleteReport],
  );

  const handleCreateHref = useMemo(() => {
    const params = new URLSearchParams({ step: String(step) });

    if (minDate) {
      params.set("minDate", minDate);
    }
    if (maxDate) {
      params.set("maxDate", maxDate);
    }

    return `/dashboard/isf/create?${params.toString()}`;
  }, [maxDate, minDate, step]);

  const handleRowClick = (row: IsfReport) => {
    router.push(`/dashboard/isf/report/${row.id}`);
  };

  return (
    <>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
          <div>
            <p className="text-muted-foreground mb-1 text-xs font-medium tracking-widest uppercase">
              Dashboard / ISF / Zona {step}
            </p>
            <h1 className="text-foreground text-2xl font-semibold tracking-tight">
              Laporan Zona {step}: {stepData?.name}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Kelola data dan pantau progres aktivitas untuk tahapan{" "}
              {stepData?.name}.
            </p>
          </div>
          <div className="space-y-1">
            <Button
              disabled={!isCanCreateReport}
              onClick={() => router.push(handleCreateHref)}
            >
              <PlusIcon className="size-4" />
              Tambah Laporan
            </Button>
          </div>
        </div>

        {!isCanCreateReport && (
          <FieldError>
            {errorMessage ?? "Belum ada tanggal laporan yang tersedia."}
          </FieldError>
        )}

        <Datatable columns={columns} data={data} onRowClick={handleRowClick} />
      </div>

      {openSheet !== null && selectedReportId !== null && (
        <Sheet open={openSheet} onOpenChange={setOpenSheet}>
          <SheetContent className="data-[side=right]:sm:max-w-[600px]">
            <SheetHeader>
              <SheetTitle>Kelola Dokumentasi</SheetTitle>
              <SheetDescription>
                Tambah atau hapus foto dokumentasi. <br /> Klik nama file untuk
                preview, perubahan disimpan saat menekan &quot;Simpan&quot;.
              </SheetDescription>
            </SheetHeader>
            <ManageDocumentationsSheet
              programType="isf"
              programId={selectedReportId!}
              onSuccess={() => setOpenSheet(false)}
            />
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
