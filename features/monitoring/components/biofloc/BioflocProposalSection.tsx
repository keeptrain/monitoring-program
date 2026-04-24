"use client";

import { Button } from "@/components/ui/button";
import { ArrowDownIcon, UploadIcon } from "lucide-react";
import ProposalProvinceTable from "./ProposalProvinceTable";
import ProposalSubmissionTable from "./ProposalSubmissionTable";
import Link from "next/link";
import { useMemo } from "react";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { useGetBioflocProgramQuotas } from "@/features/monitoring/api/getBioflocProgramQuotas";

const IN_VIEW_OPTIONS = {
  root: null,
  rootMargin: "120px 0px",
  threshold: 0.1,
} as const;

export default function BioflocProposalSection() {
  const { ref: provinceTableRef, isInView: isProvinceTableInView } =
    useInViewOnce<HTMLDivElement>(IN_VIEW_OPTIONS);
  const { ref: submissionTableRef, isInView: isSubmissionTableInView } =
    useInViewOnce<HTMLDivElement>(IN_VIEW_OPTIONS);
  const { data: quotaResponse, isPending } = useGetBioflocProgramQuotas(
    isProvinceTableInView,
  );
  const proposalTotal = quotaResponse?.proposal_total ?? 0;

  const provinceData = useMemo(
    () =>
      (quotaResponse?.data ?? [])
        .filter((item) => item.quota_limit > 0)
        .map((item) => ({
          province: item.region_name,
          // DUMMY sementara sampai schema proposal per provinsi final.
          count: proposalTotal,
          quota: item.quota_limit,
        }))
        .sort((a, b) => b.quota - a.quota),
    [proposalTotal, quotaResponse?.data],
  );

  return (
    <section className="space-y-8">
      {/* 1. Upload Banner */}
      <Button className="h-10 w-full text-base font-bold uppercase" asChild>
        <Link href="/monitoring/biofloc/proposal">
          <UploadIcon />
          Upload Pengajuan Proposal Bioflok Tematik 2026
        </Link>
      </Button>

      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">
          Data Pengajuan Proposal Tematik Bioflok 2026
        </h2>
        <ArrowDownIcon className="size-4 animate-bounce" />
      </div>

      {/* 2. Summary Section: Circle + Small Table */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">
        {/* Circle Stats */}
        <div className="flex flex-col items-center justify-center border border-zinc-200 bg-zinc-50 lg:col-span-2">
          <p className="text-muted-foreground mb-6 text-xs font-bold uppercase">
            Jumlah Proposal Masuk
          </p>
          <div className="relative flex items-center justify-center">
            <div className="flex size-35 flex-col items-center justify-center border border-zinc-200 bg-white">
              <span className="text-4xl leading-none font-bold text-zinc-900">
                {proposalTotal}
              </span>
              <span className="text-foreground-muted mt-1 text-xs font-semibold uppercase">
                Proposal
              </span>
            </div>
          </div>
        </div>

        {/* Small Provincial Summary Table */}
        <div className="lg:col-span-4" ref={provinceTableRef}>
          <ProposalProvinceTable data={provinceData} isPending={isPending} />
        </div>
      </div>

      {/* 4. Submission Queue Table */}
      <div ref={submissionTableRef}>
        <ProposalSubmissionTable enabled={isSubmissionTableInView} />
      </div>
    </section>
  );
}
