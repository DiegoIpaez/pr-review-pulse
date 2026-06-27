import { z } from 'zod';
import {
  paginationQueryParamsSchema,
  normalizeStringSchema as preprocess,
} from '@/contracts/schemas/pagination.schema';
import { PullRequestState, PullRequestType } from '@/generated/prisma/client';

const PR_TYPES = Object.values(PullRequestType);
const PR_STATES = Object.values(PullRequestState);

export const prMetricQueryParamsSchema = z.object({
  uid: z.coerce.number().int().optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
});

export const prRankingQueryParamsSchema = z.object({
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  limit: z.coerce.number().int().positive().optional(),
});

export const prQueryParamsSchema = paginationQueryParamsSchema.extend({
  type: z.preprocess(preprocess, z.enum(PR_TYPES).optional()),
  state: z.preprocess(preprocess, z.enum(PR_STATES).optional()),
  labelNames: z.string().optional(),
  uid: z.number().int().optional(),
});

export type PullRequestQueryParams = z.infer<typeof prQueryParamsSchema>;

export type PullRequestMetricQueryParams = z.infer<
  typeof prMetricQueryParamsSchema
>;

export type PullRequestRankingQueryParams = z.infer<
  typeof prRankingQueryParamsSchema
>;
