import { NextResponse, NextRequest } from 'next/server';
import { paginationQueryParamsSchema } from '@/contracts/schemas/pagination.schema';
import { apiErrorHandler, ApiError } from '@/utils/handlers/api-error.handler';
import { getAllUsers } from './user.service';
import { requiresAdmin } from '@/middlewares/session.middleware';
import { parseQueryParams } from '@/utils/query-params.util';

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get paginated list of users
 *     description: Retrieves a paginated list of users with optional search functionality
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
 *         description: Show all users without pagination
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for username
 *     responses:
 *       200:
 *         description: Successful response with paginated users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
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
    const data = await getAllUsers(queryParams);
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorHandler({ error: error as ApiError, request });
  }
}
