"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  availableLocationSchema,
  AvailableLocationFormValues,
} from "../forms/available-location-schema";
import { createAvailableLocation } from "../actions/available-locations";

const CREATE_LOCATION_DEFAULT_VALUES: AvailableLocationFormValues = {
  name: "",
  latitude: 123,
  longitude: 123,
};

export function useAvailableLocationForm() {
  const form = useForm<AvailableLocationFormValues>({
    resolver: zodResolver(availableLocationSchema),
    defaultValues: CREATE_LOCATION_DEFAULT_VALUES,
  });

  const onSubmit = (data: AvailableLocationFormValues) => {
    createAvailableLocation(data);
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
}

export default useAvailableLocationForm;
