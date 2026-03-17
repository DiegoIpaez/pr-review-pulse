'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { User } from '@/generated/prisma/client';
import { PAGINATION } from '@/constants';
import { fetchAllUsers } from '@/services/users.service';
import DataTable from '@/components/ui/custom/data-table';
import { userColumns } from './_components/users-columns';

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

  return (
    <DataTable<User>
      data={data}
      isLoading={isLoading}
      onPageChange={handlePageChange}
      emptyMessage="Not found users."
      columns={userColumns}
    />
  );
}
