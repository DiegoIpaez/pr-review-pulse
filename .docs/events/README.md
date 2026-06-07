# Webhook Test Events

This folder contains real GitHub webhook payloads captured during development. Use these files to test the webhook endpoint locally.

## Prerequisites

- [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) VS Code extension
- `GITHUB_WEBHOOK_SECRET` defined in your `.env` file

## Quick Start

### 1. Configure Environment

Edit `http-client.env.json` and set your `webhookSecret` to match your `.env`:

```json
{
  "local": {
    "host": "http://localhost:3000",
    "webhookSecret": "your-actual-secret"
  }
}
```

### 2. Generate Valid Signature

The signature in the `.http` files is from the original capture and won't work with your secret. Generate a new one:

```bash
bun run .docs/events/scripts/sign-payload.ts .docs/events/pull_request/opened.http
```

### 3. Update the .http File

Replace the `X-Hub-Signature-256` header with the generated signature.

### 4. Send the Request

Open the `.http` file in VS Code and click "Send Request" above the POST line.

## File Structure

```
events/
├── http-client.env.json      # Environment variables
├── scripts/
│   └── sign-payload.ts       # Signature generator
├── pull_request/
│   ├── opened.http           # PR opened event
│   ├── closed.http           # PR closed (not merged)
│   ├── closed_merged.http    # PR closed (merged)
│   ├── edited.http           # PR title/body edited
│   ├── labeled.http          # Label added to PR
│   ├── unlabeled.http        # Label removed from PR
│   ├── reopened.http         # PR reopened
│   └── synchronize.http      # New commits pushed
└── review/
    ├── submitted_comment.http    # Review comment submitted
    └── response_comment.http     # Response to review comment
```

## Event Reference

### Pull Request Events (`X-GitHub-Event: pull_request`)

| File | Action | Description |
|------|--------|-------------|
| `opened.http` | `opened` | New PR created |
| `closed.http` | `closed` | PR closed without merge |
| `closed_merged.http` | `closed` | PR merged (check `merged: true`) |
| `edited.http` | `edited` | Title, body, or base branch changed |
| `labeled.http` | `labeled` | Label added |
| `unlabeled.http` | `unlabeled` | Label removed |
| `reopened.http` | `reopened` | Closed PR reopened |
| `synchronize.http` | `synchronize` | New commits pushed |

### Pull Request Review Events (`X-GitHub-Event: pull_request_review`)

| File | State | Description |
|------|-------|-------------|
| `submitted_comment.http` | `commented` | Review with comment |
| `response_comment.http` | `commented` | Reply to review thread |

## Using with curl

Instead of REST Client, you can use curl:

```bash
# Generate signature
SIGNATURE=$(bun run .docs/events/scripts/sign-payload.ts .docs/events/pull_request/opened.http 2>/dev/null | grep 'sha256=' | tr -d ' ')

# Extract body and send
cat .docs/events/pull_request/opened.http | sed '1,/^$/d' | curl -X POST http://localhost:3000/api/webhooks/github \
  -H "Content-Type: application/json" \
  -H "X-GitHub-Event: pull_request" \
  -H "X-Hub-Signature-256: $SIGNATURE" \
  -d @-
```

## Notes

- These are **real payloads** captured from GitHub via ngrok
- The `X-Hub-Signature-256` header must be recalculated for your secret
- Payloads contain the full GitHub response (~20KB each) for reference
- Only fields used by the webhook handlers are actually processed
