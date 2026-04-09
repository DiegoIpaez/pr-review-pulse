export enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const NEXT_AUTH = {
  URL: process.env.NEXT_AUTH_URL || BASE_URL,
  SECRET: process.env.NEXT_AUTH_SECRET || 'secret',
};

export const CONFIG = {
  BASE_URL,
  API_URL: BASE_URL + '/api',
  DATABASE_URL: process.env.DATABASE_URL || '',
  NODE_ENV: (process.env.NODE_ENV as NodeEnv) || NodeEnv.Development,
  NEXT_AUTH,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || '',
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || '',
  GITHUB_WEBHOOK_SECRET: process.env.GITHUB_WEBHOOK_SECRET || '',
};
