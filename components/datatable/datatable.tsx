import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import { ReactNode } from "react";

export type Column<T> =
  | {
      header: string;
      accessorKey: keyof T;
      cell?: (row: T) => ReactNode;
    }
  | {
      header: string;
      accessorKey?: never;
      cell: (row: T) => ReactNode;
    };

type DatatableProps<T> = {
  columns: Column<T>[];
  data: T[];
};

export default function Datatable<T>({ columns, data }: DatatableProps<T>) {
  return (
    <Table className="border-collapse border border-border">
      <TableHeader className="bg-muted/50">
        <TableRow>
          {columns.map((column, index) => (
            <TableHead
              key={index}
              className="h-10 border-b border-border text-xs font-bold uppercase tracking-wider text-muted-foreground"
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length > 0 ? (
          data.map((row, rowIndex) => (
            <TableRow key={rowIndex} className="hover:bg-muted/30">
              {columns.map((column, colIndex) => (
                <TableCell
                  key={colIndex}
                  className="border-b border-border py-4"
                >
                  {column.cell
                    ? column.cell(row)
                    : column.accessorKey !== undefined
                      ? String(row[column.accessorKey] ?? "-")
                      : "-"}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="h-24 text-center text-muted-foreground"
            >
              Tidak ada data.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
