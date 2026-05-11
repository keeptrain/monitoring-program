import Image from "next/image";
import RevitalisasiPinPoints from "../../revitalisasi/components/RevitalisasiPinPoint";
import { getMonitoringRevitalization } from "../actions/monitoring-revitalization-actions";
import MonitoringRightSideStats from "../components/shared/MonitoringRightSideStats";
import { Suspense } from "react";
import { checkRoleGuard } from "@/features/auth/utils";
import RevitalizationStatsSection from "../components/revitalization/RevitalizationStatsSection";
import RevitalizationSheet from "../components/revitalization/RevitalizationSheet";
import { MonitoringSkeleton } from "../components/shared/MonitoringSkeleton";
import { IsfHeavyEquipmentPopover } from "../components/isf/IsfHeavyEquipmentPopover";

export default async function MonitoringRevitalisasiPage() {
  await checkRoleGuard("revitalisasi");

  return (
    <Suspense fallback={<MonitoringSkeleton />}>
      <MonitoringRevitalisasiContent />
    </Suspense>
  );
}

async function MonitoringRevitalisasiContent() {
  const data = await getMonitoringRevitalization();

  return (
    <>
      <div className="bg-background mx-auto flex max-w-6xl flex-1 flex-col">
        <div className="w-full sm:px-0">
          <div className="flex flex-col items-start gap-8 lg:flex-row">
            {/* Main Map Area */}
            <div className="relative aspect-video w-full max-w-4xl">
              <Image
                src="/images/revitalisasi_map.png"
                alt="Revitalisasi Map"
                width={1920}
                height={1080}
                className="h-full w-full"
                priority
              />

              {/* Pin Points (Client Side) */}
              <RevitalisasiPinPoints />
            </div>

            {/* Stats & Carousel (Client Side) */}
            <MonitoringRightSideStats
              totalWorkers={data?.total_workers || 0}
              documentationUrls={data?.latest_documentation_urls || []}
              isPending={false}
              heavyEquipmentPopoverContent={<IsfHeavyEquipmentPopover />}
            />
          </div>
        </div>

        {/* Client  */}
        <RevitalizationStatsSection />
      </div>
      <RevitalizationSheet />
    </>
  );
}
