import { getPublicAvailableLocations } from "@/features/dashboard/actions/public-available-locations";
import PublicMonitoringPage from "@/features/monitoring/PublicMonitoringPage";

export default async function MonitoringPage() {
  await getPublicAvailableLocations();
  return <PublicMonitoringPage />;
}
