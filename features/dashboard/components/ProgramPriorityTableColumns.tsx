import { Column } from "@/components/datatable/datatable";
import { ProgramPriorityReportIndex } from "../actions/program-priority-reports";
import { formatDateWithTime } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { MoreButton, MoreButtonMenuItem } from "@/components/shared/MoreButton";

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
      accessorKey: "updated_at",
      cell: (row) => formatDateWithTime(row.updated_at),
    },
    {
      header: "Aksi",
      cell: (row) => {
        const menuItems: MoreButtonMenuItem[] = [
          {
            type: "link",
            key: "edit",
            label: "Ubah",
            href: `/dashboard/program-priority-report/form/${row.id}`,
          },
          {
            type: "action",
            key: "report",
            label: "Laporkan",
            onClick: (e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("asas");
            },
          },
        ];
        return <MoreButton menuItems={menuItems} />;
      },
    },
  ];
}
