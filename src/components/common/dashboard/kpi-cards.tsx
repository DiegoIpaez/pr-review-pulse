'use client';

import { AlertCircle, CheckCircle, GitMerge, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { KpisData } from '@/contracts/types/metrics.type';
import { KpiCard } from './kpi-card';

type KpiCardsProps = {
  kpis: KpisData | undefined;
  isLoading: boolean;
};

export function KpiCards({ kpis, isLoading }: KpiCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        title="PRs Open"
        value={kpis?.open ?? 0}
        description="Total PRs open with reviews"
        icon={TrendingUp}
        iconColor="text-blue-500"
      />
      <KpiCard
        title="No Reviews"
        value={kpis?.no_reviews ?? 0}
        description="Total PRs open without reviews"
        icon={AlertCircle}
        iconColor="text-red-500"
      />
      <KpiCard
        title="Approved Pending"
        value={kpis?.approved_pending_merge ?? 0}
        description="Total of PRs pending merge"
        icon={CheckCircle}
        iconColor="text-green-500"
      />
      <KpiCard
        title="Merged"
        value={kpis?.merged ?? 0}
        description="Total of PRs merged"
        icon={GitMerge}
        iconColor="text-purple-500"
      />
    </div>
  );
}
