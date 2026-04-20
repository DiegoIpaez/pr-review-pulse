import type { PaginationQueryParams } from '@/contracts/schemas/pagination.schema';
import { Prisma } from '@/generated/prisma/client';
import prismaClient from '@/lib/clients/prisma-client';
import { paginationFormatter } from '@/utils/formatters/pagination.formatter';

export async function getRepositories(filters: PaginationQueryParams) {
  const { page, limit, search: contains, showAll } = filters;

  const queryMode = { contains, mode: Prisma.QueryMode.insensitive };
  const where: Prisma.RepositoryWhereInput = {
    OR: [
      {
        name: queryMode,
      },
    ],
  };

  const query: Prisma.RepositoryFindManyArgs = {
    where,
    include: {
      _count: { select: { pull_requests: true } },
      owner: {
        select: { id: true, username: true, url: true, avatar_url: true },
      },
    },
    orderBy: { created_at: Prisma.SortOrder.desc },
  };

  if (!showAll) {
    query.skip = (page - 1) * limit;
    query.take = limit;
  }

  const [data, totalRecords] = await prismaClient.$transaction([
    prismaClient.repository.findMany(query),
    prismaClient.repository.count({ where }),
  ]);

  return paginationFormatter({ data, page, limit, totalRecords, showAll });
}
