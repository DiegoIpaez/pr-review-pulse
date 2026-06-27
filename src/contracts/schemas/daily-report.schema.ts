import { z } from 'zod';
import { paginationQueryParamsSchema } from './pagination.schema';

export const dailyReportQueryParamsSchema = paginationQueryParamsSchema.extend({
  date: z.string().date().optional(),
  userId: z.coerce.number().int().positive().optional(),
});

export type DailyReportQueryParams = z.infer<
  typeof dailyReportQueryParamsSchema
>;

export const myDailyReportQuerySchema = z.object({
  date: z.string().date().optional(),
});

export type MyDailyReportQueryParams = z.infer<typeof myDailyReportQuerySchema>;

export const myDailyReportsListQuerySchema = paginationQueryParamsSchema.extend(
  {
    date: z.string().date().optional(),
  }
);

export type MyDailyReportsListQueryParams = z.infer<
  typeof myDailyReportsListQuerySchema
>;
