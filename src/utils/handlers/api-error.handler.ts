import httpStatus from 'http-status';
import { type NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { CONFIG, NodeEnv } from '@/constants';
import { PRISMA_ERRORS } from '@/constants/prisma.constant';
import { PrismaClientKnownRequestError } from '@/generated/prisma/internal/prismaNamespace';
import logger from '@/lib/logger';

interface ApiErrorOptions {
  status?: number;
  message?: string;
  isOperational?: boolean;
  stack?: string;
  code?: string;
  details?: object | null;
}

type PrismaDriverAdapterError = {
  cause?: {
    originalCode?: string;
    originalMessage?: string;
    constraint?: {
      fields?: string[];
    };
  };
};

function hasDriverAdapterError(
  meta: unknown
): meta is { driverAdapterError: PrismaDriverAdapterError } {
  return (
    typeof meta === 'object' && meta !== null && 'driverAdapterError' in meta
  );
}

const statusMessages: Record<number, string> = httpStatus;

export class ApiError extends Error {
  public readonly stack?: string;
  public readonly status: number;
  public readonly isOperational: boolean;
  public readonly code?: string;
  public readonly details?: object | null;

  constructor({
    status = httpStatus.INTERNAL_SERVER_ERROR,
    message = '',
    isOperational = true,
    stack,
    code,
    details = null,
  }: ApiErrorOptions) {
    super(message);

    this.status = status;
    this.isOperational = isOperational;
    this.code = code;
    this.details = details;

    if (stack) this.stack = stack;
    else Error.captureStackTrace(this);
  }
}

type ResponseError = {
  message: string;
  status: number;
  instance: string;
  method: string;
  stack?: string;
  code?: string;
  details?: object | null;
};

export function apiErrorHandler({
  error,
  request,
  fallbackMessage,
}: {
  error: ApiError;
  request: NextRequest;
  fallbackMessage?: string;
}) {
  let { status, message } = error;
  if (!error.isOperational) {
    status = httpStatus.INTERNAL_SERVER_ERROR;
    message = fallbackMessage ?? httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }
  if (!message) message = fallbackMessage ?? statusMessages[status];

  const response: ResponseError = {
    message,
    status: status,
    instance: request?.nextUrl?.pathname,
    method: request?.method,
  };

  if (error instanceof ZodError) {
    const firstError = error.issues?.[0]?.message ?? 'Invalid data';
    response.message = firstError;
    response.status = httpStatus.BAD_REQUEST;
    response.details = error.issues;
  }

  if (error instanceof PrismaClientKnownRequestError) {
    const { message, status } = PRISMA_ERRORS?.[error.code] || {};

    response.status = status || httpStatus.INTERNAL_SERVER_ERROR;
    if (message) response.message = message;
    response.code = error.code;

    if (hasDriverAdapterError(error?.meta)) {
      const detail = {
        code: error?.meta?.driverAdapterError?.cause?.originalCode,
        path: error?.meta?.driverAdapterError?.cause?.constraint?.fields,
        message: error?.meta?.driverAdapterError?.cause?.originalMessage,
      };
      response.details = [detail];
    }
  }

  if (error?.code) response.code = error.code;
  if (error?.details) response.details = error.details;
  if (error?.stack && CONFIG.NODE_ENV === NodeEnv.Development) {
    response.stack = error?.stack;
  }

  logger.error(response);
  return NextResponse.json(response, { status });
}
