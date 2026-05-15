import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { XIcon } from "lucide-react";
import { getSessionCached } from "@/features/auth/session";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import React from "react";
import StepNavigation from "@/features/proposal/components/StepNavigation";
import DraftHandler from "@/features/proposal/components/DraftHandler";
import { Skeleton } from "@/components/ui/skeleton";
import { RevisionProposalData } from "./api/proposal-actions";
import PublicPageHeader from "@/components/PublicPageHeader";
import { AlertTriangleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ProposalIdentityForm = dynamic(
  () => import("@/features/proposal/forms/ProposalIdentityForm"),
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

const ProposalLocationForm = dynamic(
  () => import("@/features/proposal/forms/ProposalLocationForm"),
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
      programType: string;
      basePath: string;
    }>;
  }
> = {
  1: { title: "Identitas", Component: ProposalIdentityForm },
  2: { title: "Informasi Wilayah", Component: ProposalLocationForm },
  3: { title: "Detail Proposal", Component: ProposalDetailForm },
};

export default async function ProposalThematicFormPage({
  searchParams,
  initialData,
  proposalId,
  programType,
  basePath,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  initialData?: RevisionProposalData;
  proposalId?: string;
  programType: string;
  basePath: string;
}) {
  const params = await searchParams;

  const currentStep = Number(params.step) || 1;
  const pageConfig = PAGE_CONFIG[currentStep];

  if (!pageConfig) {
    redirect(`${basePath}/proposal?step=1`);
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

  const pageHeaderTitle = initialData ? `Perbaiki Proposal` : `Buat Proposal`;


  return (
    <>
      <PublicPageHeader
        label="Proposal"
        title={pageHeaderTitle}
        programType={programType}
      />
      <div className="mx-auto max-w-6xl space-y-4 pb-4">
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
        <div className="mx-4 flex items-center justify-between sm:mx-0">
          <Button variant="outline" asChild>
            <Link href={basePath}>
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
          <CardHeader>
            <CardTitle>{pageConfig.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Component
              initialData={stepData}
              proposalId={proposalId}
              programType={programType}
              basePath={basePath}
            />
          </CardContent>
          <CardFooter className="justify-end gap-4">
            <StepNavigation totalSteps={3} />
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
