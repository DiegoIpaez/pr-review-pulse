'use client';

import ExternalLink from '@/components/common/links/external-link';
import { MarkdownViewer } from '@/components/common/markdown-viewer';
import { Separator } from '@/components/ui/separator';
import type { PrReviewSchema } from '@/contracts/types/schema.type';
import { formatDate } from '@/utils/formatters/time.formatter';
import { PrReviewCardLayout } from './pr-review-card-layout';

export function PrReviewCard({
  review,
  index,
}: {
  review: PrReviewSchema;
  index: number;
}) {
  return (
    <PrReviewCardLayout state={review.state}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <ExternalLink href={review.url}>Review #{index + 1}</ExternalLink>
            <span>/</span>
            <ExternalLink href={review.reviewer.url}>
              {review.reviewer.username}
            </ExternalLink>
          </div>
        </div>
        {review.submitted_at && (
          <p className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDate(review.submitted_at)}
          </p>
        )}
      </div>
      {review.body?.trim() && (
        <>
          <Separator />
          <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            <MarkdownViewer content={review.body} collapsedHeight="5rem" />
          </div>
        </>
      )}
    </PrReviewCardLayout>
  );
}
