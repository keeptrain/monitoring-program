import IsfReportForm from "@/features/isf/forms/IsfReportForm";

export default async function IsfCreatePage({
  searchParams,
}: {
  searchParams: Promise<{ step?: string }>;
}) {
  const { step } = await searchParams;

  return <IsfReportForm initialStep={step} />;
}
