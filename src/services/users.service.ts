import { API_ROUTES } from '@/constants';
import axiosClient from '@/lib/clients/axios-client';
import { PaginationFilters } from '@/contracts/types';
import type { UpdateUserDto } from '@/contracts/schemas/user.schema';

export async function fetchAllUsers(params: PaginationFilters) {
  const { data } = await axiosClient.get(API_ROUTES.USERS, { params });
  return data;
}

export async function fetchUserById(id: number) {
  const { data } = await axiosClient.get(`${API_ROUTES.USERS}/${id}`);
  return data;
}

export async function updateUserById(id: number, userData: UpdateUserDto) {
  const { data } = await axiosClient.patch(
    `${API_ROUTES.USERS}/${id}`,
    userData
  );
  return data;
}
