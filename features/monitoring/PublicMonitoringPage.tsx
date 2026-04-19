"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowUpIcon,
  FilterIcon,
  Grid3x2Icon,
  LucideIcon,
  Maximize2Icon,
  ShrimpIcon,
  WheatIcon,
  XIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
};

export default function PublicMonitoringPage() {
  const [activeTab, setActiveTab] = useState<LocationType | null>(null);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const { data: locations } = useGetPublicLocationsByType(activeTab);

  return (
    <>
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Map Container */}
        <div className="relative flex flex-1 flex-col justify-center bg-zinc-50/50">
          {activeTab && (locations || activeTab === "isf") ? (
            <div className="flex flex-1">
              {activeTab === "isf" ? (
                <LazyIsf />
              ) : (
                <LazyMap locations={locations!} type={activeTab} />
              )}
            </div>
          ) : (
            <EmptyFilterState onSelect={setActiveTab} />
          )}

          {/* Bottom toolbar */}
          {activeTab && (
            <>
              <Sheet
                open={isFilterSheetOpen}
                onOpenChange={setIsFilterSheetOpen}
              >
                <SheetContent side="left">
                  <SheetHeader className="mb-6 text-left">
                    <SheetTitle>Filter Area</SheetTitle>
                    <SheetDescription>
                      Pilih layer untuk memvisualisasikan data pada peta.
                    </SheetDescription>
                  </SheetHeader>
                  <FilterLayerContent
                    activeTab={activeTab}
                    onTabChange={(tab: LocationType) => {
                      setActiveTab(tab);
                      setIsFilterSheetOpen(false);
                    }}
                  />
                </SheetContent>
              </Sheet>

              <BottomToolbarMap
                onFilterClick={() => setIsFilterSheetOpen(true)}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}

function EmptyFilterState({
  onSelect,
}: {
  onSelect: (tab: LocationType) => void;
}) {
  return (
    <div className="mx-auto py-8">
      <div className="mb-8 text-center">
        <p className="text-muted-foreground">Data Visualisasi</p>
        <h1 className="text-3xl text-zinc-900">Pilih Program Prioritas</h1>
      </div>
      <div className="bg-border grid gap-px border lg:grid-cols-3">
        {Object.entries(FILTER_STATE).map(([key, value]) => (
          <button
            key={key}
            onClick={() => onSelect(key as LocationType)}
            className="group bg-background flex flex-col justify-between gap-8 p-8 text-left transition-all hover:bg-zinc-50"
          >
            <div className="flex items-start justify-between">
              <div className="border-border group-hover:border-foreground flex size-12 items-center justify-center border transition-colors">
                <value.icon className="text-foreground size-6" />
              </div>
              <Maximize2Icon className="text-muted-foreground group-hover:text-foreground size-5 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
            </div>
            <div>
              <h2 className="text-foreground text-base font-semibold">
                {value.label}
              </h2>
              <p className="text-muted-foreground mt-1 leading-relaxed font-medium">
                {value.sub}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function Header() {
  const [showHeader, setShowHeader] = useState(true);
  return (
    <div
      className={cn(
        "bg-background/95 border-border sticky top-14 z-40 overflow-hidden px-4 backdrop-blur transition-all duration-500 ease-in-out",
        showHeader
          ? "max-h-40 border-b py-2 opacity-100"
          : "max-h-0 border-b-0 border-transparent py-0 opacity-0",
      )}
    >
      <div className="mx-auto flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
            Monitoring Publik
          </p>
          <h1 className="text-foreground font-semibold tracking-tight">
            Peta Sebaran Program Prioritas
          </h1>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowHeader(false)}
        >
          <XIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function FilterLayerContent({
  activeTab,
  onTabChange,
}: {
  activeTab: LocationType | null;
  onTabChange: (tab: LocationType) => void;
}) {
  return (
    <div className="mx-4">
      <p className="text-muted-foreground mx-4 mb-4 flex items-center gap-2 text-xs font-medium tracking-widest uppercase sm:mx-0">
        <FilterIcon className="size-4" /> Filter Layer
      </p>
      <div className="mx-4 flex flex-col gap-1 sm:mx-0 lg:gap-4">
        {Object.entries(FILTER_STATE).map(([key, value]) => (
          <label
            key={key}
            className="text-foreground flex cursor-pointer items-center gap-2.5 py-2 text-sm lg:py-0"
            onClick={() => onTabChange(key as LocationType)}
          >
            <span className="border-border bg-background flex size-4 items-center justify-center border">
              {activeTab === key && <span className="bg-foreground size-2" />}
            </span>
            <value.icon className="size-4" />
            {value.label}
          </label>
        ))}
      </div>
    </div>
  );
}

const TOOLBAR_MAP_ICONS: LucideIcon[] = [FilterIcon, ArrowUpIcon];

function BottomToolbarMap({ onFilterClick }: { onFilterClick: () => void }) {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="border-border bg-background fixed right-8 bottom-8 z-50 flex items-center gap-1 border p-1 shadow-sm">
      {TOOLBAR_MAP_ICONS.map((Icon, i) => (
        <button
          key={i}
          onClick={Icon === FilterIcon ? onFilterClick : handleScrollToTop}
          className={cn(
            "text-muted-foreground hover:bg-muted hover:text-foreground flex items-center justify-center transition-colors",
            Icon === FilterIcon ? "flex h-9 gap-2 px-3" : "size-9",
          )}
        >
          <Icon className="size-4" />
          {Icon === FilterIcon && (
            <span className="text-[10px] font-bold tracking-wider uppercase">
              Filter
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
