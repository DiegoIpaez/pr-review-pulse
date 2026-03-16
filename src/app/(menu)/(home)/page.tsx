'use client';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import {
  GitBranch,
  GitMerge,
  GitPullRequest,
  XCircle,
  Eye,
} from 'lucide-react';
import { PAGINATION } from '@/constants';
import { stringToColor } from '@/utils/stringToColor.util';
import { formatDate } from '@/utils/formatters/time.formatter';
import { PullRequestSchema } from '@/contracts/types/schema.type';
import { fetchAllPullRequests } from '@/services/pullRequests.service';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import DataTableCs from '@/components/ui/custom/DataTableCs';
import ExternalLink from '@/components/ui/custom/linksCs/ExternalLink';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ExpandedPrRowContent from './_components/ExpandedPrRowContent';
import PullRequestTypeBadge from './_components/PullRequestTypeBadge';

const STATE_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; className: string }
> = {
  open: {
    label: 'Open',
    icon: GitPullRequest,
    className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  },
  closed: {
    label: 'Closed',
    icon: XCircle,
    className: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  },
  merged: {
    label: 'Merged',
    icon: GitMerge,
    className: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
  },
};

export default function Home() {
  const [filters, setFilters] = useState({
    page: PAGINATION.DEFAULT_PAGE_NUMBER,
    limit: PAGINATION.DEFAULT_PAGE_SIZE,
    search: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['pullRequests', filters],
    queryFn: () => fetchAllPullRequests(filters),
  });

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleSearchChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      search: target?.value,
      page: PAGINATION.DEFAULT_PAGE_NUMBER,
    }));
  };

  const columns: ColumnDef<PullRequestSchema>[] = [
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
        const color = stringToColor(repo);

        return (
          <Badge
            className="border font-medium text-xs text-[var(--color)] bg-[var(--color)]/10"
            style={
              {
                '--color': color,
                borderColor: `${color}33`,
                color: color,
                backgroundColor: `${color}12`,
              } as React.CSSProperties
            }
          >
            {repo}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'branch',
      header: 'Branch',
      cell: (info) => {
        const branch = info.getValue() as string;
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground border border-border/60 max-w-[180px]">
            <GitBranch className="w-3 h-3 shrink-0 text-muted-foreground/70" />
            <span className="truncate">{branch}</span>
          </span>
        );
      },
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: (info) => {
        const type = info.getValue() as PullRequestSchema['type'];
        return <PullRequestTypeBadge type={type} />;
      },
    },
    {
      accessorKey: 'state',
      header: 'State',
      cell: (info) => {
        const state = info.getValue() as string;
        const config = STATE_CONFIG[state] ?? {
          label: state,
          icon: GitPullRequest,
          className: 'bg-muted text-muted-foreground border-border',
        };
        const Icon = config.icon;

        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.className}`}
          >
            <Icon className="w-3 h-3" />
            {config.label}
          </span>
        );
      },
    },
    {
      accessorKey: 'creator.username',
      header: 'Creator',
      cell: (info) => {
        const username = info.getValue() as string;
        const url = info.row.original.url as string | null;
        const avatarUrl = info.row.original.creator?.avatar_url as
          | string
          | null;
        const initials = username?.slice(0, 2).toUpperCase() ?? '??';

        return (
          <span className="inline-flex items-center gap-2">
            <Avatar className="w-5 h-5">
              <AvatarImage src={avatarUrl ?? ''} alt="Avatar" />
              <AvatarFallback className="text-[9px]">{initials}</AvatarFallback>
            </Avatar>
            <ExternalLink href={url}>
              <span className="text-sm">{username}</span>
            </ExternalLink>
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
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Eye className="w-3.5 h-3.5" />
            <span className="tabular-nums font-medium">{count}</span>
          </span>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: (info) => (
        <span className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
          {formatDate(info.getValue() as string)}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Input
        maxLength={50}
        placeholder="Search by repository name, branch or creator..."
        value={filters.search}
        onChange={handleSearchChange}
        className="max-w-sm"
      />
      <DataTableCs<PullRequestSchema>
        data={data}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        emptyMessage="Not found any pull requests."
        columns={columns}
        isRowExpandable={(pr) => pr?.reviews?.length > 0}
        renderExpandedRow={(pr) => (
          <ExpandedPrRowContent reviews={pr?.reviews || []} />
        )}
      />
    </div>
  );
}
