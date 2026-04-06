'use client';
import { Eye } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { formatDate } from '@/utils/formatters/time.formatter';
import { PullRequestSchema } from '@/contracts/types/schema.type';
import ExternalLink from '@/components/common/links/external-link';
import {
  BranchColumn,
  PrStateColumn,
  PullRequestTypeColumn,
  RepositoryColumn,
} from '@/app/(authenticated)/admin/(prs)/_components/columns';

export const prColumns: ColumnDef<PullRequestSchema>[] = [
  {
    accessorKey: 'number',
    header: 'ID',
    cell: (info) => {
      const prNumber = info.getValue() as string;
      const url = info.row.original.url as string | null;

      return (
        <span className="font-mono text-xs font-semibold text-muted-foreground">
          <ExternalLink href={url}>#{prNumber}</ExternalLink>
        </span>
      );
    },
  },
  {
    accessorKey: 'repository.name',
    header: 'Repository',
    cell: (info) => {
      const repo = info.getValue() as string;
      return <RepositoryColumn repository={repo} />;
    },
  },
  {
    accessorKey: 'branch',
    header: 'Branch',
    cell: (info) => {
      const branch = info.getValue() as string;
      return <BranchColumn branch={branch} />;
    },
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: (info) => {
      const type = info.getValue() as PullRequestSchema['type'];
      return <PullRequestTypeColumn type={type} />;
    },
  },
  {
    accessorKey: 'state',
    header: 'State',
    cell: (info) => {
      const state = info.getValue() as string;
      return <PrStateColumn state={state} />;
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
    accessorKey: 'created_at',
    header: 'Created',
    cell: (info) => (
      <span className="date-column">
        {formatDate(info.getValue() as string)}
      </span>
    ),
  },
];
