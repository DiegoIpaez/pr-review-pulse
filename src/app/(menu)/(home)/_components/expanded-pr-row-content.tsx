'use client';
import type { PrReviewSchema } from '@/contracts/types/schema.type';
import { formatDate } from '@/utils/formatters/time.formatter';
import ExternalLink from '@/components/common/links/external-link';

function ReviewCard({ review }: { review: PrReviewSchema }) {
  const isApproved = !!review.approved_at;
  const isSubmitted = !!review.submitted_at;

  const statusLabel = isApproved
    ? 'Aprobado'
    : isSubmitted
      ? 'Revisado'
      : 'Pendiente';

  const statusStyle = isApproved
    ? 'bg-emerald-500/10 text-emerald-600'
    : isSubmitted
      ? 'bg-blue-500/10 text-blue-600'
      : 'bg-muted text-muted-foreground';

  return (
    <div
      key={review?.id}
      className="rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-1">
          <div className="text-sm font-medium">
            <ExternalLink href={review?.url}>Review #{review?.id}</ExternalLink>
          </div>
          <div className="text-xs text-muted-foreground">
            {review?.submitted_at
              ? formatDate(review?.submitted_at)
              : 'Sin fecha de revisión'}
          </div>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyle}`}
        >
          {statusLabel}
        </span>
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
      <div className="text-sm text-muted-foreground leading-relaxed mt-2">
        {review.body?.trim() ? (
          review.body
        ) : (
          <span className="italic text-xs">Sin comentarios</span>
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
      No hay reviews para esta pull request.
    </div>
  ) : (
    <div className="p-2 space-y-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
