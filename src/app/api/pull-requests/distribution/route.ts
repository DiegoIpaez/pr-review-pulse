import { NextResponse, NextRequest } from 'next/server';
import { apiErrorHandler, ApiError } from '@/utils/handlers/api-error.handler';
import { getDistribution } from './distribution.service';
import { distributionFilterSchema } from './distribution.schema';
import { paginationFormatter } from '@/utils/formatters/pagination.formatter';
import { requiresAdmin } from '@/middlewares/session.middleware';

/**
 * @swagger
 * /api/pull-requests/distribution:
 *   get:
 *     tags:
 *       - Pull Requests
 *     summary: Get pull request type distribution
 *     description: Returns the distribution of pull requests grouped by type with optional filtering
 *     parameters:
 *       - in: query
 *         name: uid
 *         schema:
 *           type: integer
 *         description: Filter by user ID (creator)
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by start date (ISO 8601)
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by end date (ISO 8601)
 *     responses:
 *       200:
 *         description: Successful response with PR type distribution
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum:
 *                       - feature
 *                       - fix
 *                       - hotfix
 *                       - refactor
 *                       - docs
 *                       - test
 *                       - release
 *                       - chore
 *                       - no_ticket
 *                   count:
 *                     type: integer
 *                   percentage:
 *                     type: number
 *       400:
 *         $ref: '#/components/responses/ErrorResponse'
 *       500:
 *         $ref: '#/components/responses/ErrorResponse'
 */
export async function GET(request: NextRequest) {
  try {
    requiresAdmin(request.headers);

    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const filters = distributionFilterSchema.parse(queryParams);
    const data = await getDistribution(filters);

    const response = paginationFormatter({ data });
    return NextResponse.json(response);
  } catch (error) {
    return apiErrorHandler({ error: error as ApiError, request });
  }
}
