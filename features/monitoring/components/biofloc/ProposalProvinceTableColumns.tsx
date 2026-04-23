import { ColumnDef } from "@tanstack/react-table";

export interface ProvinceSummary {
  province: string;
  count: number;
  quota: number;
}

export default function getProposalProvinceTableColumns(): ColumnDef<ProvinceSummary>[] {
  return [
    {
      header: "Provinsi",
      accessorKey: "province",
      cell: ({ row }) => (
        <span className="font-semibold">{row.original.province}</span>
      ),
    },
    {
      header: "Jumlah Proposal",
      accessorKey: "count",
      cell: ({ row }) => (
        <div className="text-primary font-bold tabular-nums">
          {row.original.count}
        </div>
      ),
    },
    {
      header: "Kuota",
      accessorKey: "quota",
      cell: ({ row }) => (
        <div className="text-muted-foreground font-bold tabular-nums">
          {row.original.quota}
        </div>
      ),
    },
  ];
}
