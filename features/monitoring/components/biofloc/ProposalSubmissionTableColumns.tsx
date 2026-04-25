import { ColumnDef } from "@tanstack/react-table";
import { ProposalBioflocThematicProgram } from "@/features/thematic/services/proposal-biofloc-services";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Check, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { ProposalBioflocStatus } from "@/features/thematic/types/thematic";

const STATUS_CONFIG: Record<
  ProposalBioflocStatus,
  {
    variant: "default" | "secondary" | "destructive" | "outline";
    label: string;
  }
> = {
  pending: { variant: "secondary", label: "Menunggu" },
  approved: { variant: "default", label: "Disetujui" },
  rejected: { variant: "destructive", label: "Ditolak" },
};

const StatusBadge = ({ status }: { status: ProposalBioflocStatus }) => {
  const config = STATUS_CONFIG[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export const ProposalSubmissionTableColumns =
  (): ColumnDef<ProposalBioflocThematicProgram>[] => [
    {
      header: "Nama KDMP",
      accessorKey: "name",
      cell: ({ row: { original } }) => (
        <span className="font-semibold">{original.name}</span>
      ),
    },
    {
      header: "Provinsi",
      accessorKey: "province",
      cell: ({ row: { original } }) => <span>{original.province}</span>,
    },
    {
      header: "Kab / Kota",
      accessorKey: "regency",
      cell: ({ row: { original } }) => <span>{original.regency}</span>,
    },
    {
      header: "Kelurahan",
      accessorKey: "district",
      cell: ({ row: { original } }) => <span>{original.district}</span>,
    },
    {
      header: "Desa",
      accessorKey: "village",
      cell: ({ row: { original } }) => <span>{original.village}</span>,
    },
    {
      header: "Status Proposal",
      accessorKey: "status",
      cell: ({ row: { original } }) => <StatusBadge status={original.status} />,
    },
  ];

// Admin Actions component extracted to handle loading states
function AdminActions({
  row,
  onAction,
}: {
  row: ProposalBioflocThematicProgram;
  onAction: (id: number, status: ProposalBioflocStatus) => void;
}) {
  const [isDownloading, setIsDownloading] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        // onClick={handleDownload}
        disabled={isDownloading}
        title="Download Dokumen"
      >
        {isDownloading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Download className="size-4 text-zinc-600" />
        )}
      </Button>
      {row.status === "pending" && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAction(row.id, "approved")}
            className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
            title="Setujui"
          >
            <Check className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAction(row.id, "rejected")}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
            title="Tolak"
          >
            <X className="size-4" />
          </Button>
        </>
      )}
    </div>
  );
}

export const ProposalAdminTableColumns = (
  onAction: (id: number, status: ProposalBioflocStatus) => void,
): ColumnDef<ProposalBioflocThematicProgram>[] => [
  ...ProposalSubmissionTableColumns(),
  {
    header: "Aksi",
    id: "actions",
    cell: ({ row }) => <AdminActions row={row.original} onAction={onAction} />,
  },
];
