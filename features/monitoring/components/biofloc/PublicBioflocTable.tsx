"use client";

import Datatable from "@/components/datatable/datatable";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import ProvinceSelect from "@/components/shared/ProvinceSelect";
import { PaginationState } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useGetBioflocProgramsPaginated } from "@/features/thematic/api/getBioflocProgramsPaginated";
import { BioflocProgramsPublicTableColumns } from "./BioflocProgramsTableColumns";
import { useURLSearchParams } from "@/hooks/useURLSearchParams";
import { useRouter } from "next/navigation";

const YEAR_OPTIONS = [2026, 2025] as const;

export default function PublicBioflocTable() {
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

  const { data, isPending } = useGetBioflocProgramsPaginated("public", {
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

  const columns = useMemo(() => BioflocProgramsPublicTableColumns(), []);

  const handleRowClick = (id: string) =>
    router.push(`/monitoring/biofloc-thematic/${id}`);

  return (
    <Datatable
      columns={columns}
      data={data?.data ?? []}
      isPending={isPending}
      manualPagination={true}
      pageCount={data?.totalPages ?? -1}
      rowCount={data?.total ?? 0}
      pagination={pagination}
      onRowClick={({ id }) => handleRowClick(id)}
      onPaginationChange={(updater) => {
        const newState =
          typeof updater === "function" ? updater(pagination) : updater;
        setParams({
          page: String(newState.pageIndex + 1),
          pageSize: String(newState.pageSize),
        });
      }}
      topContent={() => (
        <div className="flex w-full items-center justify-between gap-4">
          <div className="border-primary flex items-center gap-2 border-l-2 pl-2">
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
              className="w-[220px]"
            />
          </div>
          <Input
            placeholder="Cari nama KDMP..."
            className="max-w-xs"
            value={localSearchQuery}
            onChange={(event) => {
              setLocalSearchQuery(event.target.value);
            }}
          />
        </div>
      )}
    />
  );
}
