import { NextResponse, NextRequest } from 'next/server';
import { apiErrorHandler, ApiError } from '@/utils/handlers/api-error.handler';
import { getKpis } from '../pull-request.service';

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
    const data = await getKpis();
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorHandler({ error: error as ApiError, request });
  }
}
