import { ColumnDef } from "@tanstack/react-table";
import { ProposalBioflocThematicProgram } from "@/features/thematic/services/proposal-biofloc-services";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Check, X, Loader2 } from "lucide-react";
import { useState } from "react";

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
      cell: ({ row }) => {
        const status = row.original.status;
        let variant: "default" | "secondary" | "destructive" | "outline" =
          "outline";
        if (status === "Disetujui") variant = "default";
        if (status === "Ditolak") variant = "destructive";
        if (status === "Pending") variant = "secondary";

        return <Badge variant={variant}>{status}</Badge>;
      },
    },
  ];

// Admin Actions component extracted to handle loading states
function AdminActions({
  row,
  onApprove,
  onReject,
}: {
  row: ProposalBioflocThematicProgram;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}) {
  const [isDownloading, setIsDownloading] = useState(false);

  // const handleDownload = async () => {
  //   try {
  //     setIsDownloading(true);
  //     const supabase = await createClient();
  //     const { data, error } = await supabase.storage
  //       .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET as string)
  //       .download(row.proposal_path);

  //     if (error) {
  //       throw error;
  //     }

  //     // Create a download link
  //     const url = window.URL.createObjectURL(data);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     // Extract filename from path
  //     const filename = row.proposal_path.split("/").pop() || "proposal.pdf";
  //     a.download = filename;
  //     document.body.appendChild(a);
  //     a.click();
  //     window.URL.revokeObjectURL(url);
  //     document.body.removeChild(a);
  //   } catch (error) {
  //     console.error("Error downloading file:", error);
  //     toast.error("Gagal mendownload proposal");
  //   } finally {
  //     setIsDownloading(false);
  //   }
  // };

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
      {row.status === "Pending" && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onApprove(row.id)}
            className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
            title="Setujui"
          >
            <Check className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onReject(row.id)}
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
  onApprove: (id: number) => void,
  onReject: (id: number) => void,
): ColumnDef<ProposalBioflocThematicProgram>[] => [
  ...ProposalSubmissionTableColumns(),
  {
    header: "Aksi",
    id: "actions",
    cell: ({ row }) => (
      <AdminActions
        row={row.original}
        onApprove={onApprove}
        onReject={onReject}
      />
    ),
  },
];
