import { type NextRequest, NextResponse } from 'next/server';
import { paginationQueryParamsSchema } from '@/contracts/schemas/pagination.schema';
import { requiresAdmin } from '@/middlewares/session.middleware';
import {
  type ApiError,
  apiErrorHandler,
} from '@/utils/handlers/api-error.handler';
import { parseQueryParams } from '@/utils/query-params.util';
import { getRepositories } from './repository.service';

/**
 * @swagger
 * /api/repositories:
 *   get:
 *     tags:
 *       - Repositories
 *     summary: Get paginated list of repositories
 *     description: Retrieves a paginated list of repositories with optional search functionality
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
 *         description: Show all repositories without pagination
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for filtering repositories
 *     responses:
 *       200:
 *         description: Successful response with paginated repositories
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
      paginationQueryParamsSchema
    );
    const data = await getRepositories(queryParams);
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorHandler({ error: error as ApiError, request });
  }
}
