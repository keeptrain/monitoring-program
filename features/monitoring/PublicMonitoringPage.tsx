"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowUpIcon,
  Grid3x2Icon,
  LucideIcon,
  MenuIcon,
  ShrimpIcon,
  WavesIcon,
  WheatIcon,
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
import { useState } from "react";
import { LoadingLazyMap } from "./components/LoadingLazyMap";
import { LocationType } from "../dashboard/actions/available-locations";
import type { PublicMonitoringMapProps } from "./PublicMonitoringMap";
import { useGetPublicLocationsByType } from "./api/getPublicLocationsByType";

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

const FILTER_STATE: Record<
  LocationType,
  { label: string; sub: string; icon: LucideIcon }
> = {
  biofloc_thematic: {
    label: "Tematik Bioflok",
    sub: "Budidaya Ikan Sistem Bioflok",
    icon: Grid3x2Icon,
  },
  minapadi_thematic: {
    label: "Tematik Minapadi",
    sub: "Budidaya Padi dan Ikan Terintegrasi",
    icon: WheatIcon,
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
  const [activeTab, setActiveTab] = useState<LocationType | null>("isf");

  const { data: locations } = useGetPublicLocationsByType(activeTab);

  return (
    <>
      <Header
        activeTab={activeTab}
        onTabChange={(tab: LocationType) => setActiveTab(tab)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Map Container */}
        <div className="relative flex flex-1 flex-col justify-center bg-zinc-50/50">
          {activeTab && (locations || activeTab === "isf") && (
            <div className="flex flex-1">
              {activeTab === "isf" ? (
                <LazyIsf />
              ) : (
                <LazyMap locations={locations!} type={activeTab} />
              )}
            </div>
          )}

          <BottomToolbarMap />
        </div>
      </div>
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
    <div className="bg-background/95 border-border sticky top-14 z-40 overflow-hidden px-6 py-4 backdrop-blur transition-all duration-500 ease-in-out">
      <div className="mx-auto flex items-center justify-between">
        <div>
          <h2 className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
            Monitoring
          </h2>
          <h1 className="text-foreground font-semibold tracking-tight">
            Dashboard Program Prioritas
          </h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center">
              <MenuIcon className="size-4" />
              <span className="hidden sm:block">Dashboard: {activeLabel}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-64" align="end">
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
                    className="flex items-center gap-2 px-2"
                  >
                    <value.icon className="text-muted-foreground size-4" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{value.label}</span>
                      <span className="text-muted-foreground text-[10px] leading-none">
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

function BottomToolbarMap() {
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
