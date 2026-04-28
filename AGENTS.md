# PR Review Pulse — Agent Context

## Stack
- Next.js 16 (App Router only), TypeScript, Bun, Prisma + PostgreSQL
- React Query for all server state, Zod for all validation, shadcn/ui + Tailwind

## Data Flow
Client → React Query → API Route → Service → Prisma → PostgreSQL

## Layer Responsibilities
| Layer       | Responsibility              |
|-------------|-----------------------------|
| API Route   | HTTP handling only          |
| Service     | Business logic              |
| Prisma      | Database access             |
| React Query | Data fetching and caching   |

## Non-Negotiable Rules
- Use Bun only — never npm or yarn
- Never instantiate PrismaClient — use the singleton at `@/lib/clients/prisma-client`
- Never use `console.log` — use `logger` from `@/lib/logger`
- Never put business logic inside API routes
- Never fetch data in components without React Query
- Never introduce new patterns if an existing one solves the problem

## Environment Variables
Defined in `src/constants/config.constant.ts` via `CONFIG` object.
Required: `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`