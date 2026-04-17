"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import Datatable from "@/components/datatable/datatable";
import {
  IsfReport,
  getIsfProgramReportsColumns,
} from "./components/IsfStepProgramTableColumns";
import { STEPS } from "./constants/isf-step";

const DUMMY_DATA: IsfReport[] = [
  {
    id: 1,
    name: "Laporan Persiapan Awal",
    created_at: "2024-04-10T08:00:00Z",
    updated_at: "2024-04-12T14:30:00Z",
    progress: 100,
    status: "Selesai",
  },
  {
    id: 2,
    name: "Laporan Pelaksanaan Lapangan",
    created_at: "2024-04-13T09:00:00Z",
    updated_at: "2024-04-15T11:45:00Z",
    progress: 45,
    status: "Sedang Berjalan",
  },
  {
    id: 3,
    name: "Laporan Monitoring Bulanan",
    created_at: "2024-04-01T10:00:00Z",
    updated_at: "2024-04-16T16:20:00Z",
    progress: 15,
    status: "Baru",
  },
];

export default function IsfStepProgramPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step } = React.use(params);
  const stepData = STEPS.find((s) => s.id === parseInt(step));
  const columns = useMemo(() => getIsfProgramReportsColumns(), []);

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

      <Datatable columns={columns} data={DUMMY_DATA} />
    </div>
  );
}
