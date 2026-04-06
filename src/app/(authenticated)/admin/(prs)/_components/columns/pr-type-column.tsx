import { Badge } from '@/components/ui/badge';
import { PullRequestSchema } from '@/contracts/types/schema.type';

export type PullRequestType = PullRequestSchema['type'];

const typeColors: Record<PullRequestType, string> = {
  feature: '#22c55e',
  fix: '#ef4444',
  hotfix: '#f97316',
  release: '#8b5cf6',
  chore: '#6b7280',
  no_ticket: '#0ea5e9',
  refactor: '#f59e0b',
  docs: '#3b82f6',
  test: '#10b981',
};

type Props = {
  type: PullRequestType;
};

export function PullRequestTypeColumn({ type }: Props) {
  const color = typeColors[type];

  return (
    <Badge
      className="border-transparent text-[var(--color)] bg-[var(--color)]/10"
      style={{ '--color': color } as React.CSSProperties}
    >
      {type}
    </Badge>
  );
}
