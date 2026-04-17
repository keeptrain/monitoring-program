"use client";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BiohazardIcon,
  FilterIcon,
  LucideIcon,
  Navigation2,
  ShrimpIcon,
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

const FILTER_STATE: Record<LocationType, { label: string; icon: LucideIcon }> =
  {
    biofloc_thematic: { label: "Tematik Bioflok", icon: BiohazardIcon },
    isf: { label: "Integrated Shrimp Farming", icon: ShrimpIcon },
  };

export default function PublicMonitoringPage() {
  const [activeTab, setActiveTab] = useState<LocationType | null>(null);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const { data: locations } = useGetPublicLocationsByType(activeTab);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex flex-1 flex-col">
        {/* Page header */}
        <Header />

        {/* Map area */}
        <div className="bg-muted/30 relative flex flex-1">
          {/* Sidebar controls (placeholder) */}

          {/* Map placeholder */}
          <div className="relative flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
            {activeTab && locations ? (
              activeTab === "isf" ? (
                <LazyIsf />
              ) : (
                <LazyMap locations={locations} type={activeTab} />
              )
            ) : (
              <EmptyFilterState />
            )}

            {/* Bottom toolbar placeholder */}
            <BottomToolbarMap
              onFilterClick={() => setIsFilterSheetOpen(true)}
            />
          </div>
        </div>
      </main>

      <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
        <SheetContent side="left">
          <SheetHeader className="mb-6 text-left">
            <SheetTitle>Filter Area</SheetTitle>
            <SheetDescription>
              Pilih layer untuk memvisualisasikan data pada peta.
            </SheetDescription>
          </SheetHeader>
          <FilterLayerContent
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              setIsFilterSheetOpen(false);
            }}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Header() {
  const [showHeader, setShowHeader] = useState(true);
  return (
    <div
      className={cn(
        "bg-background overflow-hidden px-4 transition-all duration-500 ease-in-out",
        showHeader
          ? "border-border max-h-40 border-b py-2 opacity-100"
          : "max-h-0 border-b-0 border-transparent py-0 opacity-0",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
            Monitoring Publik
          </p>
          <h1 className="text-foreground text-lg font-semibold tracking-tight">
            Peta Sebaran Program Prioritas
          </h1>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowHeader(false)}
        >
          <XIcon />
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

const TOOLBAR_MAP_ICONS: LucideIcon[] = [FilterIcon, Navigation2];

function BottomToolbarMap({ onFilterClick }: { onFilterClick: () => void }) {
  return (
    <div className="border-border bg-background absolute bottom-6 z-10 flex items-center gap-1 border p-1">
      {TOOLBAR_MAP_ICONS.map((Icon, i) => (
        <button
          key={i}
          onClick={Icon === FilterIcon ? onFilterClick : undefined}
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

function EmptyFilterState() {
  return (
    <div className="flex -translate-y-8 flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="bg-muted/50 text-muted-foreground/50 group-hover:bg-muted group-hover:text-muted-foreground flex size-14 items-center justify-center rounded-full transition-colors">
        <FilterIcon className="size-6" />
      </div>
      <div className="space-y-2">
        <p className="text-foreground text-sm font-medium">
          Belum Ada Layer Terpilih
        </p>
        <p className="text-muted-foreground max-w-[280px] text-xs leading-relaxed">
          Silahkan pilih{" "}
          <code className="border-border bg-muted text-foreground mx-1 inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-tight uppercase">
            Filter Layer
          </code>{" "}
          untuk melihat visualisasi peta sebaran program.
        </p>
      </div>
    </div>
  );
}
