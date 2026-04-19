import { Button } from "@/components/ui/button";
import { STEPS } from "@/features/isf/constants/isf-step";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    type: string;
    id: string;
  }>;
};

export default async function MonitoringDetailPage({ params }: Props) {
  const { type, id } = await params;

  // Validasi tipe dan format ID (zona1 - zona7) secara efisien
  const zoneMatch = id.match(/^zona([1-7])$/);

  if (type !== "isf" || !zoneMatch) {
    return notFound();
  }

  // Ambil angka zona (1-7) dari hasil regex
  const zoneNumber = parseInt(zoneMatch[1], 10);
  const currentStep = STEPS.find((s) => s.id === zoneNumber);

  return (
    <main className="py-6 md:py-10">
      <div className="mx-auto max-w-6xl space-y-10">
        {/* Header */}
        <div className="space-y-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/monitoring">
              <ArrowLeftIcon className="size-4" />
              Kembali
            </Link>
          </Button>
          <div>
            <p className="text-muted-foreground font-semibold tracking-wider uppercase">
              Detail Monitoring
            </p>
            <div className="flex flex-col gap-0 md:flex-row md:items-center md:gap-2">
              <h1 className="text-muted-foreground text-xl font-semibold">
                Zona {zoneNumber}:
              </h1>
              <p className="text-primary text-xl font-bold tracking-wider uppercase">
                {currentStep?.name || "Integrated Shrimp Farming"}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
      </div>
    </main>
  );
}
