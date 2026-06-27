import { API_ROUTES } from '@/constants';
import type {
  PullRequestMetricQueryParams,
  PullRequestQueryParams,
  PullRequestRankingQueryParams,
} from '@/contracts/schemas/pull-request.schema';
import type { PullRequestRanking } from '@/contracts/types/metrics.type';
import axiosClient from '@/lib/clients/axios-client';

export async function fetchAllPullRequests(params: PullRequestQueryParams) {
  const { data } = await axiosClient.get(API_ROUTES.PULL_REQUESTS.BASE, {
    params,
  });
  return data;
}

export async function fetchGlobalKpis(params?: PullRequestMetricQueryParams) {
  const { data } = await axiosClient.get(API_ROUTES.PULL_REQUESTS.KPIS, {
    params,
  });
  return data;
}

export async function fetchGlobalStats(params?: PullRequestMetricQueryParams) {
  const { data } = await axiosClient.get(API_ROUTES.PULL_REQUESTS.STATS, {
    params,
  });
  return data;
}

export async function fetchDistribution(params?: PullRequestMetricQueryParams) {
  const { data } = await axiosClient.get(
    API_ROUTES.PULL_REQUESTS.DISTRIBUTION,
    { params }
  );
  return data;
}

export async function fetchRankings(
  params?: PullRequestRankingQueryParams
): Promise<PullRequestRanking> {
  const { data } = await axiosClient.get(API_ROUTES.PULL_REQUESTS.RANKINGS, {
    params,
  });
  return data;
}
