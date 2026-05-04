"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Datatable from "@/components/datatable/datatable";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import UpdateProgressSheet from "./components/biofloc/UpdateProgressSheet";
import { useUpdateProgressSheet } from "./hooks/useUpdateProgressSheet";
import ManageDocumentationsSheet from "@/features/documentation/components/ManageDocumentationsSheet";
import ProvinceSelect from "@/components/shared/ProvinceSelect";
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
import { useDeleteThematicProgram } from "./api/deleteThematicProgram";

const YEAR_OPTIONS = [2026, 2025] as const;

export default function BioflocProgramPage({
  programType = "biofloc",
}: {
  programType?: "biofloc" | "minapadi";
}) {
  const router = useRouter();
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
  const selectedYear = parseInt(params.year as string) || 0;

  const debouncedSearchQuery = useDebouncedValue(localSearchQuery, 400);

  // Update URL when debounced search changes
  useEffect(() => {
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

  const { mutateAsync } = useDeleteThematicProgram();

  const columns = useMemo(
    () =>
      BioflocProgramsInternalTableColumns({
        onOpenProgress: openForRow,
        onDelete: mutateAsync,
      }),
    [openForRow, mutateAsync],
  );

  const handleRowClick = useCallback(
    (row: { id: string }) => {
      router.push(`/dashboard/thematic/${programType}/${row.id}`);
    },
    [programType, router],
  );

  return (
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
          const newState =
            typeof updater === "function" ? updater(pagination) : updater;
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
                <NativeSelectOption value="0">Semua Tahun</NativeSelectOption>
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
  );
}
