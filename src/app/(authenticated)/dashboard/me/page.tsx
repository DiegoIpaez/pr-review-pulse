'use client';

import { useQuery } from '@tanstack/react-query';
import { subDays } from 'date-fns';
import { useMemo, useState } from 'react';
import { KpiCards } from '@/components/common/dashboard/kpi-cards';
import PrDistributionCard from '@/components/common/dashboard/pr-distribution-card';
import { TimeSeriesChart } from '@/components/common/dashboard/time-series-chart';
import { DateRangePicker } from '@/components/ui/custom/date-range-picker';
import {
  fetchMyPrDistribution,
  fetchMyPrKpis,
  fetchMyPrStats,
} from '@/services/users.service';

export default function MyDashboardPage() {
  const [fromDate, setFromDate] = useState<Date | undefined>(() =>
    subDays(new Date(), 30)
  );
  const [toDate, setToDate] = useState<Date | undefined>();

  const queryParams = useMemo(() => {
    const params: { start_date?: string; end_date?: string } = {};

    if (fromDate) {
      params.start_date = fromDate.toISOString();
    }

    if (toDate) {
      params.end_date = toDate.toISOString();
    }

    return params;
  }, [fromDate, toDate]);

  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ['my-prs-kpis', queryParams],
    queryFn: () => fetchMyPrKpis(queryParams),
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['my-prs-stats', queryParams],
    queryFn: () => fetchMyPrStats(queryParams),
    select: (data) => data?.data,
  });

  const { data: distribution, isLoading: isLoadingDistribution } = useQuery({
    queryKey: ['my-prDistribution', queryParams],
    queryFn: () => fetchMyPrDistribution(queryParams),
    select: (data) => data?.data,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-3">
        <DateRangePicker
          from={fromDate}
          to={toDate}
          onFromChange={setFromDate}
          onToChange={setToDate}
        />
      </div>
      <KpiCards kpis={kpis} isLoading={kpisLoading} />
      <TimeSeriesChart stats={stats} isLoading={statsLoading} />
      <PrDistributionCard
        distribution={distribution || []}
        isLoading={isLoadingDistribution}
      />
    </div>
  );
}
