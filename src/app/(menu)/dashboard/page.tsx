'use client';

import { useQuery } from '@tanstack/react-query';
import {
  fetchGlobalStats,
  fetchGlobalKpis,
} from '@/services/pr-metrics.service';
import { KpiCards } from './_components/kpi-cards';
import { TimeSeriesChart } from './_components/time-series-chart';

export default function UserDashboardPage() {
  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ['prs-kpis'],
    queryFn: fetchGlobalKpis,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['prs-stats'],
    queryFn: () => fetchGlobalStats(),
  });

  return (
    <div className="space-y-6">
      <KpiCards kpis={kpis} isLoading={kpisLoading} />
      <TimeSeriesChart stats={stats} isLoading={statsLoading} />
    </div>
  );
}
