import { Table } from "@tanstack/react-table";
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export default function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-muted-foreground flex-1 text-xs">
        {table.getFilteredRowModel().rows.length} row(s)
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        {/* <div className="flex items-center gap-2">
          <p className="text-xs font-medium">Rows per page</p>
          <NativeSelect
            className="w-[72px]"
            value={`${table.getState().pagination.pageSize}`}
            onChange={(event) => {
              table.setPageSize(Number(event.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <NativeSelectOption key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div> */}

        <div className="flex w-[100px] items-center justify-center text-xs font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            className="hidden lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="size-4" />
            <span className="sr-only">Go to first page</span>
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="size-4" />
            <span className="sr-only">Go to previous page</span>
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="size-4" />
            <span className="sr-only">Go to next page</span>
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            className="hidden lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="size-4" />
            <span className="sr-only">Go to last page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
