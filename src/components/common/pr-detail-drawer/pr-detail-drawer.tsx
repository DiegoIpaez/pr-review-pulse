'use client';

import { Eye } from 'lucide-react';
import { MarkdownViewer } from '@/components/common/markdown-viewer';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import type { PullRequestSchema } from '@/contracts/types/schema.type';
import { PrStateColumn } from '../columns/pr-state-column';
import { PrMetadata } from './pr-metadata';
import { PrReviewCard } from './pr-review-card';

type PrDetailDrawerProps = {
  pr: PullRequestSchema | null;
  onClose: () => void;
};

export default function PrDetailDrawer({ pr, onClose }: PrDetailDrawerProps) {
  const isOpen = Boolean(pr);
  const reviews = pr?.reviews || [];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:w-[600px] md:w-[700px] lg:w-[800px] sm:max-w-[50vw] overflow-y-auto"
      >
        {!pr ? (
          <div className="p-2">No data</div>
        ) : (
          <div className="space-y-6">
            <SheetHeader>
              <SheetTitle className="text-xl gap-2 flex items-center">
                <span>
                  {pr?.title ?? 'Pull Request'}{' '}
                  <span className="text-gray-400">#{pr.number}</span>
                </span>
                <PrStateColumn state={pr.state} />
              </SheetTitle>
            </SheetHeader>
            {pr?.body && (
              <SheetDescription asChild className="px-4">
                <div>
                  <MarkdownViewer content={pr.body} />
                </div>
              </SheetDescription>
            )}
            <div className="px-4 pb-4 space-y-6">
              <PrMetadata pr={pr} />
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Reviews ({reviews.length})
                  </h3>
                </div>
                {reviews.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed rounded-lg">
                    <Eye className="h-10 w-10 mx-auto mb-2 text-muted-foreground opacity-50" />
                    <p className="text-sm text-muted-foreground">
                      No reviews yet for this pull request
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reviews.map((review, index) => (
                      <PrReviewCard
                        key={review.id}
                        review={review}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
