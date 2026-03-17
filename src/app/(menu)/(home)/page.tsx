'use client';
import { Eye } from 'lucide-react';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { PAGINATION } from '@/constants';
import { formatDate } from '@/utils/formatters/time.formatter';
import { PullRequestSchema } from '@/contracts/types/schema.type';
import { fetchAllPullRequests } from '@/services/pullRequests.service';
import { Input } from '@/components/ui/input';
import DataTableCs from '@/components/ui/custom/DataTableCs';
import ExternalLink from '@/components/common/links/ExternalLink';
import UserColumn from '@/components/common/columns/UserColumn';
import BranchColumn from './_components/columns/BranchColumn';
import PrStateColumn from './_components/columns/PrStateColumn';
import RepositoryColumn from './_components/columns/RepositoryColumn';
import ExpandedPrRowContent from './_components/ExpandedPrRowContent';
import PullRequestTypeColumn from './_components/columns/PullRequestTypeColumn';

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
      accessorKey: 'creator.username',
      header: 'Creator',
      cell: (info) => {
        const username = info.getValue() as string;
        const url = info.row.original.url as string;
        const avatarUrl =
          (info.row.original.creator?.avatar_url as string | null) ?? '';

        return (
          <UserColumn username={username} url={url} avatarUrl={avatarUrl} />
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
      accessorKey: 'created_at',
      header: 'Created',
      cell: (info) => (
        <span className="date-column">
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
