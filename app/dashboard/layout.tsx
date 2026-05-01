import DashboardNavbar from "@/components/DashboardNavbar";
import { LinkBackButton } from "@/components/shared/LinkBackButton";
import { session } from "@/features/auth/session";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersRes = await headers();
  const { isAuthenticated, userRole } = await session();

  console.log(headersRes.get("x-pathname"));

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

function Header({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <LinkBackButton href="/dashboard" />
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
