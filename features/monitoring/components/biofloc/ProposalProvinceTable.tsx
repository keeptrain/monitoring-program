"use client";

import Datatable from "@/components/datatable/datatable";
import { useMemo } from "react";
import getProposalProvinceTableColumns from "./ProposalProvinceTableColumns";
import { useGetThematicProgramQuotas } from "@/features/monitoring/api/getBioflocProgramQuotas";

const TableOptions = {
  defaultPageSize: 5,
  showRowsText: false,
  showPagination: true,
} as const;

export default function ProposalProvinceTable({
  thematicType = "biofloc_thematic",
}: {
  thematicType?: "biofloc_thematic" | "minapadi_thematic";
} = {}) {
  const { data, isPending } = useGetThematicProgramQuotas(thematicType);
  const columns = useMemo(() => getProposalProvinceTableColumns(), []);

  return (
    <Datatable
      columns={columns}
      data={data?.data ?? []}
      isPending={isPending}
      options={TableOptions}
    />
  );
}
