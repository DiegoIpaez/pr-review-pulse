---
applyTo: "src/services/**/*.ts"
---

# Frontend Services - HTTP Client Standards

## Overview

All HTTP requests in frontend services **must use the Axios client singleton**, never raw `fetch()`.
This ensures consistent configuration, error handling, and base URL management.

---

## Axios Client Configuration

### Import Path
```typescript
import axiosClient from '@/lib/clients/axios-client';
```

### Singleton Instance
- Located at: `src/lib/clients/axios-client.ts`
- Pre-configured with:
  - **Base URL**: `CONFIG.API_URL` (e.g., `http://localhost:3000/api`)
  - **Headers**: `Content-Type: application/json`
  - Automatic request/response interceptors (if configured)

### Why Axios Over fetch()?
- ✅ Automatic JSON parsing (`response.data`)
- ✅ Centralized base URL configuration
- ✅ Built-in request/response interceptors
- ✅ Better TypeScript support
- ✅ Automatic error handling with Axios error types
- ✅ Query params serialization with `params` option

---

## Service Layer Structure

### File Location
All frontend services live in: `src/services/`

### Naming Convention
- **File**: `{entity}.service.ts` (e.g., `users.service.ts`)
- **Functions**: `fetch{Entity}`, `update{Entity}`, `create{Entity}`, `delete{Entity}`

### Example Structure
```typescript
// src/services/users.service.ts
import { API_ROUTES } from '@/constants';
import axiosClient from '@/lib/clients/axios-client';
import type { PaginationQueryParams } from '@/contracts/schemas/pagination.schema';
import type { UpdateUserDto } from '@/contracts/schemas/user.schema';

export async function fetchAllUsers(params: PaginationQueryParams) {
  const { data } = await axiosClient.get(API_ROUTES.USERS.BASE, { params });
  return data;
}

export async function fetchUserById(id: number) {
  const { data } = await axiosClient.get(API_ROUTES.USERS.BY_ID(id));
  return data;
}

export async function updateUserById(id: number, userData: UpdateUserDto) {
  const { data } = await axiosClient.patch(
    API_ROUTES.USERS.BY_ID(id),
    userData
  );
  return data;
}
```

---

## HTTP Methods

### GET Requests

#### Without Query Params
```typescript
export async function fetchUserById(id: number) {
  const { data } = await axiosClient.get(API_ROUTES.USERS.BY_ID(id));
  return data;
}
```

#### With Query Params
```typescript
export async function fetchAllPullRequests(params: PullRequestQueryParams) {
  const { data } = await axiosClient.get(API_ROUTES.PULL_REQUESTS.BASE, {
    params, // ✅ Axios serializes to ?page=1&limit=10&search=foo
  });
  return data;
}
```

**IMPORTANT**: Use `params` option, not manual URL construction:
```typescript
// ❌ BAD - Manual URL construction
const { data } = await axiosClient.get(
  `/users?page=${page}&limit=${limit}`
);

// ✅ GOOD - Axios params serialization
const { data } = await axiosClient.get('/users', {
  params: { page, limit },
});
```

### POST Requests

```typescript
export async function createUser(userData: CreateUserDto) {
  const { data } = await axiosClient.post(API_ROUTES.USERS.BASE, userData);
  return data;
}
```

### PATCH Requests

```typescript
export async function updateUserById(id: number, userData: UpdateUserDto) {
  const { data } = await axiosClient.patch(
    API_ROUTES.USERS.BY_ID(id),
    userData
  );
  return data;
}
```

### DELETE Requests

```typescript
export async function deleteUserById(id: number) {
  const { data } = await axiosClient.delete(API_ROUTES.USERS.BY_ID(id));
  return data;
}
```

---

## API Routes Constants

### Usage
Always reference routes from `API_ROUTES` constant:
```typescript
import { API_ROUTES } from '@/constants';

// ✅ GOOD
const { data } = await axiosClient.get(API_ROUTES.USERS.BASE);

// ❌ BAD - Hardcoded strings
const { data } = await axiosClient.get('/users');
```

### Route Definition
Located at: `src/constants/routes.constant.ts`

```typescript
export const API_ROUTES = {
  USERS: {
    BASE: '/users',
    BY_ID: (id: number) => `/users/${id}`,
    ME: {
      PULL_REQUESTS: {
        BASE: '/users/me/pull-requests',
        KPIS: '/users/me/pull-requests/kpis',
      },
    },
  },
  PULL_REQUESTS: {
    BASE: '/pull-requests',
    DISTRIBUTION: '/pull-requests/distribution',
  },
  LABELS: {
    BASE: '/labels',
  },
} as const;
```

---

## Type Safety

### Request Params
Use Zod schemas for type inference:
```typescript
import type { PaginationQueryParams } from '@/contracts/schemas/pagination.schema';

export async function fetchAllUsers(params: PaginationQueryParams) {
  const { data } = await axiosClient.get(API_ROUTES.USERS.BASE, { params });
  return data;
}
```

### Request Body
Use DTOs from contracts:
```typescript
import type { UpdateUserDto } from '@/contracts/schemas/user.schema';

export async function updateUserById(id: number, userData: UpdateUserDto) {
  const { data } = await axiosClient.patch(
    API_ROUTES.USERS.BY_ID(id),
    userData
  );
  return data;
}
```

### Response Types
Define explicit return types:
```typescript
import type { User } from '@/generated/prisma/client';

export async function fetchUserById(id: number): Promise<User> {
  const { data } = await axiosClient.get(API_ROUTES.USERS.BY_ID(id));
  return data;
}
```

---

## Error Handling

### Client-Side (React Components)
Services **do not catch errors**. Let React Query handle them:

```typescript
// ✅ GOOD - Service throws errors naturally
export async function fetchAllUsers(params: PaginationQueryParams) {
  const { data } = await axiosClient.get(API_ROUTES.USERS.BASE, { params });
  return data;
}

// Component using React Query
const { data, error } = useQuery({
  queryKey: ['users', params],
  queryFn: () => fetchAllUsers(params),
});

if (error) {
  clientErrorHandler(error); // Global error handler
}
```

### Axios Error Types
Axios provides typed errors via `AxiosError`:
```typescript
import { AxiosError } from 'axios';

try {
  await fetchAllUsers(params);
} catch (error) {
  if (error instanceof AxiosError) {
    console.error(error.response?.data); // API error response
    console.error(error.response?.status); // HTTP status code
  }
}
```

---

## Anti-Patterns - What NOT to Do

### ❌ 1. Using fetch() Instead of Axios

```typescript
// ❌ BAD - Never use fetch()
export async function fetchAllLabels(): Promise<LabelDto[]> {
  const response = await fetch(API_ROUTES.LABELS.BASE, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch labels');
  }

  return response.json();
}

// ✅ GOOD - Use Axios
export async function fetchAllLabels(): Promise<LabelDto[]> {
  const { data } = await axiosClient.get(API_ROUTES.LABELS.BASE);
  return data;
}
```

### ❌ 2. Hardcoded URLs

```typescript
// ❌ BAD
const { data } = await axiosClient.get('/api/users');

// ✅ GOOD
const { data } = await axiosClient.get(API_ROUTES.USERS.BASE);
```

### ❌ 3. Manual Query String Construction

```typescript
// ❌ BAD
const { data } = await axiosClient.get(
  `${API_ROUTES.USERS.BASE}?page=${page}&limit=${limit}`
);

// ✅ GOOD
const { data } = await axiosClient.get(API_ROUTES.USERS.BASE, {
  params: { page, limit },
});
```

### ❌ 4. Catching Errors in Service Layer

```typescript
// ❌ BAD - Service catches errors
export async function fetchAllUsers(params: PaginationQueryParams) {
  try {
    const { data } = await axiosClient.get(API_ROUTES.USERS.BASE, { params });
    return data;
  } catch (error) {
    console.error(error); // Never log in service
    return []; // Never return fallback data
  }
}

// ✅ GOOD - Let errors propagate
export async function fetchAllUsers(params: PaginationQueryParams) {
  const { data } = await axiosClient.get(API_ROUTES.USERS.BASE, { params });
  return data;
}
```

### ❌ 5. Mixing Base URLs

```typescript
// ❌ BAD - Redundant base URL
const { data } = await axiosClient.get(`${CONFIG.API_URL}/users`);

// ✅ GOOD - Axios already has base URL configured
const { data } = await axiosClient.get(API_ROUTES.USERS.BASE);
```

---

## Service Function Checklist

Before committing a new service function, verify:

- [ ] Uses `axiosClient` (not `fetch()`)
- [ ] Imports from `@/lib/clients/axios-client`
- [ ] Uses routes from `API_ROUTES` constant
- [ ] Uses `params` option for query strings
- [ ] Has proper TypeScript types for params/body/response
- [ ] Does **not** catch errors (let them propagate)
- [ ] Follows naming convention: `fetch{Entity}`, `update{Entity}`, etc.
- [ ] Destructures `data` from Axios response: `const { data } = await ...`

---

## React Query Integration

Services are designed to work seamlessly with React Query:

```typescript
// Service
export async function fetchAllUsers(params: PaginationQueryParams) {
  const { data } = await axiosClient.get(API_ROUTES.USERS.BASE, { params });
  return data;
}

// Component
const { data, isLoading, error } = useQuery({
  queryKey: ['users', page, limit, search],
  queryFn: () => fetchAllUsers({ page, limit, search }),
});
```

### Mutations
```typescript
const mutation = useMutation({
  mutationFn: (userData: UpdateUserDto) => updateUserById(userId, userData),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
});
```

---

## Summary

| Rule | ✅ DO | ❌ DON'T |
|------|------|---------|
| HTTP Client | Use `axiosClient` | Use `fetch()` |
| Routes | Use `API_ROUTES` constant | Hardcode URLs |
| Query Params | Use `params` option | Manual URL construction |
| Error Handling | Let errors propagate | Catch in service layer |
| Response | Destructure `data` | Use `.then()` chains |
| Types | Import from contracts | Use `any` |

---

## References

- **Axios Client**: `src/lib/clients/axios-client.ts`
- **API Routes**: `src/constants/routes.constant.ts`
- **Service Examples**: `src/services/users.service.ts`, `src/services/pull-requests.service.ts`
- **Contracts**: `src/contracts/schemas/`
- **Error Handler**: `src/utils/handlers/client-error.handler.ts`
