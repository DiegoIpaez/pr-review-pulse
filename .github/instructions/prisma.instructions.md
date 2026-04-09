---
applyTo: "prisma/**/*"
---

# Database & Prisma Standards

## Schema Location
`prisma/schema.prisma` defines:
- **Repository** - GitHub repositories
- **User** - GitHub users (PR creators and reviewers)
- **PullRequest** - PR metadata with type (FEATURE, FIX, etc.) and state (open, closed, merged)
- **PullRequestReview** - Reviews on PRs

## Generated Output Path
Prisma Client generates to `src/generated/prisma/` (not default `node_modules/.prisma`).

## Query Performance Rules

### CRITICAL: Let the Database Do the Work

**Never** use JavaScript array methods (`.map()`, `.filter()`, `.reduce()`) or multiple queries when the database can handle it in a single query.

#### ❌ BAD - Processing data in JavaScript
```typescript
// Multiple queries + JavaScript processing
const allPRs = await prismaClient.pullRequest.findMany();
const openPRs = allPRs.filter(pr => pr.state === 'open');
const prsByType = openPRs.reduce((acc, pr) => {
  acc[pr.type] = (acc[pr.type] || 0) + 1;
  return acc;
}, {});
```

#### ✅ GOOD - Single query in database
```typescript
// Let PostgreSQL do aggregation
const stats = await prismaClient.pullRequest.groupBy({
  by: ['type'],
  where: { state: 'open' },
  _count: true,
});
```

### When ORM Limits Are Reached: Use Raw Queries

If Prisma ORM cannot express complex queries (e.g., window functions, CTEs, advanced aggregations), use `$queryRaw` instead of workarounds in JavaScript:

#### ✅ Raw Query for Complex Logic
```typescript
import { Prisma } from '@/generated/prisma/client';

const result = await prismaClient.$queryRaw<KpisResponse[]>`
  SELECT
    COUNT(*) FILTER (WHERE pr.state = ${PullRequestState.open})::int AS open,
    COUNT(*) FILTER (WHERE pr.state = ${PullRequestState.merged})::int AS merged,
    AVG(pr.review_time) AS avg_review_time
  FROM pull_requests pr
  WHERE pr.created_at >= ${start_date}
    AND pr.created_at <= ${end_date}
`;
```

#### Raw Query with CTEs
```typescript
const result = await prismaClient.$queryRaw<TimeSeriesData[]>`
  WITH dates AS (
    SELECT generate_series(
      ${start_date}::date,
      ${end_date}::date,
      interval '1 day'
    )::date AS date
  )
  SELECT
    d.date,
    COUNT(pr.id) AS count
  FROM dates d
  LEFT JOIN pull_requests pr ON DATE(pr.created_at) = d.date
  GROUP BY d.date
  ORDER BY d.date
`;
```

### Raw Query Safety
- Always use tagged template literals with `$queryRaw` (prevents SQL injection)
- Type the result with TypeScript: `$queryRaw<MyType[]>`
- Use `Prisma.sql` or `Prisma.empty` for dynamic query building when needed

### Performance Checklist
Before writing query logic:
1. Can Prisma ORM express this? → Use Prisma methods
2. Is it complex aggregation/window functions? → Use `$queryRaw`
3. Never fetch all data then filter/map/reduce in JavaScript
4. Never make N+1 queries (use `include` or raw JOIN instead)

## Commands
```bash
bun run postinstall      # Generate Prisma Client (runs automatically)
bun run prisma:migrate   # Create/apply migrations
bun run prisma:reset     # Reset database
bun run prisma:studio    # Open Prisma Studio GUI
```
