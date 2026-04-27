'use client';

import { CheckCircle2, CircleMinus, Eye, FileDiff } from 'lucide-react';
import type { PrReviewSchema } from '@/contracts/types/schema.type';
import { cn } from '@/lib/cn';

export function PrReviewCardLayout({
  className,
  state,
  children,
}: {
  className?: string;
  state: PrReviewSchema['state'];
  children?: React.ReactNode;
}) {
  const statusConfig = {
    approved: {
      border: 'border-emerald-500/40',
      text: 'text-emerald-600 dark:text-emerald-400',
      icon: CheckCircle2,
      label: 'Approved',
    },
    changes_requested: {
      border: 'border-red-500/40',
      text: 'text-red-600 dark:text-red-400',
      icon: FileDiff,
      label: 'Changes Requested',
    },
    commented: {
      border: 'border-blue-500/40',
      text: 'text-blue-600 dark:text-blue-400',
      icon: Eye,
      label: 'Commented',
    },
    dismissed: {
      border: 'border-border',
      text: 'text-muted-foreground',
      icon: CircleMinus,
      label: 'Dismissed',
    },
  };

  const config = statusConfig[state] ?? statusConfig.commented;
  const Icon = config.icon;

  return (
    <div
      className={cn('relative rounded-lg border bg-background', config.border)}
    >
      <div
        className={cn(
          'absolute -top-3 right-3 flex items-center gap-1.5 rounded-full border bg-background px-2.5 py-0.5 text-xs font-medium',
          config.border,
          config.text
        )}
      >
        <Icon className="h-3.5 w-3.5" />
        {config.label}
      </div>
      <div className={cn('p-4 space-y-3', className)}>{children}</div>
    </div>
  );
}
