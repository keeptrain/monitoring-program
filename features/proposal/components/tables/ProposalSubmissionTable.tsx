"use client";

import Datatable from "@/components/datatable/datatable";
import { useDownloadProposal } from "./ProposalDownloadButton";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ProvinceSelect from "@/components/shared/ProvinceSelect";
import { useGetProposalThematicPaginated } from "@/features/thematic/api/getProposalThematicPaginated";
import { Input } from "@/components/ui/input";
import { PaginationState } from "@tanstack/react-table";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { UserRole } from "@/features/auth/types/user";
import { ProposalSubmissionTableColumns } from "./ProposalSubmissionTableColumns";
import { ProposalBioflocThematicProgram } from "@/features/proposal/types/proposal-biofloc";
import { ProposalStatusSelect } from "@/features/proposal/components/ProposalStatusSelect";

export default function ProposalSubmissionTable({
  enabled = true,
  role = undefined,
  programType,
}: {
  enabled?: boolean;
  role?: UserRole | undefined;
  programType: string;
}) {
  const router = useRouter();
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const debouncedSearchQuery = useDebouncedValue(searchQuery, 500);

  const { data, isPending } = useGetProposalThematicPaginated(
    {
      page: pagination.pageIndex + 1, // TanStack table is 0-indexed, our API is 1-indexed
      pageSize: pagination.pageSize,
      province: selectedProvince,
      search: debouncedSearchQuery,
      status: selectedStatus,
      programType,
    },
    enabled,
  );

  const { mutate: downloadProposal } = useDownloadProposal();

  const handleAction = useCallback(
    (
      proposal: ProposalBioflocThematicProgram,
      action: "verify" | "rollback" | "download",
    ) => {
      if (action === "download") {
        downloadProposal(proposal.id);
      }
    },
    [downloadProposal],
  );

  const basePath =
    programType === "minapadi_thematic"
      ? "/minapadi-thematic"
      : "/biofloc-thematic";

  const columns = useMemo(
    () => ProposalSubmissionTableColumns(basePath, role, handleAction),
    [basePath, role, handleAction],
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
      onRowClick={(row: ProposalBioflocThematicProgram) =>
        role
          ? router.push(
              `/${programType === "minapadi_thematic" ? "minapadi-thematic" : "biofloc-thematic"}/proposal/${row.id}/detail`,
            )
          : undefined
      }
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
          <ProposalStatusSelect
            value={selectedStatus}
            onChange={(event) => {
              setSelectedStatus(event.target.value);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
            className="ml-2 w-[150px]"
          />
          <div className="ml-auto w-1/4">
            <Input
              placeholder={`Cari kelompok ${programType === "minapadi_thematic" ? "pokdaka" : "kdmp"}...`}
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
