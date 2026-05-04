import BioflocProgramForm from "@/features/thematic/forms/BioflocProgramForm";
import { ThematicFormHeader } from "@/features/thematic/components/ThematicFormHeader";
import { getThematicProgramById } from "@/features/thematic/actions/biofloc";
import { ThematicProgramDetail } from "@/features/thematic/types/thematic";
import { notFound } from "next/navigation";

export default async function ThematicProgramEditPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;

  if (type !== "biofloc" && type !== "minapadi") {
    return notFound();
  }

  let program;
  try {
    program = await getThematicProgramById(id);
  } catch (error) {
    console.error("Error loading thematic program for edit:", error);
    return notFound();
  }

  return (
    <div className="mx-auto max-w-4xl">
      <ThematicFormHeader isEdit />
      <BioflocProgramForm initialData={program as ThematicProgramDetail} />
    </div>
  );
}
