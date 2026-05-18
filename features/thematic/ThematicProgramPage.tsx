"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import Datatable from "@/components/datatable/datatable";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import ProvinceSelect from "@/components/shared/ProvinceSelect";
import { Input } from "@/components/ui/input";
import { useGetThematicProgramsPaginated } from "./api/getBioflocProgramsPaginated";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { PaginationState } from "@tanstack/react-table";
import { ThematicProgramsTableColumnsInternal } from "@/features/monitoring/components/biofloc/ThematicProgramsTableColumns";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useDeleteThematicProgram } from "./api/deleteThematicProgram";
import {
  BioflocProgramListItem,
  ThematicProgramStatus,
  ThematicProgramType,
} from "./types/thematic";
import ManageDocumentationsSheet from "../documentation/components/ManageDocumentationsSheet";

type UpdateProgressRow = Pick<BioflocProgramListItem, "id">;
const YEAR_OPTIONS = [2026, 2025] as const;

export default function ThematicProgramPage({
  programType,
}: {
  programType: ThematicProgramType;
}) {
  const router = useRouter();
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [selectedRow, setSelectedRow] = useState<UpdateProgressRow | null>(
    null,
  );
  const sheetOpen = selectedRow !== null;

  // URL-based state management
  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    pageSize: parseAsInteger.withDefault(10),
    search: parseAsString.withDefault(""),
    province: parseAsString.withDefault(""),
    year: parseAsString.withDefault(""),
    status: parseAsString.withDefault(""),
  });

  const {
    page,
    pageSize,
    search: searchQuery,
    province: selectedProvince,
    year: selectedYear,
    status: selectedStatus,
  } = params;

  const debouncedSearchQuery = useDebouncedValue(localSearchQuery, 400);

  // Update URL when debounced search changes
  useEffect(() => {
    if (debouncedSearchQuery !== searchQuery) {
      setParams({
        search: debouncedSearchQuery,
        page: 1,
      });
    }
  }, [debouncedSearchQuery, searchQuery, setParams]);

  const { data, isPending } = useGetThematicProgramsPaginated(
    programType,
    "internal",
    {
      page,
      pageSize,
      province: selectedProvince,
      year: selectedYear ? parseInt(selectedYear) : undefined,
      search: searchQuery,
      status: selectedStatus,
    },
  );

  const pagination: PaginationState = {
    pageIndex: page - 1,
    pageSize,
  };

  const { mutateAsync } = useDeleteThematicProgram();

  const columns = useMemo(
    () =>
      ThematicProgramsTableColumnsInternal({
        onOpenDocumentation: setSelectedRow,
        onDelete: mutateAsync,
        programType,
      }),
    [setSelectedRow, mutateAsync, programType],
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
            page: newState.pageIndex + 1,
            pageSize: newState.pageSize,
          });
        }}
        topContent={() => (
          <>
            <div className="flex items-center gap-2">
              <NativeSelect
                value={selectedYear}
                onChange={(event) => {
                  setParams({
                    year: event.target.value,
                    page: 1,
                  });
                }}
              >
                <NativeSelectOption value="">Semua Tahun</NativeSelectOption>
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
                    page: 1,
                  });
                }}
                allLabel="Semua Provinsi"
                className="w-[150px]"
              />
              <NativeSelect
                value={selectedStatus}
                onChange={(e) => {
                  setParams({
                    status: e.target.value,
                    page: 1,
                  });
                }}
                className="w-[130px]"
              >
                <NativeSelectOption value="">Semua Status</NativeSelectOption>
                {Object.entries(ThematicProgramStatus).map(([key, value]) => (
                  <NativeSelectOption key={key} value={key}>
                    {value}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
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

      <Sheet open={sheetOpen} onOpenChange={() => setSelectedRow(null)}>
        <SheetContent
          side="right"
          className="data-[side=right]:sm:max-w-[600px]"
        >
          <SheetHeader>
            <SheetTitle>Update Dokumentasi</SheetTitle>
            <SheetDescription>Update dokumentasi program</SheetDescription>
          </SheetHeader>

          {selectedRow && (
            <ManageDocumentationsSheet
              programType={
                programType === "biofloc"
                  ? "biofloc_thematic"
                  : "minapadi_thematic"
              }
              programId={selectedRow.id}
              onSuccess={() => setSelectedRow(null)}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
