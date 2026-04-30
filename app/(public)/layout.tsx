import { MenuDashboardTriggerClient } from "@/components/MenuDashboardTriggerClient";
import Navbar from "@/components/Navbar";
import PublicPageHeader from "@/components/PublicPageHeader";
import { Button } from "@/components/ui/button";
import { session } from "@/features/auth/session";
import { FolderLockIcon } from "lucide-react";
import Link from "next/link";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionData = await session();
  const { isAuthenticated, userRole } = sessionData;

  return (
    <div className="grid min-h-screen grid-rows-[auto_auto_1fr]">
      <Navbar />
      <PublicPageHeader label="Monitoring" title="Dashboard Program Prioritas">
        {!isAuthenticated ? (
          <MenuDashboardTriggerClient
            isAuthenticated={isAuthenticated}
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
      <main className="bg-background">{children}</main>
    </div>
  );
}
