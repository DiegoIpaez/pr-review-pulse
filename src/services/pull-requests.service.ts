import { API_ROUTES } from '@/constants';
import type {
  PullRequestMetricQueryParams,
  PullRequestQueryParams,
} from '@/contracts/schemas/pull-request.schema';
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
