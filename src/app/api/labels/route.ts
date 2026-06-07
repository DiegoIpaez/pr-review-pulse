import { type NextRequest, NextResponse } from 'next/server';
import { getSessionFromHeaders } from '@/middlewares/session.middleware';
import {
  type ApiError,
  apiErrorHandler,
} from '@/utils/handlers/api-error.handler';
import { getAllLabels } from './label.service';

export async function GET(request: NextRequest) {
  try {
    getSessionFromHeaders(request.headers);

    const data = await getAllLabels();
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorHandler({ error: error as ApiError, request });
  }
}
