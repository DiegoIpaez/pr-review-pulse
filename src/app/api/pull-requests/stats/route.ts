import { NextResponse, NextRequest } from 'next/server';
import { apiErrorHandler, ApiError } from '@/utils/handlers/api-error.handler';
import { getStats } from './stat.service';
import { paginationFormatter } from '@/utils/formatters/pagination.formatter';
import { requiresAdmin } from '@/middlewares/session.middleware';
import { prMetricQueryParamsSchema } from '@/contracts/schemas/pull-request.schema';
import { parseQueryParams } from '@/utils/query-params.util';

/**
 * @swagger
 * /api/pull-requests/stats:
 *   get:
 *     tags:
 *       - Pull Requests
 *     summary: Get PR time series stats (all users)
 *     description: Returns time series data for PRs created vs merged
 *     parameters:
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (ISO format). Defaults to 30 days ago
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (ISO format). Defaults to today
 *     responses:
 *       200:
 *         description: Successful response with time series data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 timeSeries:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                       created:
 *                         type: integer
 *                       merged:
 *                         type: integer
 *       500:
 *         $ref: '#/components/responses/ErrorResponse'
 */
export async function GET(request: NextRequest) {
  try {
    requiresAdmin(request.headers);

    const queryParams = parseQueryParams(
      request.nextUrl.searchParams,
      prMetricQueryParamsSchema
    );
    const data = await getStats(queryParams);
    const response = paginationFormatter({ data });
    return NextResponse.json(response);
  } catch (error) {
    return apiErrorHandler({ error: error as ApiError, request });
  }
}
