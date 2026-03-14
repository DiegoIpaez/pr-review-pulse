import { z as zod } from 'zod';
import { GitHubReviewState } from '../types/index';

export const pullRequestReviewWebhookSchema = zod.object({
  review: zod.object({
    state: zod.enum(GitHubReviewState),
    body: zod.string().nullable(),
    submitted_at: zod.string().datetime(),
    user: zod.object({
      login: zod.string().min(1),
    }),
  }),

  pull_request: zod.object({
    number: zod.number().int(),
    created_at: zod.string().datetime(),
    user: zod.object({
      login: zod.string().min(1),
    }),
    head: zod.object({
      ref: zod.string().min(1),
    }),
  }),

  repository: zod.object({
    name: zod.string().min(1),
  }),
});

export type PullRequestReviewWebhookPayload = zod.infer<
  typeof pullRequestReviewWebhookSchema
>;
