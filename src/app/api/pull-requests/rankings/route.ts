import { type NextRequest, NextResponse } from 'next/server';
import { prRankingQueryParamsSchema } from '@/contracts/schemas/pull-request.schema';
import { requiresAdmin } from '@/middlewares/session.middleware';
import {
  type ApiError,
  apiErrorHandler,
} from '@/utils/handlers/api-error.handler';
import { parseQueryParams } from '@/utils/query-params.util';
import { getRankings } from './ranking.service';

/**
 * @swagger
 * /api/pull-requests/rankings:
 *   get:
 *     tags:
 *       - Pull Requests
 *     summary: Get pull request rankings by type and state
 *     description: >
 *       Returns a leaderboard of pull requests grouped by type and by state.
 *       For each type and each state it provides the total count, the top
 *       author (the user with the most PRs in that group) and the full ranking
 *       of authors ordered by count. Admin only.
 *     parameters:
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by start date (ISO 8601), applied to created_at
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by end date (ISO 8601), applied to created_at
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Max number of authors returned in each ranking
 *     responses:
 *       200:
 *         description: Successful response with PR rankings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 byType:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RankingDimensionItem'
 *                 byState:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RankingDimensionItem'
 *       400:
 *         $ref: '#/components/responses/ErrorResponse'
 *       403:
 *         $ref: '#/components/responses/ErrorResponse'
 *       500:
 *         $ref: '#/components/responses/ErrorResponse'
 * components:
 *   schemas:
 *     RankingAuthor:
 *       type: object
 *       properties:
 *         uid:
 *           type: integer
 *         username:
 *           type: string
 *         avatar_url:
 *           type: string
 *           nullable: true
 *         count:
 *           type: integer
 *     RankingDimensionItem:
 *       type: object
 *       properties:
 *         key:
 *           type: string
 *         count:
 *           type: integer
 *         topAuthor:
 *           nullable: true
 *           $ref: '#/components/schemas/RankingAuthor'
 *         ranking:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RankingAuthor'
 */
export async function GET(request: NextRequest) {
  try {
    requiresAdmin(request.headers);

    const queryParams = parseQueryParams(
      request.nextUrl.searchParams,
      prRankingQueryParamsSchema
    );
    const data = await getRankings(queryParams);

    return NextResponse.json(data);
  } catch (error) {
    return apiErrorHandler({ error: error as ApiError, request });
  }
}
