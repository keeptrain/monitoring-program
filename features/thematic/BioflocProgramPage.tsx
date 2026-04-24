"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Grid2x2Icon, Plus } from "lucide-react";
import Link from "next/link";
import Datatable from "@/components/datatable/datatable";
import { ThematicProgramIndex } from "./types/thematic";
import { BioflocProgramTableColumns } from "./components/biofloc/BioflocProgramTableColumns";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import UpdateProgressSheet from "./components/biofloc/UpdateProgressSheet";
import { useUpdateProgressSheet } from "./hooks/useUpdateProgressSheet";
import ManageDocumentationsSheet from "@/features/documentation/components/ManageDocumentationsSheet";
import ProvinceSelect from "@/components/shared/ProvinceSelect";
import ProposalBioflocProgramPage from "@/features/thematic/pages/ProposalBioflocProgramPage";
import ManagementQuotaPage from "@/features/thematic/pages/ManagementQuotaPage";
import { Input } from "@/components/ui/input";

const BIOFLOC_PAGE_TABS = {
  PROGRAM: "program",
  PROPOSAL: "proposal",
  QUOTA: "quota",
} as const;

type BioflocPageTab =
  (typeof BIOFLOC_PAGE_TABS)[keyof typeof BIOFLOC_PAGE_TABS];

export default function BioflocProgramPage({
  data,
  programType,
}: {
  data: ThematicProgramIndex[];
  programType?: "biofloc" | "minapadi";
}) {
  const [activeTab, setActiveTab] = useState<BioflocPageTab>(
    BIOFLOC_PAGE_TABS.PROGRAM,
  );
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
        {activeTab === BIOFLOC_PAGE_TABS.PROGRAM && (
          <Button size="sm" asChild>
            <Link href={`/dashboard/thematic/biofloc/create`}>
              <Plus className="size-4" />
              Tambah Program
            </Link>
          </Button>
        )}
      </div>

      <div className="mb-6 flex items-center gap-2">
        <Button
          type="button"
          variant={
            activeTab === BIOFLOC_PAGE_TABS.PROGRAM ? "default" : "outline"
          }
          onClick={() => setActiveTab(BIOFLOC_PAGE_TABS.PROGRAM)}
        >
          Program
        </Button>
        <Button
          type="button"
          variant={
            activeTab === BIOFLOC_PAGE_TABS.PROPOSAL ? "default" : "outline"
          }
          onClick={() => setActiveTab(BIOFLOC_PAGE_TABS.PROPOSAL)}
        >
          Proposal
        </Button>
        <Button
          type="button"
          variant={
            activeTab === BIOFLOC_PAGE_TABS.QUOTA ? "default" : "outline"
          }
          onClick={() => setActiveTab(BIOFLOC_PAGE_TABS.QUOTA)}
        >
          Manajemen Kuota
        </Button>
      </div>

      {activeTab === BIOFLOC_PAGE_TABS.PROGRAM ? (
        data.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <Datatable
              columns={columns}
              data={data}
              onRowClick={handleRowClick}
              topContent={(table) => (
                <>
                  <ProvinceSelect
                    value={""}
                    onChange={(val) => console.log(val)}
                    allLabel="Semua Provinsi"
                    className="w-[200px]"
                  />
                  <div className="ml-auto w-1/4">
                    <Input
                      placeholder="Cari kelompok kdmp..."
                      value={
                        (table.getColumn("name")?.getFilterValue() as string) ??
                        ""
                      }
                      onChange={(event) => {
                        table
                          .getColumn("name")
                          ?.setFilterValue(event.target.value);
                      }}
                    />
                  </div>
                </>
              )}
            />

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
          </>
        )
      ) : activeTab === BIOFLOC_PAGE_TABS.PROPOSAL ? (
        <ProposalBioflocProgramPage />
      ) : (
        <ManagementQuotaPage />
      )}
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
