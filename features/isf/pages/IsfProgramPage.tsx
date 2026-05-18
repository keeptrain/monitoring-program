"use client";

import { Button } from "@/components/ui/button";
import { ImageIcon, MapIcon } from "lucide-react";
import { STEP_COLORS } from "../constants/isf-step";
import { IsfStepSummary } from "../types/isf";
import ProgramAreaItemCard from "@/components/shared/ProgramAreaItemCard";
import { useState } from "react";
import dynamic from "next/dynamic";

const RecruitmentPhaseSkeleton = () => (
  <div className="grid animate-pulse gap-4">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="bg-muted/50 border-border flex h-[88px] w-full items-center justify-between border p-5"
      >
        <div className="flex w-3/4 items-center gap-6">
          <div className="size-12 shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="w-1/2 space-y-2">
            <div className="h-4 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-3 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
        <div className="size-10 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
      </div>
    ))}
  </div>
);

const LazyIsfRecruitmentPhasePage = dynamic(
  () => import("./IsfRecruitmentPhasePage"),
  { loading: () => <RecruitmentPhaseSkeleton /> },
);

type Tab = "zona" | "recruitment";

export default function IsfProgramPage({ data }: { data: IsfStepSummary[] }) {
  const [activeTab, setActiveTab] = useState<Tab>("zona");

  return (
    <>
      {/* Tab Navigation */}
      <div className="mb-6 flex gap-2">
        <Button
          variant={activeTab === "zona" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("zona")}
          className="gap-2"
        >
          <MapIcon className="size-4" />
          Update Progress per Zona
        </Button>
        <Button
          variant={activeTab === "recruitment" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("recruitment")}
          className="gap-2"
        >
          <ImageIcon className="size-4" />
          Update Recruitment
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === "zona" ? (
        <div className="grid gap-4">
          {data.map((program) => (
            <ProgramAreaItemCard
              key={program.step_id}
              href={`/dashboard/isf/${program.step_id}`}
              badgeLabel="Zona"
              badgeNumber={program.step_id}
              badgeColorClass={STEP_COLORS[program.step_id] || "bg-primary"}
              title={program.name}
              lastUpdatedAt={program.updated_at}
              progressPercent={program.progress_percent}
            />
          ))}
        </div>
      ) : (
        <LazyIsfRecruitmentPhasePage />
      )}
    </>
  );
}
