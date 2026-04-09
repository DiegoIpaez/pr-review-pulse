import { z } from 'zod';
import { PullRequestType, PullRequestState } from '@/generated/prisma/client';
import {
  normalizeStringSchema as preprocess,
  paginationQueryParamsSchema,
} from '@/contracts/schemas/pagination.schema';

const PR_TYPES = Object.values(PullRequestType);
const PR_STATES = Object.values(PullRequestState);

export const prMetricQueryParamsSchema = z.object({
  uid: z.coerce.number().int().optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
});

export const prQueryParamsSchema = paginationQueryParamsSchema.extend({
  type: z.preprocess(preprocess, z.enum(PR_TYPES).optional()),
  state: z.preprocess(preprocess, z.enum(PR_STATES).optional()),
  uid: z.number().int().optional(),
});

export type PullRequestQueryParams = z.infer<typeof prQueryParamsSchema>;

export type PullRequestMetricQueryParams = z.infer<
  typeof prMetricQueryParamsSchema
>;
