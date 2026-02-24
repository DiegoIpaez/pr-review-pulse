'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/cn';
import { PAGINATION } from '@/constants';
import type { User } from '@/generated/prisma/client';
import { formatDate } from '@/utils/formatters/time.formatter';
import { fetchAllUsers } from '@/services/users.service';
import { Badge } from '@/components/ui/badge';
import DataTableCs from '@/components/ui/custom/DataTableCs';

export default function Home() {
  const [filters, setFilters] = useState({
    page: PAGINATION.DEFAULT_PAGE_NUMBER,
    limit: PAGINATION.DEFAULT_PAGE_SIZE,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => fetchAllUsers(filters),
  });

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'username',
      header: 'Nombre',
    },
    {
      accessorKey: '_count.pull_requests',
      header: 'PRs',
    },
    {
      accessorKey: '_count.reviews',
      header: 'Reviews',
    },
    {
      accessorKey: 'disabled',
      header: 'Estado',
      cell: (info) => {
        const disabled = info.getValue() as boolean;
        return (
          <Badge
            className={cn(
              'text-white',
              disabled ? 'bg-red-700' : 'bg-green-700'
            )}
          >
            {disabled ? 'Inactivo' : 'Activo'}
          </Badge>
        );
      },
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
      emptyMessage="Not found users."
      columns={columns}
    />
  );
}
