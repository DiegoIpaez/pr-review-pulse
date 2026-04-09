---
applyTo: "src/app/api/webhooks/**/*"
---

# GitHub Webhooks Standards

## Configuration

### Environment Variable
`GITHUB_WEBHOOK_SECRET` - Required secret for verifying GitHub webhook signatures.
- Defined in `.env` (see `.env.example`)
- Accessed via `CONFIG.GITHUB_WEBHOOK_SECRET` from `@/constants/config.constant`
- Used by `verifyGitHubSignature()` utility to validate webhook authenticity

### Security
All webhook requests are validated using HMAC-SHA256 signature verification:
- GitHub signs payloads with the webhook secret
- Signature is sent in `x-hub-signature-256` header
- Verification is performed in `src/app/api/webhooks/github/_utils/verify-signature.util.ts`

## Webhook Handler
Webhook handler at `POST /api/webhooks/github`:
- Verifies signature using `GITHUB_WEBHOOK_SECRET`
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
