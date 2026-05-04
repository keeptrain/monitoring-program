"use client";

import { Button } from "@/components/ui/button";
import { createSignedUrlForProposalBiofloc } from "@/features/thematic/actions/proposal-biofloc";
import { useMutation } from "@tanstack/react-query";
import { DownloadIcon, Loader2Icon } from "lucide-react";

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
        <Loader2Icon className="size-4 animate-spin text-zinc-600" />
      ) : (
        <DownloadIcon className="size-4 text-zinc-600" />
      )}
    </Button>
  );
}
