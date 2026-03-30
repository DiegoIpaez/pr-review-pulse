'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, GitPullRequest } from 'lucide-react';
import type { User } from '@/generated/prisma/client';
import { cn } from '@/lib/cn';
import { formatDate } from '@/utils/formatters/time.formatter';
import { Badge } from '@/components/ui/badge';
import UserColumn from '@/components/common/columns/user-column';

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'username',
    header: 'User',
    cell: (info) => {
      const username = info.getValue() as string;
      const url = info?.row?.original?.url as string;
      const avatarUrl = info?.row?.original?.avatar_url as string;
      return <UserColumn username={username} url={url} avatarUrl={avatarUrl} />;
    },
  },
  {
    accessorKey: '_count.pull_requests',
    header: 'PRs',
    cell: (info) => {
      const count = info.getValue() as number;
      return (
        <span className="count-column">
          <GitPullRequest className="w-3.5 h-3.5" />
          <span>{count}</span>
        </span>
      );
    },
  },
  {
    accessorKey: '_count.reviews',
    header: 'Reviews',
    cell: (info) => {
      const count = info.getValue() as number;
      return (
        <span className="count-column">
          <Eye className="w-3.5 h-3.5" />
          <span>{count}</span>
        </span>
      );
    },
  },
  {
    accessorKey: 'disabled',
    header: 'Status',
    cell: (info) => {
      const disabled = info.getValue() as boolean;
      return (
        <Badge
          className={cn('text-white', disabled ? 'bg-red-700' : 'bg-green-700')}
        >
          {disabled ? 'Inactive' : 'Active'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: (info) => (
      <span className="date-column">
        {formatDate(info.getValue() as string)}
      </span>
    ),
  },
];
