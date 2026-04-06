import prismaClient from '@/lib/clients/prisma-client';
import type { PaginationFilters } from '@/contracts/types';
import { Prisma, User } from '@/generated/prisma/client';
import { paginationFormatter } from '@/utils/formatters/pagination.formatter';
import { GitHubUser } from '../webhooks/github/_contracts/types';

const COUNT_SELECT = {
  select: {
    pull_requests: true,
    reviews: true,
  },
};

export async function getAllUsers(filters: PaginationFilters) {
  const { page, limit, search: contains, showAll } = filters;

  const queryMode = { contains, mode: Prisma.QueryMode.insensitive };
  const where: Prisma.UserWhereInput = {
    OR: [{ username: queryMode }],
  };

  const query: Prisma.UserFindManyArgs = {
    where,
    include: { _count: COUNT_SELECT },
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
    include: {
      _count: COUNT_SELECT,
      reviews: {
        include: {
          reviewer: true,
          pull_request: { include: { repository: true, creator: true } },
        },
      },
      pull_requests: { include: { repository: true, creator: true } },
    },
  });
  return user;
}

export async function upsertGitHubUser(
  profile: Pick<GitHubUser, 'login' | 'avatar_url' | 'html_url' | 'id'>
) {
  const user = await prismaClient.user.upsert({
    where: { github_id: profile?.id },
    update: {
      username: profile?.login,
      avatar_url: profile?.avatar_url,
      url: profile?.html_url,
    },
    create: {
      github_id: profile?.id,
      username: profile?.login,
      avatar_url: profile?.avatar_url,
      url: profile?.html_url,
      access_status: 'pending',
    },
  });

  return user;
}

export async function updateUser(
  id: number,
  data: {
    role?: User['role'];
    access_status?: User['access_status'];
  }
) {
  const user = await prismaClient.user.update({
    where: { id },
    data,
    include: { _count: COUNT_SELECT },
  });

  return user;
}
