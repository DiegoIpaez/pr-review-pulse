---
applyTo: "src/components/**/*.tsx,src/app/**/_components/**/*.tsx"
---

# UI Components Standards

## Component Library
**shadcn/ui pattern**: Radix UI primitives + Tailwind CSS
- All UI components in `src/components/ui/`
- Custom complex components in `src/components/ui/custom/`
- Icons from `lucide-react`

## Key Components
- `DataTable` - Reusable table with TanStack Table, pagination, expandable rows
- `Sidebar` - Context-based sidebar with menu items
- Forms use `react-hook-form` + `@hookform/resolvers` with Zod validation

## Styling
Use `cn()` utility from `@/lib/cn` for conditional classes:
```typescript
import { cn } from '@/lib/cn';

<div className={cn('base-class', isActive && 'active-class')} />
```

## File Naming
- **Components**: `kebab-case.tsx` (e.g., `data-table.tsx`)

## Route-specific Components
Components specific to a route go in `_components/` subdirectory:
```
src/app/(menu)/(home)/
  ├── page.tsx
  └── _components/
      ├── pr-columns.tsx
      └── expanded-pr-row-content.tsx
```
