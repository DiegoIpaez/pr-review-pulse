'use client';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Inbox, Plus } from 'lucide-react';
import { Fragment, type ReactNode, useMemo, useState } from 'react';
import Pagination from '@/components/ui/custom/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PAGINATION } from '@/constants';
import type { PaginatedResponse } from '@/contracts/types';

type TableProps<T> = {
  isLoading: boolean;
  columns: ColumnDef<T>[];
  data: PaginatedResponse<T>;
  onPageChange: (page: number) => void;
  emptyMessage?: string;
  renderExpandedRow?: (record: T) => ReactNode;
  isRowExpandable?: (record: T) => boolean;
  onRowClick?: (record: T) => void;
};

const SkeletonRow = ({ columnsCount }: { columnsCount: number }) => {
  const widths = ['w-[20%]', 'w-[40%]', 'w-[60%]', 'w-[80%]'];

  const cellKeys = useMemo(
    () => Array.from({ length: columnsCount }, () => crypto.randomUUID()),
    [columnsCount]
  );

  return (
    <TableRow>
      {cellKeys.map((key, index) => (
        <TableCell key={key}>
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

export default function DataTable<T>({
  isLoading,
  data,
  columns,
  onPageChange,
  emptyMessage = 'No hay datos disponibles',
  renderExpandedRow,
  isRowExpandable,
  onRowClick,
}: TableProps<T>) {
  const [expandedRowIds, setExpandedRowIds] = useState<Set<string>>(
    () => new Set()
  );

  const hasExpandable = Boolean(renderExpandedRow);

  const skeletonRowKeys = useMemo(
    () =>
      Array.from({ length: PAGINATION.DEFAULT_PAGE_SIZE }, () =>
        crypto.randomUUID()
      ),
    []
  );

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
      <div className="rounded-lg bg-card  border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {hasExpandable && <TableHead className="w-10" />}
                {headerGroup.headers.map((header) => (
                  <TableHead className="font-bold text-sm" key={header.id}>
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
              skeletonRowKeys.map((key) => (
                <SkeletonRow
                  key={key}
                  columnsCount={columns.length + (hasExpandable ? 1 : 0)}
                />
              ))
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
                    <TableRow
                      className={onRowClick ? 'cursor-pointer' : ''}
                      onClick={(event) => {
                        if (
                          onRowClick &&
                          !(event.target as HTMLElement).closest('button, a')
                        ) {
                          onRowClick(row.original);
                        }
                      }}
                    >
                      {hasExpandable && (
                        <TableCell className="w-10">
                          {canExpandRow && (
                            <button
                              type="button"
                              className="flex h-8 w-8 items-center justify-center rounded-md border bg-background hover:bg-muted transition-all duration-200"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleToggleRow(row.id);
                              }}
                            >
                              <Plus
                                className={`
                                  h-4 w-4 transition-transform duration-300
                                  ${isExpanded ? 'rotate-45' : ''}
                                `}
                              />
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
      <Pagination data={data} onPageChange={onPageChange} />
    </div>
  );
}
