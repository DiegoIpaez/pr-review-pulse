import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  search: z.string().default(''),
  showAll: z.coerce.boolean().default(false),
});
