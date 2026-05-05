"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import dynamic from "next/dynamic";
import { UserRole } from "@/features/auth/types/user";

const IN_VIEW_OPTIONS = {
  root: null,
  rootMargin: "120px 0px",
  threshold: 0.5,
} as const;

const LazyTableComponent = dynamic(
  () => import("../../../proposal/components/tables/ProposalSubmissionTable"),
  {
    loading: () => <Skeleton className="h-[500px] w-full" />,
  },
);

export default function LazyThematicProposalTable({
  role = undefined,
}: {
  role?: UserRole | undefined;
}) {
  const { ref, isInView } = useInViewOnce<HTMLDivElement>(IN_VIEW_OPTIONS);

  return (
    <div ref={ref} className="mb-6">
      {isInView && <LazyTableComponent enabled={isInView} role={role} />}
    </div>
  );
}
