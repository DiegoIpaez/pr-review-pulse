import prismaClient from '@/lib/clients/prisma-client';
import { PullRequestType } from '@/generated/prisma/client';
import type { PullRequestMetricQueryParams } from '@/contracts/schemas/pull-request.schema';
import { DistributionItem } from '@/contracts/types/metrics.type';

type PrismaGroupByResult = {
  type: PullRequestType;
  _count: {
    type: number;
  };
};

export async function getDistribution(
  filters: PullRequestMetricQueryParams = {}
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
