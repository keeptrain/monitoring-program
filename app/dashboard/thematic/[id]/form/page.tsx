import Component from "@/features/thematic/forms/ThematicProgramForm";
import { getThematicProgramById } from "@/features/thematic/actions/thematic-programs";
import { ThematicProgramDetail } from "@/features/thematic/types/thematic";
import { notFound } from "next/navigation";

export default async function ThematicProgramEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const programId = Number(id);

  if (Number.isNaN(programId)) {
    return notFound();
  }

  let program;
  try {
    program = await getThematicProgramById(programId);
  } catch (error) {
    console.error("Error loading thematic program for edit:", error);
    return notFound();
  }

  return <Component initialData={program as ThematicProgramDetail} />;
}
