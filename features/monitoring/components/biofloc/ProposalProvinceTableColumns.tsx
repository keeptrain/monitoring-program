import { ColumnDef } from "@tanstack/react-table";

export type ProposalProvinceRow = {
  region_name: string;
  proposal_count: number;
  quota_limit: number;
};

export default function getProposalProvinceTableColumns(): ColumnDef<ProposalProvinceRow>[] {
  return [
    {
      header: "Provinsi",
      accessorKey: "region_name",
      cell: ({ row }) => (
        <span className="font-semibold">{row.original.region_name}</span>
      ),
    },
    {
      header: "Jumlah Proposal",
      accessorKey: "proposal_count",
      cell: ({ row }) => (
        <div className="text-primary font-bold tabular-nums">
          {row.original.proposal_count}
        </div>
      ),
    },
    {
      header: "Kuota",
      accessorKey: "quota_limit",
      cell: ({ row }) => (
        <div className="text-muted-foreground font-bold tabular-nums">
          {row.original.quota_limit}
        </div>
      ),
    },
  ];
}
