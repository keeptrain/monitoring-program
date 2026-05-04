import { DASHBOARD_LINKS } from "@/lib/constants/navigation";
import { getSessionCached } from "../auth/session";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await getSessionCached();

  const role = session.role;
  const programScope = session.programScope;

  const filteredLinks = DASHBOARD_LINKS.filter((link) => {
    if (link.href === "/dashboard/users") {
      return role === "admin";
    }

    if (programScope === "all") return true;

    return link.href.includes(programScope);
  });

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-10">
        <p className="text-muted-foreground mb-2 text-xs font-medium tracking-widest uppercase">
          Admin Panel
        </p>
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Kelola data untuk masing-masing program prioritas.
        </p>
      </div>

      {/* Quick-access cards */}
      <div
        className={cn(
          "border-border bg-border grid gap-px border",
          filteredLinks.length > 1 && "sm:grid-cols-2",
        )}
      >
        {filteredLinks.map(({ href, label, icon: Icon, description }) => (
          <Link
            key={href}
            href={href}
            className="group bg-background hover:bg-muted/60 flex flex-col justify-between gap-6 p-8 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="border-border group-hover:border-foreground flex size-10 items-center justify-center border transition-colors">
                <Icon className="text-foreground size-5" />
              </div>
              <ArrowRightIcon className="text-muted-foreground group-hover:text-foreground size-4 transition-transform group-hover:translate-x-1" />
            </div>
            <div>
              <h2 className="text-foreground text-sm font-semibold">{label}</h2>
              <p className="text-muted-foreground mt-1 text-xs">
                {description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
