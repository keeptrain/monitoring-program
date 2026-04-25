"use client";

import Datatable from "@/components/datatable/datatable";
import { useMemo } from "react";
import getProposalProvinceTableColumns, {
  ProposalProvinceRow,
} from "./ProposalProvinceTableColumns";
import { Skeleton } from "@/components/ui/skeleton";

const TableOptions = {
  defaultPageSize: 5,
  showRowsText: false,
  showPagination: true,
} as const;

export default function ProposalProvinceTable({
  data,
  isPending,
}: {
  data: ProposalProvinceRow[];
  isPending: boolean;
}) {
  const columns = useMemo(() => getProposalProvinceTableColumns(), []);

  if (isPending) {
    return <ProposalProvinceTableSkeleton />;
  }

  return (
    <Datatable
      columns={columns}
      data={data}
      isPending={false}
      options={TableOptions}
    />
  );
}

function ProposalProvinceTableSkeleton() {
  return (
    <div className="space-y-3 border p-4">
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
      </div>
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
}
