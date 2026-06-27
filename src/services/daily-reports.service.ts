import { API_ROUTES } from '@/constants';
import type { PaginatedResponse } from '@/contracts/types';
import type {
  DailyReportResponse,
  DailyReportWithDetails,
} from '@/contracts/types/report.type';
import axiosClient from '@/lib/clients/axios-client';

export async function fetchMyDailyReport(
  date?: string
): Promise<DailyReportResponse> {
  const { data } = await axiosClient.get(API_ROUTES.USERS.ME.DAILY_REPORTS, {
    params: { date },
  });
  return data;
}

export async function fetchMyDailyReportsList(params?: {
  date?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<DailyReportWithDetails>> {
  const { data } = await axiosClient.get(API_ROUTES.USERS.ME.DAILY_REPORTS, {
    params,
  });
  return data;
}

export async function fetchAllDailyReports(params?: {
  date?: string;
  userId?: number;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<DailyReportWithDetails>> {
  const { data } = await axiosClient.get(API_ROUTES.DAILY_REPORTS.BASE, {
    params,
  });
  return data;
}

export async function fetchDailyReportById(id: number) {
  const { data } = await axiosClient.get(API_ROUTES.DAILY_REPORTS.BY_ID(id));
  return data;
}
