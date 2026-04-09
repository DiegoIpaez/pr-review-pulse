---
applyTo: "src/proxy.ts,src/middlewares/**/*"
---

# Middleware & Authentication Standards

## Overview

The application uses Next.js middleware via `src/proxy.ts` for authentication, authorization, and request preprocessing.

## Middleware Architecture

### Main Middleware (`src/proxy.ts`)
The proxy middleware intercepts all requests matching the matcher configuration and:
1. **CORS Handling** - Adds CORS headers for non-multipart requests
2. **Session Extraction** - Validates JWT token via NextAuth
3. **Public Route Bypass** - Allows unauthenticated access to specific routes
4. **Authentication Check** - Redirects to login if not authenticated
5. **Access Status Validation** - Ensures user has "active" status
6. **Header Injection** - Adds `uid`, `role`, `access_status` headers for downstream use
7. **Role-Based Access Control** - Validates access to protected routes

### Protected Route Matcher
```typescript
matcher: [
  '/',
  '/login',
  '/access-status',
  '/admin/:path*',
  '/collaborator/:path*',
  '/api/:path*',
]
```

## Public Routes (No Authentication Required)

These routes bypass all authentication checks:
- `/` - Landing page
- `/login` - Login page
- `/access-status` - Access pending/blocked notification page
- `/api/webhooks/github` - GitHub webhook endpoint (uses signature verification instead)
- `/api/auth/*` - NextAuth.js authentication endpoints

**IMPORTANT**: When adding new public endpoints, explicitly add them to the `isPublicRoute` check in `proxy.ts`.

## User Roles & Access Control

### Roles
Defined in `UserRole` enum (`@/generated/prisma/enums`):
- `admin` - Full access to admin routes + collaborator routes
- `user` - Access to collaborator routes only

### Access Status
Defined in `UserAccessStatus` enum:
- `pending` - User registered but not approved (redirected to `/access-status`)
- `active` - User has full access
- `blocked` - User access revoked (redirected to `/access-status`)

### Route Mapping
**Admin routes** (`ADMIN_ROUTES` from `@/constants/routes.constant`):
- `/admin` - Admin dashboard
- `/admin/users` - User management
- `/admin/dashboard` - Admin analytics
- `/admin/repositories` - Repository management

**Collaborator routes** (`COLLABORATOR_ROUTES`):
- `/collaborator` - Collaborator dashboard

**Logic**: `roles.middleware.ts` checks if the user's role grants access to the requested pathname.

## Session Extraction in API Routes

API routes can extract session data from headers using `getSessionFromHeaders()`:

```typescript
import { getSessionFromHeaders } from '@/middlewares/session.middleware';

export async function GET(request: NextRequest) {
  try {
    const { uid, role, accessStatus } = getSessionFromHeaders(request.headers);
    // Use session data for business logic
  } catch (error) {
    return apiErrorHandler({ error: error as ApiError, request });
  }
}
```

### Admin-Only API Routes
Use `requiresAdmin()` to enforce admin access:
```typescript
import { requiresAdmin } from '@/middlewares/session.middleware';

export async function POST(request: NextRequest) {
  try {
    requiresAdmin(request.headers); // Throws 403 if not admin
    // Admin-only logic
  } catch (error) {
    return apiErrorHandler({ error: error as ApiError, request });
  }
}
```

## Authentication Flow

### 1. Unauthenticated User
- **Web Request** → Redirect to `/login`
- **API Request** → `401 Unauthorized` JSON response

### 2. Authenticated but Not Active
- User has valid session but `access_status !== 'active'`
- **Redirect** → `/access-status` (both web and API)

### 3. Authenticated with Active Status
- Session headers injected: `uid`, `role`, `access_status`
- **Role check** performed for non-API routes
- If user accesses route their role doesn't have access to → Redirect to `/404`

### 4. API Routes
- Session headers available for extraction
- Business logic must explicitly call `getSessionFromHeaders()` or `requiresAdmin()`
- No automatic role-based blocking (handled per-route as needed)

## Security Rules

### ✅ DO
- **Add new public routes explicitly** to `isPublicRoute` check
- **Use `getSessionFromHeaders()`** to access session in API routes
- **Use `requiresAdmin()`** for admin-only operations
- **Trust headers** (`uid`, `role`, `access_status`) — middleware sets them securely
- **Update route constants** when adding new protected pages

### ❌ DON'T
- **Never bypass middleware** for authenticated routes
- **Never trust user input for role/uid** — always use headers set by middleware
- **Never add authentication logic directly in API routes** — use middleware utilities
- **Never expose admin routes to non-admin users** — enforce at middleware level
- **Never allow `pending` or `blocked` users** to access protected resources

## Adding a New Protected Route

### For Admin Route
1. Add route to `ADMIN_ROUTES` in `src/constants/routes.constant.ts`
2. Create page in `src/app/(authenticated)/admin/{route}/`
3. Middleware automatically enforces admin-only access

### For Collaborator Route
1. Add route to `COLLABORATOR_ROUTES` in `src/constants/routes.constant.ts`
2. Create page in `src/app/(authenticated)/collaborator/{route}/`
3. Both admins and users can access

### For Public Route
1. Add route to `isPublicRoute` check in `src/proxy.ts`
2. Create page in `src/app/(public)/{route}/`

## CORS Configuration

```typescript
const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
```

**Applied to**: All requests except `multipart/form-data` (file uploads)

## Session Token Configuration

NextAuth JWT tokens are validated using:
- **Secret**: `CONFIG.NEXT_AUTH.SECRET` (from `NEXT_AUTH_SECRET` env var)
- **Token location**: Cookie or `Authorization` header
- **Token validation**: `getToken()` from `next-auth/jwt`

## Error Handling

- **401 Unauthorized**: No valid session
- **403 Forbidden**: Valid session but insufficient role (e.g., user accessing admin route)
- **Redirects**: Used for web navigation; JSON errors for API routes

## Debugging Middleware

To debug middleware behavior:
1. Check `uid`, `role`, `access_status` headers in API route
2. Verify route is in correct constant (`ADMIN_ROUTES` or `COLLABORATOR_ROUTES`)
3. Confirm matcher pattern matches the route
4. Check session token validity with NextAuth

## Related Files

- `src/proxy.ts` - Main middleware entry point
- `src/middlewares/roles.middleware.ts` - Role-based access control logic
- `src/middlewares/session.middleware.ts` - Session extraction and validation utilities
- `src/constants/routes.constant.ts` - Route definitions by role
- `src/generated/prisma/enums.ts` - `UserRole` and `UserAccessStatus` enums

## Migration Notes

If you need to change authentication behavior:
- **Never remove the middleware** — it's the security layer
- **Extend, don't replace** — add new checks without breaking existing ones
- **Test with all roles** — admin, user, pending, blocked
- **Test unauthenticated access** — ensure redirects work correctly
