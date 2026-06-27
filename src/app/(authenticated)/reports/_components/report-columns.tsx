'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Eye, GitMerge, GitPullRequest } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { DailyReportWithDetails } from '@/contracts/types/report.type';

export const reportColumns: ColumnDef<DailyReportWithDetails>[] = [
  {
    accessorKey: 'date',
    header: 'Fecha',
    cell: ({ row }) => (
      <span className="font-medium">
        {format(new Date(row.original.date), 'dd/MM/yyyy')}
      </span>
    ),
  },
  {
    accessorKey: 'user',
    header: 'Usuario',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarImage src={row.original.user.avatar_url ?? undefined} />
          <AvatarFallback>
            {row.original.user.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span>{row.original.user.username}</span>
      </div>
    ),
  },
  {
    accessorKey: 'summary.createdPrs',
    header: () => (
      <div className="flex items-center gap-1">
        <GitPullRequest className="h-4 w-4" />
        <span>PRs</span>
      </div>
    ),
    cell: ({ row }) => (
      <span className="text-center">
        {row.original.summary.createdPrs.length}
      </span>
    ),
  },
  {
    accessorKey: 'summary.reviews',
    header: () => (
      <div className="flex items-center gap-1">
        <Eye className="h-4 w-4" />
        <span>Reviews</span>
      </div>
    ),
    cell: ({ row }) => (
      <span className="text-center">{row.original.summary.reviews.length}</span>
    ),
  },
  {
    accessorKey: 'summary.mergedPrs',
    header: () => (
      <div className="flex items-center gap-1">
        <GitMerge className="h-4 w-4" />
        <span>Merged</span>
      </div>
    ),
    cell: ({ row }) => (
      <span className="text-center">
        {row.original.summary.mergedPrs.length}
      </span>
    ),
  },
];

export const myReportColumns: ColumnDef<DailyReportWithDetails>[] = [
  {
    accessorKey: 'date',
    header: 'Fecha',
    cell: ({ row }) => (
      <span className="font-medium">
        {format(new Date(row.original.date), 'dd/MM/yyyy')}
      </span>
    ),
  },
  {
    accessorKey: 'summary.createdPrs',
    header: () => (
      <div className="flex items-center gap-1">
        <GitPullRequest className="h-4 w-4" />
        <span>PRs Creados</span>
      </div>
    ),
    cell: ({ row }) => (
      <span className="text-center">
        {row.original.summary.createdPrs.length}
      </span>
    ),
  },
  {
    accessorKey: 'summary.reviews',
    header: () => (
      <div className="flex items-center gap-1">
        <Eye className="h-4 w-4" />
        <span>Reviews</span>
      </div>
    ),
    cell: ({ row }) => (
      <span className="text-center">{row.original.summary.reviews.length}</span>
    ),
  },
  {
    accessorKey: 'summary.mergedPrs',
    header: () => (
      <div className="flex items-center gap-1">
        <GitMerge className="h-4 w-4" />
        <span>Merged</span>
      </div>
    ),
    cell: ({ row }) => (
      <span className="text-center">
        {row.original.summary.mergedPrs.length}
      </span>
    ),
  },
];
