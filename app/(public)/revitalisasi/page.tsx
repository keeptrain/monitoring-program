import { checkRoleGuard } from "@/proxy";
import MonitoringRevitalisasiPage from "@/features/revitalisasi/MonitoringRevitalisasiPage";

export default async function RevitalisasiPage() {
  await checkRoleGuard("revitalisasi");

  return <MonitoringRevitalisasiPage />;
}
