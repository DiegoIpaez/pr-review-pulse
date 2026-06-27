import type { PullRequestRankingQueryParams } from '@/contracts/schemas/pull-request.schema';
import type {
  PullRequestRanking,
  RankingDimensionItem,
} from '@/contracts/types/metrics.type';
import { Prisma } from '@/generated/prisma/client';
import { PullRequestState, PullRequestType } from '@/generated/prisma/enums';
import prismaClient from '@/lib/clients/prisma-client';

function buildWhereClause({
  start_date,
  end_date,
}: PullRequestRankingQueryParams): Prisma.Sql {
  const conditions = [];

  if (start_date) {
    conditions.push(Prisma.sql`pr.created_at >= ${start_date}`);
  }

  if (end_date) {
    conditions.push(Prisma.sql`pr.created_at <= ${end_date}`);
  }

  return conditions.length > 0
    ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`
    : Prisma.empty;
}

/**
 * Builds the fully-shaped ranking for a dimension (type or state) entirely in
 * SQL: aggregation, per-group total, top author and the ordered author ranking
 * are computed in the database. The result rows already match
 * RankingDimensionItem, so no JS post-processing is needed.
 */
function getDimensionRanking(
  column: Prisma.Sql,
  keys: string[],
  where: Prisma.Sql,
  limit: number | null
): Prisma.PrismaPromise<RankingDimensionItem[]> {
  return prismaClient.$queryRaw<RankingDimensionItem[]>(Prisma.sql`
    WITH counts AS (
      SELECT
        pr.${column}::text AS key,
        u.id          AS uid,
        u.username,
        u.avatar_url,
        COUNT(*)::int AS count,
        ROW_NUMBER() OVER (
          PARTITION BY pr.${column}
          ORDER BY COUNT(*) DESC, u.username ASC
        ) AS rn,
        SUM(COUNT(*)) OVER (PARTITION BY pr.${column})::int AS total
      FROM "pull_requests" pr
      JOIN "users" u ON u.id = pr.creator_id
      ${where}
      GROUP BY pr.${column}, u.id, u.username, u.avatar_url
    )
    SELECT
      k.key AS key,
      COALESCE(MAX(c.total), 0)::int AS count,
      (
        array_agg(
          json_build_object(
            'uid', c.uid,
            'username', c.username,
            'avatar_url', c.avatar_url,
            'count', c.count
          )
          ORDER BY c.rn
        ) FILTER (WHERE c.uid IS NOT NULL)
      )[1] AS "topAuthor",
      COALESCE(
        json_agg(
          json_build_object(
            'uid', c.uid,
            'username', c.username,
            'avatar_url', c.avatar_url,
            'count', c.count
          )
          ORDER BY c.rn
        ) FILTER (
          WHERE c.uid IS NOT NULL
          AND (${limit}::int IS NULL OR c.rn <= ${limit}::int)
        ),
        '[]'::json
      ) AS ranking
    FROM unnest(${keys}::text[]) WITH ORDINALITY AS k(key, ord)
    LEFT JOIN counts c ON c.key = k.key
    GROUP BY k.key, k.ord
    ORDER BY k.ord;
  `);
}

export async function getRankings(
  filters: PullRequestRankingQueryParams = {}
): Promise<PullRequestRanking> {
  const where = buildWhereClause(filters);
  const limit = filters.limit ?? null;

  const [byType, byState] = await prismaClient.$transaction([
    getDimensionRanking(
      Prisma.raw('type'),
      Object.values(PullRequestType),
      where,
      limit
    ),
    getDimensionRanking(
      Prisma.raw('state'),
      Object.values(PullRequestState),
      where,
      limit
    ),
  ]);

  return { byType, byState };
}
