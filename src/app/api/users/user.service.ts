import prismaClient from '@/lib/prismaClient';
import type { PaginationFilters } from '@/contracts/types';
import { Prisma } from '@/generated/prisma/client';
import { paginationFormatter } from '@/utils/formatters/pagination.formatter';

export async function getAllUsers(filters: PaginationFilters) {
  const { page, limit, search: contains, showAll } = filters;

  const queryMode = { contains, mode: Prisma.QueryMode.insensitive };
  const where: Prisma.UserWhereInput = {
    OR: [{ username: queryMode }],
    disabled: false,
  };

  const query: Prisma.UserFindManyArgs = {
    where,
    orderBy: { created_at: Prisma.SortOrder.desc },
  };

  if (!showAll) {
    query.skip = (page - 1) * limit;
    query.take = limit;
  }

  const data = await prismaClient.user.findMany(query);
  const totalRecords = await prismaClient.user.count({ where });

  return paginationFormatter({ data, page, limit, totalRecords, showAll });
}

export async function getUserById(id: number) {
  const user = await prismaClient.user.findUnique({
    where: { id },
  });
  return user;
}
