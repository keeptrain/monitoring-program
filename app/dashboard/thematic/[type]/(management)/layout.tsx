import { ReactNode } from "react";
import { ThematicProgramTabs } from "@/features/thematic/components/ThematicProgramTabs";
import Link from "next/link";

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

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 space-y-2">
        <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
          <Link
            href="/dashboard"
            className="underline-offset-2 hover:underline"
          >
            Dashboard
          </Link>{" "}
          / Tematik / {config.label}
        </p>
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
