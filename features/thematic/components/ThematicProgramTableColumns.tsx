import React from "react";
import { ThematicProgramIndex } from "../types/thematic";
import { formatDateWithTime } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { MoreButton, MoreButtonMenuItem } from "@/components/shared/MoreButton";
import { ConstructionIcon, PencilIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

export function ThematicProgramColumns(opts?: {
  onOpenProgress?: (row: ThematicProgramIndex) => void;
}): ColumnDef<ThematicProgramIndex>[] {
  return [
    { header: "Nama KDMP", accessorKey: "name" },
    {
      header: "Lokasi",
      accessorKey: "location_id",
      cell: ({ row }) => row.original.available_locations?.name || "-",
    },
    {
      header: "Capaian (%)",
      accessorKey: "progress_percent",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Progress value={row.original.progress_percent} className="w-20" />
          <span className="text-muted-foreground text-xs whitespace-nowrap">
            {row.original.progress_percent}%
          </span>
        </div>
      ),
    },
    {
      header: "Diperbarui",
      accessorKey: "updated_at",
      cell: ({ row }) => formatDateWithTime(row.original.updated_at),
    },
    {
      header: "Aksi",
      cell: ({ row }) => {
        const item = row.original;
        const menuItems: MoreButtonMenuItem[] = [
          {
            type: "link",
            key: "edit",
            label: "Ubah",
            href: `/dashboard/thematic/biofloc/${item.id}/edit`,
            icon: PencilIcon,
          },
          {
            type: "action",
            key: "progress-update",
            label: "Update Progress",
            onClick: () => opts?.onOpenProgress?.(item),
            icon: ConstructionIcon,
          },
        ];
        return <MoreButton menuItems={menuItems} />;
      },
    },
  ];
}
