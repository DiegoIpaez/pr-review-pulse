'use client';

import { Inbox, Minus, Plus } from 'lucide-react';
import { useState, Fragment, type ReactNode } from 'react';
import {
  type ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { PAGINATION } from '@/constants';
import { type PaginatedResponse } from '@/contracts/types';
import PaginationCs from '@/components/ui/custom/PaginationCs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type TableCsProps<T> = {
  isLoading: boolean;
  columns: ColumnDef<T>[];
  data: PaginatedResponse<T>;
  onPageChange: (page: number) => void;
  emptyMessage?: string;
  renderExpandedRow?: (record: T) => ReactNode;
  isRowExpandable?: (record: T) => boolean;
};

const SkeletonRow = ({ columnsCount }: { columnsCount: number }) => {
  const widths = ['w-[20%]', 'w-[40%]', 'w-[60%]', 'w-[80%]'];

  return (
    <TableRow>
      {Array.from({ length: columnsCount }).map((_, index) => (
        <TableCell key={index}>
          <div
            className={`h-4 bg-muted rounded animate-pulse ${
              widths[index % widths.length]
            }`}
          />
        </TableCell>
      ))}
    </TableRow>
  );
};

export default function DataTableCs<T>({
  isLoading,
  data,
  columns,
  onPageChange,
  emptyMessage = 'No hay datos disponibles',
  renderExpandedRow,
  isRowExpandable,
}: TableCsProps<T>) {
  const [expandedRowIds, setExpandedRowIds] = useState<Set<string>>(
    () => new Set()
  );

  const hasExpandable = Boolean(renderExpandedRow);

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleToggleRow = (rowId: string) => {
    setExpandedRowIds((prevExpanded) => {
      const nextExpanded = new Set(prevExpanded);
      if (nextExpanded.has(rowId)) nextExpanded.delete(rowId);
      else nextExpanded.add(rowId);
      return nextExpanded;
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-x-auto">
        <Table className="bg-primary/20">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {hasExpandable && <TableHead className="w-10" />}
                {headerGroup.headers.map((header) => (
                  <TableHead className='font-bold text-sm' key={header.id}>
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
            {isLoading ? (
              Array.from({ length: PAGINATION.DEFAULT_PAGE_SIZE }).map(
                (_, index) => (
                  <SkeletonRow
                    key={`skeleton-row-${index}`}
                    columnsCount={columns.length + (hasExpandable ? 1 : 0)}
                  />
                )
              )
            ) : table?.getRowModel()?.rows?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (hasExpandable ? 1 : 0)}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Inbox className="h-10 w-10" />
                    <p>{emptyMessage}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              table?.getRowModel()?.rows?.map((row) => {
                const canExpandRow =
                  !isRowExpandable || isRowExpandable(row.original);
                const isExpanded =
                  hasExpandable && canExpandRow && expandedRowIds.has(row.id);

                return (
                  <Fragment key={row.id}>
                    <TableRow>
                      {hasExpandable && (
                        <TableCell className="w-10">
                          {canExpandRow && (
                            <button
                              type="button"
                              className="flex h-8 w-8 items-center justify-center rounded border bg-background"
                              onClick={() => handleToggleRow(row.id)}
                            >
                              {isExpanded ? (
                                <Minus className="h-4 w-4" />
                              ) : (
                                <Plus className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </TableCell>
                      )}
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    {hasExpandable && isExpanded && renderExpandedRow && (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length + 1}
                          className="bg-muted/40"
                        >
                          {renderExpandedRow(row.original)}
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      <PaginationCs data={data} onPageChange={onPageChange} />
    </div>
  );
}
