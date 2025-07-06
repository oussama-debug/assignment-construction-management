"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  emptyMessage?: string | React.ReactNode;
  onRowSelect?: (data: TData, isSelected: boolean) => void;
  selection?: RowSelectionState;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  emptyMessage,
  onRowSelect,
  selection,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    enableRowSelection: !!onRowSelect,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: (updaterOrValue) => {
      if (onRowSelect) {
        const currentSelection = selection || {};
        const newSelection =
          typeof updaterOrValue === "function"
            ? updaterOrValue(currentSelection)
            : updaterOrValue;

        const allRowIndexes = new Set([
          ...Object.keys(currentSelection),
          ...Object.keys(newSelection),
        ]);

        allRowIndexes.forEach((rowIndex) => {
          const wasSelected = currentSelection[rowIndex] || false;
          const isSelected = newSelection[rowIndex] || false;

          if (wasSelected !== isSelected) {
            const row = data[parseInt(rowIndex)];
            if (row) onRowSelect(row, isSelected);
          }
        });
      }
    },
    state: {
      rowSelection: selection || {},
    },
  });

  return (
    <div className="w-full">
      <Table>
        <TableHeader className="h-5!">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-b-slate-100! hover:bg-transparent"
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="py-1! not-first:px-0 h-3!"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => onRowSelect?.(row.original, row.getIsSelected())}
                data-state={row.getIsSelected() && "selected"}
                className="border-b-slate-100! hover:cursor-pointer hover:bg-slate-50"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="not-first:px-0">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
                {emptyMessage || "No results."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
