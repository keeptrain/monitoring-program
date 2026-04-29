import PublicMonitoringPage from "@/features/monitoring/PublicMonitoringPage";
import { cookies } from "next/headers";

export default async function MonitoringPage() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("session_id")?.value === "true";

  return (
    <>
      <PublicMonitoringPage isAuthenticated={isAuthenticated} />
    </>
  );
}
