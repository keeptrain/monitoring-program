import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getThematicProgramQueryOptions } from "../api/getThematicProgram";
import { notFound } from "next/navigation";
import ThematicProgramEditTabsClient from "../components/ThematicProgramEditTabsClient";
import BreadcrumbHeader from "@/components/shared/BreadcrumbHeader";

const breadcrumbItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Tematik Bioflok", href: "/dashboard/thematic/biofloc" },
  { label: "Edit", href: "/dashboard/thematic/biofloc/edit" },
];

export default async function ThematicProgramEditFormPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;

  if (type !== "biofloc" && type !== "minapadi") {
    return notFound();
  }

  const queryClient = new QueryClient();
  queryClient.prefetchQuery(getThematicProgramQueryOptions(id));
  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <BreadcrumbHeader items={breadcrumbItems} />
      <HydrationBoundary state={dehydratedState}>
        <ThematicProgramEditTabsClient id={id} />
      </HydrationBoundary>
    </div>
  );
}
