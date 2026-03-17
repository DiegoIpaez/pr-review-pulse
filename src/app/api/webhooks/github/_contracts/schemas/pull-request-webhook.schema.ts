import { z } from 'zod';
import { GitHubPullRequestAction } from '../types';

const webhookUserSchema = z.object({
  login: z.string(),
  html_url: z.string().url(),
  avatar_url: z.string().url(),
});

const webhookRepoSchema = z.object({
  name: z.string(),
  html_url: z.string().url(),
});

const webhookPRSchema = z.object({
  number: z.number().int().positive(),
  html_url: z.string().url(),
  title: z.string(),
  body: z.string().nullable(),
  state: z.enum(['open', 'closed']),
  merged: z.boolean(),
  merged_at: z.string().nullable(),
  merged_by: webhookUserSchema.nullable(),
  head: z.object({
    ref: z.string(),
  }),
  user: webhookUserSchema,
  commits: z.number().int().nonnegative(),
  additions: z.number().int().nonnegative(),
  deletions: z.number().int().nonnegative(),
  changed_files: z.number().int().nonnegative(),
  created_at: z.string(),
  closed_at: z.string().nullable(),
});

export const pullRequestWebhookSchema = z.object({
  action: z.nativeEnum(GitHubPullRequestAction),
  pull_request: webhookPRSchema,
  repository: webhookRepoSchema,
});

export type PullRequestWebhookPayload = z.infer<
  typeof pullRequestWebhookSchema
>;
