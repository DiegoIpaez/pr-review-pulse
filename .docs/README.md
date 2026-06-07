# PR Review Pulse — Documentation

> Web application for real-time tracking and analysis of GitHub Pull Request metrics.

## Tech Stack

| Layer         | Technology                                         |
| ------------- | -------------------------------------------------- |
| Frontend      | Next.js 16 (App Router), React 19, Tailwind CSS v4 |
| Backend       | Next.js API Routes (REST)                          |
| Database      | PostgreSQL + Prisma ORM                            |
| Auth          | NextAuth.js v4 + GitHub OAuth                      |
| Cache/State   | React Query (TanStack Query)                       |
| Validation    | Zod                                                |
| UI            | shadcn/ui + Recharts                               |

## Architecture

```
Client (React Query) → API Route → Service → Prisma → PostgreSQL
```

## Modules

| #  | Module                         | Description                                              | Public |
| -- | ------------------------------ | -------------------------------------------------------- | ------ |
| 01 | [Introduction](./01-introduction.md)    | Stack, data model, general architecture         | —      |
| 02 | [Authentication](./02-module-authentication.md) | GitHub OAuth login, sessions, access control | Yes    |
| 03 | [Dashboard](./03-module-dashboard.md)    | Global and personal KPIs, time-series, distribution | Yes    |
| 04 | [Pull Requests](./04-module-pull-requests.md) | Listing, filters, PR details                | Yes    |
| 05 | [Repositories](./05-module-repositories.md) | Catalog of synced repositories               | Yes    |
| 06 | [Users](./06-module-users.md)     | User administration, roles, access status              | Yes    |
| 07 | [Webhooks](./07-module-webhooks.md)     | PR/review event ingestion from GitHub               | No     |

## Conventions

- **Public routes**: `/`, `/login`, `/access-status`, `/api/auth/*`, `/api/webhooks/github`
- **Admin routes**: `/dashboard`, `/prs`, `/repositories`, `/users`
- **User routes**: `/dashboard/me`, `/prs/me`
- **Roles**: `admin` (global access), `user` (personal metrics only)
- **Access statuses**: `pending` → `active` | `blocked`
