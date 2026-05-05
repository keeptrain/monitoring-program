import { checkRoleGuard } from "@/features/auth/utils";
import MonitoringRevitalisasiPage from "@/features/monitoring/pages/MonitoringRevitalisasiPage";

export default async function RevitalisasiPage() {
  await checkRoleGuard("revitalisasi");

  return <MonitoringRevitalisasiPage />;
}
