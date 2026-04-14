"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  programPrioritySchema,
  ProgramPriorityFormInput,
  ProgramPriorityFormValues,
} from "../forms/program-priority-schema";
import { createProgramsDjpbReports } from "../actions/programs-djpb-reports";

const CREATE_PROGRAM_PRIORITY_DEFAULT_VALUES: ProgramPriorityFormInput = {
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
  const form = useForm<
    ProgramPriorityFormInput,
    undefined,
    ProgramPriorityFormValues
  >({
    resolver: zodResolver(programPrioritySchema),
    defaultValues: CREATE_PROGRAM_PRIORITY_DEFAULT_VALUES,
  });

  const onSubmit = (data: ProgramPriorityFormValues) => {
    createProgramsDjpbReports(data);
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
}

export default useProgramPriorityForm;
