---
applyTo: "src/utils/handlers/**/*,src/app/api/**/route.ts,**/*.service.ts"
---

# Exception Handling Standards

## Overview

PR Review Pulse uses a robust and consistent error handling system that differentiates between server-side (API) and client-side (UI) errors. This document defines rules and best practices to avoid misuse.

---

## General Rules

### ✅ DO
- **Use `apiErrorHandler` in all API routes** - Wrap all logic in try/catch
- **Use `clientErrorHandler` in client components** - For fetch/async errors
- **Use `ApiError` for operational errors** - Predictable business errors
- **Include descriptive message** - Never throw empty or generic errors
- **Use correct HTTP status codes** - Follow REST standards (400, 404, 409, 422, 500)
- **Log with Winston** - Use `logger.error()`, never `console.log`

### ❌ DON'T
- **Never use `console.log` or `console.error`** - Use `logger` (see Biome rule)
- **Never ignore errors silently** - Always catch and handle
- **Never expose stack traces in production** - Only in development
- **Never throw generic errors without context** - `throw new Error('error')` ❌
- **Never handle errors outside of handlers** - Use centralized system

---

## API Routes - Server-Side Errors

### Error Handler Anatomy

```typescript
import { apiErrorHandler, ApiError } from '@/utils/handlers/api-error.handler';
import { NextRequest, NextResponse } from 'next/server';
import httpStatus from 'http-status';

export async function GET(request: NextRequest) {
  try {
    const data = await someService();
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorHandler({ error: error as ApiError, request });
  }
}
```

**CRITICAL**: ALL HTTP methods (GET, POST, PUT, PATCH, DELETE) must be wrapped in try/catch with `apiErrorHandler`.

### Throwing Operational Errors

For **predictable** business errors (validation, not found, conflict):

```typescript
import { ApiError } from '@/utils/handlers/api-error.handler';
import httpStatus from 'http-status';

// ✅ Error with clear context
throw new ApiError({
  status: httpStatus.NOT_FOUND,
  message: 'Pull request not found',
  code: 'PR_NOT_FOUND',
  details: { id: prId },
});

// ✅ Business validation error
throw new ApiError({
  status: httpStatus.UNPROCESSABLE_ENTITY,
  message: 'Cannot merge a closed pull request',
  code: 'INVALID_PR_STATE',
  details: { currentState: pr.state },
});

// ❌ Generic error without context
throw new Error('Something went wrong'); // NEVER DO THIS
```

### Automatically Handled Errors

The `apiErrorHandler` automatically handles:

#### 1. **ZodError** (Validation)
- Code: `400 Bad Request`
- Extracts first Zod error message
- Includes all issues in `details`

```typescript
// You don't need to do anything, apiErrorHandler converts automatically
const validated = schema.parse(data); // If it fails, mapped to 400
```

#### 2. **PrismaClientKnownRequestError** (Database)
- Maps Prisma codes to HTTP status (see `PRISMA_ERRORS` in `prisma.constant.ts`)
- Examples:
  - `P2002` (unique constraint) → `409 Conflict`
  - `P2025` (record not found) → `404 Not Found`
  - `P2003` (foreign key) → `400 Bad Request`

```typescript
// You don't need to catch Prisma errors manually
await prismaClient.user.create({ data }); // If violates constraint, mapped to 409
```

### HTTP Status Codes by Scenario

| Scenario                         | Code | When to Use                          |
|----------------------------------|------|--------------------------------------|
| Input validation (Zod)           | 400  | Invalid data from client             |
| Not found                        | 404  | Resource doesn't exist in DB         |
| Conflict (constraint)            | 409  | Uniqueness/integrity violation       |
| Business rule violated           | 422  | Business logic rejects operation     |
| Internal error                   | 500  | Unexpected/non-operational error     |

### Non-Operational Errors

For **unexpected** errors (bugs, system errors):

```typescript
// ❌ NEVER throw ApiError with isOperational: false manually
throw new ApiError({
  status: 500,
  message: 'Unexpected error',
  isOperational: false, // INCORRECT
});

// ✅ Let native error propagate
// apiErrorHandler automatically detects non-operational errors
// and returns 500 without exposing details
await riskyOperation(); // If fails, apiErrorHandler handles it as 500
```

**Important**: Non-operational errors are logged with full stack trace but respond with generic message in production.

---

## Client Components - Frontend Errors

### Using `clientErrorHandler`

```typescript
'use client';
import clientErrorHandler from '@/utils/handlers/client-error.handler';
import { useQuery } from '@tanstack/react-query';

export default function MyComponent() {
  const { data, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  // ✅ Automatic handling with React Query
  if (error) {
    clientErrorHandler(error); // Shows toast + logs
    return <ErrorFallback />;
  }

  return <div>{data}</div>;
}
```

### Errors in Async Handlers

```typescript
'use client';
import clientErrorHandler from '@/utils/handlers/client-error.handler';

async function handleSubmit() {
  try {
    await updateUser(data);
    toast.success('User updated successfully');
  } catch (error) {
    clientErrorHandler(error); // ✅ Handles AxiosError, Error, string, etc.
  }
}
```

### `clientErrorHandler` Options

```typescript
clientErrorHandler(error, callback, {
  showToast: true,              // Show toast (default: true)
  messagePrefix: 'Error:',      // Toast prefix (default: 'Error:')
  defaultMessage: 'Unknown error', // Fallback message
  toastOptions: { duration: 4000 }, // Sonner options
});

// Example: Disable toast for silent errors
clientErrorHandler(error, () => {}, { showToast: false });

// Example: With custom callback
clientErrorHandler(error, () => {
  router.push('/login'); // Redirect on 401
});
```

### Automatic Error Normalization

`clientErrorHandler` automatically normalizes:
- `AxiosError` → Extracts message from `response.data.message`
- `Error` → Uses `error.message`
- `string` → Converts to `Error`
- `object` → Tries to extract `message` or stringify

```typescript
// ✅ All of these normalize correctly
clientErrorHandler(new Error('Failed'));
clientErrorHandler('Something went wrong');
clientErrorHandler({ message: 'Custom error' });
clientErrorHandler(axiosError); // Detects network errors
```

---

## React Query - Global Error Handling

React Query is configured with global error handling in `@/lib/clients/query-client`:

```typescript
import { QueryCache, QueryClient } from '@tanstack/react-query';
import clientErrorHandler from '@/utils/handlers/client-error.handler';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000,
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      clientErrorHandler(error); // ✅ Global handling
    },
  }),
});
```

**Implication**: You don't need `clientErrorHandler` in every component if using React Query. Only for errors outside queries (mutations, event handlers).

---

## Error Boundary - Next.js

`src/app/error.tsx` catches unhandled errors in component tree:

```typescript
'use client';

export default function ErrorPage({ error, reset }: ErrorBoundaryProps) {
  // Shows generic error UI
  // Allows "Try again" with reset()
  // Shows stack trace only in development
}
```

**You don't need to create additional error boundaries** unless you want specific logic per section.

---

## Logging - Winston

```typescript
import logger from '@/lib/logger';

// ✅ Log errors with context
logger.error('Failed to process webhook', {
  error: error.message,
  stack: error.stack,
  payload: webhookPayload,
});

// ✅ Log info/warn
logger.info('User logged in', { userId: user.id });
logger.warn('Rate limit approaching', { requests: 90, limit: 100 });

// ❌ NEVER use console
console.log('Debug message'); // FORBIDDEN (Biome error)
console.error(error); // FORBIDDEN
```

---

## Prisma Error Mapping

Common Prisma errors are mapped in `src/constants/prisma.constant.ts`:

```typescript
export const PRISMA_ERROR_CODES = {
  UNIQUE_CONSTRAINT: 'P2002',   // → 409 Conflict
  FOREIGN_KEY: 'P2003',         // → 400 Bad Request
  RECORD_NOT_FOUND: 'P2025',    // → 404 Not Found
  // ... see full file
};
```

**You don't need to map these errors manually**. `apiErrorHandler` does it automatically.

### Example: Create User with Duplicate Email

```typescript
// Service
async function createUser(data: CreateUserDto) {
  // If email already exists, Prisma throws P2002
  return await prismaClient.user.create({ data });
}

// Route
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createUserSchema.parse(body);
    const user = await createUser(validated);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return apiErrorHandler({ error: error as ApiError, request });
    // P2002 automatically mapped to:
    // { message: "The value already exists. Please use a different one.", status: 409 }
  }
}
```

---

## Error Response Structure

### API Response (Server)

```json
{
  "message": "Pull request not found",
  "status": 404,
  "instance": "/api/pull-requests/123",
  "method": "GET",
  "code": "PR_NOT_FOUND",
  "details": { "id": 123 },
  "stack": "Error: ...\n at ..." // Only in development
}
```

### Client Toast (Frontend)

```
🔴 Error:
Pull request not found
```

---

## Anti-Patterns - What to Avoid

### ❌ 1. Inconsistent Handling

```typescript
// ❌ BAD - Not using apiErrorHandler
export async function GET(request: NextRequest) {
  try {
    const data = await service();
    return NextResponse.json(data);
  } catch (error) {
    // NEVER do this manually
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

// ✅ GOOD
export async function GET(request: NextRequest) {
  try {
    const data = await service();
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorHandler({ error: error as ApiError, request });
  }
}
```

### ❌ 2. Silent Errors

```typescript
// ❌ BAD - Ignoring errors
try {
  await riskyOperation();
} catch {
  // Silent - never do this
}

// ✅ GOOD - At least log
try {
  await riskyOperation();
} catch (error) {
  logger.error('Risky operation failed', { error });
  throw error; // Or handle appropriately
}
```

### ❌ 3. Wrong HTTP Status Code

```typescript
// ❌ BAD - Always return 500
throw new ApiError({ status: 500, message: 'User not found' });

// ✅ GOOD - Use semantic code
throw new ApiError({ status: 404, message: 'User not found' });
```

### ❌ 4. Mixing Handlers

```typescript
// ❌ BAD - Using clientErrorHandler in API route
export async function POST(request: NextRequest) {
  try {
    await service();
  } catch (error) {
    clientErrorHandler(error); // WRONG - this is for client
  }
}

// ❌ BAD - Using apiErrorHandler in component
function MyComponent() {
  try {
    await fetch('/api/users');
  } catch (error) {
    apiErrorHandler({ error, request }); // WRONG - this is for API
  }
}
```

### ❌ 5. Stack Traces in Production

```typescript
// ❌ BAD - Exposing stack in production manually
return NextResponse.json({
  error: error.message,
  stack: error.stack, // NEVER expose directly
});

// ✅ GOOD - apiErrorHandler only includes stack in development
return apiErrorHandler({ error: error as ApiError, request });
```

---

## Implementation Checklist

Before committing, verify:

- [ ] All API routes use `apiErrorHandler` in catch block
- [ ] Operational errors throw `ApiError` with correct HTTP status code
- [ ] No `console.log` or `console.error` (Biome should fail)
- [ ] Client components use `clientErrorHandler` for async errors
- [ ] Prisma errors are allowed to propagate (not caught manually)
- [ ] Zod errors are allowed to propagate (not caught manually)
- [ ] All errors have descriptive messages and context
- [ ] Winston logger is used instead of console

---

## Quick Summary

| Context           | Handler to Use         | When                                |
|-------------------|------------------------|-------------------------------------|
| API Route         | `apiErrorHandler`      | In catch of try/catch               |
| Client Component  | `clientErrorHandler`   | Fetch/async/mutation errors         |
| React Query       | Automatic              | Global QueryCache handles errors    |
| Service Layer     | Throw `ApiError`       | Operational business errors         |
| Prisma/Zod        | Let propagate          | apiErrorHandler maps automatically  |
| Logging           | `logger`               | NEVER console.log                   |

---

## References

- **API Error Handler**: `src/utils/handlers/api-error.handler.ts`
- **Client Error Handler**: `src/utils/handlers/client-error.handler.ts`
- **Prisma Error Codes**: `src/constants/prisma.constant.ts`
- **Error Boundary**: `src/app/error.tsx`
- **Query Client Config**: `src/lib/clients/query-client.ts`
- **Logger**: `src/lib/logger.ts`
