import BioflocProgramForm from "@/features/thematic/forms/BioflocProgramForm";
import { getThematicProgramById } from "@/features/thematic/actions/biofloc";
import { ThematicProgramDetail } from "@/features/thematic/types/thematic";
import { notFound } from "next/navigation";

export default async function ThematicProgramEditPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;
  const programId = Number(id);

  if (Number.isNaN(programId) || (type !== "biofloc" && type !== "minapadi")) {
    return notFound();
  }

  let program;
  try {
    program = await getThematicProgramById(programId);
  } catch (error) {
    console.error("Error loading thematic program for edit:", error);
    return notFound();
  }

  return <BioflocProgramForm initialData={program as ThematicProgramDetail} />;
}
