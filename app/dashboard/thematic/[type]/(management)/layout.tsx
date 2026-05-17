import { ReactNode } from "react";
import { ThematicProgramTabs } from "@/features/thematic/components/ThematicProgramTabs";
import BreadcrumbHeader from "@/components/shared/BreadcrumbHeader";

const PAGE_CONFIG: Record<string, { label: string }> = {
  biofloc: { label: "Bioflok" },
  minapadi: { label: "Minapadi" },
};

export default async function ThematicTypeLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const config = PAGE_CONFIG[type] || { label: type };

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: `Tematik ${config.label}`, href: `/dashboard/thematic/${type}` },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 space-y-2">
        <BreadcrumbHeader items={breadcrumbItems} />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-foreground text-2xl font-semibold tracking-tight">
              Program Tematik {config.label}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Kelola dan pantau program tematik {config.label.toLowerCase()}{" "}
              DJPB.
            </p>
          </div>
          {/* <div className="shrink-0">
            <Button size="sm" asChild>
              <Link href={`/dashboard/thematic/${type}/create`}>
                <PlusIcon className="size-4" />
                KDMP
              </Link>
            </Button>
          </div> */}
        </div>
      </div>

      <ThematicProgramTabs />

      {children}
    </div>
  );
}
