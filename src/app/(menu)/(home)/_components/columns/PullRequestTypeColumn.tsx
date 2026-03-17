import { Badge } from '@/components/ui/badge';
import { PullRequestSchema } from '@/contracts/types/schema.type';

export type PullRequestType = PullRequestSchema['type'];

const typeColors: Record<PullRequestType, string> = {
  FEATURE: '#22c55e',
  FIX: '#ef4444',
  HOTFIX: '#f97316',
  RELEASE: '#8b5cf6',
  CHORE: '#6b7280',
  NO_TICKET: '#0ea5e9',
  REFACTOR: '#f59e0b',
  DOCS: '#3b82f6',
  TEST: '#10b981',
};

type Props = {
  type: PullRequestType;
};

export default function PullRequestTypeColumn({ type }: Props) {
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
