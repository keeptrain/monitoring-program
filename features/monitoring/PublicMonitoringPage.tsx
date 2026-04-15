"use client";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import type { PublicAvailableLocation } from "@/features/dashboard/actions/public-available-locations";
import { cn } from "@/lib/utils";
import { FilterIcon, LucideIcon, Navigation2, XIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import dynamic from "next/dynamic";
import { useState } from "react";
import type { PublicMonitoringMapProps } from "./PublicMonitoringMap";
import { LoadingLazyMap } from "./components/LoadingLazyMap";

const LazyMap = dynamic<PublicMonitoringMapProps>(
  () => import("./PublicMonitoringMap"),
  {
    ssr: false,
    loading: () => <LoadingLazyMap />,
  },
);

export default function PublicMonitoringPage({
  locations,
}: {
  locations: PublicAvailableLocation[];
}) {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex flex-1 flex-col">
        {/* Page header */}
        <Header />

        {/* Map area */}
        <div className="bg-muted/30 relative flex flex-1">
          {/* Sidebar controls (placeholder) */}
          <aside className="border-border bg-background hidden w-64 shrink-0 border-r p-4 lg:flex lg:flex-col lg:gap-4">
            <FilterLayerContent
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </aside>

          {/* Map placeholder */}
          <div className="relative flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
            {activeTab ? (
              <LazyMap locations={locations} />
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

const PRIORITY_PROGRAM = ["Tematik", "Bioflok", "Isf", "Revitalisasi"];

function FilterLayerContent({
  activeTab,
  onTabChange,
}: {
  activeTab: string | null;
  onTabChange: (tab: string) => void;
}) {
  return (
    <>
      <p className="text-muted-foreground mx-4 flex items-center gap-2 text-xs font-medium tracking-widest uppercase sm:mx-0">
        <FilterIcon className="size-4" /> Filter Layer
      </p>
      <div className="mx-4 flex flex-col gap-1 sm:mx-0 lg:gap-4">
        {PRIORITY_PROGRAM.map((layer) => (
          <label
            key={layer}
            className="text-foreground flex cursor-pointer items-center gap-2.5 py-2 text-sm lg:py-0"
            onClick={() => onTabChange(layer)}
          >
            <span className="border-border bg-background flex size-4 items-center justify-center border">
              {activeTab === layer && <span className="bg-foreground size-2" />}
            </span>
            {layer}
          </label>
        ))}
      </div>
    </>
  );
}

const TOOLBAR_MAP_ICONS: LucideIcon[] = [FilterIcon, Navigation2];

function BottomToolbarMap({ onFilterClick }: { onFilterClick: () => void }) {
  return (
    <div className="border-border bg-background absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 border p-1">
      {TOOLBAR_MAP_ICONS.map((Icon, i) => (
        <button
          key={i}
          onClick={Icon === FilterIcon ? onFilterClick : undefined}
          className={cn(
            "text-muted-foreground hover:bg-muted hover:text-foreground flex items-center justify-center transition-colors",
            Icon === FilterIcon ? "flex h-9 gap-2 px-3 lg:hidden" : "size-9",
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
    <div className="flex flex-col items-center justify-center gap-4 px-6 text-center">
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
