import { type NextRequest, NextResponse } from 'next/server';
import { dailyReportQueryParamsSchema } from '@/contracts/schemas/daily-report.schema';
import { requiresAdmin } from '@/middlewares/session.middleware';
import {
  type ApiError,
  apiErrorHandler,
} from '@/utils/handlers/api-error.handler';
import { parseQueryParams } from '@/utils/query-params.util';
import { getAllDailyReports } from './daily-reports.service';

/**
 * @swagger
 * /api/daily-reports:
 *   get:
 *     summary: List all daily reports (Admin only)
 *     tags: [Daily Reports]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by date (YYYY-MM-DD)
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filter by user ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of daily reports
 *       403:
 *         description: Forbidden - Admin access required
 */
export async function GET(request: NextRequest) {
  try {
    requiresAdmin(request.headers);

    const queryParams = parseQueryParams(
      request.nextUrl.searchParams,
      dailyReportQueryParamsSchema
    );

    const reports = await getAllDailyReports(queryParams);
    return NextResponse.json(reports);
  } catch (error) {
    return apiErrorHandler({ error: error as ApiError, request });
  }
}
