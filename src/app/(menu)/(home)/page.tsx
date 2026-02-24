'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { PAGINATION } from '@/constants';
import type { User } from '@/generated/prisma/client';
import { stringToColor } from '@/utils/stringToColor.util';
import { formatDate } from '@/utils/formatters/time.formatter';
import { fetchAllPullRequests } from '@/services/pullRequests.service';
import { Badge } from '@/components/ui/badge';
import DataTableCs from '@/components/ui/custom/DataTableCs';
import ExpandedPrRowContent from './_components/ExpandedPrRowContent';
import { PullRequestSchema } from '@/contracts/types/schema.type';

export default function Home() {
  const [filters, setFilters] = useState({
    page: PAGINATION.DEFAULT_PAGE_NUMBER,
    limit: PAGINATION.DEFAULT_PAGE_SIZE,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['pullRequests', filters],
    queryFn: () => fetchAllPullRequests(filters),
  });

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const columns: ColumnDef<PullRequestSchema>[] = [
    {
      accessorKey: 'number',
      header: '#',
    },
    {
      accessorKey: 'repository.name',
      header: 'Repositorio',
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
      header: 'Rama',
      cell: (info) => {
        const branch = info.getValue() as string;
        return <Badge>{branch}</Badge>;
      },
    },
    {
      accessorKey: 'creator.username',
      header: 'Creador',
    },
    {
      accessorKey: '_count.reviews',
      header: 'Reviews',
    },
    {
      accessorKey: 'created_at',
      header: 'Fecha de creación',
      cell: (info) => formatDate(info.getValue() as string),
    },
  ];

  return (
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
  );
}
