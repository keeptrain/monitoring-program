import { ArrowDownIcon, UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getSessionCached } from "@/features/auth/session";
import {
  FILTER_STATE,
  ThematicType,
} from "@/features/thematic/constants/filter-state";

export default async function MonitoringThematicHeader({
  thematicType,
}: {
  thematicType: ThematicType;
}) {
  const { isLoggedIn, role } = await getSessionCached();

  const config = FILTER_STATE[thematicType];
  const proposalHref = `${config.href}/proposal`;

  const isCanUploadProposal = isLoggedIn && role === "officer";
  return (
    <>
      {isCanUploadProposal && (
        <Button className="h-10 w-full text-base" asChild>
          <Link href={proposalHref}>
            <UploadIcon />
            Upload Pengajuan Proposal {config.label} 2026
          </Link>
        </Button>
      )}

      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-zinc-900">
          Data Pengajuan Proposal {config.label} 2026
        </h2>
        <ArrowDownIcon className="size-4 animate-bounce text-zinc-900" />
      </div>
    </>
  );
}
