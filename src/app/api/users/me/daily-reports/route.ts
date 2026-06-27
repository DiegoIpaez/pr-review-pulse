import { type NextRequest, NextResponse } from 'next/server';
import {
  getMyDailyReportsList,
  getUserDailyReport,
} from '@/app/api/daily-reports/daily-reports.service';
import { myDailyReportsListQuerySchema } from '@/contracts/schemas/daily-report.schema';
import { getSessionFromHeaders } from '@/middlewares/session.middleware';
import {
  type ApiError,
  apiErrorHandler,
} from '@/utils/handlers/api-error.handler';
import { parseQueryParams } from '@/utils/query-params.util';

/**
 * @swagger
 * /api/users/me/daily-reports:
 *   get:
 *     summary: Get daily reports for the authenticated user
 *     tags: [Users, Daily Reports]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by date (YYYY-MM-DD)
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
 *         description: User's daily reports (paginated list or single report)
 *       401:
 *         description: Unauthorized
 */
export async function GET(request: NextRequest) {
  try {
    const session = getSessionFromHeaders(request.headers);
    const params = parseQueryParams(
      request.nextUrl.searchParams,
      myDailyReportsListQuerySchema
    );

    // If page/limit provided, return paginated list
    if (params.page && params.limit) {
      const reports = await getMyDailyReportsList(session.uid, params);
      return NextResponse.json(reports);
    }

    // Otherwise return single report for date (backwards compatible)
    const report = await getUserDailyReport(session.uid, params.date);
    return NextResponse.json(report);
  } catch (error) {
    return apiErrorHandler({ error: error as ApiError, request });
  }
}
