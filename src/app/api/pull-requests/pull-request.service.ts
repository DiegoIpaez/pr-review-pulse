import prismaClient from '@/lib/clients/prisma-client';
import { Prisma } from '@/generated/prisma/client';
import { PullRequestState } from '@/generated/prisma/enums';
import { paginationFormatter } from '@/utils/formatters/pagination.formatter';
import {
  PullRequestMetricFilter,
  PullRequestTypeFilter,
} from './pull-request.schema';

type KpisResponse = {
  open: number;
  no_reviews: number;
  approved_pending_merge: number;
};

type StatsFilters = {
  uid?: number;
  start_date?: string;
  end_date?: string;
};

type TimeSeriesData = {
  date: string;
  created: number;
  closed: number;
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

export async function getKpis({
  uid,
  end_date,
  start_date,
}: PullRequestMetricFilter = {}): Promise<KpisResponse> {
  const result = await prismaClient.$queryRaw<KpisResponse[]>`
  SELECT
    COUNT(*) FILTER (WHERE pr.state = ${PullRequestState.open})::int AS open,
    COUNT(*) FILTER (
      WHERE pr.state = ${PullRequestState.open}
      AND NOT EXISTS (
        SELECT 1 FROM "pull_request_reviews" r WHERE r.pull_request_id = pr.id
      )
    )::int AS no_reviews,
    COUNT(*) FILTER (
      WHERE pr.state = ${PullRequestState.open}
      AND EXISTS (
        SELECT 1 FROM "pull_request_reviews" r 
        WHERE r.pull_request_id = pr.id 
        AND r.state = 'approved'
      )
    )::int AS approved_pending_merge
  FROM "pull_requests" pr
  ${uid ? Prisma.sql`WHERE pr.creator_id = ${uid}` : Prisma.empty}
  ${start_date ? Prisma.sql`AND pr.created_at >= ${start_date}` : Prisma.empty}
  ${end_date ? Prisma.sql`AND pr.created_at <= ${end_date}` : Prisma.empty};
`;

  return result?.[0];
}

export async function getStats(filters: StatsFilters): Promise<StatsResponse> {
  const end_date = filters?.end_date ? new Date(filters.end_date) : new Date();
  const start_date = filters?.start_date
    ? new Date(filters.start_date)
    : new Date(end_date.getTime() - 30 * 24 * 60 * 60 * 1000);

  const uid = filters?.uid;
  const creatorCondition = uid
    ? Prisma.sql`AND pr.creator_id = ${uid}`
    : Prisma.empty;

  const result = await prismaClient.$queryRaw<TimeSeriesData[]>`
    WITH dates AS (
      SELECT generate_series(
        ${start_date}::date,
        ${end_date}::date,
        interval '1 day'
      )::date AS date
    ),
    open_by_day AS (
      SELECT pr.created_at::date AS date, COUNT(*)::int AS count
      FROM pull_requests pr
      WHERE pr.state = 'open'
        AND pr.created_at::date BETWEEN ${start_date}::date AND ${end_date}::date
        ${creatorCondition}
      GROUP BY pr.created_at::date
    ),
    closed_by_day AS (
      SELECT pr.closed_at::date AS date, COUNT(*)::int AS count
      FROM pull_requests pr
      WHERE pr.closed_at IS NOT NULL
        AND pr.closed_at::date BETWEEN ${start_date}::date AND ${end_date}::date
        ${creatorCondition}
      GROUP BY pr.closed_at::date
    ),
    merged_by_day AS (
      SELECT pr.merged_at::date AS date, COUNT(*)::int AS count
      FROM pull_requests pr
      WHERE pr.merged_at IS NOT NULL
        AND pr.merged_at::date BETWEEN ${start_date}::date AND ${end_date}::date
        ${creatorCondition}
      GROUP BY pr.merged_at::date
    )
    SELECT
      d.date::text AS date,
      COALESCE(o.count, 0) AS open,
      COALESCE(c.count, 0) AS closed,
      COALESCE(m.count, 0) AS merged
    FROM dates d
    LEFT JOIN open_by_day o ON o.date = d.date
    LEFT JOIN closed_by_day c ON c.date = d.date
    LEFT JOIN merged_by_day m ON m.date = d.date
    ORDER BY d.date;
  `;

  return { timeSeries: result };
}
