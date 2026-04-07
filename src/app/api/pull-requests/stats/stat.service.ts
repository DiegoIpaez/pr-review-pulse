import prismaClient from '@/lib/clients/prisma-client';
import { Prisma } from '@/generated/prisma/client';
import { TimeSeriesData } from '@/contracts/types/metrics.type';
import { PullRequestMetricQueryParams } from '@/contracts/schemas/pull-request.schema';

export async function getStats(
  filters: PullRequestMetricQueryParams
): Promise<TimeSeriesData[]> {
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

  return result;
}
