'use client';

import { useQuery } from '@tanstack/react-query';
import { subDays } from 'date-fns';
import { useMemo, useState } from 'react';
import { DateRangePicker } from '@/components/ui/custom/date-range-picker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PR_STATE_COLORS, PR_TYPE_COLORS } from '@/constants';
import { fetchRankings } from '@/services/pull-requests.service';
import { RankingGrid, RankingsSkeleton } from './_components/ranking-grid';

export default function RankingsPage() {
  const [fromDate, setFromDate] = useState<Date | undefined>(() =>
    subDays(new Date(), 30)
  );
  const [toDate, setToDate] = useState<Date | undefined>();

  const rankingParams = useMemo(() => {
    const params: { start_date?: string; end_date?: string; limit: number } = {
      limit: 10,
    };

    if (fromDate) params.start_date = fromDate.toISOString();
    if (toDate) params.end_date = toDate.toISOString();
    return params;
  }, [fromDate, toDate]);

  const { data: ranking, isLoading: rankingsLoading } = useQuery({
    queryKey: ['pr-rankings', rankingParams],
    queryFn: () => fetchRankings(rankingParams),
  });

  return (
    <Tabs defaultValue="type">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <TabsList>
          <TabsTrigger value="type">By type</TabsTrigger>
          <TabsTrigger value="state">By state</TabsTrigger>
        </TabsList>
        <DateRangePicker
          from={fromDate}
          to={toDate}
          onFromChange={setFromDate}
          onToChange={setToDate}
        />
      </div>
      <TabsContent value="type">
        {rankingsLoading ? (
          <RankingsSkeleton />
        ) : (
          <RankingGrid items={ranking?.byType ?? []} colors={PR_TYPE_COLORS} />
        )}
      </TabsContent>
      <TabsContent value="state">
        {rankingsLoading ? (
          <RankingsSkeleton />
        ) : (
          <RankingGrid
            items={ranking?.byState ?? []}
            colors={PR_STATE_COLORS}
          />
        )}
      </TabsContent>
    </Tabs>
  );
}
