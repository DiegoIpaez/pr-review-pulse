import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FALLBACK_COLOR, PR_TYPE_COLORS } from '@/constants';
import type { DistributionItem } from '@/contracts/types/metrics.type';
import { cn } from '@/lib/cn';

type PrDistributionCardProps = {
  distribution: DistributionItem[];
  isLoading?: boolean;
};

export default function PrDistributionCard({
  distribution,
  isLoading,
}: PrDistributionCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>PR Type Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalPrs = distribution.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>PR Type Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {totalPrs === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No pull requests found
          </p>
        ) : (
          <div className="space-y-3">
            {distribution
              .filter((item) => item.count > 0)
              .map((item) => (
                <div key={item.type} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium capitalize">
                      {item.type.replace(/_/g, ' ')}
                    </span>
                    <span className="text-muted-foreground">
                      {item.count} ({item.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        'h-full transition-all duration-300',
                        PR_TYPE_COLORS[item.type] || FALLBACK_COLOR
                      )}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
