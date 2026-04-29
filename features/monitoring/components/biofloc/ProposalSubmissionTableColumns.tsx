import { ColumnDef } from "@tanstack/react-table";
import { ProposalBioflocThematicProgram } from "@/features/thematic/services/proposal-biofloc-services";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Check, X, Loader2 } from "lucide-react";
import { ProposalBioflocStatus } from "@/features/thematic/types/thematic";
import { INDONESIA_PROVINCES } from "@/features/thematic/constants/indonesia-provinces";
import { useMutation } from "@tanstack/react-query";
import { createSignedUrlForProposalBiofloc } from "@/features/thematic/actions/proposal-biofloc";
import { ConvertProposalButton } from "@/features/thematic/components/biofloc/ConvertProposalButton";

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
};

export const StatusBadge = ({ status }: { status: ProposalBioflocStatus }) => {
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
      accessorKey: "province_id",
      cell: ({ row: { original } }) => {
        const name = INDONESIA_PROVINCES.find(
          (p) => p.province_id === original.province_id,
        )?.name;
        return <span>{name || original.province_id}</span>;
      },
    },
    {
      header: "Kab / Kota",
      accessorKey: "regency_id",
      cell: ({ row: { original } }) => <span>{original.regency_id}</span>,
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
  return (
    <div className="flex items-center gap-2">
      <ProposalDownloadButton id={row.id} />
      {row.status === "pending" && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAction(row.id, "approved");
            }}
            className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
            title="Setujui"
          >
            <Check className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAction(row.id, "rejected");
            }}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
            title="Tolak"
          >
            <X className="size-4" />
          </Button>
        </>
      )}
      {row.status === "approved" && (
        <ConvertProposalButton proposalId={row.id} proposalName={row.name} />
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

export function ProposalDownloadButton({ id }: { id: number }) {
  const { mutate, isPending } = useMutation({
    mutationFn: () => createSignedUrlForProposalBiofloc(id),
    onSuccess: (data) => {
      const url = URL.createObjectURL(data.blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    mutate();
  };
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      title="Download Dokumen"
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin text-zinc-600" />
      ) : (
        <Download className="size-4 text-zinc-600" />
      )}
    </Button>
  );
}
