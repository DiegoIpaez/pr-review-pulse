import { API_ROUTES } from '@/constants';
import axiosClient from '@/lib/clients/axios-client';

export async function fetchLabels() {
  const { data } = await axiosClient.get(API_ROUTES.LABELS.BASE);
  return data;
}
