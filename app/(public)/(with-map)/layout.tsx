import PublicMonitoringPage from "@/features/monitoring/PublicMonitoringPage";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { LoadingLazyMap } from "@/features/monitoring/components/LoadingLazyMap";

export default async function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userRole = cookieStore.get("session_id")?.value;
  const isAuthenticated = !!userRole;

  return (
    <Suspense fallback={<LoadingLazyMap />}>
      <PublicMonitoringPage isAuthenticated={isAuthenticated}>
        {children}
      </PublicMonitoringPage>
    </Suspense>
  );
}
