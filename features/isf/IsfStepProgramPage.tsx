"use client";

import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Datatable from "@/components/datatable/datatable";
import {
  IsfReport,
  getIsfProgramReportsColumns,
} from "./components/IsfStepProgramTableColumns";
import { STEPS } from "./constants/isf-step";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { IsfReportDateWindow } from "./utils/report-date-window";
import ManageDocumentationsSheet from "@/features/documentation/components/ManageDocumentationsSheet";

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
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);

  const stepData = STEPS.find((s) => s.id === step);
  const {
    minDate,
    maxDate,
    canCreate: isCanCreateReport,
    errorMessage,
  } = availableDate;

  const handleUpdateDocumentations = useCallback((id: number) => {
    setSelectedReportId(id);
  }, []);

  const columns = useMemo(
    () =>
      getIsfProgramReportsColumns({
        onUpdateDocumentations: handleUpdateDocumentations,
      }),
    [handleUpdateDocumentations],
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

  const handleRowClick = (
    e: MouseEvent<HTMLTableRowElement>,
    row: IsfReport,
  ) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) {
      return;
    }
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
          <p className="text-muted-foreground text-xs">
            {errorMessage ?? "Belum ada tanggal laporan yang tersedia."}
          </p>
        )}

        <Datatable columns={columns} data={data} onRowClick={handleRowClick} />
      </div>

      <ManageDocumentationsSheet
        programId={selectedReportId}
        programType="isf"
        isOpen={selectedReportId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedReportId(null);
        }}
      />
    </>
  );
}
