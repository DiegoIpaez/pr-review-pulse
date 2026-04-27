'use client';
import { DropdownMenuArrow } from '@radix-ui/react-dropdown-menu';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye, GitPullRequest, MoreHorizontal, Pencil } from 'lucide-react';
import UserColumn from '@/components/common/columns/user-column';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { User } from '@/generated/prisma/client';
import { formatDate } from '@/utils/formatters/time.formatter';

export const getUserColumns = (
  onEdit: (user: User) => void
): ColumnDef<User>[] => [
  {
    accessorKey: 'username',
    header: 'User',
    cell: (info) => {
      const username = info.getValue() as string;
      const url = info?.row?.original?.url as string;
      const avatarUrl = info?.row?.original?.avatar_url as string;
      return <UserColumn username={username} url={url} avatarUrl={avatarUrl} />;
    },
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: (info) => {
      const role = info.getValue() as string;

      const roleConfig = {
        admin: {
          label: 'Admin',
          className:
            ' bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400',
        },
        user: {
          label: 'User',
          className:
            ' bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-400',
        },
      };

      const config = roleConfig[role as keyof typeof roleConfig] || {
        label: role,
        className: ' text-gray-700',
      };

      return (
        <Badge variant="outline" className={config.className}>
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'access_status',
    header: 'Access Status',
    cell: (info) => {
      const status = info.getValue() as string;

      const statusConfig = {
        active: {
          label: 'Active',
          className: 'bg-green-600 hover:bg-green-700 text-green-100',
        },
        pending: {
          label: 'Pending',
          className: 'bg-yellow-600 hover:bg-yellow-700 text-yellow-100',
        },
        blocked: {
          label: 'Blocked',
          className: 'bg-red-600 hover:bg-red-700 text-red-100',
        },
      };

      const config = statusConfig[status as keyof typeof statusConfig] || {
        label: status,
        className: 'bg-gray-600 text-gray-100',
      };

      return (
        <Badge variant="outline" className={config.className}>
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: '_count.pull_requests',
    header: 'PRs',
    cell: (info) => {
      const count = info.getValue() as number;
      return (
        <span className="count-column">
          <GitPullRequest className="w-3.5 h-3.5" />
          <span>{count}</span>
        </span>
      );
    },
  },
  {
    accessorKey: '_count.reviews',
    header: 'Reviews',
    cell: (info) => {
      const count = info.getValue() as number;
      return (
        <span className="count-column">
          <Eye className="w-3.5 h-3.5" />
          <span>{count}</span>
        </span>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: (info) => (
      <span className="date-column">
        {formatDate(info.getValue() as string)}
      </span>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="right">
            <DropdownMenuArrow />
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => onEdit(user)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
