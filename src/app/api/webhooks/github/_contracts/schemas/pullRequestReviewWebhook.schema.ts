import { z as zod } from 'zod';
import { GitHubPullRequestState, GitHubReviewState } from '../types/index';

const userSchema = zod.object({
  login: zod.string().min(1),
  avatar_url: zod.string().url().nullable(),
  html_url: zod.string().url().nullable(),
});

export const pullRequestReviewWebhookSchema = zod.object({
  review: zod.object({
    state: zod.enum(GitHubReviewState),
    body: zod.string().nullable(),
    submitted_at: zod.string().datetime(),
    user: userSchema,
    html_url: zod.string().url().nullable(),
  }),
  pull_request: zod.object({
    number: zod.number().int(),
    created_at: zod.string().datetime(),
    user: userSchema,
    html_url: zod.string().url().nullable(),
    state: zod.enum(GitHubPullRequestState),
    head: zod.object({
      ref: zod.string().min(1),
    }),
  }),
  repository: zod.object({
    name: zod.string().min(1),
    html_url: zod.string().url().nullable(),
  }),
});

export type PullRequestReviewWebhookPayload = zod.infer<
  typeof pullRequestReviewWebhookSchema
>;
