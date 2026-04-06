'use client';
import { CheckCircle2, Eye, CircleMinus, FileDiff } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { PrReviewSchema } from '@/contracts/types/schema.type';
import { formatDate } from '@/utils/formatters/time.formatter';
import ExternalLink from '@/components/common/links/external-link';

function StatusReviewCard({ state }: { state: PrReviewSchema['state'] }) {
  const statusStyle =
    state === 'approved'
      ? 'bg-emerald-500/10'
      : state === 'changes_requested'
        ? 'bg-red-500/10'
        : state === 'commented'
          ? 'bg-blue-500/10'
          : 'bg-muted';

  const getStatusIcon = () => {
    switch (state) {
      case 'approved':
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case 'changes_requested':
        return <FileDiff className="h-4 w-4 text-red-600" />;
      case 'commented':
        return <Eye className="h-4 w-4 text-blue-600" />;
      case 'dismissed':
        return <CircleMinus className="h-4 w-4 text-gray-500" />;
      default:
        return <Eye className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <span
      className={cn(
        'flex items-center justify-center p-2 rounded-full',
        statusStyle
      )}
    >
      {getStatusIcon()}
    </span>
  );
}

function ReviewCard({
  review,
  index,
}: {
  review: PrReviewSchema;
  index: number;
}) {
  return (
    <div
      key={review?.id}
      className="rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-1">
          <div className="text-sm font-medium">
            <ExternalLink href={review?.url}>Review #{index + 1}</ExternalLink>
          </div>
          <div className="text-xs text-muted-foreground">
            {review?.submitted_at
              ? formatDate(review?.submitted_at)
              : 'No review date'}
          </div>
        </div>
        <StatusReviewCard state={review?.state} />
      </div>
      {review.reviewer && (
        <div className="text-xs text-muted-foreground mb-2">
          Reviewer:{' '}
          <span className="font-medium text-foreground">
            <ExternalLink href={review.reviewer?.url}>
              {review.reviewer?.username}
            </ExternalLink>
          </span>
        </div>
      )}
      <div className="text-sm text-muted-foreground leading-relaxed mt-2 line-clamp-3">
        {review.body?.trim() ? (
          review.body
        ) : (
          <span className="italic text-xs">No comments</span>
        )}
      </div>
    </div>
  );
}

export default function ExpandedPrRowContent({
  reviews,
}: {
  reviews: PrReviewSchema[];
}) {
  return !reviews?.length ? (
    <div className="p-2 text-center text-sm text-muted-foreground">
      No reviews for this pull request.
    </div>
  ) : (
    <div className="p-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
      {reviews.map((review, index) => (
        <ReviewCard key={review.id} review={review} index={index} />
      ))}
    </div>
  );
}
