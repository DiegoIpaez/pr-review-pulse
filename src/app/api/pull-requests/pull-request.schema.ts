import { z } from 'zod';
import { PullRequestType, PullRequestState } from '@/generated/prisma/client';
import { paginationSchema } from '@/contracts/schemas/pagination.schema';

const PR_TYPES = Object.values(PullRequestType);
const PR_STATES = Object.values(PullRequestState);

export const prFilterSchema = paginationSchema.merge(
  z.object({
    type: z.enum(PR_TYPES).optional(),
    state: z.enum(PR_STATES).optional(),
  })
);

export type PullRequestTypeFilter = z.infer<typeof prFilterSchema>;
