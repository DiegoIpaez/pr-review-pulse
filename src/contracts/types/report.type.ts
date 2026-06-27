import type { DailyReport, Repository } from '@/generated/prisma/client';

// Base repository info included in PR responses
type RepositoryInfo = Pick<Repository, 'name' | 'url'>;

// Label info - simplified since snapshot only stores name
type LabelInfo = { label: { name: string } };

// PR detail for daily report (works for both snapshot and fallback)
export type DailyReportPr = {
  id: number;
  title: string | null;
  url: string | null;
  state: string;
  repository: RepositoryInfo;
  labels: LabelInfo[];
};

// Review detail for daily report
export type DailyReportReview = {
  id: number;
  url: string | null;
  state: string;
  pull_request: {
    title: string | null;
    repository: RepositoryInfo;
  };
};

// Response from getUserDailyReport
export type DailyReportResponse = {
  createdPrs: DailyReportPr[];
  reviews: DailyReportReview[];
  mergedPrs: DailyReportPr[];
};

// Full daily report with metadata (for list endpoints)
export type DailyReportWithDetails = DailyReport & {
  user: { id: number; username: string; avatar_url: string | null };
  summary: DailyReportResponse;
};

// Query params for daily reports list
export type DailyReportQueryParams = {
  date?: string;
  userId?: number;
  page?: number;
  limit?: number;
};
