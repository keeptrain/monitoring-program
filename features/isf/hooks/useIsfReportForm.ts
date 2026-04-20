import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import {
  isfReportSchema,
  IsfReportFormInput,
  IsfReportFormValues,
} from "../forms/isf-report-schema";
import { useRouter } from "next/navigation";
import {
  createIsfProgramLog,
  updateIsfProgramLog,
} from "../actions/isf-program-logs";
import { IsfProgramLog } from "../types/isf";
import { documentationFormSchema } from "@/features/documentation/forms/documentation-schema";

const DEFAULT_VALUES = (data?: IsfProgramLog) => {
  return {
    progress_date: data?.progress_date ?? "",
    progress_percent: data?.progress_percent ?? 0,
    name: data?.name ?? "",
    status: data?.status ?? "",
    provider_name: data?.provider_name ?? "",
    intervention: data?.intervention ?? "",
    total_worker: data?.total_worker ?? "",
    production: data?.production ?? "",
    outcome: data?.outcome ?? "",
    constraints: data?.constraints ?? "",
    follow_up: data?.follow_up ?? "",
    s_curve_path: data?.s_curve_path ?? "",
    documentations: [],
  };
};

export function useIsfReportForm(
  zone: string,
  initialData?: IsfProgramLog,
  initialMinDate?: string,
  initialMaxDate?: string,
) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [documentationError, setDocumentationError] = useState<string | null>(
    null,
  );

  const form = useForm<IsfReportFormInput, undefined, IsfReportFormValues>({
    resolver: zodResolver(isfReportSchema),
    defaultValues: DEFAULT_VALUES(initialData),
  });

  const onSubmit = (values: IsfReportFormValues) => {
    startTransition(async () => {
      setDocumentationError(null);
      try {
        if (!initialData) {
          if (
            initialMinDate &&
            values.progress_date &&
            values.progress_date < initialMinDate
          ) {
            throw new Error(
              `Tanggal laporan tidak boleh lebih kecil dari batas: ${initialMinDate}.`,
            );
          }

          if (
            initialMaxDate &&
            values.progress_date &&
            values.progress_date > initialMaxDate
          ) {
            throw new Error(
              `Tanggal laporan tidak boleh melebihi batas: ${initialMaxDate}.`,
            );
          }
        }

        const parsedDocumentations =
          documentationFormSchema.shape.documentations.safeParse(
            values.documentations ?? [],
          );

        const payload: IsfReportFormValues = {
          ...values,
          constraints: values.constraints ?? "",
          follow_up: values.follow_up ?? "",
          s_curve_path: values.s_curve_path ?? "",
          documentations: parsedDocumentations.success
            ? (parsedDocumentations.data ?? [])
            : [],
        };

        if (initialData?.id) {
          const updated = await updateIsfProgramLog(
            initialData.id,
            Number(zone),
            payload,
          );

          router.push(`/dashboard/isf/${updated.stepId}`);
          router.refresh();
          return;
        }

        const created = await createIsfProgramLog(Number(zone), payload);

        router.push(`/dashboard/isf/${created.stepId}`);
        router.refresh();
      } catch (error) {
        if (
          error instanceof Error &&
          !error.message.includes("NEXT_REDIRECT")
        ) {
          console.error("Failed to submit ISF report:", error);
          setDocumentationError(error.message);
        }
        router.refresh();
      }
    });
  };

  return { form, onSubmit, isPending, documentationError };
}
