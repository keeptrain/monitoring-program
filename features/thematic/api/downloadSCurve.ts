import { useMutation } from "@tanstack/react-query";
import { downloadSCurveFile } from "@/features/thematic/actions/thematic-actions";
import { toast } from "sonner";

export function useDownloadScurve(id: string) {
  return useMutation({
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
}
