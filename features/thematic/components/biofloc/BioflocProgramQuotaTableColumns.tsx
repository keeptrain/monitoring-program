import { ColumnDef } from "@tanstack/react-table";
import { ProgramQuotaView } from "../../actions/program-quotas";
import { MoreButton, MoreButtonMenuItem } from "@/components/shared/MoreButton";
import { PencilIcon } from "lucide-react";
import { formatDateWithTime } from "@/lib/utils";

export function BioflocProgramQuotaTableColumns(opts?: {
  onEditQuota?: (row: ProgramQuotaView) => void;
}): ColumnDef<ProgramQuotaView>[] {
  return [
    {
      header: "Provinsi",
      accessorKey: "region_name",
      cell: ({ row }) => row.original.region_name,
    },
    {
      header: "Kode Provinsi",
      accessorKey: "province_id",
      cell: ({ row }) => row.original.province_id,
    },
    {
      header: "Tahun",
      accessorKey: "year",
      cell: ({ row }) => row.original.year,
    },
    {
      header: "Kuota Program",
      accessorKey: "quota_limit",
      cell: ({ row }) => row.original.quota_limit,
    },
    {
      header: "Diperbarui",
      accessorKey: "updated_at",
      cell: ({ row }) =>
        row.original.updated_at
          ? formatDateWithTime(row.original.updated_at)
          : "-",
    },
    {
      header: "Aksi",
      cell: ({ row }) => {
        const item = row.original;
        const menuItems: MoreButtonMenuItem[] = [
          {
            type: "action",
            key: "edit-quota",
            label: "Ubah Kuota",
            onClick: () => opts?.onEditQuota?.(item),
            icon: PencilIcon,
          },
        ];
        return <MoreButton menuItems={menuItems} />;
      },
    },
  ];
}
