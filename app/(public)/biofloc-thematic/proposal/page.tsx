import ProposalBioflocForm from "@/features/thematic/forms/ProposalBioflocForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { getSessionCached } from "@/features/auth/session";
import { redirect } from "next/navigation";

export default async function BioflocMonitoringProposalPage() {
  const { isLoggedIn, role } = await getSessionCached();

  if (!isLoggedIn && role !== "officer") {
    redirect("/");
  }
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
