import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Column } from "@/components/datatable/datatable";
import { ProgramPriorityReportIndex } from "../actions/program-priority-reports";
import { formatDateWithTime } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export function ProgramPriorityColumns(): Column<ProgramPriorityReportIndex>[] {
  return [
    {
      header: "Lokasi",
      accessorKey: "available_location_id",
      cell: (row) => row.available_locations?.name || "-",
    },
    { header: "Program", accessorKey: "name" },
    { header: "Status", accessorKey: "status" },
    {
      header: "Capaian (%)",
      accessorKey: "percentage_of_work",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Progress value={row.percentage_of_work} className="w-20" />
          <span className="text-xs">{row.percentage_of_work}%</span>
        </div>
      ),
    },
    {
      header: "Diperbarui",
      accessorKey: "created_at",
      cell: (row) => formatDateWithTime(row.created_at),
    },
    {
      header: "Aksi",
      cell: (row) => (
        <Button size="sm" variant="outline" asChild>
          <Link href={`/dashboard/program-priority-report/form/${row.id}`}>
            Ubah
          </Link>
        </Button>
      ),
    },
  ];
}
