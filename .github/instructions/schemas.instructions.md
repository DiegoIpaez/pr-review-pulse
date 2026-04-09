---
applyTo: "**/*.schema.ts,**/schemas/**/*.ts"
---

# Validation Schemas Standards

## Zod Validation
All API routes and webhooks validate with **Zod schemas**.
Zod is used for:
- Query parameters validation
- Request body validation
- Response type inference
- Client-side and server-side validation (shared schemas)

## File Location
Schemas live in:
- `src/contracts/schemas/` - Global schemas (shared between API and client/frontend)
- Route-specific `_contracts/schemas/` - Feature-specific schemas

## File Naming
- **Schemas**: `{entity}.schema.ts` (Zod validators)

## Schema Reuse Strategy

### When to Extend vs Create New
**Extend existing schemas** when:
- New schema shares similar properties/validations with existing one
- You want to add or override specific fields
```typescript
// ✅ Extend when similar
export const prQueryParamsSchema = paginationQueryParamsSchema.extend({
  type: z.preprocess(preprocess, z.enum(PR_TYPES).optional()),
  state: z.preprocess(preprocess, z.enum(PR_STATES).optional()),
  uid: z.number().int().optional(),
});
```

**Create new schema** when:
- Validation rules are completely different
- No shared properties exist
- Creating a base schema would be forced/artificial

## Query Parameters Pattern

Use `z.coerce` for query parameters (strings from URL):
```typescript
import { z } from 'zod';

export const paginationQueryParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  showAll: z.coerce.boolean().default(false),
  search: z.string().default(''),
});

export type PaginationQueryParams = z.infer<typeof paginationQueryParamsSchema>;
```

### Parse Query Parameters in Routes
Use `parseQueryParams` utility with schema:
```typescript
import { parseQueryParams } from '@/utils/query-params.util';
import { paginationQueryParamsSchema } from '@/contracts/schemas/pagination.schema';

export async function GET(request: NextRequest) {
  const queryParams = parseQueryParams(
    request.nextUrl.searchParams,
    paginationQueryParamsSchema
  );
  // queryParams is now typed and validated
}
```

## Request Body Pattern

Validate JSON bodies with `.parse()`:
```typescript
import { updateUserSchema } from '@/contracts/schemas/user.schema';

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const validated = updateUserSchema.parse(body); // Throws ZodError on failure
  // validated is now typed
}
```

### Body Schema Example
```typescript
export const updateUserSchema = z.object({
  role: z.enum(['admin', 'user']).optional(),
  access_status: z.enum(['pending', 'active', 'blocked']).optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
```

## Shared Schemas for API Documentation

Schemas in `src/contracts/schemas/` serve dual purpose:
1. **Runtime validation** in API routes
2. **Type inference** for TypeScript
3. **Client-side validation** in frontend forms
4. **API documentation** (Swagger) reference

### Documenting Query Parameters
Reference schema properties in Swagger JSDoc:
```typescript
/**
 * @swagger
 * /api/users:
 *   get:
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 */
```

### Documenting Request Body
Reference schema properties in Swagger JSDoc:
```typescript
/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 */
```

## Advanced Patterns

### Preprocessing/Normalization
Use `z.preprocess` for custom transformations:
```typescript
export const normalizeStringSchema = (val: unknown) => (!val ? undefined : val);

const schema = z.object({
  type: z.preprocess(normalizeStringSchema, z.enum(['a', 'b']).optional()),
});
```

### Enum from Prisma
Extract enum values from Prisma:
```typescript
import { PullRequestType, PullRequestState } from '@/generated/prisma/client';

const PR_TYPES = Object.values(PullRequestType);
const PR_STATES = Object.values(PullRequestState);

export const prQueryParamsSchema = z.object({
  type: z.enum(PR_TYPES).optional(),
  state: z.enum(PR_STATES).optional(),
});
```

## Webhook Schemas
Webhook schemas in `src/app/api/webhooks/github/_contracts/schemas/`.
