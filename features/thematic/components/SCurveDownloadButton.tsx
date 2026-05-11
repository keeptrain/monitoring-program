"use client";

import { Button } from "@/components/ui/button";
import { downloadSCurveFile } from "@/features/thematic/actions/biofloc-actions";
import { useMutation } from "@tanstack/react-query";
import { DownloadIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

export default function SCurveDownloadButton({ id }: { id: string }) {
  const { mutate, isPending } = useMutation({
    mutationFn: () => downloadSCurveFile(id),
    onSuccess: (data) => {
      if (!data || !data.blob || !data.fileName) {
        toast.error("Gagal mendapatkan data file");
        return;
      }

      const url = URL.createObjectURL(data.blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Berhasil mengunduh Kurva S");
    },
    onError: (error) => {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Gagal mengunduh Kurva S",
      );
    },
  });

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    mutate();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      disabled={isPending}
      className="flex items-center gap-2"
    >
      {isPending ? (
        <>
          <Loader2Icon className="size-4 animate-spin" />
          <span>Mengunduh...</span>
        </>
      ) : (
        <>
          <DownloadIcon className="size-4" />
          <span>Unduh Kurva S</span>
        </>
      )}
    </Button>
  );
}
