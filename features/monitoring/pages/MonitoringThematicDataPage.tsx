import BreadcrumbHeader from "@/components/shared/BreadcrumbHeader";
import MonitoringThematicDataTable from "../components/thematic/MonitoringThematicDataTable";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  THEMATIC_CONFIG,
  ThematicProgramType,
} from "@/features/thematic/constants/thematic-constants";

export default function MonitoringThematicDataPage({
  programType,
}: {
  programType: ThematicProgramType;
}) {
  const config = THEMATIC_CONFIG[programType];

  const breadcrumbItems = [
    {
      label: `${config.label} Tematik`,
      href: config.basePath,
    },
    {
      label: `Data ${config.label} Tematik`,
      href: `${config.basePath}/data`,
    },
  ];

  return (
    <div className="mx-auto my-6 max-w-6xl space-y-4">
      <div className="space-y-2">
        <BreadcrumbHeader items={breadcrumbItems} />
        <h1 className="text-xl font-bold tracking-tight">
          Penerima Bantuan {config.label} Tematik
        </h1>
      </div>
      <Suspense fallback={<SuspenseFallback />}>
        <MonitoringThematicDataTable programType={programType} />
      </Suspense>
    </div>
  );
}

function SuspenseFallback() {
  return (
    <div className="space-y-4">
      {/* Top Content Skeleton */}
      <div className="flex w-full items-center justify-between gap-4">
        <div className="border-primary flex items-center gap-2 border-l-2 pl-2">
          <Skeleton className="h-8 w-[270px]" />
        </div>
        <Skeleton className="h-8 w-[250px]" />
      </div>

      {/* Table Skeleton */}
      <div className="border-border rounded-md border">
        {/* Table Header */}
        <div className="bg-muted/50 border-border border-b p-3">
          <Skeleton className="h-6 w-full" />
        </div>
        {/* Table Rows */}
        <div className="divide-border divide-y">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-5 w-1/6" />
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-5 w-1/12" />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-4 w-[100px]" />
        <div className="flex gap-2">
          <Skeleton className="size-8" />
          <Skeleton className="size-8" />
          <Skeleton className="size-8" />
        </div>
      </div>
    </div>
  );
}
