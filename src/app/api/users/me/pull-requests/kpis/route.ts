import { type NextRequest, NextResponse } from 'next/server';
import { getKpis } from '@/app/api/pull-requests/kpis/kpi.service';
import { prMetricQueryParamsSchema } from '@/contracts/schemas/pull-request.schema';
import { getSessionFromHeaders } from '@/middlewares/session.middleware';
import {
  type ApiError,
  apiErrorHandler,
} from '@/utils/handlers/api-error.handler';
import { parseQueryParams } from '@/utils/query-params.util';

/**
 * @swagger
 * /api/users/me/pull-requests/kpis:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user's PR KPIs
 *     description: Returns KPI metrics for authenticated user's pull requests
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
    const { uid } = getSessionFromHeaders(request.headers);

    const queryParams = parseQueryParams(
      request.nextUrl.searchParams,
      prMetricQueryParamsSchema
    );
    const data = await getKpis({ ...queryParams, uid });
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorHandler({ error: error as ApiError, request });
  }
}
