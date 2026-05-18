import { ColumnDef } from "@tanstack/react-table";
import {
  BioflocProgramListItem,
  ThematicProgramStatus,
  ThematicProgramType,
} from "@/features/thematic/types/thematic";
import { Progress } from "@/components/ui/progress";
import { formatDateWithTime } from "@/lib/utils";
import { MoreButton, MoreButtonMenuItem } from "@/components/shared/MoreButton";
import { ConstructionIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  potential: "default",
  active: "secondary",
  inactive: "destructive",
};

export const StatusBadge = ({ status }: { status: string }) => {
  return (
    <Badge variant={STATUS_VARIANT[status]}>
      {ThematicProgramStatus[status]}
    </Badge>
  );
};

const BASE_COLUMNS: ColumnDef<BioflocProgramListItem>[] = [
  {
    header: "Nama KDMP",
    accessorKey: "entity_name",
    cell: ({ row }) => (
      <span className="font-semibold">{row.original.entity_name}</span>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    header: "Komoditas Bantuan",
    accessorKey: "commodity_aid",
    cell: ({ row }) => (
      <span className="capitalize">{row.original.commodity_aid}</span>
    ),
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
];

export const ThematicProgramsTableColumnsPublic =
  (): ColumnDef<BioflocProgramListItem>[] => [
    ...BASE_COLUMNS,
    {
      header: "Komoditas Potensial",
      accessorKey: "commodity_potential",
      cell: ({ row }) => (
        <span className="capitalize">
          {row.original.commodity_potential || "-"}
        </span>
      ),
    },
  ];

export const ThematicProgramsTableColumnsInternal = (opts: {
  onOpenDocumentation?: (row: BioflocProgramListItem) => void;
  onDelete?: (id: string) => Promise<unknown>;
  programType: ThematicProgramType;
}): ColumnDef<BioflocProgramListItem>[] => {
  const handleDelete = async (item: BioflocProgramListItem) => {
    if (!opts.onDelete) {
      alert("Delete functionality is not available");
      return;
    }

    const confirmed = confirm(
      `Apakah Anda yakin ingin menghapus program KDMP "${item.entity_name}"? Tindakan ini tidak dapat dibatalkan.`,
    );
    if (confirmed) {
      try {
        await opts.onDelete(item.id);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Gagal menghapus program";
        toast.error(errorMessage);
      }
    }
  };

  return [
    BASE_COLUMNS[0],
    {
      header: "No. KUSUKA",
      accessorKey: "kusuka_number",
      cell: ({ row }) => row.original.kusuka_number || "-",
    },
    ...BASE_COLUMNS.slice(1),
    {
      header: "Aksi",
      id: "actions",
      cell: ({ row }) => {
        const item = row.original;
        const menuItems: MoreButtonMenuItem[] = [
          {
            type: "link",
            key: "edit",
            label: "Ubah",
            href: `/dashboard/thematic/${opts.programType}/${item.id}/edit`,
            icon: PencilIcon,
          },
          {
            type: "action",
            key: "progress-update",
            label: "Update Dokumentasi",
            onClick: () => opts.onOpenDocumentation?.(item),
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
};
