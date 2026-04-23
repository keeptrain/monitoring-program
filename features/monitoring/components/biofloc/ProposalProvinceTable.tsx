"use client";

import Datatable from "@/components/datatable/datatable";
import { useMemo } from "react";
import getProposalProvinceTableColumns, {
  ProvinceSummary,
} from "./ProposalProvinceTableColumns";

export default function ProposalProvinceTable() {
  const provinceData: ProvinceSummary[] = [
    { province: "Jawa Barat", count: 25, quota: 30 },
    { province: "Jawa Timur", count: 18, quota: 25 },
    { province: "Jawa Tengah", count: 15, quota: 20 },
    { province: "Lampung", count: 12, quota: 15 },
  ];
  const columns = useMemo(() => getProposalProvinceTableColumns(), []);

  return <Datatable columns={columns} data={provinceData} />;
}
