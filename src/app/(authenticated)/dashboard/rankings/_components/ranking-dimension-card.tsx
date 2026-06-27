import { Card, CardContent } from '@/components/ui/card';
import type { RankingDimensionItem } from '@/contracts/types/metrics.type';
import { cn } from '@/lib/cn';
import { RankingChampion } from './ranking-champion';
import { RankingRow } from './ranking-row';

type RankingDimensionCardProps = {
  item: RankingDimensionItem;
  colorClass: string;
};

function formatLabel(key: string) {
  return key.replace(/_/g, ' ');
}

export default function RankingDimensionCard({
  item,
  colorClass,
}: RankingDimensionCardProps) {
  const champion = item.topAuthor;
  const challengers = item.ranking.slice(1);
  const maxCount = champion?.count ?? 0;

  return (
    <Card className="overflow-hidden py-4">
      <CardContent className="space-y-4 px-4">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <span className={cn('size-2.5 rounded-full', colorClass)} />
            <span className="text-sm font-medium capitalize">
              {formatLabel(item.key)}
            </span>
          </span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {item.count} PRs
          </span>
        </div>

        {champion ? (
          <>
            <RankingChampion champion={champion} colorClass={colorClass} />

            {challengers.length > 0 && (
              <ul className="space-y-2.5">
                {challengers.map((author, index) => (
                  <RankingRow
                    key={author.uid}
                    author={author}
                    position={index + 2}
                    maxCount={maxCount}
                    colorClass={colorClass}
                  />
                ))}
              </ul>
            )}
          </>
        ) : (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No pull requests found
          </p>
        )}
      </CardContent>
    </Card>
  );
}
