'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { PAGINATION } from '@/constants';
import { stringToColor } from '@/utils/stringToColor.util';
import { formatDate } from '@/utils/formatters/time.formatter';
import { PullRequestSchema } from '@/contracts/types/schema.type';
import { fetchAllPullRequests } from '@/services/pullRequests.service';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import DataTableCs from '@/components/ui/custom/DataTableCs';
import ExpandedPrRowContent from './_components/ExpandedPrRowContent';
import PullRequestTypeBadge from './_components/PullRequestTypeBadge';
import ExternalLink from '@/components/ui/custom/linksCs/ExternalLink';

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

        return <ExternalLink href={url}>#{prNumber}</ExternalLink>;
      },
    },
    {
      accessorKey: 'repository.name',
      header: 'Repository name',
      cell: (info) => {
        const repo = info.getValue() as string;
        const color = stringToColor(repo);

        return (
          <Badge
            className="border-transparent text-[var(--color)] bg-[var(--color)]/10"
            style={{ '--color': color } as React.CSSProperties}
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
        return <Badge>{branch}</Badge>;
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
        const state = info.getValue() as PullRequestSchema['state'];
        return state;
      },
    },
    {
      accessorKey: 'creator.username',
      header: 'Creator',
      cell: (info) => {
        const username = info.getValue() as string;
        const url = info.row.original.url as string | null;

        return <ExternalLink href={url}>{username}</ExternalLink>;
      },
    },
    {
      accessorKey: '_count.reviews',
      header: 'Reviews',
    },
    {
      accessorKey: 'created_at',
      header: 'Creation Date',
      cell: (info) => formatDate(info.getValue() as string),
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
