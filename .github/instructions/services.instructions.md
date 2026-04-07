---
applyTo: "**/*.service.ts"
---

# Service Layer Standards

## File Location
- API route services live alongside the route: `src/app/api/{resource}/{resource}.service.ts`
- Frontend services live in: `src/services/`

## Database Queries with Prisma

### Prisma Client Singleton
Import the global singleton (never instantiate new PrismaClient):
```typescript
import prismaClient from '@/lib/clients/prisma-client';
```

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
`apiErrorHandler` automatically maps errors:
- Maps `ZodError` → 400 Bad Request
- Maps `PrismaClientKnownRequestError` → appropriate status (409, 404, etc.)
- Logs errors with Winston
- Returns standardized JSON response

## Logging
Use Winston logger (not `console.log`):
```typescript
import logger from '@/lib/logger';

logger.info('Operation completed');
logger.error('Operation failed', { error });
```
