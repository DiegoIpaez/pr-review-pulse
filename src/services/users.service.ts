import { API_ROUTES } from '@/constants';
import axiosClient from '@/lib/axiosClient';
import { PaginationFilters } from '@/contracts/types';

export async function fetchAllUsers(params: PaginationFilters) {
  const { data } = await axiosClient.get(API_ROUTES.USERS, { params });
  return data;
}

export async function fetchUserById(id: number) {
  const { data } = await axiosClient.get(`${API_ROUTES.USERS}/${id}`);
  return data;
}
