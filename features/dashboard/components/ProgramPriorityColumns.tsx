import { Button } from "@/components/ui/button";
import { Column } from "@/components/datatable/datatable";
import { ProgramPriorityReportIndex } from "../actions/program-priority-reports";
import { formatDateWithTime } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";

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
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/program-priority-report/form/${row.id}`}>
                Ubah
              </Link>
            </DropdownMenuItem>
            {/* <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Hapus
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
