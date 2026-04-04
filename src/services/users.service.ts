import { API_ROUTES } from '@/constants';
import axiosClient from '@/lib/clients/axios-client';
import { MetricsFilters, PaginationFilters } from '@/contracts/types';
import type { UpdateUserDto } from '@/contracts/schemas/user.schema';

export async function fetchAllUsers(params: PaginationFilters) {
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

export async function fetchUserKpis(params?: MetricsFilters) {
  const { data } = await axiosClient.get(
    API_ROUTES.USERS.ME.PULL_REQUESTS.KPIS,
    {
      params,
    }
  );
  return data;
}

export async function fetchUserStats(params?: MetricsFilters) {
  const { data } = await axiosClient.get(
    API_ROUTES.USERS.ME.PULL_REQUESTS.STATS,
    {
      params,
    }
  );
  return data;
}

export async function fetchUserDistribution(params?: MetricsFilters) {
  const { data } = await axiosClient.get(
    API_ROUTES.USERS.ME.PULL_REQUESTS.DISTRIBUTION,
    {
      params,
    }
  );
  return data;
}
