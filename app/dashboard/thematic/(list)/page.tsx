import { getThematicPrograms } from "@/features/thematic/actions/thematic-programs";
import Component from "@/features/thematic/ThematicProgramPage";

export default async function ThematicProgramPage() {
  const data = await getThematicPrograms();
  return <Component data={data} />;
}
