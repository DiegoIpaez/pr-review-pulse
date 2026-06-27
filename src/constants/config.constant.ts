export enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export const CONFIG = {
  DATABASE_URL: process.env.DATABASE_URL || '',
  NODE_ENV: (process.env.NODE_ENV as NodeEnv) || NodeEnv.Development,
  NEXT_AUTH: {
    SECRET: process.env.NEXTAUTH_SECRET || 'secret',
  },
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || '',
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || '',
  GITHUB_WEBHOOK_SECRET: process.env.GITHUB_WEBHOOK_SECRET || '',
  CRON_SECRET: process.env.CRON_SECRET || 'development_cron_secret',
};
