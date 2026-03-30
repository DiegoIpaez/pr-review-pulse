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
  })
);
