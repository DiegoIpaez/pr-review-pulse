'use client';

import { Calendar, GitBranch, GitPullRequest, Tag } from 'lucide-react';
import ExternalLink from '@/components/common/links/external-link';
import type { PullRequestSchema } from '@/contracts/types/schema.type';
import { formatDate } from '@/utils/formatters/time.formatter';
import { PrTypeBadge } from '../badges/pr-type-badge';

export function PrMetadata({ pr }: { pr: PullRequestSchema }) {
  return (
    <div className="space-y-3 p-4 bg-card rounded-lg border">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <GitPullRequest className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs">
            <ExternalLink href={pr?.url}>
              {pr?.title ?? 'Pull Request'}
            </ExternalLink>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <PrTypeBadge type={pr?.type} />
        </div>
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-mono">{pr?.branch}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {formatDate(pr?.created_at)}
          </span>
        </div>
      </div>
      <div className="pt-2 border-t">
        <p className="text-xs text-muted-foreground">Repository</p>
        <div className="text-sm font-medium">
          <ExternalLink href={pr?.repository?.url}>
            {pr?.repository?.name}
          </ExternalLink>
        </div>
      </div>
      <div className="pt-2 border-t">
        <p className="text-xs text-muted-foreground">Created by</p>
        <div className="text-sm font-medium">
          <ExternalLink href={pr?.creator?.url}>
            {pr?.creator?.username}
          </ExternalLink>
        </div>
      </div>
      <div className="pt-2 border-t">
        <p className="text-xs text-muted-foreground">Merged by</p>
        <div className="text-sm font-medium">
          <ExternalLink href={pr?.merged_by?.url}>
            {pr?.merged_by?.username || '-'}
          </ExternalLink>
        </div>
      </div>
    </div>
  );
}
