"use client";

import dynamic from "next/dynamic";
import { LoadingLazyMap } from "@/features/monitoring/components/LoadingLazyMap";
import { ArrowUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PublicMonitoringMapProps } from "./MonitoringMapPage";

const LazyMap = dynamic<PublicMonitoringMapProps>(
  () => import("./MonitoringMapPage"),
  {
    ssr: false,
    loading: () => <LoadingLazyMap />,
  },
);

export default function PublicMonitoringPage({
  isAuthenticated = false,
  children,
}: {
  isAuthenticated?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <>
      <div className="mx-auto w-full max-w-6xl space-y-8 pb-8">
        {/* Map Container - Top Section */}
        <section className="relative h-[65vh] min-h-[400px] w-full">
          <div className="flex h-full w-full">
            <LazyMap isAuthenticated={isAuthenticated} />
          </div>
        </section>

        {/* Dynamic Content Container - Bottom Section */}
        <div className="space-y-8">{children}</div>
      </div>
      <ScrollToTopButton />
    </>
  );
}

function ScrollToTopButton() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="fixed right-8 bottom-8 z-50">
      <Button
        variant="outline"
        size="icon"
        onClick={handleScrollToTop}
        className="bg-background/80 size-10 rounded-full border shadow-sm backdrop-blur-sm"
      >
        <ArrowUpIcon className="size-4" />
      </Button>
    </div>
  );
}
