import prismaClient from '@/lib/clients/prisma-client';
import { Prisma } from '@/generated/prisma/client';
import { paginationFormatter } from '@/utils/formatters/pagination.formatter';
import { PullRequestTypeFilter } from './pull-request.schema';

type KpisResponse = {
  open: number;
  noReviews: number;
  approvedPendingMerge: number;
};

type StatsFilters = {
  uid?: number;
  start_date?: string;
  end_date?: string;
};

type TimeSeriesData = {
  date: string;
  created: number;
  merged: number;
};

type StatsResponse = {
  timeSeries: TimeSeriesData[];
};

export async function getPullRequest(filters: PullRequestTypeFilter) {
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

export async function getKpis(uid?: number): Promise<KpisResponse> {
  const baseWhere: Prisma.PullRequestWhereInput = uid
    ? { creator_id: uid }
    : {};

  const open = await prismaClient.pullRequest.count({
    where: { ...baseWhere, state: 'open' },
  });

  const noReviews = await prismaClient.pullRequest.count({
    where: {
      ...baseWhere,
      state: 'open',
      reviews: { none: {} },
    },
  });

  const approvedPendingMerge = await prismaClient.pullRequest.count({
    where: {
      ...baseWhere,
      state: 'open',
      reviews: {
        some: { state: 'approved' },
      },
    },
  });

  return { open, noReviews, approvedPendingMerge };
}

export async function getStats(filters: StatsFilters): Promise<StatsResponse> {
  const { uid, start_date, end_date } = filters;

  const startDate = start_date ? new Date(start_date) : new Date();
  const endDate = end_date ? new Date(end_date) : new Date();

  if (!start_date) {
    startDate.setDate(startDate.getDate() - 30);
  }

  const baseWhere: Prisma.PullRequestWhereInput = uid
    ? { creator_id: uid }
    : {};

  const createdPRs = await prismaClient.pullRequest.findMany({
    where: {
      ...baseWhere,
      created_at: { gte: startDate, lte: endDate },
    },
    select: { created_at: true },
  });

  const mergedPRs = await prismaClient.pullRequest.findMany({
    where: {
      ...baseWhere,
      merged_at: { gte: startDate, lte: endDate },
    },
    select: { merged_at: true },
  });

  const dateMap = new Map<string, { created: number; merged: number }>();

  createdPRs.forEach((pr) => {
    const date = pr.created_at.toISOString().split('T')[0];
    const current = dateMap.get(date) || { created: 0, merged: 0 };
    dateMap.set(date, { ...current, created: current.created + 1 });
  });

  mergedPRs.forEach((pr) => {
    if (pr.merged_at) {
      const date = pr.merged_at.toISOString().split('T')[0];
      const current = dateMap.get(date) || { created: 0, merged: 0 };
      dateMap.set(date, { ...current, merged: current.merged + 1 });
    }
  });

  const timeSeries: TimeSeriesData[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const data = dateMap.get(dateStr) || { created: 0, merged: 0 };
    timeSeries.push({
      date: dateStr,
      created: data.created,
      merged: data.merged,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return { timeSeries };
}
