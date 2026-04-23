import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProposalTable from "@/features/monitoring/components/biofloc/ProposalTable";

type Props = {
  params: Promise<{
    type: string;
  }>;
};

export default async function MonitoringBantuan2025Page({ params }: Props) {
  const { type } = await params;

  if (type !== "biofloc_thematic") {
    return notFound();
  }

  return (
    <main className="py-4 md:py-8">
      <div className="mx-auto max-w-6xl space-y-4 px-4 sm:px-0">
        <Button variant="outline" size="sm" asChild>
          <Link href="/monitoring">
            <ArrowLeftIcon className="size-4" />
            Kembali
          </Link>
        </Button>

        <section className="space-y-4">
          <h2 className="text-lg font-bold">
            Penerima Bantuan Tematik Bioflok Tahun 2025
          </h2>
          <ProposalTable />
        </section>
      </div>
    </main>
  );
}
