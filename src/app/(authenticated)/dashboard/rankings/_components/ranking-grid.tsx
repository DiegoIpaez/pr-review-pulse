import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FALLBACK_COLOR } from '@/constants';
import type { RankingDimensionItem } from '@/contracts/types/metrics.type';
import RankingDimensionCard from './ranking-dimension-card';

const GRID_CLASS = 'grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3';

type RankingGridProps = {
  items: RankingDimensionItem[];
  colors: Record<string, string>;
};

export function RankingGrid({ items, colors }: RankingGridProps) {
  const ranked = items.filter((item) => item.count > 0);

  if (ranked.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No pull requests found
      </p>
    );
  }

  return (
    <div className={GRID_CLASS}>
      {ranked.map((item) => (
        <RankingDimensionCard
          key={item.key}
          item={item}
          colorClass={colors[item.key] || FALLBACK_COLOR}
        />
      ))}
    </div>
  );
}

export function RankingsSkeleton() {
  return (
    <div className={GRID_CLASS}>
      {[1, 2, 3].map((index) => (
        <Card key={index}>
          <CardContent className="space-y-4 p-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
