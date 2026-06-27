import { endOfDay, startOfDay, subDays } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import type {
  DailyReportPr,
  DailyReportResponse,
  DailyReportReview,
} from '@/contracts/types/report.type';
import {
  type Label,
  Prisma,
  type PullRequest,
  type PullRequestLabel,
  type PullRequestReview,
  type Repository,
} from '@/generated/prisma/client';
import prismaClient from '@/lib/clients/prisma-client';
import logger from '@/lib/logger';
import { paginationFormatter } from '@/utils/formatters/pagination.formatter';

const TIMEZONE = 'America/Argentina/Buenos_Aires';

type FullPullRequest = PullRequest & {
  repository: Pick<Repository, 'id' | 'name' | 'url'>;
  labels: (PullRequestLabel & { label: Label })[];
};

type FullReview = PullRequestReview & {
  pull_request: FullPullRequest;
};

// Helper to normalize PR data into consistent shape
function normalizePrToResponse(
  pr:
    | FullPullRequest
    | {
        id: number;
        title: string | null;
        url: string | null;
        state: string;
        repository: Pick<Repository, 'name' | 'url'>;
        labels: { name: string }[];
      }
): DailyReportPr {
  const labels =
    'labels' in pr && Array.isArray(pr.labels)
      ? pr.labels.map((l) => ({
          label: {
            name: 'label' in l ? l.label.name : (l as { name: string }).name,
          },
        }))
      : [];

  return {
    id: pr.id,
    title: pr.title,
    url: pr.url,
    state: pr.state,
    repository: { name: pr.repository.name, url: pr.repository.url },
    labels,
  };
}

// Helper to normalize review data into consistent shape
function normalizeReviewToResponse(
  review:
    | FullReview
    | {
        id: number;
        url: string | null;
        state: string;
        pr_title: string | null;
        repository: Pick<Repository, 'name' | 'url'>;
      }
): DailyReportReview {
  if ('pull_request' in review) {
    return {
      id: review.id,
      url: review.url,
      state: review.state,
      pull_request: {
        title: review.pull_request.title,
        repository: {
          name: review.pull_request.repository.name,
          url: review.pull_request.repository.url,
        },
      },
    };
  }

  return {
    id: review.id,
    url: review.url,
    state: review.state,
    pull_request: {
      title: review.pr_title,
      repository: { name: review.repository.name, url: review.repository.url },
    },
  };
}

/**
 * Get daily report for a specific user and date
 * First tries to load from snapshot, falls back to on-the-fly calculation
 */
export async function getUserDailyReport(
  userId: number,
  dateStr?: string
): Promise<DailyReportResponse> {
  const date = dateStr ? new Date(dateStr) : new Date();
  const zonedDate = toZonedTime(date, TIMEZONE);
  const reportDate = startOfDay(zonedDate);

  // 1. Check for snapshot
  const snapshot = await prismaClient.dailyReport.findUnique({
    where: {
      user_id_date: {
        user_id: userId,
        date: reportDate,
      },
    },
    include: {
      pull_requests: {
        include: {
          repository: { select: { name: true, url: true } },
          pull_request: { select: { url: true } },
        },
      },
      pull_requests_reviews: {
        include: {
          repository: { select: { name: true, url: true } },
          pull_request_review: { select: { url: true } },
        },
      },
    },
  });

  if (snapshot) {
    return {
      createdPrs: snapshot.pull_requests
        .filter((pr) => pr.created)
        .map((pr) =>
          normalizePrToResponse({
            id: pr.id,
            title: pr.title,
            url: pr.pull_request.url,
            state: pr.state,
            repository: pr.repository,
            labels: ((pr.labels as string[]) || []).map((name) => ({ name })),
          })
        ),
      mergedPrs: snapshot.pull_requests
        .filter((pr) => pr.merged)
        .map((pr) =>
          normalizePrToResponse({
            id: pr.id,
            title: pr.title,
            url: pr.pull_request.url,
            state: pr.state,
            repository: pr.repository,
            labels: [],
          })
        ),
      reviews: snapshot.pull_requests_reviews.map((review) =>
        normalizeReviewToResponse({
          id: review.id,
          url: review.pull_request_review.url,
          state: review.state,
          pr_title: review.pr_title,
          repository: review.repository,
        })
      ),
    };
  }

  // 2. Fallback to on-the-fly calculation
  const start = fromZonedTime(startOfDay(zonedDate), TIMEZONE);
  const end = fromZonedTime(endOfDay(zonedDate), TIMEZONE);

  const [createdPrs, reviews, mergedPrs] = await Promise.all([
    prismaClient.pullRequest.findMany({
      where: {
        creator_id: userId,
        created_at: { gte: start, lte: end },
      },
      include: {
        repository: { select: { id: true, name: true, url: true } },
        labels: { include: { label: true } },
      },
      orderBy: { created_at: Prisma.SortOrder.desc },
    }) as Promise<FullPullRequest[]>,
    prismaClient.pullRequestReview.findMany({
      where: {
        reviewer_id: userId,
        submitted_at: { gte: start, lte: end },
      },
      include: {
        pull_request: {
          include: {
            repository: { select: { id: true, name: true, url: true } },
            labels: { include: { label: true } },
          },
        },
      },
      orderBy: { submitted_at: Prisma.SortOrder.desc },
    }) as Promise<FullReview[]>,
    prismaClient.pullRequest.findMany({
      where: {
        merged_by_id: userId,
        merged_at: { gte: start, lte: end },
      },
      include: {
        repository: { select: { id: true, name: true, url: true } },
        labels: { include: { label: true } },
      },
      orderBy: { merged_at: Prisma.SortOrder.desc },
    }) as Promise<FullPullRequest[]>,
  ]);

  return {
    createdPrs: createdPrs.map(normalizePrToResponse),
    reviews: reviews.map(normalizeReviewToResponse),
    mergedPrs: mergedPrs.map(normalizePrToResponse),
  };
}

/**
 * Get all daily reports with pagination and filters (admin only)
 */
export async function getAllDailyReports(params: {
  date?: string;
  userId?: number;
  page: number;
  limit: number;
}) {
  const { date, userId, page, limit } = params;

  const where: Prisma.DailyReportWhereInput = {};

  if (date) {
    const zonedDate = toZonedTime(new Date(date), TIMEZONE);
    where.date = startOfDay(zonedDate);
  }

  if (userId) {
    where.user_id = userId;
  }

  const [rawData, totalRecords] = await Promise.all([
    prismaClient.dailyReport.findMany({
      where,
      include: {
        user: { select: { id: true, username: true, avatar_url: true } },
        pull_requests: {
          include: {
            repository: { select: { name: true, url: true } },
            pull_request: { select: { url: true } },
          },
        },
        pull_requests_reviews: {
          include: {
            repository: { select: { name: true, url: true } },
            pull_request_review: { select: { url: true } },
          },
        },
      },
      orderBy: { date: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prismaClient.dailyReport.count({ where }),
  ]);

  const data = rawData.map((report) => ({
    id: report.id,
    date: report.date,
    user: report.user,
    summary: {
      createdPrs: report.pull_requests
        .filter((pr) => pr.created)
        .map((pr) =>
          normalizePrToResponse({
            id: pr.id,
            title: pr.title,
            url: pr.pull_request.url,
            state: pr.state,
            repository: pr.repository,
            labels: ((pr.labels as string[]) || []).map((name) => ({ name })),
          })
        ),
      mergedPrs: report.pull_requests
        .filter((pr) => pr.merged)
        .map((pr) =>
          normalizePrToResponse({
            id: pr.id,
            title: pr.title,
            url: pr.pull_request.url,
            state: pr.state,
            repository: pr.repository,
            labels: [],
          })
        ),
      reviews: report.pull_requests_reviews.map((review) =>
        normalizeReviewToResponse({
          id: review.id,
          url: review.pull_request_review.url,
          state: review.state,
          pr_title: review.pr_title,
          repository: review.repository,
        })
      ),
    },
  }));

  return paginationFormatter({ data, page, limit, totalRecords });
}

/**
 * Get paginated list of daily reports for a specific user
 */
export async function getMyDailyReportsList(
  userId: number,
  params: { date?: string; page: number; limit: number }
) {
  const { date, page, limit } = params;

  const where: Prisma.DailyReportWhereInput = {
    user_id: userId,
  };

  if (date) {
    const zonedDate = toZonedTime(new Date(date), TIMEZONE);
    where.date = startOfDay(zonedDate);
  }

  const [rawData, totalRecords] = await Promise.all([
    prismaClient.dailyReport.findMany({
      where,
      include: {
        user: { select: { id: true, username: true, avatar_url: true } },
        pull_requests: {
          include: {
            repository: { select: { name: true, url: true } },
            pull_request: { select: { url: true } },
          },
        },
        pull_requests_reviews: {
          include: {
            repository: { select: { name: true, url: true } },
            pull_request_review: { select: { url: true } },
          },
        },
      },
      orderBy: { date: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prismaClient.dailyReport.count({ where }),
  ]);

  const data = rawData.map((report) => ({
    id: report.id,
    date: report.date,
    user: report.user,
    summary: {
      createdPrs: report.pull_requests
        .filter((pr) => pr.created)
        .map((pr) =>
          normalizePrToResponse({
            id: pr.id,
            title: pr.title,
            url: pr.pull_request.url,
            state: pr.state,
            repository: pr.repository,
            labels: ((pr.labels as string[]) || []).map((name) => ({ name })),
          })
        ),
      mergedPrs: report.pull_requests
        .filter((pr) => pr.merged)
        .map((pr) =>
          normalizePrToResponse({
            id: pr.id,
            title: pr.title,
            url: pr.pull_request.url,
            state: pr.state,
            repository: pr.repository,
            labels: [],
          })
        ),
      reviews: report.pull_requests_reviews.map((review) =>
        normalizeReviewToResponse({
          id: review.id,
          url: review.pull_request_review.url,
          state: review.state,
          pr_title: review.pr_title,
          repository: review.repository,
        })
      ),
    },
  }));

  return paginationFormatter({ data, page, limit, totalRecords });
}

/**
 * Get a specific daily report by ID
 */
export async function getDailyReportById(reportId: number) {
  const report = await prismaClient.dailyReport.findUnique({
    where: { id: reportId },
    include: {
      user: { select: { id: true, username: true, avatar_url: true } },
      pull_requests: {
        include: {
          repository: { select: { name: true, url: true } },
          pull_request: { select: { url: true } },
        },
      },
      pull_requests_reviews: {
        include: {
          repository: { select: { name: true, url: true } },
          pull_request_review: { select: { url: true } },
        },
      },
    },
  });

  if (!report) {
    return null;
  }

  return {
    id: report.id,
    date: report.date,
    user: report.user,
    summary: {
      createdPrs: report.pull_requests
        .filter((pr) => pr.created)
        .map((pr) =>
          normalizePrToResponse({
            id: pr.id,
            title: pr.title,
            url: pr.pull_request.url,
            state: pr.state,
            repository: pr.repository,
            labels: ((pr.labels as string[]) || []).map((name) => ({ name })),
          })
        ),
      mergedPrs: report.pull_requests
        .filter((pr) => pr.merged)
        .map((pr) =>
          normalizePrToResponse({
            id: pr.id,
            title: pr.title,
            url: pr.pull_request.url,
            state: pr.state,
            repository: pr.repository,
            labels: [],
          })
        ),
      reviews: report.pull_requests_reviews.map((review) =>
        normalizeReviewToResponse({
          id: review.id,
          url: review.pull_request_review.url,
          state: review.state,
          pr_title: review.pr_title,
          repository: review.repository,
        })
      ),
    },
  };
}

export async function upsertDailyReport(userId: number, date: Date) {
  // 1. Get the range for the Argentinian day in UTC
  const zonedDate = toZonedTime(date, TIMEZONE);
  const start = fromZonedTime(startOfDay(zonedDate), TIMEZONE);
  const end = fromZonedTime(endOfDay(zonedDate), TIMEZONE);

  logger.info(
    `Processing daily report for user ${userId} on date ${date.toISOString().split('T')[0]} (Range: ${start.toISOString()} - ${end.toISOString()})`
  );

  // 2. Fetch all activity in that range
  const [createdPrs, reviews, mergedPrs] = await Promise.all([
    prismaClient.pullRequest.findMany({
      where: {
        creator_id: userId,
        created_at: { gte: start, lte: end },
      },
      include: {
        repository: { select: { id: true, name: true, url: true } },
        labels: { include: { label: true } },
      },
    }) as Promise<FullPullRequest[]>,
    prismaClient.pullRequestReview.findMany({
      where: {
        reviewer_id: userId,
        submitted_at: { gte: start, lte: end },
      },
      include: {
        pull_request: {
          include: {
            repository: { select: { id: true, name: true, url: true } },
            labels: { include: { label: true } },
          },
        },
      },
    }) as Promise<FullReview[]>,
    prismaClient.pullRequest.findMany({
      where: {
        merged_by_id: userId,
        merged_at: { gte: start, lte: end },
      },
      include: {
        repository: { select: { id: true, name: true, url: true } },
        labels: { include: { label: true } },
      },
    }) as Promise<FullPullRequest[]>,
  ]);

  if (
    createdPrs.length === 0 &&
    reviews.length === 0 &&
    mergedPrs.length === 0
  ) {
    logger.debug(
      `No activity found for user ${userId} on ${date.toISOString().split('T')[0]}`
    );
    return null;
  }

  // 3. Upsert the DailyReport record
  const dailyReport = await prismaClient.dailyReport.upsert({
    where: {
      user_id_date: {
        user_id: userId,
        date: startOfDay(zonedDate),
      },
    },
    create: {
      user_id: userId,
      date: startOfDay(zonedDate),
      created_at: new Date(),
    },
    update: {
      updated_at: new Date(),
    },
  });

  // 4. Sync PR Details
  // We combine created and merged PRs into a single list of unique PRs for this report
  const prMap = new Map<
    number,
    { pr: FullPullRequest; created: boolean; merged: boolean }
  >();

  for (const pr of createdPrs) {
    prMap.set(pr.id, { pr, created: true, merged: false });
  }

  for (const pr of mergedPrs) {
    const existing = prMap.get(pr.id);
    if (existing) {
      existing.merged = true;
    } else {
      prMap.set(pr.id, { pr, created: false, merged: true });
    }
  }

  await prismaClient.dailyReportPrDetail.deleteMany({
    where: { daily_report_id: dailyReport.id },
  });

  if (prMap.size > 0) {
    await prismaClient.dailyReportPrDetail.createMany({
      data: Array.from(prMap.values()).map(({ pr, created, merged }) => ({
        daily_report_id: dailyReport.id,
        pull_request_id: pr.id,
        repository_id: pr.repository_id,
        title: pr.title,
        state: pr.state,
        labels: pr.labels.map((l) => l.label.name) as Prisma.InputJsonValue,
        created,
        merged,
        created_at: new Date(),
      })),
    });
  }

  // 5. Sync Review Details
  await prismaClient.dailyReportReviewDetail.deleteMany({
    where: { daily_report_id: dailyReport.id },
  });

  if (reviews.length > 0) {
    await prismaClient.dailyReportReviewDetail.createMany({
      data: reviews.map((review) => ({
        daily_report_id: dailyReport.id,
        review_id: review.id,
        pull_request_id: review.pull_request_id,
        repository_id: review.pull_request.repository_id,
        pr_title: review.pull_request.title,
        state: review.state,
        labels: review.pull_request.labels.map(
          (l) => l.label.name
        ) as Prisma.InputJsonValue,
        created_at: new Date(),
      })),
    });
  }

  return dailyReport;
}

export async function processAllDailyReports(
  date: Date = subDays(new Date(), 1)
) {
  const users = await prismaClient.user.findMany({
    where: { access_status: 'active' },
    select: { id: true },
  });

  logger.info(
    `Starting daily report processing for ${users.length} users on ${date.toISOString().split('T')[0]}`
  );

  let successCount = 0;
  for (const user of users) {
    try {
      await upsertDailyReport(user.id, date);
      successCount++;
    } catch (error) {
      logger.error(
        `Failed to process daily report for user ${user.id}:`,
        error
      );
    }
  }

  logger.info(
    `Completed daily report processing. Successfully processed ${successCount}/${users.length} users.`
  );
}
