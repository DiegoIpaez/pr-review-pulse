# Copilot Instructions: PR Review Pulse

## Project Overview

Next.js 16 (App Router) application for tracking and managing GitHub pull request reviews. Uses TypeScript, Prisma ORM with PostgreSQL, and receives GitHub webhook events to maintain PR review analytics.

## Build, Test, and Lint Commands

```bash
# Package manager: Bun (not npm/yarn)
bun install --frozen-lockfile

# Development
bun run dev              # Start dev server on port 3000

# Build & Production
bun run build            # Production build
bun run start            # Start production server

# Linting
bun run lint             # Run ESLint
bun run lint:fix         # Auto-fix ESLint issues

# Database (Prisma)
bun run postinstall      # Generate Prisma Client (runs automatically)
bun run prisma:migrate   # Create/apply migrations
bun run prisma:reset     # Reset database
bun run prisma:studio    # Open Prisma Studio GUI

# Docker (includes PostgreSQL + ngrok for webhooks)
docker compose up        # Start PostgreSQL on :5432 and ngrok on :4040
```

**Minimum Node Version**: 22.14.0

## Architecture Overview

### Routing Structure

- **App Router** with route groups for organization:
  - `(menu)/` - Main authenticated UI with shared sidebar layout
    - `(home)/` - Dashboard at `/` (PR list view)
    - `users/` - Users page at `/users`
  - `api/` - API routes (RESTful + webhooks)
  - `docs/` - Swagger API documentation at `/docs`

### Data Flow

1. **GitHub Webhooks** → `POST /api/webhooks/github` → Zod validation → Service layer → Prisma
2. **Client Pages** (React Query) → `GET /api/pull-requests` or `/api/users` → Service layer → Prisma
3. **UI Updates** → React Query refetch/invalidation

### Key Layers

```
Client Components (pages) 
  ↓ React Query hooks
Frontend Services (axios)
  ↓ HTTP
API Routes (/api/*/route.ts)
  ↓ try/catch with apiErrorHandler
Backend Services (*.service.ts)
  ↓ Prisma queries
PostgreSQL Database
```

## Code Conventions

### File Naming

- **Components**: `kebab-case.tsx` (e.g., `data-table.tsx`)
- **Pages**: `page.tsx` (App Router convention)
- **API Routes**: `route.ts` (App Router convention)
- **Services**: `{entity}.service.ts` (e.g., `pull-requests.service.ts`)
- **Schemas**: `{entity}.schema.ts` (Zod validators)
- **Types**: `{entity}.type.ts`
- **Handlers**: `{context}-{type}.handler.ts` (e.g., `api-error.handler.ts`)
- **Private/Internal**: Prefix folder with `_` (e.g., `_components/`, `_services/`)

### Folder Structure Patterns

**Route-specific components** go in `_components/` subdirectory:
```
src/app/(menu)/(home)/
  ├── page.tsx
  └── _components/
      ├── pr-columns.tsx
      └── expanded-pr-row-content.tsx
```

**API route services** live alongside the route:
```
src/app/api/pull-requests/
  ├── route.ts
  └── pull-request.service.ts
```

**Complex features** can have private subfolders:
```
src/app/api/webhooks/github/
  ├── route.ts
  ├── _services/
  ├── _contracts/
  └── _utils/
```

### Import Path Aliases

All imports use `@/*` pointing to `src/`:
```typescript
import prismaClient from '@/lib/clients/prisma-client';
import { ApiError } from '@/utils/handlers/api-error.handler';
import { Button } from '@/components/ui/button';
```

### ESLint Rules to Note

- `no-console: error` - Use `logger` from `@/lib/logger` instead
- `max-params: 3` - Functions cannot exceed 3 parameters (use object destructuring)
- `id-length: [2, 50]` - Identifiers must be 2-50 chars (except `_` for unused)

### Prettier Configuration

- Single quotes
- 2-space indentation
- Semicolons required
- 80-character line width
- ES5 trailing commas

## Database & Prisma

### Schema Location

`prisma/schema.prisma` defines:
- **Repository** - GitHub repositories
- **User** - GitHub users (PR creators and reviewers)
- **PullRequest** - PR metadata with type (FEATURE, FIX, etc.) and state (open, closed, merged)
- **PullRequestReview** - Reviews on PRs

### Prisma Client Singleton

Import the global singleton (never instantiate new PrismaClient):
```typescript
import prismaClient from '@/lib/clients/prisma-client';

// Uses PrismaPg adapter for PostgreSQL
// Generated types at: @/generated/prisma/client
```

### Generated Output Path

Prisma Client generates to `src/generated/prisma/` (not default `node_modules/.prisma`).

### Query Patterns

Use case-insensitive search with `Prisma.QueryMode.insensitive`:
```typescript
const where: Prisma.PullRequestWhereInput = {
  OR: [
    { repository: { name: { contains: search, mode: Prisma.QueryMode.insensitive } } },
    { creator: { username: { contains: search, mode: Prisma.QueryMode.insensitive } } },
  ],
};
```

Always include relations explicitly:
```typescript
const query = {
  include: {
    _count: { select: { reviews: true } },
    repository: { select: { id: true, name: true, url: true } },
    creator: { select: { id: true, username: true, url: true, avatar_url: true } },
  },
};
```

## Error Handling

### API Routes

Wrap all API route logic in try/catch with `apiErrorHandler`:
```typescript
export async function GET(request: NextRequest) {
  try {
    const data = await someService();
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorHandler({ error: error as ApiError, request });
  }
}
```

`apiErrorHandler` automatically:
- Maps `ZodError` → 400 Bad Request
- Maps `PrismaClientKnownRequestError` → appropriate status (409, 404, etc.)
- Logs errors with Winston
- Returns standardized JSON response

### Client-Side

Use `clientErrorHandler` with toast notifications:
```typescript
import clientErrorHandler from '@/utils/handlers/client-error.handler';

try {
  await fetchData();
} catch (error) {
  clientErrorHandler(error); // Shows toast via Sonner
}
```

## State Management

- **Server State**: React Query (TanStack Query) configured in `@/lib/clients/query-client`
  - 10-second stale time
  - No retry on failure
  - Global error handling via `QueryCache`
- **Local UI State**: React `useState` and `useReducer`
- **Theme**: `next-themes` provider
- **No Zustand** - Package installed but not currently used

## React Query Usage

All data fetching uses React Query on client components:
```typescript
'use client';
import { useQuery } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['pullRequests', page, limit, search],
  queryFn: () => fetchAllPullRequests({ page, limit, search }),
});
```

Frontend services (in `src/services/`) use axios:
```typescript
import axiosClient from '@/lib/clients/axios-client';

export async function fetchAllPullRequests(params: PaginationFilters) {
  const { data } = await axiosClient.get('/api/pull-requests', { params });
  return data;
}
```

## UI Components

### Component Library

**shadcn/ui pattern**: Radix UI primitives + Tailwind CSS
- All UI components in `src/components/ui/`
- Custom complex components in `src/components/ui/custom/`
- Icons from `lucide-react`

### Key Components

- `DataTable` - Reusable table with TanStack Table, pagination, expandable rows
- `Sidebar` - Context-based sidebar with menu items
- Forms use `react-hook-form` + `@hookform/resolvers` with Zod validation

### Styling

Use `cn()` utility from `@/lib/cn` for conditional classes:
```typescript
import { cn } from '@/lib/cn';

<div className={cn('base-class', isActive && 'active-class')} />
```

## Validation

All API routes and webhooks validate with **Zod schemas**:
```typescript
import { z } from 'zod';

const schema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive().max(100),
});

// In API route
const validated = schema.parse(data); // Throws ZodError on failure
```

Schemas live in `src/contracts/schemas/` or route-specific `_contracts/schemas/`.

## Logging

Use Winston logger (not `console.log`):
```typescript
import logger from '@/lib/logger';

logger.info('Operation completed');
logger.error('Operation failed', { error });
```

- Logs to `storage/logs/` with daily rotation
- 14-day retention, 20MB max file size
- Console output in development
- Structured JSON format for errors

## Environment Variables

Centralized in `src/constants/config.constant.ts`:
```typescript
export const CONFIG = {
  DATABASE_URL: process.env.DATABASE_URL!,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL!,
};
```

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_BASE_URL` - Base URL for API calls

## GitHub Webhooks

Webhook handler at `POST /api/webhooks/github`:
- Reads `x-github-event` header
- Validates payload with Zod schemas
- Dispatches to service based on event type:
  - `pull_request` → `processPullRequest()`
  - `pull_request_review` → `processPullRequestReview()`

Webhook schemas in `src/app/api/webhooks/github/_contracts/schemas/`.

## Development Workflow

1. Start database: `docker compose up -d`
2. Run migrations: `bun run prisma:migrate`
3. Start dev server: `bun run dev`
4. Configure GitHub webhook to point to ngrok URL (available at `localhost:4040`)

## Common Patterns

### Creating a New API Route

1. Create `src/app/api/{resource}/route.ts` with HTTP method handlers
2. Create `src/app/api/{resource}/{resource}.service.ts` for business logic
3. Use Zod for validation, Prisma for queries
4. Wrap in try/catch with `apiErrorHandler`

### Creating a New Page

1. Create `src/app/(menu)/{route}/page.tsx` as client component
2. Create `_components/` subdirectory for page-specific components
3. Use React Query for data fetching
4. Import service from `src/services/`

### Adding a New Table Column

1. Define column in `src/app/(menu)/{route}/_components/{entity}-columns.tsx`
2. Use TanStack Table column helpers
3. Extract complex cells into separate column components in `columns/` subdirectory

## Testing

Currently **no test suite** exists. If adding tests, use:
- Jest or Vitest for unit tests
- Playwright or Cypress for E2E tests
- React Testing Library for component tests
