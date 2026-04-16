"use client";

import { Button } from "@/components/ui/button";
import { FileBarChart2, Plus } from "lucide-react";
import Link from "next/link";
import Datatable from "@/components/datatable/datatable";
import { ThematicProgramIndex } from "./types/thematic";
import { ThematicProgramColumns } from "./components/ThematicProgramTableColumns";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useUpdateProgressSheet } from "./hooks/useUpdateProgressSheet";
import UpdateProgressSheet from "./components/UpdateProgressSheet";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function ThematicProgramPage({
  data,
}: {
  data: ThematicProgramIndex[];
}) {
  const router = useRouter();
  const { form, openForRow, sheetOpen, setSheetOpen, onSubmit } =
    useUpdateProgressSheet();

  const getColumns = useMemo(
    () => ThematicProgramColumns({ onOpenProgress: openForRow }),
    [openForRow],
  );

  const handleRowClick = (
    e: React.MouseEvent<HTMLTableRowElement>,
    row: ThematicProgramIndex,
  ) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) {
      return;
    }

    if (row.id) {
      router.push(`/dashboard/thematic/${row.id}`);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
        <div>
          <p className="text-muted-foreground mb-1 text-xs font-medium tracking-widest uppercase">
            Dashboard / Tematik
          </p>
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">
            Program Tematik
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Kelola dan pantau program KDMP tematik DJPB.
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href="/dashboard/thematic/create">
            <Plus className="mr-1.5 size-3.5" />
            Tambah Program
          </Link>
        </Button>
      </div>

      {data.length === 0 ? (
        <EmptyState />
      ) : (
        <Datatable
          columns={getColumns}
          data={data}
          onRowClick={handleRowClick}
        />
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Update Progress & Dokumentasi</SheetTitle>
            <SheetDescription>
              Ubah persentase capaian dan tambahkan dokumentasi tanpa mengganti
              yang sudah ada.
            </SheetDescription>
          </SheetHeader>
          <UpdateProgressSheet
            form={form}
            setSheetOpen={setSheetOpen}
            onSubmit={onSubmit}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border-border bg-background flex flex-col items-center justify-center border py-20 text-center">
      <div className="border-border mb-4 flex size-12 items-center justify-center border">
        <FileBarChart2 className="text-muted-foreground size-6" />
      </div>
      <p className="text-foreground text-sm font-medium">
        Belum ada program tersimpan
      </p>
      <p className="text-muted-foreground mt-1 text-xs">
        Klik &quot;Tambah Program&quot; untuk mulai memasukkan data laporan.
      </p>
    </div>
  );
}
