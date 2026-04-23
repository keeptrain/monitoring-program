import { useForm } from "react-hook-form";
import { UpdateProgressFormValues } from "../forms/update-progress-schema";

export const useUpdateProgressForm = (
  initialData: UpdateProgressFormValues,
) => {
  const form = useForm<UpdateProgressFormValues>({
    defaultValues: {
      progress_percent: initialData.progress_percent,
    },
  });

  return {
    form,
  };
};
