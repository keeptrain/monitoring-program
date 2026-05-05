import MonitoringIsfPage from "@/features/monitoring/MonitoringIsfPage";
import { checkRoleGuard } from "@/features/auth/utils";

export default async function IsfMonitoringPage() {
  await checkRoleGuard("isf");

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 pb-8">
      <MonitoringIsfPage />
    </div>
  );
}
