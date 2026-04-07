---
applyTo: "src/app/api/webhooks/**/*"
---

# GitHub Webhooks Standards

## Webhook Handler
Webhook handler at `POST /api/webhooks/github`:
- Reads `x-github-event` header
- Validates payload with Zod schemas
- Dispatches to service based on event type:
  - `pull_request` → `processPullRequest()`
  - `pull_request_review` → `processPullRequestReview()`

## Webhook Schemas
Webhook schemas in `src/app/api/webhooks/github/_contracts/schemas/`.

## REST API Exception
Routes under `/api/webhooks/` are excluded from REST API standards.
Their contracts are dictated by external providers (e.g. GitHub) and must not be modified
to fit internal conventions.

## Complex Features Structure
Complex features can have private subfolders:
```
src/app/api/webhooks/github/
  ├── route.ts
  ├── _services/
  ├── _contracts/
  └── _utils/
```
