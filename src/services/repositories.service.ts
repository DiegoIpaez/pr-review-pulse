import { API_ROUTES } from '@/constants';
import axiosClient from '@/lib/clients/axios-client';
import { PaginationFilters } from '@/contracts/types';

export async function fetchAllRepositories(params: PaginationFilters) {
  const { data } = await axiosClient.get(API_ROUTES.REPOSITORIES.BASE, {
    params,
  });
  return data;
}
