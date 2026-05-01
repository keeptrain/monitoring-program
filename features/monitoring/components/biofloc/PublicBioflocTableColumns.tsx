import { ColumnDef } from "@tanstack/react-table";

export interface BioflocProposal {
  id: number;
  kdmp_name: string;
  province: string;
  regency: string;
  district: string;
  village: string;
  status: "Diverifikasi" | "Divalidasi" | "Pending" | string;
}

export default function getProposalTableColumns(): ColumnDef<BioflocProposal>[] {
  return [
    {
      header: "Nama KDMP",
      accessorKey: "kdmp_name",
      cell: ({ row }) => (
        <span className="font-semibold uppercase">
          {row.original.kdmp_name}
        </span>
      ),
    },
    {
      header: "Provinsi",
      accessorKey: "province",
      cell: ({ row }) => <p>Test</p>,
    },
    {
      header: "Kabupaten/Kota",
      accessorKey: "regency",
      cell: ({ row }) => <p>Test</p>,
    },
    {
      header: "Kelurahan",
      accessorKey: "district",
      cell: ({ row }) => <p>Test</p>,
    },
    {
      header: "Desa",
      accessorKey: "village",
      cell: ({ row }) => <p>Test</p>,
    },
    {
      header: "Komoditas Bantuan",
      accessorKey: "commodity_aid",
      cell: ({ row }) => <p>Test</p>,
    },
    {
      header: "Komoditas Potensi",
      accessorKey: "commodity_potential",
      cell: ({ row }) => <p>Test</p>,
    },
    {
      header: "Jumlah Pengurus",
      accessorKey: "total_management",
      cell: ({ row }) => <p>Test</p>,
    },
    {
      header: "Jumlah Anggota",
      accessorKey: "total_members",
      cell: ({ row }) => <p>Test</p>,
    },
    {
      header: "Volume Produksi",
      accessorKey: "production_value",
      cell: ({ row }) => <p>Test</p>,
    },
    {
      header: "Nilai Produksi",
      accessorKey: "production_value",
      cell: ({ row }) => <p>Test</p>,
    },
    {
      header: "Status Proposal",
      accessorKey: "status",
      cell: ({ row }) => <p>Test</p>,
    },
  ];
}
