'use client';
import { ColumnDef } from '@tanstack/react-table';
import { ExternalLink, GitPullRequest } from 'lucide-react';
import type { Repository } from '@/generated/prisma/client';
import { formatDate } from '@/utils/formatters/time.formatter';
import UserColumn from '@/components/common/columns/user-column';

type RepositoryWithCount = Repository & {
  _count: {
    pull_requests: number;
  };
  owner: {
    id: number;
    username: string;
    url: string | null;
    avatar_url: string | null;
  } | null;
};

export const getRepositoryColumns = (): ColumnDef<RepositoryWithCount>[] => [
  {
    accessorKey: 'name',
    header: 'Repository',
    cell: (info) => {
      const name = info.getValue() as string;
      const url = info?.row?.original?.url as string | null;

      if (url) {
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <span className="font-medium">{name}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        );
      }

      return <span className="font-medium">{name}</span>;
    },
  },
  {
    accessorKey: 'owner.username',
    header: 'Owner',
    cell: (info) => {
      const owner = info.row.original.owner;

      if (!owner?.url) {
        return <span className="text-muted-foreground">—</span>;
      }

      return (
        <UserColumn
          username={owner.username}
          url={owner.url}
          avatarUrl={owner.avatar_url ?? undefined}
        />
      );
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
    accessorKey: 'pushed_at',
    header: 'Last Push',
    cell: (info) => (
      <span className="date-column">
        {formatDate(info.getValue() as string)}
      </span>
    ),
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
