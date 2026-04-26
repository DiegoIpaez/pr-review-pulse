'use client';
import { useQuery } from '@tanstack/react-query';
import { type ChangeEvent, useState } from 'react';
import PrDetailDrawer from '@/components/common/pr-detail-drawer/pr-detail-drawer';
import DataTable from '@/components/ui/custom/data-table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PAGINATION } from '@/constants';
import type { PullRequestQueryParams } from '@/contracts/schemas/pull-request.schema';
import type { PullRequestSchema } from '@/contracts/types/schema.type';
import { PullRequestState, PullRequestType } from '@/generated/prisma/enums';
import { fetchAllPullRequests } from '@/services/pull-requests.service';
import { prColumns } from './_components/pr-columns';

export default function Home() {
  const [filters, setFilters] = useState<PullRequestQueryParams>({
    page: PAGINATION.DEFAULT_PAGE_NUMBER,
    limit: PAGINATION.DEFAULT_PAGE_SIZE,
    search: '',
    showAll: false,
  });

  const [selectedPr, setSelectedPr] = useState<PullRequestSchema | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: [
      'pullRequests',
      filters.page,
      filters.limit,
      filters.search,
      filters.type,
      filters.state,
    ],
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

  const handleTypeChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      type: value === 'all' ? undefined : (value as PullRequestType),
      page: PAGINATION.DEFAULT_PAGE_NUMBER,
    }));
  };

  const handleStateChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      state: value === 'all' ? undefined : (value as PullRequestState),
      page: PAGINATION.DEFAULT_PAGE_NUMBER,
    }));
  };

  const typeOptions = Object.values(PullRequestType);
  const stateOptions = Object.values(PullRequestState);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <Input
          maxLength={50}
          placeholder="Search by repository name, branch or creator..."
          value={filters.search}
          onChange={handleSearchChange}
          className="max-w-sm"
        />
        <Select value={filters.type ?? 'all'} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {typeOptions.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.state ?? 'all'}
          onValueChange={handleStateChange}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All states" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All states</SelectItem>
            {stateOptions.map((state) => (
              <SelectItem key={state} value={state}>
                {state.charAt(0).toUpperCase() + state.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DataTable<PullRequestSchema>
        data={data}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        emptyMessage="Not found any pull requests."
        columns={prColumns}
        isRowExpandable={(pr) => pr?.reviews?.length > 0}
        onRowClick={setSelectedPr}
      />
      <PrDetailDrawer pr={selectedPr} onClose={() => setSelectedPr(null)} />
    </div>
  );
}
