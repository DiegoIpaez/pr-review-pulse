import { Crown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { RankingAuthor } from '@/contracts/types/metrics.type';
import { cn } from '@/lib/cn';
import { getInitials } from '@/lib/initials';

type RankingChampionProps = {
  champion: RankingAuthor;
  colorClass: string;
};

export function RankingChampion({
  champion,
  colorClass,
}: RankingChampionProps) {
  return (
    <div className="relative rounded-lg bg-muted/40 p-3 pl-4">
      <span
        className={cn('absolute inset-y-0 left-0 w-1 rounded-l-lg', colorClass)}
      />
      <div className="flex items-center gap-3">
        <Avatar className="size-10 shrink-0">
          <AvatarImage
            src={champion.avatar_url ?? ''}
            alt={champion.username}
          />
          <AvatarFallback className="text-xs">
            {getInitials(champion.username)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Crown
              className="size-3.5 shrink-0 text-amber-400"
              aria-label="Champion"
            />
            <span className="truncate text-sm font-semibold">
              {champion.username}
            </span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn('h-full rounded-full', colorClass)}
              style={{ width: '100%' }}
            />
          </div>
        </div>
        <span className="text-2xl font-bold tabular-nums leading-none">
          {champion.count}
        </span>
      </div>
    </div>
  );
}
