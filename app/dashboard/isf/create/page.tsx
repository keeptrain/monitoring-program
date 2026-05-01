import IsfReportForm from "@/features/isf/forms/IsfReportForm";
import { notFound } from "next/navigation";

export default async function IsfCreatePage({
  searchParams,
}: {
  searchParams: Promise<{ step?: string; minDate?: string; maxDate?: string }>;
}) {
  const { step } = await searchParams;

  if (!step) {
    return notFound();
  }

  return <IsfReportForm zone={step} />;
}
