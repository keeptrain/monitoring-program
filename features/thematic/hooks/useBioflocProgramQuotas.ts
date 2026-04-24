"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  getBioflocProgramQuotas2026,
  ProgramQuotaView,
  upsertBioflocProgramQuota2026,
} from "../actions/program-quotas";
import {
  programQuotaUpdateSchema,
  ProgramQuotaUpdateInput,
  ProgramQuotaUpdateValues,
} from "../forms/program-quota-schema";

export function useBioflocProgramQuotas() {
  const [rows, setRows] = useState<ProgramQuotaView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ProgramQuotaView | null>(null);

  const form = useForm<
    ProgramQuotaUpdateInput,
    undefined,
    ProgramQuotaUpdateValues
  >({
    resolver: zodResolver(programQuotaUpdateSchema),
    defaultValues: {
      quota_limit: 0,
    },
  });

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoadError(null);
      setIsLoading(true);
      try {
        const data = await getBioflocProgramQuotas2026();
        if (!isMounted) return;
        setRows(data);
      } catch (error) {
        if (!isMounted) return;
        setLoadError(
          error instanceof Error ? error.message : "Gagal memuat data kuota.",
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const openForRow = useCallback(
    (row: ProgramQuotaView) => {
      setSelectedRow(row);
      setSubmitError(null);
      setSheetOpen(true);
      form.reset({
        quota_limit: row.quota_limit,
      });
    },
    [form],
  );

  const onSubmit = useCallback(
    (values: ProgramQuotaUpdateValues) => {
      if (!selectedRow) return;

      startTransition(async () => {
        setSubmitError(null);
        try {
          const updated = await upsertBioflocProgramQuota2026({
            region_id: selectedRow.region_id,
            quota_limit: values.quota_limit,
          });

          setRows((prev) =>
            prev.map((row) =>
              row.region_id === updated.region_id ? updated : row,
            ),
          );
          setSheetOpen(false);
        } catch (error) {
          setSubmitError(
            error instanceof Error ? error.message : "Gagal menyimpan kuota.",
          );
        }
      });
    },
    [selectedRow],
  );

  return {
    rows,
    isLoading,
    loadError,
    form,
    onSubmit,
    isPending,
    submitError,
    sheetOpen,
    setSheetOpen,
    selectedRow,
    openForRow,
  } as const;
}
