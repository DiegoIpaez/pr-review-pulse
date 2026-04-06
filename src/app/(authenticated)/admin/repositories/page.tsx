'use client';
import { useState, type ChangeEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Repository } from '@/generated/prisma/client';
import { PAGINATION } from '@/constants';
import { fetchAllRepositories } from '@/services/repositories.service';
import { Input } from '@/components/ui/input';
import DataTable from '@/components/ui/custom/data-table';
import { getRepositoryColumns } from './_components/repositories-columns';

type RepositoryWithCount = Repository & {
  _count: {
    pull_requests: number;
  };
};

export default function RepositoriesPage() {
  const [filters, setFilters] = useState({
    page: PAGINATION.DEFAULT_PAGE_NUMBER,
    limit: PAGINATION.DEFAULT_PAGE_SIZE,
    search: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['repositories', filters.page, filters.limit, filters.search],
    queryFn: () => fetchAllRepositories(filters),
  });

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleSearchChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      search: target?.value,
      page: PAGINATION.DEFAULT_PAGE_NUMBER,
    }));
  };

  const repositoryColumns = getRepositoryColumns();

  return (
    <div className="flex flex-col gap-4">
      <Input
        maxLength={50}
        placeholder="Search by repository name..."
        value={filters.search}
        onChange={handleSearchChange}
        className="max-w-sm"
      />
      <DataTable<RepositoryWithCount>
        data={data}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        emptyMessage="No repositories found."
        columns={repositoryColumns}
      />
    </div>
  );
}
