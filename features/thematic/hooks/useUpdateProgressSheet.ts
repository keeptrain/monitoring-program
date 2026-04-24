"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  updateProgressSchema,
  UpdateProgressFormInput,
  UpdateProgressFormValues,
} from "../forms/update-progress-schema";
import { ThematicProgramIndex } from "../types/thematic";
import { updateThematicProgramProgress } from "../actions/biofloc";

export function useUpdateProgressSheet() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ThematicProgramIndex | null>(
    null,
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<
    UpdateProgressFormInput,
    undefined,
    UpdateProgressFormValues
  >({
    resolver: zodResolver(updateProgressSchema),
    defaultValues: {
      progress_percent: 0,
      documentations: [],
    },
  });

  const openForRow = useCallback(
    (row: ThematicProgramIndex) => {
      setSelectedRow(row);
      setSubmitError(null);
      setSheetOpen(true);
      form.reset({
        progress_percent: row.progress_percent,
        documentations: [],
      });
    },
    [form],
  );

  const onSubmit = useCallback(
    (values: UpdateProgressFormValues) => {
      if (!selectedRow) return;

      startTransition(async () => {
        setSubmitError(null);
        try {
          await updateThematicProgramProgress(selectedRow.id, values);
          setSheetOpen(false);
        } catch (error) {
          setSubmitError(
            error instanceof Error
              ? error.message
              : "Gagal memperbarui progress program.",
          );
        }
      });
    },
    [selectedRow],
  );

  return {
    sheetOpen,
    setSheetOpen,
    selectedRow,
    form,
    onSubmit,
    submitError,
    isPending,
    openForRow,
  } as const;
}
