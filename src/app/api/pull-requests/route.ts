import { NextResponse, NextRequest } from 'next/server';
import { paginationUrlParser } from '@/contracts/parsers/paginationUrl.parser';
import { apiErrorHandler, ApiError } from '@/utils/handlers/apiError.handler';
import { getPullRequest } from './pullRequest.service';

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
    const queryParams = paginationUrlParser(request.nextUrl.searchParams);
    const data = await getPullRequest(queryParams);
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorHandler({ error: error as ApiError, request });
  }
}
