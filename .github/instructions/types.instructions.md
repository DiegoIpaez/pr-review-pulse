---
applyTo: "**/*.ts,**/*.tsx"
---

# TypeScript Standards

## TypeScript Typing
- Use `type` for all type definitions
- Use `interface` only when typing a class (`implements`)
- For database entity types, always import from `@/generated/prisma/client` — never redefine them manually:
```typescript
import type { PullRequest, User } from '@/generated/prisma/client';
```

## Import Path Aliases
All imports use `@/*` pointing to `src/`:
```typescript
import prismaClient from '@/lib/clients/prisma-client';
import { ApiError } from '@/utils/handlers/api-error.handler';
import { Button } from '@/components/ui/button';
```

## File Naming
- **Types**: `{entity}.type.ts`
- **Handlers**: `{context}-{type}.handler.ts` (e.g., `api-error.handler.ts`)
- **Private/Internal**: Prefix folder with `_` (e.g., `_components/`, `_services/`)

## ESLint Rules
- `no-console: error` - Use `logger` from `@/lib/logger` instead
- `max-params: 3` - Functions cannot exceed 3 parameters (use object destructuring)
- `id-length: [2, 50]` - Identifiers must be 2-50 chars (except `_` for unused)

## Prettier Configuration
- Single quotes
- 2-space indentation
- Semicolons required
- 80-character line width
- ES5 trailing commas
