import { API_ROUTES } from '@/constants';
import axiosClient from '@/lib/clients/axios-client';
import type { UpdateUserDto } from '@/contracts/schemas/user.schema';
import type { PaginationQueryParams } from '@/contracts/schemas/pagination.schema';
import type { PullRequestMetricQueryParams } from '@/contracts/schemas/pull-request.schema';

export async function fetchAllUsers(params: PaginationQueryParams) {
  const { data } = await axiosClient.get(API_ROUTES.USERS.BASE, { params });
  return data;
}

export async function fetchUserById(id: number) {
  const { data } = await axiosClient.get(API_ROUTES.USERS.BY_ID(id));
  return data;
}

export async function updateUserById(id: number, userData: UpdateUserDto) {
  const { data } = await axiosClient.patch(
    API_ROUTES.USERS.BY_ID(id),
    userData
  );
  return data;
}

export async function fetchMyPrs(params?: PaginationQueryParams) {
  const { data } = await axiosClient.get(
    API_ROUTES.USERS.ME.PULL_REQUESTS.BASE,
    { params }
  );
  return data;
}

export async function fetchMyPrKpis(params?: PullRequestMetricQueryParams) {
  const { data } = await axiosClient.get(
    API_ROUTES.USERS.ME.PULL_REQUESTS.KPIS,
    { params }
  );
  return data;
}

export async function fetchMyPrStats(params?: PullRequestMetricQueryParams) {
  const { data } = await axiosClient.get(
    API_ROUTES.USERS.ME.PULL_REQUESTS.STATS,
    { params }
  );
  return data;
}

export async function fetchMyPrDistribution(
  params?: PullRequestMetricQueryParams
) {
  const { data } = await axiosClient.get(
    API_ROUTES.USERS.ME.PULL_REQUESTS.DISTRIBUTION,
    { params }
  );
  return data;
}
