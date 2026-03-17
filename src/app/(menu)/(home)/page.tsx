'use client';
import { useState, type ChangeEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PAGINATION } from '@/constants';
import { PullRequestSchema } from '@/contracts/types/schema.type';
import { fetchAllPullRequests } from '@/services/pull-requests.service';
import { Input } from '@/components/ui/input';
import DataTable from '@/components/ui/custom/data-table';
import { prColumns } from './_components/pr-columns';
import ExpandedPrRowContent from './_components/expanded-pr-row-content';

export default function Home() {
  const [filters, setFilters] = useState({
    page: PAGINATION.DEFAULT_PAGE_NUMBER,
    limit: PAGINATION.DEFAULT_PAGE_SIZE,
    search: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['pullRequests', filters.page, filters.limit, filters.search],
    queryFn: () => fetchAllPullRequests(filters),
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

  return (
    <div className="flex flex-col gap-4">
      <Input
        maxLength={50}
        placeholder="Search by repository name, branch or creator..."
        value={filters.search}
        onChange={handleSearchChange}
        className="max-w-sm"
      />
      <DataTable<PullRequestSchema>
        data={data}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        emptyMessage="Not found any pull requests."
        columns={prColumns}
        isRowExpandable={(pr) => pr?.reviews?.length > 0}
        renderExpandedRow={(pr) => (
          <ExpandedPrRowContent reviews={pr?.reviews || []} />
        )}
      />
    </div>
  );
}
