import DashboardNavbar from "@/components/DashboardNavbar";
import { session } from "@/features/auth/session";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, userRole } = await session();

  if (!isAuthenticated || (userRole !== "admin" && userRole !== "pmo")) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNavbar />
      <main className="bg-muted/20 xs:px-0 flex-1 px-6 py-12">{children}</main>
    </div>
  );
}
