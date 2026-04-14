"use client";

import { Button } from "@/components/ui/button";
import { FileBarChart2, Plus } from "lucide-react";
import Link from "next/link";
import Datatable from "@/components/datatable/datatable";
import { ProgramPriorityReportIndex } from "./actions/program-priority-reports";
import { ProgramPriorityColumns } from "./components/ProgramPriorityTableColumns";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function ProgramPriorityReportPage({
  data,
}: {
  data: ProgramPriorityReportIndex[];
}) {
  const router = useRouter();
  const getColumns = useMemo(() => ProgramPriorityColumns(), []);

  const handleRowClick = (
    e: React.MouseEvent<HTMLTableRowElement>,
    row: ProgramPriorityReportIndex
  ) => {
    // Prevent navigation if clicking on a button or link inside the row
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) {
      return;
    }

    if (row.id) {
      router.push(`/dashboard/program-priority-report/${row.id}`);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Dashboard / Laporan
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Laporan Prioritas Program
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola dan pantau laporan capaian program prioritas DJPB.
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href="/dashboard/program-priority-report/form/create">
            <Plus className="mr-1.5 size-3.5" />
            Tambah Laporan
          </Link>
        </Button>
      </div>

      {/* Content */}
      {data.length === 0 ? (
        <EmptyState />
      ) : (
        <Datatable
          columns={getColumns}
          data={data}
          onRowClick={handleRowClick}
        />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center border border-border bg-background py-20 text-center">
      <div className="mb-4 flex size-12 items-center justify-center border border-border">
        <FileBarChart2 className="size-6 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">
        Belum ada laporan tersimpan
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Klik &quot;Tambah Laporan&quot; untuk mulai memasukkan data laporan.
      </p>
    </div>
  );
}
