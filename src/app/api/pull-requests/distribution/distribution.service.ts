import prismaClient from '@/lib/clients/prisma-client';
import { PullRequestType } from '@/generated/prisma/client';
import type { DistributionFilter } from './distribution.schema';

type DistributionItem = {
  type: PullRequestType;
  count: number;
  percentage: number;
};

type PrismaGroupByResult = {
  type: PullRequestType;
  _count: {
    type: number;
  };
};

/**
 * Get the distribution of pull requests by type
 * Uses a single optimized GROUP BY query, then maps to include all enum values
 *
 * Performance considerations:
 * - Single query using Prisma groupBy (translates to SQL GROUP BY)
 * - Index on `type` column exists in schema (@@index([type]))
 * - Index on `created_at` exists for date filtering (@@index([created_at(sort: Desc)]))
 * - Index on `creator_id` exists for user filtering (@@index([creator_id]))
 * - Returns all enum values even if count is 0
 * - Calculates percentage on the fly (no additional query)
 */
export async function getDistribution(
  filters: DistributionFilter = {}
): Promise<DistributionItem[]> {
  const { uid, start_date, end_date } = filters;

  const where = {
    ...(uid && { creator_id: uid }),
    ...(start_date && { created_at: { gte: new Date(start_date) } }),
    ...(end_date && {
      created_at: {
        ...(start_date ? { gte: new Date(start_date) } : {}),
        lte: new Date(end_date),
      },
    }),
  };

  const groupedResults = await prismaClient.pullRequest.groupBy({
    by: ['type'],
    _count: {
      type: true,
    },
    where,
  });

  const resultMap = new Map<PullRequestType, number>(
    groupedResults.map((item: PrismaGroupByResult) => [
      item.type,
      item._count.type,
    ])
  );

  const totalCount = Array.from(resultMap.values()).reduce(
    (sum, count) => sum + count,
    0
  );

  const allTypes = Object.values(PullRequestType);

  return allTypes.map((type) => {
    const count = resultMap.get(type) ?? 0;
    const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;

    return {
      type,
      count,
      percentage: Math.round(percentage * 100) / 100,
    };
  });
}
