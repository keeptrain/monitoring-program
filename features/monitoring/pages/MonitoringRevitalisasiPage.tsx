import Image from "next/image";
import RevitalisasiPinPoints from "../../revitalisasi/components/RevitalisasiPinPoint";
import RevitalisasiRightSideStats from "../../revitalisasi/components/RevitalisasiRightSideStats";

export default async function MonitoringRevitalisasiPage() {
  return (
    <div className="bg-background flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-6xl sm:px-0">
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
          <RevitalisasiRightSideStats />
        </div>
      </div>
    </div>
  );
}
