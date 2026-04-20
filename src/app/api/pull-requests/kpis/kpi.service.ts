import { Prisma } from '@/generated/prisma/client';
import { PullRequestState } from '@/generated/prisma/enums';
import prismaClient from '@/lib/clients/prisma-client';
import type { PullRequestMetricQueryParams } from '../../../../contracts/schemas/pull-request.schema';

type KpisResponse = {
  open: number;
  no_reviews: number;
  approved_pending_merge: number;
};

export async function getKpis({
  uid,
  end_date,
  start_date,
}: PullRequestMetricQueryParams = {}): Promise<KpisResponse> {
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
