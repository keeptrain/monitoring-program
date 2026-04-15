"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  availableLocationSchema,
  AvailableLocationFormValues,
} from "../forms/available-location-schema";
import {
  createAvailableLocation,
  updateAvailableLocation,
} from "../actions/available-locations";

const CREATE_LOCATION_DEFAULT_VALUES: AvailableLocationFormValues = {
  name: "",
  latitude: 123,
  longitude: 123,
};

export function useAvailableLocationForm(
  initialValues?: AvailableLocationFormValues,
  locationId?: number
) {
  const form = useForm<AvailableLocationFormValues>({
    resolver: zodResolver(availableLocationSchema),
    defaultValues: initialValues ?? CREATE_LOCATION_DEFAULT_VALUES,
  });

  const onSubmit = (data: AvailableLocationFormValues) => {
    if (locationId !== undefined) {
      updateAvailableLocation(locationId, data);
      return;
    }

    createAvailableLocation(data);
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
}

export default useAvailableLocationForm;
