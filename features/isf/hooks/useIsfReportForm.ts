import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTransition } from "react";
import {
  isfReportSchema,
  IsfReportFormInput,
  IsfReportFormValues,
} from "../forms/isf-report-schema";
import { useRouter } from "next/navigation";

const DEFAULT_VALUES: IsfReportFormInput = {
  progress_date: new Date().toISOString().split("T")[0],
  step_id: 0,
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
  documentations: [{ image_before_path: "", image_after_path: "" }],
};

export function useIsfReportForm(initialStep?: string) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<IsfReportFormInput, undefined, IsfReportFormValues>({
    resolver: zodResolver(isfReportSchema),
    defaultValues: {
      ...DEFAULT_VALUES,
      step_id: initialStep ? parseInt(initialStep) : 0,
    },
  });

  const onSubmit = (values: IsfReportFormValues) => {
    startTransition(async () => {
      try {
        console.log("Submitting ISF Report:", values);
        // Implement the actual submission logic here
        router.back();
      } catch (error) {
        console.error("Failed to submit ISF report:", error);
      }
    });
  };

  return { form, onSubmit, isPending };
}
