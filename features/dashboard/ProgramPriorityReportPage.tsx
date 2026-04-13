"use client";

import DashboardNavbar from "@/components/DashboardNavbar";
import { Button } from "@/components/ui/button";
import { FileBarChart2, Plus } from "lucide-react";

export default function ProgramPriorityReportPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNavbar />

      <main className="flex-1 bg-muted/20 px-6 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between gap-4">
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
            <Button size="sm">
              <Plus className="mr-1.5 size-3.5" />
              Tambah Laporan
            </Button>
          </div>

          {/* Empty state placeholder */}
          <div className="flex flex-col items-center justify-center border border-border bg-background py-20 text-center">
            <div className="mb-4 flex size-12 items-center justify-center border border-border">
              <FileBarChart2 className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Belum ada laporan tersimpan
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Klik &quot;Tambah Laporan&quot; untuk mulai memasukkan data
              laporan.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
