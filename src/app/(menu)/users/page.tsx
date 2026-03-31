'use client';
import { useState, type ChangeEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { User } from '@/generated/prisma/client';
import { PAGINATION } from '@/constants';
import { fetchAllUsers } from '@/services/users.service';
import { Input } from '@/components/ui/input';
import DataTable from '@/components/ui/custom/data-table';
import { getUserColumns } from './_components/users-columns';
import EditUserDialog from './_components/edit-user-dialog';

export default function Home() {
  const [filters, setFilters] = useState({
    page: PAGINATION.DEFAULT_PAGE_NUMBER,
    limit: PAGINATION.DEFAULT_PAGE_SIZE,
    search: '',
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
