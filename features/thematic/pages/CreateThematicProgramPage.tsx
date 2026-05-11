import { notFound } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getProposalBioflocDetailQueryOptions } from "../api/getProposalBioflocDetail";
import CreateThematicProgramClientPage from "./CreateThematicProgramClientPage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import BreadcrumbHeader from "@/components/shared/BreadcrumbHeader";

const breadcrumbItems = [
  { label: "Dashboard", href: "/dashboard" },
  {
    label: "Proposal Tematik Bioflok",
    href: "/dashboard/thematic/biofloc/proposals",
  },
  { label: "Tambah" },
];

export default async function CreateThematicProgramPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ proposalId?: string }>;
}) {
  const { type } = await params;
  const { proposalId } = await searchParams;

  if (type !== "biofloc" && type !== "minapadi") {
    return notFound();
  }

  if (!proposalId) {
    return notFound();
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    getProposalBioflocDetailQueryOptions(proposalId),
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <BreadcrumbHeader items={breadcrumbItems} />
      <Alert>
        <InfoIcon />
        <AlertTitle>Informasi</AlertTitle>
        <AlertDescription>
          Data ini nantinya akan menjadi program tematik. Status di proposal dan
          di program akan otomatis menjadi potensial.
        </AlertDescription>
      </Alert>
      <HydrationBoundary state={dehydratedState}>
        <CreateThematicProgramClientPage proposalId={proposalId} />
      </HydrationBoundary>
    </div>
  );
}
