import Component from "@/features/dashboard/AvailableLocationPage";
import { getAvailableLocations } from "@/features/dashboard/actions/available-locations";

export default async function AvailableLocationPage() {
  const data = await getAvailableLocations();
  return <Component data={data} />;
}
