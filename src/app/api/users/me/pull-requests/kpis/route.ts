import { NextResponse, NextRequest } from 'next/server';
import { apiErrorHandler, ApiError } from '@/utils/handlers/api-error.handler';
import { getKpis } from '@/app/api/pull-requests/pull-request.service';
import { getSessionFromHeaders } from '@/middlewares/session.middleware';

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
 *                 noReviews:
 *                   type: integer
 *                   description: Number of open PRs with no reviews
 *                 approvedPendingMerge:
 *                   type: integer
 *                   description: Number of approved PRs pending merge
 *       500:
 *         $ref: '#/components/responses/ErrorResponse'
 */
export async function GET(request: NextRequest) {
  try {
    const { uid } = getSessionFromHeaders(request.headers);
    const data = await getKpis(uid);
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorHandler({ error: error as ApiError, request });
  }
}
