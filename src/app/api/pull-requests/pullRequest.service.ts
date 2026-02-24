import prismaClient from '@/lib/prismaClient';
import type { PaginationFilters } from '@/contracts/types';
import { Prisma } from '@/generated/prisma/client';
import { paginationFormatter } from '@/utils/formatters/pagination.formatter';

export async function getPullRequest(filters: PaginationFilters) {
  const { page, limit, search: contains, showAll } = filters;

  const queryMode = { contains, mode: Prisma.QueryMode.insensitive };
  const where: Prisma.PullRequestWhereInput = {
    OR: [
      {
        repository: {
          name: queryMode,
        },
      },
      {
        creator: {
          username: queryMode,
        },
      },
      {
        branch: queryMode,
      },
      {
        number:
          typeof contains === 'string' && !isNaN(Number(contains))
            ? Number(contains)
            : undefined,
      },
    ],
  };

  const query: Prisma.PullRequestFindManyArgs = {
    where,
    include: {
      _count: { select: { reviews: true } },
      repository: {
        select: { id: true, name: true },
      },
      creator: {
        select: { id: true, username: true },
      },
      reviews: {
        select: {
          id: true,
          note: true,
          reviewer: { select: { id: true, username: true } },
        },
      },
    },
    orderBy: { created_at: Prisma.SortOrder.desc },
  };

  if (!showAll) {
    query.skip = (page - 1) * limit;
    query.take = limit;
  }

  const data = await prismaClient.pullRequest.findMany(query);
  const totalRecords = await prismaClient.pullRequest.count({ where });

  return paginationFormatter({ data, page, limit, totalRecords, showAll });
}
