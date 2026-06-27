'use client';

import { format } from 'date-fns';
import {
  Check,
  Copy,
  ExternalLink,
  Eye,
  GitMerge,
  GitPullRequest,
} from 'lucide-react';
import { useState } from 'react';
import { PrLabelBadge } from '@/components/common/badges/pr-label-badge';
import { PrStateBadge } from '@/components/common/badges/pr-state-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import type { DailyReportWithDetails } from '@/contracts/types/report.type';
import type { PullRequestState } from '@/generated/prisma/enums';

type ReportDetailDrawerProps = {
  report: DailyReportWithDetails | null;
  onClose: () => void;
};

function formatReportAsText(report: DailyReportWithDetails): string {
  const dateStr = format(new Date(report.date), 'dd/MM/yyyy');
  const { createdPrs, reviews, mergedPrs } = report.summary;

  const hasActivity =
    createdPrs.length > 0 || reviews.length > 0 || mergedPrs.length > 0;

  if (!hasActivity) {
    return `Daily Report ${dateStr}:\nNo hubo actividad este día.`;
  }

  const lines: string[] = [`Daily Report ${dateStr}:`];

  if (createdPrs.length > 0) {
    lines.push('');
    lines.push('PRs Creados:');
    createdPrs.forEach((pr) => {
      lines.push(`  - ${pr.title} (${pr.repository.name}) ${pr.url ?? ''}`);
    });
  }

  if (reviews.length > 0) {
    lines.push('');
    lines.push('Reviews Realizados:');
    reviews.forEach((review) => {
      lines.push(
        `  - ${review.pull_request.title} [${review.state.replace(/_/g, ' ')}] (${review.pull_request.repository.name}) ${review.url ?? ''}`
      );
    });
  }

  if (mergedPrs.length > 0) {
    lines.push('');
    lines.push('PRs Mergeados:');
    mergedPrs.forEach((pr) => {
      lines.push(`  - ${pr.title} (${pr.repository.name}) ${pr.url ?? ''}`);
    });
  }

  return lines.join('\n');
}

export function ReportDetailDrawer({
  report,
  onClose,
}: ReportDetailDrawerProps) {
  const isOpen = Boolean(report);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!report) return;
    const text = formatReportAsText(report);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { createdPrs, reviews, mergedPrs } = report?.summary ?? {
    createdPrs: [],
    reviews: [],
    mergedPrs: [],
  };

  const hasActivity =
    createdPrs.length > 0 || reviews.length > 0 || mergedPrs.length > 0;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:w-[600px] md:w-[700px] lg:w-[800px] sm:max-w-[50vw] overflow-y-auto"
      >
        {!report ? (
          <div className="p-2">No data</div>
        ) : (
          <div className="space-y-6">
            <SheetHeader>
              <SheetTitle className="text-xl flex items-center gap-2">
                Daily Report - {format(new Date(report.date), 'PPP')}
              </SheetTitle>
              <SheetDescription className="flex items-center gap-2">
                <span>by {report.user.username}</span>
              </SheetDescription>
            </SheetHeader>

            <div className="px-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copiar reporte
                  </>
                )}
              </Button>
            </div>

            {!hasActivity ? (
              <div className="px-4 pb-4">
                <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg text-muted-foreground">
                  <Eye className="h-12 w-12 mb-2 opacity-20" />
                  <p className="text-sm">No hubo actividad este día</p>
                </div>
              </div>
            ) : (
              <div className="px-4 pb-4 space-y-6">
                {/* PRs Created */}
                <div>
                  <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                    <GitPullRequest className="h-4 w-4" />
                    PRs Creados ({createdPrs.length})
                  </h3>
                  {createdPrs.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Sin PRs creados
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {createdPrs.map((pr) => (
                        <li
                          key={pr.id}
                          className="flex flex-col gap-2 pb-3 border-b last:border-0 last:pb-0"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <span className="font-medium text-sm truncate">
                                {pr.title}
                              </span>
                              <PrStateBadge
                                state={pr.state as PullRequestState}
                              />
                            </div>
                            <a
                              href={pr.url || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {pr.labels.map((l) => (
                              <PrLabelBadge
                                key={`${pr.id}-${l.label.name}`}
                                name={l.label.name}
                                color={null}
                              />
                            ))}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {pr.repository.name}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Reviews */}
                <div>
                  <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                    <Eye className="h-4 w-4" />
                    Reviews Realizados ({reviews.length})
                  </h3>
                  {reviews.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Sin reviews</p>
                  ) : (
                    <ul className="space-y-3">
                      {reviews.map((review) => (
                        <li
                          key={review.id}
                          className="flex flex-col gap-1 pb-3 border-b last:border-0 last:pb-0"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <span className="text-sm font-medium truncate">
                                {review.pull_request.title}
                              </span>
                              <Badge
                                variant="outline"
                                className="text-[10px] uppercase"
                              >
                                {review.state.replace(/_/g, ' ')}
                              </Badge>
                            </div>
                            <a
                              href={review.url || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {review.pull_request.repository.name}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Merged PRs */}
                <div>
                  <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                    <GitMerge className="h-4 w-4" />
                    PRs Mergeados ({mergedPrs.length})
                  </h3>
                  {mergedPrs.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Sin PRs mergeados
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {mergedPrs.map((pr) => (
                        <li
                          key={pr.id}
                          className="flex flex-col gap-1 pb-3 border-b last:border-0 last:pb-0"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <span className="text-sm font-medium truncate">
                                {pr.title}
                              </span>
                            </div>
                            <a
                              href={pr.url || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {pr.repository.name}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
