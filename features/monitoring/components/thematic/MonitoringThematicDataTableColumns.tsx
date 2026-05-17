import { ColumnDef } from "@tanstack/react-table";
import {
  BioflocProgramListItem,
  ThematicProgramStatus,
} from "@/features/thematic/types/thematic";
import { Progress } from "@/components/ui/progress";
import { formatDateWithTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { THEMATIC_CONFIG, ThematicProgramType } from "@/features/thematic/constants/thematic-constants";

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
    <Badge variant={STATUS_VARIANT[status] || "outline"}>
      {ThematicProgramStatus[status] || status}
    </Badge>
  );
};

export function getMonitoringThematicDataTableColumns(
  type: ThematicProgramType
): ColumnDef<BioflocProgramListItem>[] {
  const config = THEMATIC_CONFIG[type];

  return [
    {
      header: config.groupLabel,
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
        <span className="capitalize">{row.original.commodity_aid || "-"}</span>
      ),
    },
    {
      header: "Komoditas Potensial",
      accessorKey: "commodity_potential",
      cell: ({ row }) => (
        <span className="capitalize">
          {row.original.commodity_potential || "-"}
        </span>
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
}
