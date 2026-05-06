import React from "react";
import { formatDate, formatDateWithTime } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { MoreButton, MoreButtonMenuItem } from "@/components/shared/MoreButton";
import { CameraIcon, PencilIcon, Trash2Icon } from "lucide-react";
import IsfStatusBadge from "@/features/isf/components/IsfStatusBadge";
import { ColumnDef } from "@tanstack/react-table";
import { RevitalizationProgramLogListItem } from "../types/revitalization";

export const RevitalizationAreaTableColumns = ({
  onUpdateDocumentations,
  onDeleteReport,
}: {
  onUpdateDocumentations: (id: string) => void;
  onDeleteReport: (id: string) => void;
}): ColumnDef<RevitalizationProgramLogListItem>[] => [
  {
    header: "Dilaporkan Pada",
    accessorKey: "progress_date",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs font-medium italic">
        {formatDate(row.original.progress_date)}
      </span>
    ),
  },
  { header: "Nama Laporan", accessorKey: "name" },
  {
    header: "Progress",
    accessorKey: "progress_percent",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Progress value={row.original.progress_percent} className="w-20" />
        <span className="text-[10px] font-bold">
          {row.original.progress_percent}%
        </span>
      </div>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => <IsfStatusBadge status={row.original.status} />,
  },
  {
    header: "Diperbarui",
    accessorKey: "updated_at",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs font-medium italic">
        {formatDateWithTime(row.original.updated_at)}
      </span>
    ),
  },
  {
    header: "Aksi",
    cell: ({ row }) => {
      const original = row.original;
      const menuItems: MoreButtonMenuItem[] = [
        {
          type: "link",
          key: "edit",
          label: "Ubah",
          href: `/dashboard/revitalisasi/report/${original.id}/edit`,
          icon: PencilIcon,
        },
        {
          type: "action",
          key: "update-documentations",
          label: "Update Dokumentasi",
          icon: CameraIcon,
          onClick: () => onUpdateDocumentations(original.id),
        },
        {
          type: "action",
          key: "delete",
          label: "Hapus",
          icon: Trash2Icon,
          onClick: () => onDeleteReport(original.id),
        },
      ];
      return <MoreButton menuItems={menuItems} />;
    },
  },
];
