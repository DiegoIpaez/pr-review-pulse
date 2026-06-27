'use client';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarIcon, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import DataTable from '@/components/ui/custom/data-table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PAGINATION } from '@/constants';
import type { DailyReportWithDetails } from '@/contracts/types/report.type';
import type { User } from '@/generated/prisma/client';
import { cn } from '@/lib/cn';
import { fetchAllDailyReports } from '@/services/daily-reports.service';
import { fetchAllUsers } from '@/services/users.service';
import { reportColumns } from './_components/report-columns';
import { ReportDetailDrawer } from './_components/report-detail-drawer';

export default function AllReportsPage() {
  const [filters, setFilters] = useState<{
    page: number;
    limit: number;
    date?: string;
    userId?: number;
  }>({
    page: PAGINATION.DEFAULT_PAGE_NUMBER,
    limit: PAGINATION.DEFAULT_PAGE_SIZE,
  });

  const [selectedReport, setSelectedReport] =
    useState<DailyReportWithDetails | null>(null);

  const { data: users } = useQuery({
    queryKey: ['users-list'],
    queryFn: () =>
      fetchAllUsers({ showAll: true, page: 1, limit: 100, search: '' }),
  });

  const { data, isLoading } = useQuery({
    queryKey: [
      'all-daily-reports',
      filters.page,
      filters.limit,
      filters.date,
      filters.userId,
    ],
    queryFn: () => fetchAllDailyReports(filters),
  });

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleDateSelect = (date?: Date) => {
    setFilters((prev) => ({
      ...prev,
      date: date ? format(date, 'yyyy-MM-dd') : undefined,
      page: PAGINATION.DEFAULT_PAGE_NUMBER,
    }));
  };

  const handleUserChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      userId: value === 'all' ? undefined : Number(value),
      page: PAGINATION.DEFAULT_PAGE_NUMBER,
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Filtrar por fecha</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-[200px] justify-start text-left font-normal',
                  !filters.date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.date ? (
                  format(new Date(filters.date), 'PPP')
                ) : (
                  <span>Todas las fechas</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.date ? new Date(filters.date) : undefined}
                onSelect={handleDateSelect}
                initialFocus
              />
              {filters.date && (
                <div className="p-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDateSelect(undefined)}
                    className="w-full"
                  >
                    Limpiar filtro
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Filtrar por usuario</span>
          <Select
            value={filters.userId?.toString() ?? 'all'}
            onValueChange={handleUserChange}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Todos los usuarios" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  <span>Todos los usuarios</span>
                </div>
              </SelectItem>
              {users?.data?.map((user: User) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable<DailyReportWithDetails>
        data={data!}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        emptyMessage="No se encontraron reportes."
        columns={reportColumns}
        onRowClick={setSelectedReport}
      />

      <ReportDetailDrawer
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </div>
  );
}
