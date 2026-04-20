'use client';
import { useQuery } from '@tanstack/react-query';
import { type ChangeEvent, useState } from 'react';
import DataTable from '@/components/ui/custom/data-table';
import { Input } from '@/components/ui/input';
import { PAGINATION } from '@/constants';
import type { User } from '@/generated/prisma/client';
import { fetchAllUsers } from '@/services/users.service';
import EditUserDialog from './_components/edit-user-dialog';
import { getUserColumns } from './_components/users-columns';

export default function Home() {
  const [filters, setFilters] = useState({
    page: PAGINATION.DEFAULT_PAGE_NUMBER,
    limit: PAGINATION.DEFAULT_PAGE_SIZE,
    search: '',
    showAll: false,
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['users', filters.page, filters.limit, filters.search],
    queryFn: () => fetchAllUsers(filters),
  });

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

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

  const userColumns = getUserColumns(handleEditUser);

  return (
    <div className="flex flex-col gap-4">
      <Input
        maxLength={50}
        placeholder="Search by username..."
        value={filters.search}
        onChange={handleSearchChange}
        className="max-w-sm"
      />
      <DataTable<User>
        data={data}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        emptyMessage="Not found users."
        columns={userColumns}
      />
      {selectedUser && (
        <EditUserDialog
          user={selectedUser}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />
      )}
    </div>
  );
}
