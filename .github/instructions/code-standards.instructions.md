---
applyTo: "**/*.ts,**/*.tsx"
---

# Code Standards (TypeScript, Linting & Formatting)

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

## Biome Linter Rules
Key rules explicitly configured (on top of `"recommended": true`):

**Complexity**:
- `useMaxParams: error` - Functions cannot exceed 3 parameters (use object destructuring)
- `noUselessCatch: error` - No try/catch that just re-throws

**Correctness**:
- `noUnusedVariables: error` - No unused variables (except `_` for unused)
- `noUnusedImports: error` - No unused imports (bundle size)
- `noConstantCondition: error` - No `if(true)` or `while(false)`
- `noUnreachable: error` - No dead code after return/throw

**Suspicious**:
- `noConsole: error` - Use `logger` from `@/lib/logger` instead
- `noArrayIndexKey: error` - No `key={index}` in React
- `noDebugger: error` - No debugger statements in code
- `noDoubleEquals: error` - Use `===` instead of `==`
- `noDuplicateCase: error` - No duplicate switch cases
- `noDuplicateObjectKeys: error` - No duplicate object keys
- `noVar: error` - Use `let`/`const` instead of `var`

**Style**:
- `noDefaultExport: off` - Next.js requires default exports for pages
- `noParameterAssign: error` - No reassignment of parameters

**Security**:
- `noDangerouslySetInnerHtml: error` - XSS prevention
- `noGlobalEval: error` - No eval() usage

## Code Formatting (Biome)
- Single quotes
- 2-space indentation
- Semicolons required
- 80-character line width
- ES5 trailing commas
- Arrow parentheses always
