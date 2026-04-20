import { type NextRequest, NextResponse } from 'next/server';
import { requiresAdmin } from '@/middlewares/session.middleware';
import {
  type ApiError,
  apiErrorHandler,
} from '@/utils/handlers/api-error.handler';
import { parseQueryParams } from '@/utils/query-params.util';
import { prQueryParamsSchema } from '../../../contracts/schemas/pull-request.schema';
import { getPullRequest } from './pull-request.service';

/**
 * @swagger
 * /api/pull-requests:
 *   get:
 *     tags:
 *       - Pull Requests
 *     summary: Get paginated list of pull requests
 *     description: Retrieves a paginated list of pull requests with optional search functionality
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: showAll
 *         schema:
 *           type: boolean
 *         description: Show all pull requests without pagination
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for filtering pull requests
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum:
 *             - feature
 *             - fix
 *             - hotfix
 *             - refactor
 *             - docs
 *             - test
 *             - release
 *             - chore
 *             - no_ticket
 *         description: Filter by pull request type
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *           enum:
 *             - open
 *             - closed
 *             - merged
 *         description: Filter by pull request state
 *     responses:
 *       200:
 *         description: Successful response with paginated pull requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                 currentPage:
 *                   type: integer
 *                 recordsPerPage:
 *                   type: integer
 *                 totalRecords:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 hasNextPage:
 *                   type: boolean
 *       500:
 *         $ref: '#/components/responses/ErrorResponse'
 */
export async function GET(request: NextRequest) {
  try {
    requiresAdmin(request.headers);

    const queryParams = parseQueryParams(
      request.nextUrl.searchParams,
      prQueryParamsSchema
    );
    const data = await getPullRequest(queryParams);
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorHandler({ error: error as ApiError, request });
  }
}
