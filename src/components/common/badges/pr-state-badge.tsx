import { GitMerge, GitPullRequest, XCircle } from 'lucide-react';

const STATE_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; className: string }
> = {
  open: {
    label: 'Open',
    icon: GitPullRequest,
    className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  },
  closed: {
    label: 'Closed',
    icon: XCircle,
    className: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  },
  merged: {
    label: 'Merged',
    icon: GitMerge,
    className: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
  },
};

export function PrStateBadge({ state }: { state: string }) {
  const config = STATE_CONFIG[state] ?? {
    label: state,
    icon: GitPullRequest,
    className: 'bg-muted text-muted-foreground border-border',
  };
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}
