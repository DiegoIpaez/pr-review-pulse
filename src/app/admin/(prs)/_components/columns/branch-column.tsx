import { GitBranch } from 'lucide-react';

export function BranchColumn({ branch }: { branch: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground border border-border/60 max-w-[180px]">
      <GitBranch className="w-3 h-3 shrink-0 text-muted-foreground/70" />
      <span className="truncate">{branch}</span>
    </span>
  );
}
