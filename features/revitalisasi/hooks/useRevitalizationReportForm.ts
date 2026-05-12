import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import {
  revitalizationReportSchema,
  RevitalizationReportFormInput,
  RevitalizationReportFormValues,
} from "../forms/revitalization-report-schema";
import { useRouter } from "next/navigation";
import {
  createRevitalizationProgramLog,
  updateRevitalizationProgramLog,
} from "../actions/revitalization-program-logs";
import { RevitalizationProgramLog } from "../types/revitalization";
import { documentationFormSchema } from "@/features/documentation/forms/documentation-schema";
import { REVITALIZATION_AREAS } from "../constants/revitalization-area";

const DEFAULT_VALUES = (data?: RevitalizationProgramLog) => {
  return {
    name: data?.name ?? "",
    progress_date: data?.progress_date ?? "",
    progress_percent: data?.progress_percent ?? 0,
    status: data?.status ?? "",
    provider_name: data?.provider_name ?? "",
    production: data?.production ?? "",
    intervention: data?.intervention ?? "",
    total_worker: data?.total_worker ?? "",
    total_production_value: data?.total_production_value ?? "",
    limit_point_measurement: data?.limit_point_measurement ?? "",
    limit_pal: data?.limit_pal ?? "",
    outcome: data?.outcome ?? "",
    constraints: data?.constraints ?? "",
    follow_up: data?.follow_up ?? "",
    design_path: data?.design_path ?? null,
    documentations: [],
  };
};

export function useRevitalizationReportForm(
  areaId: number,
  initialData?: RevitalizationProgramLog,
) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [documentationError, setDocumentationError] = useState<string | null>(
    null,
  );

  const form = useForm<
    RevitalizationReportFormInput,
    undefined,
    RevitalizationReportFormValues
  >({
    resolver: zodResolver(revitalizationReportSchema),
    defaultValues: DEFAULT_VALUES(initialData),
  });

  const onSubmit = (values: RevitalizationReportFormValues) => {
    startTransition(async () => {
      setDocumentationError(null);
      try {
        const parsedDocumentations =
          documentationFormSchema.shape.documentations.safeParse(
            values.documentations ?? [],
          );

        const payload: RevitalizationReportFormValues = {
          ...values,
          constraints: values.constraints ?? "",
          follow_up: values.follow_up ?? "",
          documentations: parsedDocumentations.success
            ? (parsedDocumentations.data ?? [])
            : [],
        };

        if (initialData?.id) {
          const updated = await updateRevitalizationProgramLog(
            initialData.id,
            areaId,
            payload,
          );

          const area = REVITALIZATION_AREAS.find(
            (a) => a.id === updated.areaId,
          );
          router.push(
            `/dashboard/revitalisasi/${area?.slug ?? updated.areaId}`,
          );
          router.refresh();
          return;
        }

        const created = await createRevitalizationProgramLog(areaId, payload);

        const area = REVITALIZATION_AREAS.find((a) => a.id === created.areaId);
        router.push(`/dashboard/revitalisasi/${area?.slug ?? created.areaId}`);
        router.refresh();
      } catch (error) {
        if (
          error instanceof Error &&
          !error.message.includes("NEXT_REDIRECT")
        ) {
          console.error("Failed to submit revitalization report:", error);
          setDocumentationError(error.message);
        }
        router.refresh();
      }
    });
  };

  return { form, onSubmit, isPending, documentationError };
}
