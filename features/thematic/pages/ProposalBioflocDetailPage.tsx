import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import {
  CalendarPlusIcon,
  HomeIcon,
  HouseIcon,
  MapPinIcon,
  RefreshCwIcon,
} from "lucide-react";
import { getProposalBioflocDetail } from "../actions/proposal-biofloc";
import { proposalBioflocDetailQueryKey } from "../api/getProposalBioflocDetail";
import { INDONESIA_PROVINCES } from "../constants/indonesia-provinces";
import { formatDateWithTime } from "@/lib/utils";
import { LinkBackButton } from "@/components/shared/LinkBackButton";
import { StatusBadge } from "@/features/monitoring/components/biofloc/ProposalSubmissionTableColumns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailItem } from "@/components/shared/DetailItem";
import ProposalDetailClient from "../components/biofloc/ProposalDetailClient";
import { notFound } from "next/navigation";

interface ProposalBioflocDetailPageProps {
  params: Promise<{ type: string; id: string }>;
}

export default async function ProposalBioflocDetailPage({
  params,
}: ProposalBioflocDetailPageProps) {
  const { type, id } = await params;

  if (type !== "biofloc") {
    notFound();
  }

  const queryClient = new QueryClient();

  const data = await queryClient.fetchQuery({
    queryKey: proposalBioflocDetailQueryKey(Number(id)),
    queryFn: () => getProposalBioflocDetail(Number(id)),
  });

  if (!data) {
    notFound();
  }

  const {
    id: proposalId,
    province_id,
    name,
    status,
    district,
    village,
    created_at,
    updated_at,
    available_locations,
  } = data;

  const provinceName =
    INDONESIA_PROVINCES.find((p) => p.province_id === province_id)?.name ??
    province_id;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-muted-foreground mb-1 text-xs font-medium tracking-widest uppercase">
              Dashboard / Tematik / {type} / Proposal / Detail
            </p>
            <div className="flex items-center gap-1">
              <LinkBackButton href={`/dashboard/thematic/${type}/proposals`} />
              <h1 className="text-foreground text-lg font-semibold tracking-tight md:text-xl">
                {name}
              </h1>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
              <span className="flex items-center gap-2">
                <MapPinIcon className="size-4" />
                <p className="text-muted-foreground">{provinceName}</p>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <CalendarPlusIcon className="size-4" />
              <p className="text-muted-foreground text-sm">
                {formatDateWithTime(created_at)}
              </p>
            </span>
            <span className="flex items-center gap-2">
              <RefreshCwIcon className="size-4" />
              <p className="text-muted-foreground text-sm">
                {formatDateWithTime(updated_at)}
              </p>
            </span>
          </div>
          <StatusBadge status={status} />
        </div>

        <Card className="rounded-none">
          <CardHeader>
            <CardTitle>Informasi</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <DetailItem icon={HouseIcon} label="Kelurahan" value={district} />
            <DetailItem icon={HomeIcon} label="Desa" value={village} />
          </CardContent>
        </Card>

        <ProposalDetailClient
          id={proposalId}
          locations={{
            latitude: available_locations?.latitude || 0,
            longitude: available_locations?.longitude || 0,
          }}
        />
      </div>
    </HydrationBoundary>
  );
}
