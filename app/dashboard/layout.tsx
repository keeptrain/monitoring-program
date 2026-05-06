import DashboardNavbar from "@/components/DashboardNavbar";
import { getSessionCached } from "@/features/auth/session";
import { redirect } from "next/navigation";

const SCOPE_TO_PATH: Record<string, string> = {
  biofloc: "/biofloc-thematic",
  minapadi: "/minapadi-thematic",
  isf: "/isf",
  revitalisasi: "/revitalisasi",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, programScope } = await getSessionCached();
  const homeHref =
    programScope === "all" ? "/" : SCOPE_TO_PATH[programScope] || "/";

  if (role === "officer") {
    return redirect(homeHref);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNavbar homeHref={homeHref} />
      <main className="bg-muted/20 xs:px-0 flex-1 px-6 py-12">{children}</main>
    </div>
  );
}
