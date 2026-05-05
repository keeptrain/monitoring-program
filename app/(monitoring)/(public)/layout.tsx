import { MenuDashboardTriggerClient } from "@/components/MenuDashboardTriggerClient";
import PublicPageHeader from "@/components/PublicPageHeader";
import { Button } from "@/components/ui/button";
import { getSessionCached } from "@/features/auth/session";
import { FolderLockIcon } from "lucide-react";
import Link from "next/link";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionCached();
  const isLoggedIn = session.isLoggedIn;
  const userRole = session.role;

  return (
    <div className="grid min-h-screen grid-rows-[auto_auto_1fr]">
      <PublicPageHeader label="Monitoring" title="Dashboard Program Prioritas">
        {!isLoggedIn ? (
          <MenuDashboardTriggerClient
            isAuthenticated={isLoggedIn}
            userRole={userRole}
          />
        ) : (
          userRole !== "officer" && (
            <Button variant="default" size="sm" asChild>
              <Link href="/dashboard">
                <FolderLockIcon className="mr-1" />
                Admin Panel
              </Link>
            </Button>
          )
        )}
      </PublicPageHeader>
      <main className="bg-background px-4 sm:px-2">{children}</main>
    </div>
  );
}
