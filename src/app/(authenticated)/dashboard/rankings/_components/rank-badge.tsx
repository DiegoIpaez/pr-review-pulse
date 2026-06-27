import { Medal } from 'lucide-react';

export function RankBadge({ position }: { position: number }) {
  if (position === 2) {
    return <Medal className="size-4 text-zinc-400" aria-label="2nd place" />;
  }
  if (position === 3) {
    return <Medal className="size-4 text-amber-700" aria-label="3rd place" />;
  }
  return (
    <span className="w-4 text-center text-xs font-medium text-muted-foreground tabular-nums">
      {position}
    </span>
  );
}
