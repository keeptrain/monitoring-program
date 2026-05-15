"use client";

import { Button } from "@/components/ui/button";
import { downloadProposalThematic } from "@/features/thematic/actions/proposal-thematic-internal-actions";
import { useMutation } from "@tanstack/react-query";
import { DownloadIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

const useDownloadProposal = () => {
  return useMutation({
    mutationFn: (id: string) => downloadProposalThematic(id),
    onSuccess: (result) => {
      if (result.success && result.data) {
        const { blob, fileName } = result.data;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    },
  });
};

export function ProposalDownloadButton({ id }: { id: string }) {
  const { mutate, isPending } = useDownloadProposal();

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    mutate(id);
  };
  return (
    <Button
      variant="outline"
      size="icon-xs"
      onClick={handleDownload}
      title="Download Dokumen"
    >
      {isPending ? (
        <Loader2Icon className="size-4 animate-spin text-zinc-600" />
      ) : (
        <DownloadIcon className="size-4 text-zinc-600" />
      )}
    </Button>
  );
}
