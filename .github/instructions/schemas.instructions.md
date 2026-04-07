---
applyTo: "**/*.schema.ts,**/schemas/**/*.ts"
---

# Validation Schemas Standards

## Zod Validation
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

## File Location
Schemas live in:
- `src/contracts/schemas/` - Global schemas
- Route-specific `_contracts/schemas/` - Feature-specific schemas

## File Naming
- **Schemas**: `{entity}.schema.ts` (Zod validators)

## Webhook Schemas
Webhook schemas in `src/app/api/webhooks/github/_contracts/schemas/`.
