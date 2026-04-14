import Component from "@/features/dashboard/AvailableLocationFormPage";
import { notFound } from "next/navigation";
import { AvailableLocationFormValues } from "@/features/dashboard/forms/available-location-schema";
import {
  AvailableLocation,
  getAvailableLocationById,
} from "@/features/dashboard/actions/available-locations";

export default async function AvailableLocationEditFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locationId = Number(id);

  if (Number.isNaN(locationId)) {
    return notFound();
  }

  let availableLocations: AvailableLocation;

  try {
    availableLocations = await getAvailableLocationById(locationId);
  } catch (error) {
    console.error("Error loading available location for edit:", error);
    return notFound();
  }

  const initialValues: AvailableLocationFormValues = {
    name: availableLocations.name,
    latitude: availableLocations.latitude,
    longitude: availableLocations.longitude,
  };

  return <Component initialValues={initialValues} locationId={locationId} />;
}
