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
import { documentationFormSchema } from "@/features/documentation/documentation-schema";

const DEFAULT_VALUES: IsfReportFormInput = {
  progress_date: new Date().toISOString().split("T")[0],
  step_id: 1,
  status: "",
  progress_percent: 0,
  provider_name: "",
  name: "",
  intervention: "",
  total_worker: "",
  production: "",
  outcome: "",
  constraints: "",
  follow_up: "",
  s_curve_path: "",
  documentations: [],
};

export function useIsfReportForm(
  initialStep?: string,
  initialData?: IsfProgramLog,
) {
  const [isPending, startTransition] = useTransition();
  const [documentationError, setDocumentationError] = useState<string | null>(
    null,
  );
  const router = useRouter();

  const form = useForm<IsfReportFormInput, undefined, IsfReportFormValues>({
    resolver: zodResolver(isfReportSchema),
    defaultValues: initialData
      ? {
          ...DEFAULT_VALUES,
          ...initialData,
          progress_date: initialData.progress_date.slice(0, 10),
          s_curve_path: "",
          documentations: [],
        }
      : {
          ...DEFAULT_VALUES,
          step_id: initialStep ? Number.parseInt(initialStep, 10) : 1,
        },
  });

  const onSubmit = (values: IsfReportFormValues) => {
    startTransition(async () => {
      setDocumentationError(null);
      try {
        const parsedDocumentations = documentationFormSchema.shape.documentations
          .safeParse(values.documentations ?? []);

        const payload: IsfReportFormValues = {
          ...values,
          constraints: values.constraints ?? "",
          follow_up: values.follow_up ?? "",
          s_curve_path: values.s_curve_path ?? "",
          documentations: parsedDocumentations.success
            ? parsedDocumentations.data
            : [],
        };

        if (initialData?.id) {
          const updated = await updateIsfProgramLog(initialData.id, payload);

          router.push(`/dashboard/isf/${updated.stepId}`);
          router.refresh();
          return;
        }

        const created = await createIsfProgramLog(payload);

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
