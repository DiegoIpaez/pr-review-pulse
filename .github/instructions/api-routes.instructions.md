---
applyTo: "src/app/api/**/route.ts"
---

# API Routes Standards

## Error Handling

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

## REST API Standard (Richardson Maturity Level 2)

- Resources identified by URIs + correct use of HTTP verbs
- No actions in URLs. No verbs. Only entities.

### Resource Naming
- Plural nouns in kebab-case
- Never verbs, never actions
```
✅ GET /api/pull-requests
✅ GET /api/pull-requests/:id/reviews
❌ GET /api/getPullRequests
❌ POST /api/pull-requests/:id/approve
```

### HTTP Status Codes
| Scenario | Code |
|----------|------|
| Successful retrieval | 200 OK |
| Resource created | 201 Created |
| Successful update/delete with no body | 204 No Content |
| Validation error (Zod) | 400 Bad Request |
| Resource not found | 404 Not Found |
| Conflict (duplicate, constraint) | 409 Conflict |
| Unprocessable entity (business rule) | 422 Unprocessable Entity |
| Internal server error | 500 Internal Server Error |

### Response Shape
Successful responses return the resource or collection directly. No unnecessary wrappers.
```typescript
// ✅ Single resource
{ "id": 1, "title": "Fix login bug", "state": "open" }

// ✅ Collection
{ "data": [...], "total": 42, "page": 1, "limit": 10 }

// ❌ Unnecessary wrapper
{ "success": true, "result": { "id": 1 } }
```

Error responses follow a consistent shape (handled by `apiErrorHandler`):
```typescript
{ "error": "Validation failed", "details": [...] }
```

### Content Negotiation
All requests and responses use JSON exclusively. Both headers are required:
```
Content-Type: application/json
Accept: application/json
```

## Creating a New API Route Pattern
1. Create `src/app/api/{resource}/route.ts` with HTTP method handlers
2. Create `src/app/api/{resource}/{resource}.service.ts` for business logic
3. Use Zod for validation, Prisma for queries
4. Wrap in try/catch with `apiErrorHandler`
