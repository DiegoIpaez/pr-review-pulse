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

## Commands
```bash
bun run postinstall      # Generate Prisma Client (runs automatically)
bun run prisma:migrate   # Create/apply migrations
bun run prisma:reset     # Reset database
bun run prisma:studio    # Open Prisma Studio GUI
```
