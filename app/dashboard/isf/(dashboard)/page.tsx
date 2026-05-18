import IsfProgramPage from "@/features/isf/pages/IsfProgramPage";
import { getIsfStepSummaries } from "@/features/isf/actions/isf-program-logs";
import BreadcrumbHeader from "@/components/shared/BreadcrumbHeader";

const breadcrumbItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "ISF" },
];

export default async function Page() {
  const data = await getIsfStepSummaries();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4 flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
        <div>
          <div className="mb-1">
            <BreadcrumbHeader items={breadcrumbItems} />
          </div>
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">
            Program ISF
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Monitoring Integrated Shrimp Farming (ISF).
          </p>
        </div>
      </div>
      <IsfProgramPage data={data} />
    </div>
  );
}
