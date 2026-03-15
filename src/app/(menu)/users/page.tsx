'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import type { User } from '@/generated/prisma/client';
import { cn } from '@/lib/cn';
import { PAGINATION } from '@/constants';
import { formatDate } from '@/utils/formatters/time.formatter';
import { fetchAllUsers } from '@/services/users.service';
import { Badge } from '@/components/ui/badge';
import DataTableCs from '@/components/ui/custom/DataTableCs';
import ExternalLink from '@/components/ui/custom/linksCs/ExternalLink';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
      accessorKey: 'avatar_url',
      header: '',
      cell: (info) => {
        const avatarUrl = info.getValue() as string;
        return (
          <Avatar className="w-7 h-7">
            <AvatarImage src={avatarUrl} alt="Avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      accessorKey: 'username',
      header: 'User',
      cell: (info) => {
        const username = info.getValue() as string;
        const url = info.row.original.url as string | null;
        return <ExternalLink href={url}>{username}</ExternalLink>;
      },
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
      header: 'Status',
      cell: (info) => {
        const disabled = info.getValue() as boolean;
        return (
          <Badge
            className={cn(
              'text-white',
              disabled ? 'bg-red-700' : 'bg-green-700'
            )}
          >
            {disabled ? 'Inactive' : 'Active'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Creation Date',
      cell: (info) => formatDate(info.getValue() as string),
    },
  ];

  return (
    <DataTableCs<User>
      data={data}
      isLoading={isLoading}
      onPageChange={handlePageChange}
      emptyMessage="Not found users."
      columns={columns}
    />
  );
}
