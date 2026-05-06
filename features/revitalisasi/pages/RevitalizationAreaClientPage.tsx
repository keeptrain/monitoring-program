"use client";

import { useCallback, useMemo, useState } from "react";
import Datatable from "@/components/datatable/datatable";
import { RevitalizationAreaTableColumns } from "../components/RevitalizationAreaTableColumns";
import { useGetRevitalizationByArea } from "../api/getRevitalizationByArea";
import { useRouter } from "next/navigation";
import { REVITALIZATION_AREAS } from "../constants/revitalization-area";
import { deleteRevitalizationProgramLog } from "../actions/revitalization-program-logs";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ManageDocumentationsSheet from "@/features/documentation/components/ManageDocumentationsSheet";

export default function RevitalizationAreaClientPage({
  area,
}: {
  area: string;
}) {
  const router = useRouter();
  const [openSheet, setOpenSheet] = useState<boolean | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const areaInfo = REVITALIZATION_AREAS.find((a) => a.slug === area);
  const areaId = areaInfo?.id ?? 0;

  const { data } = useGetRevitalizationByArea(area);

  const handleUpdateDocumentations = useCallback((id: string) => {
    setSelectedReportId(id);
    setOpenSheet(true);
  }, []);

  const handleDeleteReport = useCallback(
    async (id: string) => {
      if (window.confirm("Apakah Anda yakin ingin menghapus laporan ini?")) {
        try {
          await deleteRevitalizationProgramLog(id, areaId);
          router.refresh();
          toast.success("Laporan berhasil dihapus.");
        } catch (error) {
          console.error(error);
          alert("Gagal menghapus laporan.");
        }
      }
    },
    [areaId, router],
  );

  const columns = useMemo(
    () =>
      RevitalizationAreaTableColumns({
        onUpdateDocumentations: handleUpdateDocumentations,
        onDeleteReport: handleDeleteReport,
      }),
    [handleUpdateDocumentations, handleDeleteReport],
  );

  const handleRowClick = (row: { id: string }) => {
    router.push(`/dashboard/revitalisasi/report/${row.id}`);
  };

  return (
    <>
      <Datatable
        columns={columns}
        data={data?.data ?? []}
        onRowClick={handleRowClick}
      />

      {openSheet !== null && selectedReportId !== null && (
        <Sheet open={openSheet} onOpenChange={setOpenSheet}>
          <SheetContent className="data-[side=right]:sm:max-w-[600px]">
            <SheetHeader>
              <SheetTitle>Kelola Dokumentasi</SheetTitle>
              <SheetDescription>
                Tambah atau hapus foto dokumentasi. <br /> Klik nama file untuk
                preview, perubahan disimpan saat menekan &quot;Simpan&quot;.
              </SheetDescription>
            </SheetHeader>
            <ManageDocumentationsSheet
              programType="revitalization"
              programId={selectedReportId!}
              onSuccess={() => setOpenSheet(false)}
            />
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
