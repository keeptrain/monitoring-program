"use client";

import Datatable from "@/components/datatable/datatable";
import { useMemo } from "react";
import getProposalProvinceTableColumns, {
  ProposalProvinceRow,
} from "./ProposalProvinceTableColumns";

const TableOptions = {
  defaultPageSize: 5,
  showRowsText: false,
  showPagination: true,
} as const;

export default function ProposalProvinceTable({
  data,
}: {
  data: ProposalProvinceRow[];
}) {
  const columns = useMemo(() => getProposalProvinceTableColumns(), []);

  return (
    <Datatable
      columns={columns}
      data={data}
      isPending={false}
      options={TableOptions}
    />
  );
}

