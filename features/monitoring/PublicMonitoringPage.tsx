"use client";

import {
  ArrowUpIcon,
  Grid3X3Icon,
  LeafIcon,
  LucideIcon,
  MenuIcon,
  ShrimpIcon,
  WavesIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoadingLazyMap } from "@/features/monitoring/components/LoadingLazyMap";
import { LocationType } from "@/features/dashboard/actions/available-locations";
import type { PublicMonitoringMapProps } from "@/features/monitoring/PublicMonitoringMap";

const LazyMap = dynamic<PublicMonitoringMapProps>(
  () => import("./PublicMonitoringMap"),
  {
    ssr: false,
    loading: () => <LoadingLazyMap />,
  },
);

const LazyIsf = dynamic(() => import("./PublicMonitoringIsf"), {
  ssr: false,
  loading: () => <LoadingLazyMap />,
});

const LazyPublicBioflocProposalSection = dynamic(
  () => import("./components/biofloc/PublicBioflocProposalSection"),
  {
    ssr: false,
    loading: () => <LoadingLazyMap />,
  },
);

const FILTER_STATE: Record<
  LocationType,
  { label: string; sub: string; icon: LucideIcon }
> = {
  biofloc_thematic: {
    label: "Tematik Bioflok",
    sub: "Budidaya Ikan Sistem Bioflok",
    icon: Grid3X3Icon,
  },
  minapadi_thematic: {
    label: "Tematik Minapadi",
    sub: "Budidaya Padi dan Ikan Terintegrasi",
    icon: LeafIcon,
  },
  isf: {
    label: "Integrated Shrimp Farming",
    sub: "Kawasan Budidaya Udang Terintegrasi",
    icon: ShrimpIcon,
  },
  revitalization: {
    label: "Revitalisasi",
    sub: "Revitalisasi tambak pantura",
    icon: WavesIcon,
  },
};

export default function PublicMonitoringPage() {
  const [activeTab, setActiveTab] = useState<LocationType | null>(
    "biofloc_thematic",
  );

  return (
    <>
      <Header
        activeTab={activeTab}
        onTabChange={(tab: LocationType) => setActiveTab(tab)}
      />
      <div className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-6xl space-y-8 pb-8">
          {/* Map Container - Top Section */}
          <section
            className={cn(
              "relative h-[65vh] min-h-[400px] w-full",
              activeTab !== "isf" && "mt-6",
            )}
          >
            {activeTab && (
              <div className="flex h-full w-full">
                {activeTab === "isf" ? (
                  <LazyIsf />
                ) : (
                  <LazyMap type={activeTab} />
                )}
              </div>
            )}
          </section>

          {/* Table Container - Bottom Section */}
          {activeTab === "biofloc_thematic" && (
            <LazyPublicBioflocProposalSection />
          )}
        </div>
      </div>
      <ScrollToTopButton />
    </>
  );
}

export function Header({
  activeTab,
  onTabChange,
}: {
  activeTab: LocationType | null;
  onTabChange: (tab: LocationType) => void;
}) {
  const activeLabel = activeTab
    ? FILTER_STATE[activeTab].label
    : "Select Dashboard";

  return (
    <div className="bg-backdrop-blur-sm sticky top-14 z-40 border-b border-zinc-200 bg-white/80 px-6 py-2">
      <div className="mx-auto flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold text-zinc-400 uppercase">
            Monitoring
          </h2>
          <h1 className="font-bold text-zinc-900">
            Dashboard Program Prioritas
          </h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center rounded-none border-zinc-200"
            >
              <MenuIcon className="size-4" />
              <span className="ml-2 hidden sm:block">
                Dashboard: {activeLabel}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-64 rounded-none" align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Pilih Dashboard Program</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={activeTab || ""}
                onValueChange={(value) => onTabChange(value as LocationType)}
              >
                {Object.entries(FILTER_STATE).map(([key, value]) => (
                  <DropdownMenuRadioItem
                    key={key}
                    value={key}
                    className="flex items-center gap-2 rounded-none px-2"
                  >
                    <value.icon className="size-4 text-zinc-400" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{value.label}</span>
                      <span className="text-[10px] leading-none text-zinc-400">
                        {value.sub}
                      </span>
                    </div>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
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
