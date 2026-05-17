import { getSessionCached } from "@/features/auth/session";
import MonitoringMapPage from "@/features/monitoring/pages/MonitoringMapPage";

export default async function WithMapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn } = await getSessionCached();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="relative h-[65vh] min-h-[400px] w-full overflow-hidden">
        <MonitoringMapPage isAuthenticated={isLoggedIn} />
      </div>
      <section className="space-y-6">{children}</section>
    </div>
  );
}
