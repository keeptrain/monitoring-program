"use client";

import { Button } from "@/components/ui/button";
import { ArrowDownIcon, UploadIcon } from "lucide-react";
import ProposalProvinceTable from "./ProposalProvinceTable";
import ProposalSubmissionTable from "./ProposalSubmissionTable";
import Link from "next/link";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { useGetBioflocProgramQuotas } from "@/features/monitoring/api/getBioflocProgramQuotas";

const IN_VIEW_OPTIONS = {
  root: null,
  rootMargin: "120px 0px",
  threshold: 0.5,
} as const;

export default function PublicBioflocProposalSection() {
  const { ref: provinceTableRef, isInView: isProvinceTableInView } =
    useInViewOnce<HTMLDivElement>(IN_VIEW_OPTIONS);

  const { ref: submissionTableRef, isInView: isSubmissionTableInView } =
    useInViewOnce<HTMLDivElement>(IN_VIEW_OPTIONS);

  const { data: quotaResponse, isPending } = useGetBioflocProgramQuotas(
    isProvinceTableInView,
  );

  const proposalTotal = quotaResponse?.proposal_total ?? 0;

  return (
    <section className="space-y-8">
      {/* 1. Upload Banner */}
      <Button className="h-10 w-full text-base" asChild>
        <Link href="/monitoring/biofloc/proposal">
          <UploadIcon />
          Upload Pengajuan Proposal Bioflok Tematik 2026
        </Link>
      </Button>

      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-zinc-900">
          Data Pengajuan Proposal Tematik Bioflok 2026
        </h2>
        <ArrowDownIcon className="size-4 animate-bounce text-zinc-900" />
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
        <div ref={provinceTableRef} className="lg:col-span-4">
          <ProposalProvinceTable
            data={quotaResponse?.data ?? []}
            isPending={isPending}
          />
        </div>
      </div>

      {/* 4. Submission Queue Table */}
      <div ref={submissionTableRef}>
        <ProposalSubmissionTable enabled={isSubmissionTableInView} />
      </div>
    </section>
  );
}
