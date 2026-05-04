import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getProposalBioflocPaginated } from "@/features/thematic/actions/proposal-biofloc";
import { proposalBioflocQueryKey } from "@/features/thematic/api/getProposalBioflocPaginated";
import ProposalBioflocProgramPage from "@/features/thematic/pages/ProposalBioflocProgramPage";
import { notFound } from "next/navigation";
import React from "react";
import { getSessionCached } from "@/features/auth/session";
import { UserRole } from "@/features/auth/types/user";

const PAGE_CONFIG: Record<
  string,
  {
    label: string;
    Component: React.ComponentType<{ role: UserRole }>;
  }
> = {
  biofloc: {
    label: "Program Tematik Bioflok",
    Component: ProposalBioflocProgramPage,
  },
  minapadi: {
    label: "Program Tematik Minapadi",
    Component: () => (
      <div className="bg-muted flex h-40 items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground text-sm italic">
          Halaman proposal Minapadi sedang dalam pengembangan.
        </p>
      </div>
    ),
  },
};

export default async function ThematicProposalPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  if (type !== "biofloc" && type !== "minapadi") {
    return notFound();
  }

  const { role } = await getSessionCached();

  const queryClient = new QueryClient();

  // Prefetch only if biofloc for now
  if (type === "biofloc") {
    const defaultParams = {
      page: 1,
      pageSize: 20,
      province: "",
      search: "",
    };
    await queryClient.prefetchQuery({
      queryKey: proposalBioflocQueryKey(defaultParams),
      queryFn: () => getProposalBioflocPaginated(defaultParams),
    });
  }

  const config = PAGE_CONFIG[type];
  const ComponentPage = config.Component;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ComponentPage role={role} />
      </HydrationBoundary>
    </div>
  );
}
