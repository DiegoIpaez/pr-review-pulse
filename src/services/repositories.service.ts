import { API_ROUTES } from '@/constants';
import axiosClient from '@/lib/clients/axios-client';
import { PaginationQueryParams } from '@/contracts/schemas/pagination.schema';

export async function fetchAllRepositories(params: PaginationQueryParams) {
  const { data } = await axiosClient.get(API_ROUTES.REPOSITORIES.BASE, {
    params,
  });
  return data;
}
