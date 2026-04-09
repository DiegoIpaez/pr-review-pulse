---
applyTo: "src/app/**/page.tsx"
---

# Page Components Standards

## State Management
- **Server State**: React Query (TanStack Query) configured in `@/lib/clients/query-client`
  - 10-second stale time
  - No retry on failure
  - Global error handling via `QueryCache`
- **Local UI State**: React `useState` and `useReducer`
- **Theme**: `next-themes` provider

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

## Client-Side Error Handling
Use `clientErrorHandler` with toast notifications:
```typescript
import clientErrorHandler from '@/utils/handlers/client-error.handler';

try {
  await fetchData();
} catch (error) {
  clientErrorHandler(error); // Shows toast via Sonner
}
```

## Routing Structure
- **App Router** with route groups:
  - `(authenticated)/` - Authenticated UI with role-based access
    - `admin/` - Admin dashboard and management pages
    - `collaborator/` - Collaborator-specific pages
  - `(public)/` - Public pages (login, etc.)
  - `api/` - API routes (RESTful + webhooks)
  - `docs/` - Swagger API documentation at `/docs`

## Creating a New Page Pattern
1. Create `src/app/(authenticated)/{role}/{route}/page.tsx` as client component
2. Create `_components/` subdirectory for page-specific components
3. Use React Query for data fetching
4. Import service from `src/services/`
