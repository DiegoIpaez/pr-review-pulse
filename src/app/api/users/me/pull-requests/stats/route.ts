import { NextResponse, NextRequest } from 'next/server';
import { apiErrorHandler, ApiError } from '@/utils/handlers/api-error.handler';
import { getStats } from '@/app/api/pull-requests/stats/stat.service';
import { getSessionFromHeaders } from '@/middlewares/session.middleware';
import { paginationFormatter } from '@/utils/formatters/pagination.formatter';

/**
 * @swagger
 * /api/users/me/pull-requests/stats:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user's PR time series stats
 *     description: Returns time series data for authenticated user's PRs created vs merged
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
    const { searchParams } = request.nextUrl;
    const { uid } = getSessionFromHeaders(request.headers);
    const start_date = searchParams.get('start_date') || undefined;
    const end_date = searchParams.get('end_date') || undefined;

    const data = await getStats({ uid, start_date, end_date });
    const response = paginationFormatter({ data });
    return NextResponse.json(response);
  } catch (error) {
    return apiErrorHandler({ error: error as ApiError, request });
  }
}
