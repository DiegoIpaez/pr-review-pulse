import { z } from 'zod';

export const normalizeStringSchema = (val: unknown) => (!val ? undefined : val);

export const paginationQueryParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  showAll: z.coerce.boolean().default(false),
  search: z.string().default(''),
});

export type PaginationQueryParams = z.infer<typeof paginationQueryParamsSchema>;
