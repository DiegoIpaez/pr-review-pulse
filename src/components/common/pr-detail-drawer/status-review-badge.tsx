'use client';

import { CheckCircle2, CircleMinus, Eye, FileDiff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { PrReviewSchema } from '@/contracts/types/schema.type';
import { cn } from '@/lib/cn';

export function StatusReviewBadge({
  state,
}: {
  state: PrReviewSchema['state'];
}) {
  const statusConfig = {
    approved: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-600 dark:text-emerald-400',
      icon: CheckCircle2,
      label: 'Approved',
    },
    changes_requested: {
      bg: 'bg-red-500/10',
      text: 'text-red-600 dark:text-red-400',
      icon: FileDiff,
      label: 'Changes Requested',
    },
    commented: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-600 dark:text-blue-400',
      icon: Eye,
      label: 'Commented',
    },
    dismissed: {
      bg: 'bg-muted',
      text: 'text-muted-foreground',
      icon: CircleMinus,
      label: 'Dismissed',
    },
  };

  const config = statusConfig[state] || statusConfig.commented;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn('gap-1.5', config.bg, config.text)}>
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </Badge>
  );
}
