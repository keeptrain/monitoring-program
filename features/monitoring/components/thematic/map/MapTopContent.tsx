"use client";

import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";
import { useGetMonitoringLocationsThematic } from "../../../api/getMonitoringLocationsByType";
import {
  THEMATIC_CONFIG,
  ThematicProgramType,
} from "@/features/thematic/constants/thematic-constants";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FishIcon, AlertCircleIcon, LocateFixedIcon } from "lucide-react";
import { MapPin } from "./MapPinIcon";

export default function MapTopContent({
  isAuthenticated,
  type,
  resetMap,
}: {
  isAuthenticated: boolean;
  type: ThematicProgramType;
  resetMap: () => void;
}) {
  const [statuses, setStatuses] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString).withDefault(["active"]),
  );

  const { data, isPending } = useGetMonitoringLocationsThematic(type, [
    "active",
  ]);
  const activeCount = data?.active?.length ?? 0;

  const showActive = statuses.includes("active");
  const showPotential = statuses.includes("potential");

  const handleToggleActive = (checked: boolean) => {
    if (checked) {
      setStatuses([...statuses, "active"], { scroll: false });
    } else {
      setStatuses(
        statuses.filter((s) => s !== "active"),
        { scroll: false },
      );
    }
  };

  const handleTogglePotential = (checked: boolean) => {
    if (checked) {
      setStatuses([...statuses, "potential"], { scroll: false });
    } else {
      setStatuses(
        statuses.filter((s) => s !== "potential"),
        { scroll: false },
      );
    }
  };

  const config = THEMATIC_CONFIG[type];
  const activeLagendaLabel = config.legendLabel;
  const hrefData = `${config.basePath}/data`;
  const LegendWrapper = isAuthenticated ? "label" : "div";
  const potentialValue = config.potentialValue;

  return (
    <>
      <div className="bg-secondary absolute top-3 left-15 z-1 border border-zinc-200 shadow-xs">
        <div className="flex items-center">
          <LegendWrapper
            className={cn(
              "flex items-center gap-2 px-2 transition-colors select-none",
              isAuthenticated
                ? "cursor-pointer hover:bg-zinc-100"
                : "cursor-default",
            )}
          >
            {isAuthenticated && (
              <Checkbox
                checked={showActive}
                onCheckedChange={(c) => handleToggleActive(!!c)}
              />
            )}
            <div className="flex items-center gap-1">
              <MapPin
                bgColor="bg-emerald-600"
                icon={FishIcon}
                iconColor="text-emerald-700"
                className="pb-1"
              />
              <div className="flex flex-col gap-1">
                <span className="text-[9px] leading-none font-bold tracking-widest text-zinc-400 uppercase">
                  {activeLagendaLabel}
                </span>
                <span className="text-sm leading-none font-semibold">
                  {isPending ? <Skeleton className="h-4 w-6" /> : activeCount}
                </span>
              </div>
            </div>
          </LegendWrapper>

          <LegendWrapper
            className={cn(
              "flex items-center gap-2 px-2 transition-colors select-none",
              isAuthenticated
                ? "cursor-pointer hover:bg-zinc-100"
                : "cursor-default",
            )}
          >
            {isAuthenticated && (
              <Checkbox
                checked={showPotential}
                onCheckedChange={(c) => handleTogglePotential(!!c)}
              />
            )}
            <div className="flex items-center gap-1">
              {type === "minapadi_thematic" && (
                <MapPin
                  bgColor="bg-red-600"
                  icon={AlertCircleIcon}
                  iconColor="text-red-700"
                  className="pb-1"
                />
              )}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] leading-none font-bold tracking-widest text-zinc-400 uppercase">
                  Target
                </span>
                <span className="text-sm leading-none font-semibold">
                  {potentialValue}
                </span>
              </div>
            </div>
          </LegendWrapper>
        </div>
      </div>
      <div className="absolute top-3 right-3 z-5 flex items-center gap-2">
        <Button size="lg" variant="secondary" asChild>
          <Link href={hrefData}>Lihat Data</Link>
        </Button>
      </div>
      <div className="absolute right-3 bottom-7 z-5">
        <Button
          size="icon-lg"
          variant="secondary"
          onClick={resetMap}
          title="Reset Posisi Peta"
        >
          <LocateFixedIcon className="size-4 text-zinc-600" />
        </Button>
      </div>
    </>
  );
}
