"use client";

import Datatable from "@/components/datatable/datatable";
import { useMemo, useState } from "react";
import ProvinceSelect from "@/components/shared/ProvinceSelect";
import { useGetProposalBioflocPaginated } from "@/features/thematic/api/getProposalBioflocPaginated";
import { Input } from "@/components/ui/input";
import { PaginationState } from "@tanstack/react-table";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { UserRole } from "@/features/auth/types/user";
import { ProposalSubmissionTableColumns } from "./ProposalSubmissionTableColumns";

export default function ProposalSubmissionTable({
  enabled = true,
  role = undefined,
}: {
  enabled?: boolean;
  role?: UserRole | undefined;
}) {
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const debouncedSearchQuery = useDebouncedValue(searchQuery, 500);

  const { data, isPending } = useGetProposalBioflocPaginated(
    {
      page: pagination.pageIndex + 1, // TanStack table is 0-indexed, our API is 1-indexed
      pageSize: pagination.pageSize,
      province: selectedProvince,
      search: debouncedSearchQuery,
    },
    enabled,
  );

  const columns = useMemo(() => ProposalSubmissionTableColumns(role), [role]);

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
      topContent={() => (
        <>
          <ProvinceSelect
            value={selectedProvince}
            onChange={(val) => {
              setSelectedProvince(val);
              setPagination((prev) => ({ ...prev, pageIndex: 0 })); // Reset page
            }}
            className="w-[200px]"
          />
          <div className="ml-auto w-1/4">
            <Input
              placeholder="Cari kelompok kdmp..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setPagination((prev) => ({ ...prev, pageIndex: 0 })); // Reset page
              }}
            />
          </div>
        </>
      )}
    />
  );
}
