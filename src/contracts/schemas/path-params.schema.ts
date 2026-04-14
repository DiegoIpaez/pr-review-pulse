import { z } from 'zod';

export const pathParamsSchema = z.object({
  id: z.coerce.number().int().positive({
    message: 'ID must be a positive integer',
  }),
});
