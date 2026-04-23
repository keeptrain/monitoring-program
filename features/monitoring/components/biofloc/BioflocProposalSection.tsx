import { Button } from "@/components/ui/button";
import { ArrowDownIcon, UploadIcon } from "lucide-react";
import ProposalProvinceTable from "./ProposalProvinceTable";
import ProposalSubmissionTable from "./ProposalSubmissionTable";

export default function BioflocProposalSection() {
  return (
    <section className="space-y-4">
      {/* 1. Upload Banner */}
      <Button className="h-10 w-full text-base font-bold uppercase">
        <UploadIcon />
        Upload Pengajuan Proposal Bioflok Tematik 2026
      </Button>

      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">
          Data Pengajuan Proposal Tematik Bioflok 2026
        </h2>
        <ArrowDownIcon className="size-4 animate-bounce" />
      </div>

      {/* 2. Summary Section: Circle + Small Table */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Circle Stats */}
        <div className="flex flex-col items-center justify-center border border-zinc-200 bg-zinc-50 p-8 lg:col-span-2">
          <p className="text-muted-foreground mb-6 text-xs font-bold uppercase">
            Jumlah Proposal Masuk
          </p>
          <div className="relative flex items-center justify-center">
            <div className="flex size-48 flex-col items-center justify-center border border-zinc-200 bg-white">
              <span className="text-5xl leading-none font-bold text-zinc-900">
                70
              </span>
              <span className="text-foreground-muted mt-1 text-xs font-semibold uppercase">
                Proposal
              </span>
            </div>
          </div>
        </div>

        {/* Small Provincial Summary Table */}
        <div className="lg:col-span-3">
          <ProposalProvinceTable />
        </div>
      </div>

      {/* 4. Submission Queue Table */}
      <ProposalSubmissionTable />
    </section>
  );
}
