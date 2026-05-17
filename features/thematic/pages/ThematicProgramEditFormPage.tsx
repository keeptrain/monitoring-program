import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getThematicProgramQueryOptions } from "../api/getThematicProgram";
import { notFound } from "next/navigation";
import ThematicProgramEditTabsClient from "../components/ThematicProgramEditTabsClient";
import BreadcrumbHeader from "@/components/shared/BreadcrumbHeader";
import {
  THEMATIC_CONFIG,
  ThematicProgramType,
} from "../constants/thematic-constants";

export default async function ThematicProgramEditFormPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;

  // Map URL type to thematic program type
  const programType: ThematicProgramType | null =
    type === "biofloc"
      ? "biofloc_thematic"
      : type === "minapadi"
        ? "minapadi_thematic"
        : null;

  if (!programType || !THEMATIC_CONFIG[programType]) {
    return notFound();
  }

  const config = THEMATIC_CONFIG[programType];

  const queryClient = new QueryClient();
  queryClient.prefetchQuery(getThematicProgramQueryOptions(id));
  const dehydratedState = dehydrate(queryClient);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: `Tematik ${config.label}`, href: `/dashboard/thematic/${type}` },
    { label: "Edit" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <BreadcrumbHeader items={breadcrumbItems} />
      <HydrationBoundary state={dehydratedState}>
        <ThematicProgramEditTabsClient id={id} programType={programType} />
      </HydrationBoundary>
    </div>
  );
}
