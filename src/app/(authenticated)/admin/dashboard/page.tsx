'use client';

import { useQuery } from '@tanstack/react-query';
import {
  fetchDistribution,
  fetchGlobalKpis,
  fetchGlobalStats,
} from '@/services/pull-requests.service';
import { KpiCards } from './_components/kpi-cards';
import PrDistributionCard from './_components/pr-distribution-card';
import { TimeSeriesChart } from './_components/time-series-chart';

export default function UserDashboardPage() {
  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ['prs-kpis'],
    queryFn: () => fetchGlobalKpis(),
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['prs-stats'],
    queryFn: () => fetchGlobalStats(),
    select: (data) => data?.data,
  });

  const { data: distribution, isLoading: isLoadingDistribution } = useQuery({
    queryKey: ['prDistribution'],
    queryFn: () => fetchDistribution(),
    select: (data) => data?.data,
  });

  return (
    <div className="space-y-6">
      <KpiCards kpis={kpis} isLoading={kpisLoading} />
      <TimeSeriesChart stats={stats} isLoading={statsLoading} />
      <PrDistributionCard
        distribution={distribution || []}
        isLoading={isLoadingDistribution}
      />
    </div>
  );
}
