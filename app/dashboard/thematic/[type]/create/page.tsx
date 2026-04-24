import BioflocProgramForm from "@/features/thematic/forms/BioflocProgramForm";
import { notFound } from "next/navigation";

export default async function ThematicProgramCreatePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  if (type !== "biofloc" && type !== "minapadi") {
    return notFound();
  }

  return <BioflocProgramForm />;
}
