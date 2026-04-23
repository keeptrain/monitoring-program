import ProposalBioflocForm from "@/features/thematic/forms/ProposalBioflocForm";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function ProposalPage() {
  return (
    <div className="py-6 md:py-10">
      <div className="mx-auto max-w-6xl space-y-4 px-4 sm:px-0">
        <Button variant="outline" size="sm" asChild>
          <Link href="/monitoring">
            <ArrowLeftIcon className="size-4" />
            Kembali
          </Link>
        </Button>
        <div>
          <h2 className="text-primary text-lg font-semibold">
            Pengajuan Proposal Bioflok Tematik 2026
          </h2>
          <p className="text-muted-foreground text-sm">
            Silahkan isi form di bawah ini untuk mengajukan proposal
          </p>
        </div>

        <ProposalBioflocForm />
      </div>
    </div>
  );
}
