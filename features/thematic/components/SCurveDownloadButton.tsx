"use client";

import { Button } from "@/components/ui/button";
import { useDownloadScurve } from "@/features/thematic/api/downloadSCurve";
import { DownloadIcon, Loader2Icon } from "lucide-react";

export default function SCurveDownloadButton({ id }: { id: string }) {
  const { mutate, isPending } = useDownloadScurve(id);

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
