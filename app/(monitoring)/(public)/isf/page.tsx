import MonitoringIsfPage from "@/features/monitoring/pages/MonitoringIsfPage";
import { checkRoleGuard } from "@/features/auth/utils";
import { Suspense } from "react";
import { MonitoringSkeleton } from "@/features/monitoring/components/MonitoringSkeleton";

export default async function IsfMonitoringPage() {
  await checkRoleGuard("isf");

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 pb-8">
      <Suspense fallback={<MonitoringSkeleton />}>
        <MonitoringIsfPage />
      </Suspense>
    </div>
  );
}
