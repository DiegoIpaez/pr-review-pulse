import { type NextRequest, NextResponse } from 'next/server';
import { pathParamsSchema } from '@/contracts/schemas/path-params.schema';
import type { RouteParams } from '@/contracts/types';
import { requiresAdmin } from '@/middlewares/session.middleware';
import {
  type ApiError,
  apiErrorHandler,
} from '@/utils/handlers/api-error.handler';
import { getDailyReportById } from '../daily-reports.service';

/**
 * @swagger
 * /api/daily-reports/{id}:
 *   get:
 *     summary: Get a specific daily report by ID
 *     tags: [Daily Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Daily report ID
 *     responses:
 *       200:
 *         description: Daily report details
 *       403:
 *         description: Forbidden - Not authorized to view this report
 *       404:
 *         description: Daily report not found
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    requiresAdmin(request.headers);
    const { id } = pathParamsSchema.parse(await params);

    const report = await getDailyReportById(id);
    if (!report) {
      throw { status: 404, message: 'Daily report not found' };
    }

    return NextResponse.json(report);
  } catch (error) {
    return apiErrorHandler({ error: error as ApiError, request });
  }
}
