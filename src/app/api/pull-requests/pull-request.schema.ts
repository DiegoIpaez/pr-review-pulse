import { z } from 'zod';
import { PullRequestType, PullRequestState } from '@/generated/prisma/client';
import {
  normalizeStringSchema as preprocess,
  paginationSchema,
} from '@/contracts/schemas/pagination.schema';

const PR_TYPES = Object.values(PullRequestType);
const PR_STATES = Object.values(PullRequestState);

export const prFilterSchema = paginationSchema.merge(
  z.object({
    type: z.preprocess(preprocess, z.enum(PR_TYPES).optional()),
    state: z.preprocess(preprocess, z.enum(PR_STATES).optional()),
    uid: z.number().int().optional(),
  })
);
export type PullRequestTypeFilter = z.infer<typeof prFilterSchema>;

export const prMetricSchema = z.object({
  uid: z.number().int().optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
});

export type PullRequestMetricFilter = z.infer<typeof prMetricSchema>;
