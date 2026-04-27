import { z as zod } from 'zod';
import { GitHubPullRequestState, GitHubReviewState } from '../types/index';

const userSchema = zod.object({
  id: zod.number().int().positive(),
  login: zod.string().min(1),
  avatar_url: zod.string().url().nullable(),
  html_url: zod.string().url().nullable(),
});

export const pullRequestReviewWebhookSchema = zod.object({
  review: zod.object({
    id: zod.number().int().positive(),
    state: zod.enum(GitHubReviewState),
    body: zod.string().nullable(),
    submitted_at: zod.string().datetime(),
    user: userSchema,
    html_url: zod.string().url().nullable(),
  }),
  pull_request: zod.object({
    id: zod.number().int().positive(),
    number: zod.number().int(),
    created_at: zod.string().datetime(),
    user: userSchema,
    html_url: zod.string().url().nullable(),
    state: zod.enum(GitHubPullRequestState),
    title: zod.string().nullable(),
    body: zod.string().nullable(),
    head: zod.object({
      ref: zod.string().min(1),
    }),
  }),
  repository: zod.object({
    id: zod.number().int().positive(),
    name: zod.string().min(1),
    html_url: zod.string().url().nullable(),
    description: zod.string().nullable(),
    fork: zod.boolean(),
    private: zod.boolean(),
    created_at: zod.string().datetime(),
    updated_at: zod.string().datetime(),
    pushed_at: zod.string().datetime().nullable(),
    owner: userSchema,
  }),
});

export type PullRequestReviewWebhookPayload = zod.infer<
  typeof pullRequestReviewWebhookSchema
>;
