import { Suspense } from "react";
import { checkRoleGuard } from "@/features/auth/utils";
import MonitoringRevitalisasiPage from "@/features/monitoring/pages/MonitoringRevitalisasiPage";
import { MonitoringSkeleton } from "@/features/monitoring/components/MonitoringSkeleton";

export default async function RevitalisasiPage() {
  await checkRoleGuard("revitalisasi");

  return (
    <Suspense fallback={<MonitoringSkeleton />}>
      <MonitoringRevitalisasiPage />
    </Suspense>
  );
}
