"use client";

import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ThematicProgramIndex } from "../types/thematic";
import { useRouter } from "next/navigation";
import {
  UpdateProgressFormInput,
  UpdateProgressFormValues,
  updateProgressSchema,
} from "../forms/update-progress-schema";

export function useUpdateProgressSheet() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ThematicProgramIndex | null>(
    null,
  );

  const form = useForm<
    UpdateProgressFormInput,
    undefined,
    UpdateProgressFormValues
  >({
    resolver: zodResolver(updateProgressSchema),
    mode: "onBlur",
    defaultValues: {
      percentage_of_work: 0,
      documentations: [],
    },
  });

  const openForRow = useCallback((row: ThematicProgramIndex) => {
    setSelectedRow(row);
    setOpen(true);
  }, []);

  useEffect(() => {
    if (selectedRow) {
      form.reset({
        percentage_of_work: selectedRow.percentage_of_work,
        documentations: [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRow]);

  const onSubmit = useCallback(
    async (values: UpdateProgressFormValues) => {
      if (!selectedRow) return;
      try {
        // ensure client-side validation passed
        const valid = await form.trigger();
        if (!valid) return;

        // const res = await fetch(
        //   `/api/thematic/program-priority-reports/${selectedRow.id}/append-documentations`,
        //   {
        //     method: "POST",
        //     headers: { "content-type": "application/json" },
        //     body: JSON.stringify({
        //       percentage_of_work: values.percentage_of_work,
        //       documentations: values.documentations,
        //     }),
        //   },
        // );

        // if (res.ok) {
        //   setOpen(false);
        //   router.refresh();
        // } else {
        //   console.error("Failed to update");
        // }
      } catch (err) {
        console.error(err);
      }
    },
    [selectedRow, router, form],
  );

  return {
    sheetOpen: open,
    setSheetOpen: setOpen,
    openForRow,
    form,
    onSubmit,
  } as const;
}
