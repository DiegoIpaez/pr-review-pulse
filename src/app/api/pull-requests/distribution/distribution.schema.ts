import { z } from 'zod';

export const distributionFilterSchema = z.object({
  uid: z.coerce.number().int().positive().optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
});

export type DistributionFilter = z.infer<typeof distributionFilterSchema>;
