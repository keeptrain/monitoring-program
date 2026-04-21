import { getThematicPrograms } from "@/features/thematic/actions/thematic-programs";
import ThematicProgramPage from "@/features/thematic/ThematicProgramPage";
import { ThematicProgramIndex } from "@/features/thematic/types/thematic";
import { notFound } from "next/navigation";
import React from "react";

const PAGE_CONFIG: Record<
  string,
  {
    label: string;
    Component: React.ComponentType<{ data: ThematicProgramIndex[] }>;
  }
> = {
  biofloc: {
    label: "Program Tematik Bioflok",
    Component: ThematicProgramPage,
  },
  minapadi: {
    label: "Program Tematik Minapadi",
    Component: MinapadiPage,
  },
};

export default async function ThematicProgramTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  if (type !== "biofloc" && type !== "minapadi") {
    return notFound();
  }

  const config = PAGE_CONFIG[type];
  const ComponentPage = config.Component;
  const data = await getThematicPrograms();

  return <ComponentPage data={data} />;
}

function MinapadiPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
        <div>
          <p className="text-muted-foreground mb-1 text-xs font-medium tracking-widest uppercase">
            Dashboard / Tematik / Minapadi
          </p>
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">
            Program Tematik Minapadi
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Kelola dan pantau program KDMP tematik minapadi DJPB.
          </p>
        </div>
      </div>
    </div>
  );
}
