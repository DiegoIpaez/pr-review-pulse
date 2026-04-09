import { NextResponse, NextRequest } from 'next/server';
import { apiErrorHandler, ApiError } from '@/utils/handlers/api-error.handler';
import { getKpis } from './kpi.service';
import { requiresAdmin } from '@/middlewares/session.middleware';
import { prMetricQueryParamsSchema } from '@/contracts/schemas/pull-request.schema';
import { parseQueryParams } from '@/utils/query-params.util';

/**
 * @swagger
 * /api/pull-requests/kpis:
 *   get:
 *     tags:
 *       - Pull Requests
 *     summary: Get PR KPIs (all users)
 *     description: Returns KPI metrics for all pull requests
 *     responses:
 *       200:
 *         description: Successful response with KPIs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 open:
 *                   type: integer
 *                   description: Number of open PRs
 *                 no_reviews:
 *                   type: integer
 *                   description: Number of open PRs with no reviews
 *                 approved_pending_merge:
 *                   type: integer
 *                   description: Number of approved PRs pending merge
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
    const data = await getKpis(queryParams);
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorHandler({ error: error as ApiError, request });
  }
}
