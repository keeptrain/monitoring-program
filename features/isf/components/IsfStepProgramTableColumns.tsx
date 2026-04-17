import React from "react";
import { Column } from "@/components/datatable/datatable";
import { formatDateWithTime } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MoreButton, MoreButtonMenuItem } from "@/components/shared/MoreButton";
import { PencilIcon, Trash2Icon } from "lucide-react";

export interface IsfReport {
  id: number;
  step_id: number;
  progress_date: string;
  progress_percent: number;
  name: string;
  status: string;
  updated_at: string;
}

export function getIsfProgramReportsColumns(
  onDelete?: (row: IsfReport) => void,
): Column<IsfReport>[] {
  return [
    {
      header: "Dilaporkan Pada",
      accessorKey: "progress_date",
      cell: (row) => (
        <span className="text-muted-foreground text-xs font-medium italic">
          {formatDateWithTime(row.progress_date)}
        </span>
      ),
    },
    { header: "Nama Laporan", accessorKey: "name" },
    {
      header: "Progress",
      accessorKey: "progress_percent",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Progress value={row.progress_percent} className="w-20" />
          <span className="text-[10px] font-bold">{row.progress_percent}%</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => {
        let variant: "default" | "secondary" | "outline" | "destructive" =
          "secondary";
        if (row.status === "Selesai") variant = "default";
        if (row.status === "Baru") variant = "outline";

        return (
          <Badge
            variant={variant}
            className="rounded-full px-2 text-[10px] font-bold uppercase transition-all"
          >
            {row.status}
          </Badge>
        );
      },
    },

    {
      header: "Diperbarui",
      accessorKey: "updated_at",
      cell: (row) => (
        <span className="text-muted-foreground text-xs font-medium italic">
          {formatDateWithTime(row.updated_at)}
        </span>
      ),
    },
    {
      header: "Aksi",
      cell: (row) => {
        const menuItems: MoreButtonMenuItem[] = [
          {
            type: "link",
            key: "edit",
            label: "Ubah",
            href: `/dashboard/isf/report/${row.id}/edit`,
            icon: <PencilIcon className="size-4" />,
          },
          {
            type: "action",
            key: "delete",
            label: "Hapus",
            onClick: () => onDelete?.(row),
            disabled: !onDelete,
            icon: <Trash2Icon className="text-destructive size-4" />,
            destructive: true,
          },
        ];
        return <MoreButton menuItems={menuItems} />;
      },
    },
  ];
}
