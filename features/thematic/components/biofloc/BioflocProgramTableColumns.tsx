import React from "react";
import { ThematicProgramIndex } from "../../types/thematic";
import { formatDateWithTime } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { MoreButton, MoreButtonMenuItem } from "@/components/shared/MoreButton";
import { ConstructionIcon, PencilIcon, TrashIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { deleteThematicProgram } from "../../actions/biofloc";

export function BioflocProgramTableColumns(opts?: {
  onOpenProgress?: (row: ThematicProgramIndex) => void;
}): ColumnDef<ThematicProgramIndex>[] {
  const handleDelete = async (item: ThematicProgramIndex) => {
    const confirmed = confirm(
      `Apakah Anda yakin ingin menghapus program KDMP "${item.name}"? Tindakan ini tidak dapat dibatalkan.`
    );
    if (confirmed) {
      try {
        await deleteThematicProgram(item.id);
      } catch (error) {
        console.error("Failed to delete program:", error);
        alert("Gagal menghapus program. Silakan coba lagi.");
      }
    }
  };

  return [
    {
      header: "Nama KDMP",
      accessorKey: "name",
      cell: ({ row }) => row.original.name || "-",
    },
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
          {
            type: "action",
            key: "delete",
            label: "Hapus",
            onClick: () => handleDelete(item),
            icon: TrashIcon,
            className: "text-red-600 hover:text-red-700 hover:bg-red-50",
          },
        ];
        return <MoreButton menuItems={menuItems} />;
      },
    },
  ];
}
