import type {
  Label,
  PullRequest,
  PullRequestLabel,
  PullRequestReview,
  Repository,
  User,
} from '@/generated/prisma/client';

export type PrReviewSchema = PullRequestReview & {
  reviewer: User;
};

export type PullRequestSchema = PullRequest & {
  _count: {
    reviews: number;
  };
  creator?: User;
  merged_by?: User;
  repository?: Repository;
  reviews: PrReviewSchema[];
  labels?: (PullRequestLabel & { label: Label })[];
};
