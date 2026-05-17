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
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useGetThematicProgramsPaginated } from "@/features/thematic/api/getBioflocProgramsPaginated";
import { THEMATIC_CONFIG, ThematicProgramType } from "@/features/thematic/constants/thematic-constants";
import { getMonitoringThematicDataTableColumns } from "./MonitoringThematicDataTableColumns";

const YEAR_OPTIONS = [2026, 2025] as const;

interface MonitoringThematicDataTableProps {
  programType: ThematicProgramType;
}

export default function MonitoringThematicDataTable({
  programType,
}: MonitoringThematicDataTableProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const config = THEMATIC_CONFIG[programType];

  // URL-based state management
  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    pageSize: parseAsInteger.withDefault(10),
    search: parseAsString.withDefault(""),
    province: parseAsString.withDefault(""),
    year: parseAsString.withDefault(""),
  });

  const {
    page,
    pageSize,
    search: searchQuery,
    province: selectedProvince,
    year: selectedYear,
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

  // Map "biofloc_thematic" -> "biofloc", "minapadi_thematic" -> "minapadi"
  const thematicType = programType === "biofloc_thematic" ? "biofloc" : "minapadi";

  const { data, isPending } = useGetThematicProgramsPaginated(
    thematicType,
    "public",
    {
      page,
      pageSize,
      province: selectedProvince,
      year: selectedYear ? parseInt(selectedYear) : undefined,
      search: searchQuery,
    },
  );

  const pagination: PaginationState = {
    pageIndex: page - 1,
    pageSize,
  };

  const columns = useMemo(
    () => getMonitoringThematicDataTableColumns(programType),
    [programType]
  );

  return (
    <Datatable
      columns={columns}
      data={data?.data ?? []}
      isPending={isPending}
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
        <div className="flex w-full items-center justify-between gap-4">
          <div className="border-primary flex items-center gap-2 border-l-2 pl-2">
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
              className="w-[150px]"
            />
          </div>
          <Input
            placeholder={`Cari ${config.groupLabel.toLowerCase()}...`}
            className="w-[250px]"
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
