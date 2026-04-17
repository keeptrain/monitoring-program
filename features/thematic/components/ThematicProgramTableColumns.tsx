import React from "react";
import { Column } from "@/components/datatable/datatable";
import { ThematicProgramIndex } from "../types/thematic";
import { formatDateWithTime } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { MoreButton, MoreButtonMenuItem } from "@/components/shared/MoreButton";
import { ConstructionIcon, PencilIcon } from "lucide-react";

export function ThematicProgramColumns(opts?: {
  onOpenProgress?: (row: ThematicProgramIndex) => void;
}): Column<ThematicProgramIndex>[] {
  return [
    { header: "Nama KDMP", accessorKey: "name" },
    {
      header: "Lokasi",
      accessorKey: "location_id",
      cell: (row) => row.available_locations?.name || "-",
    },
    {
      header: "Capaian (%)",
      accessorKey: "percentage_of_work",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Progress value={row.percentage_of_work} className="w-20" />
          <span className="text-xs">{row.percentage_of_work}%</span>
        </div>
      ),
    },
    {
      header: "Diperbarui",
      accessorKey: "updated_at",
      cell: (row) => formatDateWithTime(row.updated_at),
    },
    {
      header: "Aksi",
      cell: (row) => {
        const menuItems: MoreButtonMenuItem[] = [
          {
            type: "link",
            key: "edit",
            label: "Ubah",
            href: `/dashboard/thematic/${row.id}/form`,
            icon: <PencilIcon />,
          },
          {
            type: "action",
            key: "progress-update",
            label: "Update Progress",
            onClick: () => opts?.onOpenProgress?.(row),
            icon: <ConstructionIcon />,
          },
        ];
        return <MoreButton menuItems={menuItems} />;
      },
    },
  ];
}
