import { useForm } from "react-hook-form";
import { UpdateProgressFormValues } from "../forms/update-progress-schema";

export const useUpdateProgressForm = () => {
  const form = useForm<UpdateProgressFormValues>({
    defaultValues: {
      percentage_of_work: 0,
    },
  });

  return {
    form,
  };
};
