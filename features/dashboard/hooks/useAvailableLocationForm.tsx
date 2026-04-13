"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  availableLocationSchema,
  AvailableLocationFormValues,
} from "../forms/available-location-schema";

const CREATE_LOCATION_DEFAULT_VALUES: AvailableLocationFormValues = {
  name: "",
  latitude: undefined,
  longitude: undefined,
};

export function useAvailableLocationForm() {
  const form = useForm<AvailableLocationFormValues>({
    resolver: zodResolver(availableLocationSchema),
    defaultValues: CREATE_LOCATION_DEFAULT_VALUES,
  });

  const onSubmit = (data: AvailableLocationFormValues) => {
    console.log("Location Form Data:", data);
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
}

export default useAvailableLocationForm;
