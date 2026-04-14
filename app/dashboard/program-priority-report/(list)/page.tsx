import { getProgramPriorityReports } from "@/features/dashboard/actions/program-priority-reports";
import Component from "@/features/dashboard/ProgramPriorityReportPage";

export default async function ProgramPriorityReportPage() {
  const data = await getProgramPriorityReports();
  return <Component data={data} />;
}
