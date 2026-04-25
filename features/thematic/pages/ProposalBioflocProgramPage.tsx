"use client";

import Datatable from "@/components/datatable/datatable";
import { useCallback, useMemo, useState } from "react";
import ProvinceSelect from "@/components/shared/ProvinceSelect";
import { useGetProposalBioflocPaginated } from "@/features/thematic/api/getProposalBioflocPaginated";
import { Input } from "@/components/ui/input";
import { PaginationState } from "@tanstack/react-table";
import { ProposalAdminTableColumns } from "@/features/monitoring/components/biofloc/ProposalSubmissionTableColumns";
import { useUpdateProposalBioflocStatus } from "@/features/thematic/api/useUpdateProposalBioflocStatus";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { ProposalBioflocStatus } from "../types/thematic";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

export default function ProposalBioflocProgramPage() {
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20, // Server pagination 20 per page as requested
  });
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 400);

  // Simulated static admin check for this demo component
  const isAdmin = true;

  const { data, isPending } = useGetProposalBioflocPaginated({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    province: selectedProvince,
    search: debouncedSearchQuery,
  });

  const { mutate: updateStatus } = useUpdateProposalBioflocStatus();

  // Action Handlers
  const handleAction = useCallback(
    (id: number, status: ProposalBioflocStatus) => {
      updateStatus({ id, status });
    },
    [updateStatus],
  );

  const columns = useMemo(
    () => ProposalAdminTableColumns(handleAction),
    [handleAction],
  );

  if (!isAdmin) {
    return (
      <div className="rounded border border-red-200 bg-red-50 p-4 text-red-800">
        <h3
          className="font-semibold"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          Akses Ditolak
        </h3>
        <p className="mt-1 text-sm">
          Hanya admin yang memiliki izin untuk memverifikasi proposal.
        </p>
      </div>
    );
  }

  return (
    <Datatable
      columns={columns}
      data={data?.data ?? []}
      isPending={isPending}
      manualPagination={true}
      pageCount={data?.totalPages ?? -1}
      rowCount={data?.total ?? 0}
      pagination={pagination}
      onPaginationChange={setPagination}
      topContent={(table) => (
        <>
          <ProvinceSelect
            value={selectedProvince}
            onChange={(val) => {
              setSelectedProvince(val);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
            className="mr-2 w-[200px]"
          />
          <NativeSelect
            value={table.getColumn("status")?.getFilterValue() as string}
            onChange={(event) => {
              table.getColumn("status")?.setFilterValue(event.target.value);
            }}
          >
            <NativeSelectOption value="">Semua Status</NativeSelectOption>
            <NativeSelectOption value="pending">Menunggu</NativeSelectOption>
            <NativeSelectOption value="approved">Disetujui</NativeSelectOption>
            <NativeSelectOption value="rejected">Ditolak</NativeSelectOption>
          </NativeSelect>
          <div className="ml-auto w-1/4">
            <Input
              placeholder="Cari kelompok kdmp..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
              }}
            />
          </div>
        </>
      )}
    />
  );
}
