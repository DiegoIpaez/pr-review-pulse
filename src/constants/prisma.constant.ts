import status from 'http-status';

type PrismaErrorInfo = {
  message: string;
  status: number;
};

export const PRISMA_ERROR_CODES = {
  UNIQUE_CONSTRAINT: 'P2002',
  FOREIGN_KEY: 'P2003',
  DATABASE_CONSTRAINT: 'P2004',
  INVALID_RELATION: 'P2014',
  QUERY_INTERPRETATION: 'P2016',
  MISSING_RELATION: 'P2017',
  TABLE_NOT_FOUND: 'P2021',
  COLUMN_NOT_FOUND: 'P2022',
  INVALID_VALUE_TYPE: 'P2023',
  RECORD_NOT_FOUND: 'P2025',
  ECONNREFUSED: 'ECONNREFUSED',
} as const;

export const PRISMA_ERRORS: Record<string, PrismaErrorInfo> = {
  [PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT]: {
    message: 'The value already exists. Please use a different one.',
    status: status.CONFLICT,
  },
  [PRISMA_ERROR_CODES.FOREIGN_KEY]: {
    message: 'Invalid relationship detected.',
    status: status.BAD_REQUEST,
  },
  [PRISMA_ERROR_CODES.DATABASE_CONSTRAINT]: {
    message: 'Database constraint failed.',
    status: status.BAD_REQUEST,
  },
  [PRISMA_ERROR_CODES.INVALID_RELATION]: {
    message: 'Invalid relation while performing the operation.',
    status: status.BAD_REQUEST,
  },
  [PRISMA_ERROR_CODES.QUERY_INTERPRETATION]: {
    message: 'Query could not be interpreted by the database.',
    status: status.BAD_REQUEST,
  },
  [PRISMA_ERROR_CODES.MISSING_RELATION]: {
    message: 'Missing relation for this operation.',
    status: status.BAD_REQUEST,
  },
  [PRISMA_ERROR_CODES.TABLE_NOT_FOUND]: {
    message: 'The requested table was not found in the database.',
    status: status.INTERNAL_SERVER_ERROR,
  },
  [PRISMA_ERROR_CODES.COLUMN_NOT_FOUND]: {
    message: 'The requested column was not found in the database.',
    status: status.INTERNAL_SERVER_ERROR,
  },
  [PRISMA_ERROR_CODES.INVALID_VALUE_TYPE]: {
    message: 'Invalid value type provided.',
    status: status.BAD_REQUEST,
  },
  [PRISMA_ERROR_CODES.RECORD_NOT_FOUND]: {
    message: 'The requested record does not exist.',
    status: status.NOT_FOUND,
  },
  [PRISMA_ERROR_CODES.ECONNREFUSED]: {
    message: 'Database connection failed.',
    status: status.SERVICE_UNAVAILABLE,
  },
};
