import { checkRoleGuard } from "@/features/auth/utils";
import ProposalBioflocForm from "@/features/thematic/forms/ProposalBioflocForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
export default async function BioflocMonitoringProposalPage() {
  await checkRoleGuard("biofloc-thematic");

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <Button variant="outline" asChild>
        <Link href="/biofloc-thematic">
          <ArrowLeftIcon />
          Kembali
        </Link>
      </Button>
      <ProposalBioflocForm />
    </div>
  );
}
