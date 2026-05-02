"use client";

import dynamic from "next/dynamic";
import { LoadingLazyMap } from "@/features/monitoring/components/LoadingLazyMap";
import { ArrowUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PublicMonitoringMapProps } from "./MapClient";

const LazyMap = dynamic<PublicMonitoringMapProps>(() => import("./MapClient"), {
  ssr: false,
  loading: () => <LoadingLazyMap />,
});

export default function MonitoringMapPage({
  isAuthenticated = false,
}: {
  isAuthenticated?: boolean;
}) {
  return (
    <>
      {/* Map Container - Top Section */}
      <div className="flex h-full w-full">
        <LazyMap isAuthenticated={isAuthenticated} />
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
