import { NextRequest, NextResponse } from 'next/server';
import type { RouteParams } from '@/contracts/types';
import { apiErrorHandler, ApiError } from '@/utils/handlers/apiError.handler';
import { getUserById } from '../user.service';

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by ID
 *     description: Retrieves a single user using its unique identifier.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique user identifier
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         $ref: '#/components/responses/ErrorResponse'
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await getUserById(parseInt(id));
    return NextResponse.json(user);
  } catch (error) {
    return apiErrorHandler({ error: error as ApiError, request });
  }
}
