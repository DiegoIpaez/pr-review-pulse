import { API_ROUTES } from '@/constants';
import axiosClient from '@/lib/clients/axios-client';
import { MetricsFilters, PaginationFilters } from '@/contracts/types';

export async function fetchAllPullRequests(params: PaginationFilters) {
  const { data } = await axiosClient.get(API_ROUTES.PULL_REQUESTS.BASE, {
    params,
  });
  return data;
}

export async function fetchGlobalKpis(params?: MetricsFilters) {
  const { data } = await axiosClient.get(API_ROUTES.PULL_REQUESTS.KPIS, {
    params,
  });
  return data;
}

export async function fetchGlobalStats(params?: MetricsFilters) {
  const { data } = await axiosClient.get(API_ROUTES.PULL_REQUESTS.STATS, {
    params,
  });
  return data;
}

export async function fetchDistribution(params?: MetricsFilters) {
  const { data } = await axiosClient.get(
    API_ROUTES.PULL_REQUESTS.DISTRIBUTION,
    { params }
  );
  return data;
}
