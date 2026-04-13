"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  programPrioritySchema,
  ProgramPriorityFormValues,
} from "../forms/program-priority-schema";

const CREATE_PROGRAM_PRIORITY_DEFAULT_VALUES: ProgramPriorityFormValues = {
  available_location_id: undefined,
  name: "",
  provider_type: undefined,
  percentage_of_work: 0,
  status: undefined,
  constraints: "",
  follow_up: "",
  documentations: [{ image_before_path: "", image_after_path: "" }],
};

export function useProgramPriorityForm() {
  const form = useForm<ProgramPriorityFormValues>({
    // @ts-expect-error - Resolver type mismatch with Zod preprocess
    resolver: zodResolver(programPrioritySchema),
    defaultValues: CREATE_PROGRAM_PRIORITY_DEFAULT_VALUES,
  });

  const onSubmit = (data: ProgramPriorityFormValues) => {
    console.log(data);
  };

  return {
    form,
    // @ts-expect-error - Form submit type mismatch with Zod preprocess
    onSubmit: form.handleSubmit(onSubmit),
  };
}

export default useProgramPriorityForm;
