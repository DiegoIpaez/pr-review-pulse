import { API_ROUTES } from '@/constants';
import type { PaginationQueryParams } from '@/contracts/schemas/pagination.schema';
import axiosClient from '@/lib/clients/axios-client';

export async function fetchAllRepositories(params: PaginationQueryParams) {
  const { data } = await axiosClient.get(API_ROUTES.REPOSITORIES.BASE, {
    params,
  });
  return data;
}
