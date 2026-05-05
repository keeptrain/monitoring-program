import { Button } from "@/components/ui/button";
import Link from "next/link";
import { XIcon } from "lucide-react";
import { getSessionCached } from "@/features/auth/session";
import { redirect } from "next/navigation";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";
import React from "react";
import StepNavigation from "@/features/proposal/components/StepNavigation";
import DraftHandler from "@/features/proposal/components/DraftHandler";
import { Skeleton } from "@/components/ui/skeleton";
import { RevisionProposalData } from "./api/proposal-actions";
import PublicPageHeader from "@/components/PublicPageHeader";
import { AlertTriangleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const IdentityKdmpForm = dynamic(
  () => import("@/features/proposal/forms/IdentityKdmpForm"),
  {
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-32 w-full" />
      </div>
    ),
  },
);
const LocationKdmpForm = dynamic(
  () => import("@/features/proposal/forms/LocationKdmpForm"),
  {
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-[320px] w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    ),
  },
);
const ProposalDetailForm = dynamic(
  () => import("@/features/proposal/forms/ProposalDetailForm"),
  {
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    ),
  },
);

const PAGE_CONFIG: Record<
  number,
  {
    title: string;
    Component: React.ComponentType<{
      // TODO: Replace any with actual type
      initialData?: any;
      proposalId?: string;
    }>;
  }
> = {
  1: { title: "Identitas KDMP", Component: IdentityKdmpForm },
  2: { title: "Informasi Wilayah KDMP", Component: LocationKdmpForm },
  3: { title: "Detail Proposal", Component: ProposalDetailForm },
};

export default async function ProposalThematicPage({
  searchParams,
  initialData,
  proposalId,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  initialData?: RevisionProposalData;
  proposalId?: string;
}) {
  const params = await searchParams;

  const currentStep = Number(params.step) || 1;
  const pageConfig = PAGE_CONFIG[currentStep];

  if (!pageConfig) {
    redirect("/biofloc-thematic/proposal?step=1");
  }

  const { isLoggedIn, role } = await getSessionCached();

  if (!isLoggedIn && role !== "officer") {
    redirect("/login");
  }

  const Component = pageConfig.Component;

  // Select only relevant data for the current step
  const stepData = initialData
    ? initialData[`step${currentStep}Data` as keyof typeof initialData]
    : undefined;

  const pageHeaderTitle = initialData
    ? `Perbaiki proposal tematik bioflok`
    : `Buat proposal tematik bioflok`;

  return (
    <>
      <PublicPageHeader label="Proposal" title={pageHeaderTitle} />
      <div className="mx-auto max-w-6xl space-y-4">
        {initialData && (
          <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
            <AlertTriangleIcon className="size-4" />
            <AlertTitle>Proposal kamu ditolak</AlertTitle>
            <AlertDescription>
              Dengan catatan: {initialData?.revisionReason || "-"}. Silakan
              revisi proposal kamu berdasarkan catatan yang diberikan.
            </AlertDescription>
          </Alert>
        )}
        <DraftHandler />
        <div className="flex items-center justify-between">
          <Button variant="outline" asChild>
            <Link href="/biofloc-thematic">
              <XIcon className="size-4" />
              Batal
            </Link>
          </Button>

          <div className="text-muted-foreground text-sm font-medium">
            Langkah <span className="text-foreground">{currentStep}</span> dari
            3
          </div>
        </div>
        <Card>
          <CardContent>
            <CardTitle>{pageConfig.title}</CardTitle>
            <div className="min-h-[300px]">
              <Component initialData={stepData} proposalId={proposalId} />
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-4">
            <StepNavigation totalSteps={3} backHref="/biofloc-thematic" />
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
