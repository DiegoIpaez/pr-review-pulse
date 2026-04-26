'use client';

import ExternalLink from '@/components/common/links/external-link';
import { MarkdownViewer } from '@/components/common/markdown-viewer';
import { Separator } from '@/components/ui/separator';
import type { PrReviewSchema } from '@/contracts/types/schema.type';
import { formatDate } from '@/utils/formatters/time.formatter';
import { StatusReviewBadge } from './status-review-badge';

export function PrReviewCard({
  review,
  index,
}: {
  review: PrReviewSchema;
  index: number;
}) {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex gap-2 text-sm font-medium">
                <ExternalLink href={review.url}>
                  Review #{index + 1}
                </ExternalLink>
                <span>/</span>
                <ExternalLink href={review.reviewer.url}>
                  {review.reviewer.username}
                </ExternalLink>
              </div>
              <StatusReviewBadge state={review.state} />
            </div>
            {review.submitted_at && (
              <p className="text-xs text-muted-foreground">
                {formatDate(review.submitted_at)}
              </p>
            )}
          </div>
        </div>
      </div>
      {review.body?.trim() && (
        <>
          <Separator />
          <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            <MarkdownViewer content={review.body} collapsedHeight="5rem" />
          </div>
        </>
      )}
    </div>
  );
}
