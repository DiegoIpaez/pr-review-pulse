export enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const NEXTAUTH = {
  URL: process.env.NEXTAUTH_URL || BASE_URL,
  SECRET: process.env.NEXTAUTH_SECRET || 'secret',
};

export const CONFIG = {
  BASE_URL,
  API_URL: BASE_URL + '/api',
  DATABASE_URL: process.env.DATABASE_URL || '',
  NODE_ENV: (process.env.NODE_ENV as NodeEnv) || NodeEnv.Development,
  NEXTAUTH,
};
