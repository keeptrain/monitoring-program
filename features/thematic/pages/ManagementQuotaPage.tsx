"use client";

import { useMemo, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Datatable from "@/components/datatable/datatable";

import { BioflocProgramQuotaTableColumns } from "../components/biofloc/BioflocProgramQuotaTableColumns";
import UpdateProgramQuotaSheet from "../components/biofloc/UpdateProgramQuotaSheet";
import { PROGRAM_QUOTA_YEAR } from "../forms/program-quota-schema";
import { useGetBioflocProgramQuotas } from "../api/getBioflocProgramQuotas";
import { useUpdateBioflocProgramQuota } from "../api/updateBioflocProgramQuota";
import { ProgramQuotaView } from "../actions/program-quotas";
import {
  ProgramQuotaUpdateInput,
  ProgramQuotaUpdateValues,
  programQuotaUpdateSchema,
} from "../forms/program-quota-schema";

export default function ManagementQuotaPage() {
  const [quotaSheetOpen, setQuotaSheetOpen] = useState(false);
  const [selectedQuotaRow, setSelectedQuotaRow] =
    useState<ProgramQuotaView | null>(null);
  const [submitQuotaError, setSubmitQuotaError] = useState<string | null>(null);

  const { data: quotaResponse, isLoading: isLoadingQuotas } =
    useGetBioflocProgramQuotas();
  const updateQuotaMutation = useUpdateBioflocProgramQuota();

  const quotaForm = useForm<
    ProgramQuotaUpdateInput,
    undefined,
    ProgramQuotaUpdateValues
  >({
    resolver: zodResolver(programQuotaUpdateSchema),
    defaultValues: {
      quota_limit: 0,
    },
  });

  const openQuotaSheetForRow = useCallback(
    (row: ProgramQuotaView) => {
      setSelectedQuotaRow(row);
      setSubmitQuotaError(null);
      quotaForm.reset({ quota_limit: row.quota_limit });
      setQuotaSheetOpen(true);
    },
    [quotaForm],
  );

  const onSubmitQuota = useCallback(
    async (values: ProgramQuotaUpdateValues) => {
      if (!selectedQuotaRow) {
        return;
      }
      setSubmitQuotaError(null);
      try {
        await updateQuotaMutation.mutateAsync({
          region_id: selectedQuotaRow.region_id,
          quota_limit: values.quota_limit,
        });
        setQuotaSheetOpen(false);
      } catch (error) {
        setSubmitQuotaError(
          error instanceof Error ? error.message : "Gagal menyimpan kuota.",
        );
      }
    },
    [selectedQuotaRow, updateQuotaMutation],
  );

  const quotaColumns = useMemo(
    () =>
      BioflocProgramQuotaTableColumns({ onEditQuota: openQuotaSheetForRow }),
    [openQuotaSheetForRow],
  );

  return (
    <>
      <Datatable
        columns={quotaColumns}
        data={quotaResponse?.data ?? []}
        isPending={isLoadingQuotas}
        topContent={(table) => (
          <div className="ml-auto w-1/4">
            <Input
              placeholder="Cari nama provinsi..."
              value={
                (table.getColumn("region_name")?.getFilterValue() as string) ??
                ""
              }
              onChange={(e) =>
                table.getColumn("region_name")?.setFilterValue(e.target.value)
              }
            />
          </div>
        )}
      />
      <Sheet open={quotaSheetOpen} onOpenChange={setQuotaSheetOpen}>
        <SheetContent
          side="right"
          className="data-[side=right]:sm:max-w-[500px]"
        >
          <SheetHeader>
            <SheetTitle>Ubah Kuota Program</SheetTitle>
            <SheetDescription>
              Perubahan disimpan sebagai kuota program tahun{" "}
              {PROGRAM_QUOTA_YEAR}.
            </SheetDescription>
          </SheetHeader>
          {selectedQuotaRow && (
            <UpdateProgramQuotaSheet
              provinceName={selectedQuotaRow.region_name}
              form={quotaForm}
              setSheetOpen={setQuotaSheetOpen}
              onSubmit={onSubmitQuota}
              submitError={submitQuotaError}
              isPending={updateQuotaMutation.isPending}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
