import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicBioflocTable from "@/features/monitoring/components/biofloc/PublicBioflocTable";

type Props = {
  params: Promise<{
    type: string;
  }>;
};

export default async function MonitoringBantuan2025Page({ params }: Props) {
  const { type } = await params;

  if (type !== "biofloc-thematic") {
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
            Penerima Bantuan Tematik Bioflok
          </h2>
          <PublicBioflocTable />
        </section>
      </div>
    </main>
  );
}
