import { ColumnDef } from "@tanstack/react-table";

export const ProposalSubmissionTableColumns = (): ColumnDef<any>[] => [
  {
    header: "Nama KDMP",
    accessorKey: "kdmp_name",
    cell: () => <span className="font-semibold">Test</span>,
  },
  {
    header: "Provinsi",
    accessorKey: "province",
    cell: () => <span className="font-semibold">Test</span>,
  },
  {
    header: "Kab / Kota",
    accessorKey: "regency",
    cell: () => <span className="font-semibold">Test</span>,
  },
  {
    header: "Kelurahan",
    accessorKey: "district",
    cell: () => <span className="font-semibold">Test</span>,
  },
  {
    header: "Desa",
    accessorKey: "village",
    cell: () => <span className="font-semibold">Test</span>,
  },
  {
    header: "Status Proposal",
    accessorKey: "status",
    cell: () => <span className="font-semibold">Test</span>,
  },
];
