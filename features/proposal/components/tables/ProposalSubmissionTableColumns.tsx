import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  ProposalBioflocStatus,
  ProposalBioflocThematicProgram,
} from "@/features/proposal/types/proposal-biofloc";
import { UserRole } from "@/features/auth/types/user";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_CONFIG: Record<
  ProposalBioflocStatus,
  {
    variant: "default" | "secondary" | "destructive" | "outline";
    label: string;
  }
> = {
  pending: { variant: "secondary", label: "Menunggu" },
  approved: { variant: "default", label: "Disetujui" },
  converted: { variant: "default", label: "Masuk KDMP" },
  rejected: { variant: "destructive", label: "Ditolak" },
  revision: { variant: "outline", label: "Revisi" },
};

export const StatusBadge = ({ status }: { status: ProposalBioflocStatus }) => {
  const config = STATUS_CONFIG[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const ActionButtons = dynamic(
  () =>
    import("@/features/proposal/components/tables/ProposalSubmissionTableActions"),
  {
    loading: () => <Skeleton className="h-8 w-8" />,
  },
);

export const ProposalSubmissionTableColumns = (
  basePath: string,
  role: UserRole | undefined = undefined,
  onAction?: (
    data: ProposalBioflocThematicProgram,
    action: "verify" | "rollback" | "download",
  ) => void,
): ColumnDef<ProposalBioflocThematicProgram>[] => [
  {
    header: "Nama Kelompok",
    accessorKey: "kdmp_entities.name",
    cell: ({ row: { original } }) => original.kdmp_entities.name,
  },
  {
    header: "Kelurahan / Desa",
    accessorKey: "available_locations.ref_villages.name",
    cell: ({ row: { original } }) =>
      original.available_locations.ref_villages?.name || "-",
  },
  {
    header: "Komoditas diusulkan",
    accessorKey: "proposed_commodity",
    cell: ({ row: { original } }) => (
      <p className="capitalize">{original.proposed_commodity}</p>
    ),
  },
  {
    header: "Komoditas potensial",
    accessorKey: "commodity_potentials",
    cell: ({ row: { original } }) => (
      <p className="capitalize">{original.commodity_potentials.join(", ")}</p>
    ),
  },
  {
    header: "Status Proposal",
    accessorKey: "status",
    cell: ({ row: { original } }) => <StatusBadge status={original.status} />,
  },
  ...(role
    ? [
        {
          id: "actions",
          header: "Aksi",
          cell: ({
            row: { original },
          }: {
            row: { original: ProposalBioflocThematicProgram };
          }) => (
            <div onClick={(e) => e.stopPropagation()}>
              <ActionButtons
                data={original}
                role={role}
                onAction={onAction}
                basePath={basePath}
              />
            </div>
          ),
        },
      ]
    : []),
];
