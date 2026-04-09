import prismaClient from '@/lib/clients/prisma-client';
import { Prisma } from '@/generated/prisma/client';
import { paginationFormatter } from '@/utils/formatters/pagination.formatter';
import { PullRequestQueryParams } from '../../../contracts/schemas/pull-request.schema';

export async function getPullRequest(filters: PullRequestQueryParams) {
  const { page, limit, search: contains, showAll, type, state, uid } = filters;

  const queryMode = { contains, mode: Prisma.QueryMode.insensitive };
  const where: Prisma.PullRequestWhereInput = {
    ...(type ? { type } : {}),
    ...(state ? { state } : {}),
    ...(uid ? { creator_id: uid } : {}),
    OR: [
      {
        repository: {
          name: queryMode,
        },
      },
      uid
        ? {}
        : {
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
        select: { id: true, name: true, url: true },
      },
      creator: {
        select: { id: true, username: true, url: true, avatar_url: true },
      },
      merged_by: {
        select: { id: true, username: true, url: true, avatar_url: true },
      },
      reviews: {
        include: {
          reviewer: {
            select: { id: true, username: true, url: true, avatar_url: true },
          },
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
