"use client";

import { useState } from "react";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { Badge } from "@civalgo/ui/badge";
import { Button } from "@civalgo/ui/button";
import { Clock, MapPin, User, ChevronLeft, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { AsyncErrorBoundary } from "@/components/common/error-boundary";
import { TableSkeleton } from "@/components/common/loading-states";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@civalgo/ui/table";
import { formatDistanceToNow } from "date-fns";
import PaginationControls from "./workers-list-pagination-controls";

type ActiveWorker = {
  id: string;
  workerId: string;
  workerName: string | null;
  siteId: string;
  siteName: string | null;
  checkInTime: Date;
  notes: string | null;
};

type PaginatedResponse = {
  data: ActiveWorker[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const ActiveWorkersColumns: ColumnDef<ActiveWorker>[] = [
  {
    header: "Worker",
    accessorKey: "workerName",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">
          {row.getValue("workerName") || "Unknown"}
        </span>
      </div>
    ),
  },
  {
    header: "Site",
    accessorKey: "siteName",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span>{row.getValue("siteName") || "Unknown Site"}</span>
      </div>
    ),
  },
  {
    header: "Check-in Time",
    accessorKey: "checkInTime",
    cell: ({ row }) => {
      const checkInTime = row.getValue("checkInTime") as Date;
      return (
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="text-sm">
              {checkInTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(checkInTime, { addSuffix: true })}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    header: "Status",
    cell: () => (
      <Badge
        variant="default"
        className="bg-green-100 text-green-800 border-green-200"
      >
        On Site
      </Badge>
    ),
  },
  {
    header: "Notes",
    accessorKey: "notes",
    cell: ({ row }) => {
      const notes = row.getValue("notes") as string;
      return notes ? (
        <span className="text-sm text-muted-foreground">{notes}</span>
      ) : (
        <span className="text-sm text-muted-foreground italic">No notes</span>
      );
    },
  },
];

function ActiveWorkersTable() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data: response,
    isLoading,
    error,
  } = trpc.worker.getActiveCheckIns.useQuery({ page, limit } as any, {
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });

  const activeWorkers = (response as PaginatedResponse)?.data || [];
  const pagination = (response as PaginatedResponse)?.pagination;

  const table = useReactTable({
    data: activeWorkers,
    columns: ActiveWorkersColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading && !response) return <TableSkeleton rows={3} columns={5} />;

  if (error) throw error;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"></div>

      {activeWorkers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-md font-medium text-muted-foreground mb-1">
            No workers currently on site
          </h3>
          <p className="text-sm text-muted-foreground">
            Workers will appear here when they check in
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={ActiveWorkersColumns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <PaginationControls
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
              isLoading={isLoading}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default function WorkersList() {
  return (
    <AsyncErrorBoundary>
      <ActiveWorkersTable />
    </AsyncErrorBoundary>
  );
}
