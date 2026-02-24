'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { PAGINATION } from '@/constants';
import type { User } from '@/generated/prisma/client';
import { formatDate } from '@/utils/formatters/time.formatter';
import DataTableCs from '@/components/ui/custom/DataTableCs';
import { fetchAllPullRequests } from '@/services/pullRequests.service';

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

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'number',
      header: '#',
    },
    {
      accessorKey: 'repository.name',
      header: 'Repositorio',
    },
    {
      accessorKey: 'branch',
      header: 'Rama',
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
    <DataTableCs
      data={data}
      isLoading={isLoading}
      onPageChange={handlePageChange}
      emptyMessage="Not found any pull requests."
      columns={columns}
    />
  );
}
