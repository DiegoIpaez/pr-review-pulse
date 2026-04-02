import axiosClient from '@/lib/clients/axios-client';

export type KpisData = {
  open: number;
  noReviews: number;
  approvedPendingMerge: number;
};

export type TimeSeriesData = {
  date: string;
  created: number;
  merged: number;
};

export type StatsData = {
  timeSeries: TimeSeriesData[];
};

type StatsParams = {
  start_date?: string;
  end_date?: string;
};

export async function fetchUserKpis(): Promise<KpisData> {
  const { data } = await axiosClient.get('/users/me/pull-requests/kpis');
  return data;
}

export async function fetchUserStats(params?: StatsParams): Promise<StatsData> {
  const { data } = await axiosClient.get('/users/me/pull-requests/stats', {
    params,
  });
  return data;
}

export async function fetchGlobalKpis(): Promise<KpisData> {
  const { data } = await axiosClient.get('/pull-requests/kpis');
  return data;
}

export async function fetchGlobalStats(
  params?: StatsParams
): Promise<StatsData> {
  const { data } = await axiosClient.get('/pull-requests/stats', {
    params,
  });
  return data;
}
