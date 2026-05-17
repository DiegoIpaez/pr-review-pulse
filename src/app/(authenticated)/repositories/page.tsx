'use client';
import { useQuery } from '@tanstack/react-query';
import { type ChangeEvent, useState } from 'react';
import DataTable from '@/components/ui/custom/data-table';
import { Input } from '@/components/ui/input';
import { PAGINATION } from '@/constants';
import type { Repository } from '@/generated/prisma/client';
import { fetchAllRepositories } from '@/services/repositories.service';
import { getRepositoryColumns } from './_components/repositories-columns';

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

export default function RepositoriesPage() {
  const [filters, setFilters] = useState({
    page: PAGINATION.DEFAULT_PAGE_NUMBER,
    limit: PAGINATION.DEFAULT_PAGE_SIZE,
    search: '',
    showAll: false,
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
