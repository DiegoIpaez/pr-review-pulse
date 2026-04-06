import prismaClient from '@/lib/clients/prisma-client';
import { Prisma } from '@/generated/prisma/client';
import { paginationFormatter } from '@/utils/formatters/pagination.formatter';
import { PaginationFilters } from '@/contracts/types';

export async function getRepositories(filters: PaginationFilters) {
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
    },
    orderBy: { created_at: Prisma.SortOrder.desc },
  };

  if (!showAll) {
    query.skip = (page - 1) * limit;
    query.take = limit;
  }

  const data = await prismaClient.repository.findMany(query);
  const totalRecords = await prismaClient.repository.count({ where });

  return paginationFormatter({ data, page, limit, totalRecords, showAll });
}
