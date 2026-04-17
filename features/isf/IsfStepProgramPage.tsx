"use client";

import { useCallback, useMemo, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import Datatable from "@/components/datatable/datatable";
import {
  IsfReport,
  getIsfProgramReportsColumns,
} from "./components/IsfStepProgramTableColumns";
import { STEPS } from "./constants/isf-step";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";

export default function IsfStepProgramPage({
  step,
  data,
}: {
  step: number;
  data: IsfReport[];
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const stepData = STEPS.find((s) => s.id === step);

  const handleDelete = useCallback(
    (row: IsfReport) => {
      const confirmed = window.confirm("Hapus laporan ini?");
      if (!confirmed) {
        return;
      }

      startTransition(async () => {
        try {
          const response = await fetch(
            `/api/isf/program-logs/${row.id}?stepId=${step}`,
            {
              method: "DELETE",
            },
          );
          if (!response.ok) {
            throw new Error("Failed to delete ISF log");
          }
          router.refresh();
        } catch (error) {
          console.error("Failed to delete ISF log:", error);
        }
      });
    },
    [router, step],
  );

  const columns = useMemo(
    () => getIsfProgramReportsColumns(handleDelete),
    [handleDelete],
  );

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
        <Button size="sm" asChild>
          <Link href={`/dashboard/isf/create?step=${step}`}>
            <PlusIcon className="mr-1.5 size-3.5" />
            Tambah Laporan
          </Link>
        </Button>
      </div>

      <Datatable columns={columns} data={data} onRowClick={handleRowClick} />
      {isPending ? (
        <p className="text-muted-foreground mt-3 text-xs">Memproses...</p>
      ) : null}
    </div>
  );
}
