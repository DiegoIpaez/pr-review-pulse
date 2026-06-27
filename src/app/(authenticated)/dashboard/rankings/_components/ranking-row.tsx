import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { RankingAuthor } from '@/contracts/types/metrics.type';
import { cn } from '@/lib/cn';
import { getInitials } from '@/lib/initials';
import { RankBadge } from './rank-badge';

type RankingRowProps = {
  author: RankingAuthor;
  position: number;
  maxCount: number;
  colorClass: string;
};

export function RankingRow({
  author,
  position,
  maxCount,
  colorClass,
}: RankingRowProps) {
  const width = maxCount > 0 ? (author.count / maxCount) * 100 : 0;

  return (
    <li className="flex items-center gap-2.5">
      <span className="flex w-4 shrink-0 justify-center">
        <RankBadge position={position} />
      </span>
      <Avatar className="size-6 shrink-0">
        <AvatarImage src={author.avatar_url ?? ''} alt={author.username} />
        <AvatarFallback className="text-[9px]">
          {getInitials(author.username)}
        </AvatarFallback>
      </Avatar>
      <span className="min-w-0 flex-1 truncate text-sm">{author.username}</span>
      <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-muted sm:block">
        <div
          className={cn('h-full transition-all duration-300', colorClass)}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="w-7 text-right text-sm tabular-nums text-muted-foreground">
        {author.count}
      </span>
    </li>
  );
}
