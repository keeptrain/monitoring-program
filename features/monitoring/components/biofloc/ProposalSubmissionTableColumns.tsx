import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Check, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { createSignedUrlForProposalBiofloc } from "@/features/thematic/actions/proposal-biofloc";
import { ConvertProposalButton } from "@/features/thematic/components/biofloc/ConvertProposalButton";
import {
  ProposalBioflocStatus,
  ProposalBioflocThematicProgram,
} from "@/features/proposal/types/proposal-biofloc";
import z from "zod";

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

export const ProposalSubmissionTableColumns =
  (): ColumnDef<ProposalBioflocThematicProgram>[] => [
    {
      header: "Nama KDMP",
      accessorKey: "kdmp_entities.name",
      cell: ({ row: { original } }) => original.kdmp_entities.name,
    },
    {
      header: "No. KUSUKA",
      accessorKey: "kdmp_entities.kusuka_number",
      cell: ({ row: { original } }) => original.kdmp_entities.kusuka_number,
    },
    {
      header: "Status Proposal",
      accessorKey: "status",
      cell: ({ row: { original } }) => <StatusBadge status={original.status} />,
    },
  ];

export const proposalVerificationSchema = z
  .object({
    status: z.enum(["approved", "rejected"]),
    rejectionReason: z.string().nullable(),
  })
  .refine((data) => {
    if (data.status === "rejected" && !data.rejectionReason) {
      return false;
    }
    return true;
  });

export type ProposalVerificationFormValues = z.infer<
  typeof proposalVerificationSchema
>;

function ActionButtons({
  row,
  onAction,
}: {
  row: ProposalBioflocThematicProgram;
  onAction: (id: string, action: "verify" | "convert") => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {row.status === "pending" && (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onAction(row.id, "verify");
          }}
          title="Verifikasi"
        >
          <Check className="size-4" />
          Verifikasi
        </Button>
      )}
      <ProposalDownloadButton id={row.id} />
      {row.status === "approved" && (
        <ConvertProposalButton
          proposalId={row.id}
          proposalName={row.kdmp_entities.name}
        />
      )}
    </div>
  );
}

export const ProposalAdminTableColumns = (
  onAction: (id: string, action: "verify" | "convert") => void,
): ColumnDef<ProposalBioflocThematicProgram>[] => [
  ...ProposalSubmissionTableColumns(),
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => <ActionButtons row={row.original} onAction={onAction} />,
  },
];

export function ProposalDownloadButton({ id }: { id: string }) {
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
