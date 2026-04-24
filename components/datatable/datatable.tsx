import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  Table as TanstackTable,
} from "@tanstack/react-table";
import React, { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Loader2Icon } from "lucide-react";
import DataTablePagination from "./data-table-pagination";

interface TableOptions {
  defaultPageSize?: number;
  showRowsText?: boolean;
  showPagination?: boolean;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isPending?: boolean;
  options?: TableOptions;
  topContent?: (table: TanstackTable<TData>) => React.ReactNode;
  onRowClick?: (row: TData) => void;
}

export default function DataTable<TData, TValue>({
  topContent,
  columns,
  data,
  isPending = false,
  onRowClick,
  options: userOptions,
}: DataTableProps<TData, TValue>) {
  const options = {
    defaultPageSize: 10,
    showRowsText: true,
    showPagination: true,
    ...userOptions,
  };

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageSize: options.defaultPageSize,
      },
    },
    state: {
      sorting,
      columnFilters,
    },
    meta: {
      isLoading: isPending,
    },
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-4">
      {!!topContent && (
        <div className="flex items-center">{topContent(table)}</div>
      )}
      <Table className="border-border border-collapse border">
        <TableHeader className="bg-muted/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isPending ? (
            <LoadingTableBody columns={columns.length} />
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRowClick?.(row.original);
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Tidak ditemukan atau data tidak tersedia
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} options={options} />
    </div>
  );
}

function LoadingTableBody({ columns }: { columns: number }) {
  return (
    <>
      <TableRow>
        <TableCell colSpan={columns}>
          <div className="my-2 flex items-center justify-center gap-2">
            <Loader2Icon className="animate-spin" />
            <p>Loading...</p>
          </div>
          <Skeleton className="h-6 w-full" />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={columns}>
          <Skeleton className="h-6 w-full" />
        </TableCell>
      </TableRow>
    </>
  );
}
