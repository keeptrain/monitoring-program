import { ThematicProgramDetailComponent as Component } from "@/features/thematic/components/ThematicProgramDetail";
import { getThematicProgramById } from "@/features/thematic/actions/thematic-programs";
import { notFound } from "next/navigation";

export default async function ThematicProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string; type: string }>;
}) {
  const { id, type } = await params;
  const programId = Number(id);

  if (Number.isNaN(programId) || (type !== "biofloc" && type !== "minapadi")) {
    return notFound();
  }

  let program;
  try {
    program = await getThematicProgramById(programId);
  } catch (error) {
    console.error("Error loading thematic program detail:", error);
    return notFound();
  }

  return <Component data={program} />;
}
