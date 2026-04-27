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

## Component Modularization
**CRITICAL**: Prioritize modularization to keep components maintainable.

### When to Modularize
If a component becomes large or complex (>150 lines, multiple responsibilities, or complex logic), create a folder structure with sub-components:

```
src/components/common/
  └── user-dashboard/
      ├── index.tsx                     # Main component (exports default)
      ├── user-dashboard-header.tsx
      ├── user-dashboard-stats.tsx
      └── user-dashboard-activity.tsx
```

### Rules
- **Folder name** matches the main component (kebab-case)
- **Main component** in `index.tsx` exports the composed component
- **Sub-components** are internal implementation details (not exported outside folder)
- **Extract early** - don't wait for components to become unmaintainable
- **Single responsibility** - each sub-component should have one clear purpose

### Example Structure
```typescript
// src/components/common/user-dashboard/index.tsx
import { UserDashboardHeader } from './user-dashboard-header';
import { UserDashboardStats } from './user-dashboard-stats';
import { UserDashboardActivity } from './user-dashboard-activity';

export function UserDashboard({ user }: UserDashboardProps) {
  return (
    <div>
      <UserDashboardHeader user={user} />
      <UserDashboardStats stats={user.stats} />
      <UserDashboardActivity activities={user.activities} />
    </div>
  );
}
```

**Apply the same pattern to route-specific components** (`_components/`) when they grow large.

## Route-specific Components
Components specific to a route go in `_components/` subdirectory:
```
src/app/(menu)/(home)/
  ├── page.tsx
  └── _components/
      ├── pr-columns.tsx
      └── expanded-pr-row-content.tsx
```
