"use client";

import { Button } from "@/components/ui/button";
import { Grid2x2Icon, Plus } from "lucide-react";
import Link from "next/link";
import Datatable from "@/components/datatable/datatable";
import { ThematicProgramIndex } from "./types/thematic";
import { BioflocProgramTableColumns } from "./components/biofloc/BioflocProgramTableColumns";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import UpdateProgressSheet from "./components/biofloc/UpdateProgressSheet";
import { useUpdateProgressSheet } from "./hooks/useUpdateProgressSheet";
import ManageDocumentationsSheet from "@/features/documentation/components/ManageDocumentationsSheet";

export default function BioflocProgramPage({
  data,
  programType,
}: {
  data: ThematicProgramIndex[];
  programType?: "biofloc" | "minapadi";
}) {
  const router = useRouter();
  const {
    form,
    onSubmit,
    sheetOpen,
    setSheetOpen,
    openForRow,
    submitError,
    isPending: isUpdatingProgress,
    selectedRow,
  } = useUpdateProgressSheet();

  const columns = useMemo(
    () => BioflocProgramTableColumns({ onOpenProgress: openForRow }),
    [openForRow],
  );

  const handleRowClick = useCallback(
    (row: ThematicProgramIndex) => {
      if (row.id && programType) {
        router.push(`/dashboard/thematic/${programType}/${row.id}`);
      }
    },
    [programType, router],
  );

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
        <div>
          <p className="text-muted-foreground mb-1 text-xs font-medium tracking-widest uppercase">
            Dashboard / Tematik / Bioflok
          </p>
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">
            Program Tematik Bioflok
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Kelola dan pantau program tematik bioflok DJPB.
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href={`/dashboard/thematic/biofloc/create`}>
            <Plus className="size-4" />
            Tambah Program
          </Link>
        </Button>
      </div>

      {data.length === 0 ? (
        <EmptyState />
      ) : (
        <Datatable columns={columns} data={data} onRowClick={handleRowClick} />
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          className="data-[side=right]:sm:max-w-[600px]"
        >
          <SheetHeader>
            <SheetTitle>Update Progress & Dokumentasi</SheetTitle>
            <SheetDescription>
              Ubah persentase capaian lalu kelola dokumentasi program.
            </SheetDescription>
          </SheetHeader>
          <UpdateProgressSheet
            form={form}
            setSheetOpen={setSheetOpen}
            onSubmit={onSubmit}
            submitError={submitError}
            isPending={isUpdatingProgress}
          />
          {selectedRow && (
            <ManageDocumentationsSheet
              programType="biofloc_thematic"
              programId={selectedRow.id}
              onSuccess={() => setSheetOpen(false)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border-border bg-background flex flex-col items-center justify-center border py-20 text-center">
      <div className="border-border mb-4 flex size-12 items-center justify-center border">
        <Grid2x2Icon className="text-muted-foreground size-6" />
      </div>
      <p className="text-foreground text-sm font-medium">
        Belum ada data tersimpan
      </p>
      <p className="text-muted-foreground mt-1 text-xs">
        Klik &quot;Tambah Program&quot; untuk mulai memasukkan data baru.
      </p>
    </div>
  );
}
