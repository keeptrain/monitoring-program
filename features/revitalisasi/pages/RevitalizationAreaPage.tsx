import { REVITALIZATION_AREAS } from "../constants/revitalization-area";
import { notFound } from "next/navigation";

export default async function RevitalizationAreaPage({
  params,
}: {
  params: Promise<{ area: string }>;
}) {
  const { area: slug } = await params;

  // Find area by slug
  const areaInfo = REVITALIZATION_AREAS.find((a) => a.slug === slug);

  // Validation: Only allow existing areas
  if (!areaInfo) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <p className="text-muted-foreground mb-1 text-xs font-medium tracking-widest uppercase">
          Dashboard / Revitalisasi / {areaInfo.name}
        </p>
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">
          Detail Area: {areaInfo.name}
        </h1>
      </div>

      <div className="bg-background border-border flex h-64 items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground text-sm italic">
          Konten log monitoring untuk {areaInfo.name} sedang dikembangkan...
        </p>
      </div>
    </div>
  );
}
