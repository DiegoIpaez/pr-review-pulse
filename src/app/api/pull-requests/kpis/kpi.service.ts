import type { KpisData } from '@/contracts/types/metrics.type';
import { Prisma } from '@/generated/prisma/client';
import { PullRequestState } from '@/generated/prisma/enums';
import prismaClient from '@/lib/clients/prisma-client';
import type { PullRequestMetricQueryParams } from '../../../../contracts/schemas/pull-request.schema';

export async function getKpis({
  uid,
  end_date,
  start_date,
}: PullRequestMetricQueryParams = {}): Promise<KpisData> {
  const conditions = [];

  if (uid) {
    conditions.push(Prisma.sql`pr.creator_id = ${uid}`);
  }

  if (start_date) {
    conditions.push(Prisma.sql`pr.created_at >= ${start_date}`);
  }

  if (end_date) {
    conditions.push(Prisma.sql`pr.created_at <= ${end_date}`);
  }

  const whereClause =
    conditions.length > 0
      ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`
      : Prisma.empty;

  const result = await prismaClient.$queryRaw<KpisData[]>`
  SELECT
    COUNT(*) FILTER (
      WHERE pr.state = ${PullRequestState.open}
      AND EXISTS (
        SELECT 1 FROM "pull_request_reviews" r WHERE r.pull_request_id = pr.id
      )
    )::int AS open,
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
    )::int AS approved_pending_merge,
    COUNT(*) FILTER (WHERE pr.merged_at IS NOT NULL)::int AS merged
  FROM "pull_requests" pr
  ${whereClause};
`;

  return result?.[0];
}
