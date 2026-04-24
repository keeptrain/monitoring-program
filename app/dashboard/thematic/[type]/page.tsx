import { getThematicPrograms } from "@/features/thematic/actions/biofloc";
import BioflocProgramPage from "@/features/thematic/BioflocProgramPage";
import MinapadiProgramPage from "@/features/thematic/MinapadiProgramPage";
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
    Component: BioflocProgramPage,
  },
  minapadi: {
    label: "Program Tematik Minapadi",
    Component: MinapadiProgramPage,
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
