import { NextRequest, NextResponse } from 'next/server';
import type { RouteParams } from '@/contracts/types';
import { requiresAdmin } from '@/middlewares/session.middleware';
import { updateUserSchema } from '@/contracts/schemas/user.schema';
import { pathParamsSchema } from '@/contracts/schemas/path-params.schema';
import { apiErrorHandler, ApiError } from '@/utils/handlers/api-error.handler';
import { getUserById, updateUser } from '../user.service';

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
    requiresAdmin(request.headers);

    const { id } = pathParamsSchema.parse(await params);
    const user = await getUserById(id);
    return NextResponse.json(user);
  } catch (error) {
    return apiErrorHandler({ error: error as ApiError, request });
  }
}

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update user
 *     description: Updates user role and/or access status.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique user identifier
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *               access_status:
 *                 type: string
 *                 enum: [pending, active, blocked]
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/ErrorResponse'
 *       500:
 *         $ref: '#/components/responses/ErrorResponse'
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    requiresAdmin(request.headers);

    const { id } = pathParamsSchema.parse(await params);
    const body = await request.json();
    const validated = updateUserSchema.parse(body);

    const user = await updateUser(id, validated);
    return NextResponse.json(user);
  } catch (error) {
    return apiErrorHandler({ error: error as ApiError, request });
  }
}
