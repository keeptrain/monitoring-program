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
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import UpdateProgressSheet from "./components/biofloc/UpdateProgressSheet";
import { useUpdateProgressSheet } from "./hooks/useUpdateProgressSheet";
import ManageDocumentationsSheet from "@/features/documentation/components/ManageDocumentationsSheet";
import ProvinceSelect from "@/components/shared/ProvinceSelect";
import ProposalBioflocProgramPage from "@/features/thematic/pages/ProposalBioflocProgramPage";
import ManagementQuotaPage from "@/features/thematic/pages/ManagementQuotaPage";
import { Input } from "@/components/ui/input";
import { useGetBioflocProgramsPaginated } from "./api/getBioflocProgramsPaginated";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { PaginationState } from "@tanstack/react-table";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { BioflocProgramsInternalTableColumns } from "@/features/monitoring/components/biofloc/BioflocProgramsTableColumns";
import { useURLSearchParams } from "@/hooks/useURLSearchParams";

const BIOFLOC_PAGE_TABS = {
  PROGRAM: "program",
  PROPOSAL: "proposal",
  QUOTA: "quota",
} as const;

const YEAR_OPTIONS = [2026, 2025, 2024] as const;

type BioflocPageTab =
  (typeof BIOFLOC_PAGE_TABS)[keyof typeof BIOFLOC_PAGE_TABS];

export default function BioflocProgramPage({
  programType = "biofloc",
}: {
  programType?: "biofloc" | "minapadi";
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<BioflocPageTab>(
    BIOFLOC_PAGE_TABS.PROGRAM,
  );
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  // URL-based state management
  const { params, setParams } = useURLSearchParams<{
    page?: string;
    pageSize?: string;
    search?: string;
    province?: string;
    year?: string;
  }>();

  const page = parseInt(params.page as string) || 1;
  const pageSize = parseInt(params.pageSize as string) || 10;
  const searchQuery = (params.search as string) || "";
  const selectedProvince = (params.province as string) || "";
  const selectedYear = parseInt(params.year as string) || YEAR_OPTIONS[0];

  const debouncedSearchQuery = useDebouncedValue(localSearchQuery, 400);

  // Update URL when debounced search changes
  useMemo(() => {
    if (debouncedSearchQuery !== searchQuery) {
      setParams({
        search: debouncedSearchQuery,
        page: "1",
      });
    }
  }, [debouncedSearchQuery, searchQuery, setParams]);

  const { data, isPending } = useGetBioflocProgramsPaginated("internal", {
    page,
    pageSize,
    province: selectedProvince,
    year: selectedYear,
    search: searchQuery,
  });

  const pagination: PaginationState = {
    pageIndex: page - 1,
    pageSize,
  };

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
    () => BioflocProgramsInternalTableColumns({ onOpenProgress: openForRow }),
    [openForRow],
  );

  const handleRowClick = useCallback(
    (row: { id: number }) => {
      router.push(`/dashboard/thematic/${programType}/${row.id}`);
    },
    [programType, router],
  );

  const isEmptyPrograms = !isPending && (data?.total ?? 0) === 0;

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
            <Link href="/dashboard/thematic/biofloc/create">
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
        isEmptyPrograms ? (
          <EmptyState />
        ) : (
          <>
            <Datatable
              columns={columns}
              data={data?.data ?? []}
              isPending={isPending}
              onRowClick={handleRowClick}
              manualPagination={true}
              pageCount={data?.totalPages ?? -1}
              rowCount={data?.total ?? 0}
              pagination={pagination}
              onPaginationChange={(updater) => {
                const newState = typeof updater === "function" 
                  ? updater(pagination)
                  : updater;
                setParams({
                  page: String(newState.pageIndex + 1),
                  pageSize: String(newState.pageSize),
                });
              }}
              topContent={() => (
                <>
                  <div className="flex items-center gap-2">
                    <NativeSelect
                      value={String(selectedYear)}
                      onChange={(event) => {
                        setParams({
                          year: event.target.value,
                          page: "1",
                        });
                      }}
                    >
                      {YEAR_OPTIONS.map((year) => (
                        <NativeSelectOption key={year} value={String(year)}>
                          {year}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                    <ProvinceSelect
                      value={selectedProvince}
                      onChange={(value) => {
                        setParams({
                          province: value,
                          page: "1",
                        });
                      }}
                      allLabel="Semua Provinsi"
                      className="w-[220px]"
                    />
                  </div>
                  <div className="ml-auto w-1/4">
                    <Input
                      placeholder="Cari nama KDMP..."
                      value={localSearchQuery}
                      onChange={(event) => {
                        setLocalSearchQuery(event.target.value);
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
