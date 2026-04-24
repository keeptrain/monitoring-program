"use client";

import Datatable from "@/components/datatable/datatable";
import { useMemo } from "react";
import getProposalProvinceTableColumns, {
  ProvinceSummary,
} from "./ProposalProvinceTableColumns";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { useGetBioflocProgramQuotas } from "@/features/monitoring/api/getBioflocProgramQuotas";

const TableOptions = {
  defaultPageSize: 5,
  showRowsText: false,
  showPagination: true,
};

export default function ProposalProvinceTable() {
  const { ref: tableRef, isInView } = useInViewOnce<HTMLDivElement>({
    root: null,
    rootMargin: "120px 0px",
    threshold: 0.1,
  });
  const { data: quotas = [], isPending } = useGetBioflocProgramQuotas(isInView);

  const columns = useMemo(() => getProposalProvinceTableColumns(), []);
  const provinceData = useMemo<ProvinceSummary[]>(
    () =>
      quotas
        .filter((item) => item.quota_limit > 0)
        .map((item) => ({
          province: item.region_name,
          // DUMMY sementara sampai schema proposal final.
          count: 0,
          quota: item.quota_limit,
        }))
        .sort((a, b) => b.quota - a.quota),
    [quotas],
  );

  return (
    <div ref={tableRef}>
      <Datatable
        columns={columns}
        data={provinceData}
        isPending={isPending}
        options={TableOptions}
      />
    </div>
  );
}
