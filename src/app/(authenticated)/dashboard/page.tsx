'use client';

import { useQuery } from '@tanstack/react-query';
import { subDays } from 'date-fns';
import { useMemo, useState } from 'react';
import { KpiCards } from '@/components/common/dashboard/kpi-cards';
import PrDistributionCard from '@/components/common/dashboard/pr-distribution-card';
import { TimeSeriesChart } from '@/components/common/dashboard/time-series-chart';
import { DateRangePicker } from '@/components/ui/custom/date-range-picker';
import {
  fetchDistribution,
  fetchGlobalKpis,
  fetchGlobalStats,
} from '@/services/pull-requests.service';

export default function DashboardPage() {
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
    queryKey: ['prs-kpis', queryParams],
    queryFn: () => fetchGlobalKpis(queryParams),
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['prs-stats', queryParams],
    queryFn: () => fetchGlobalStats(queryParams),
    select: (data) => data?.data,
  });

  const { data: distribution, isLoading: isLoadingDistribution } = useQuery({
    queryKey: ['prDistribution', queryParams],
    queryFn: () => fetchDistribution(queryParams),
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
