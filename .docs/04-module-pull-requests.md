# Module 04: Pull Requests

## Requirements

### Functional
- List PRs in paginated table with columns: title, repo, branch, type, state, creator, date
- Search PRs by repo name, branch, or creator
- Filter by type (`feature`, `fix`, `hotfix`, `refactor`, `docs`, `test`, `release`, `chore`, `no_ticket`)
- Filter by state (`open`, `closed`, `merged`)
- View PR details in side drawer with:
  - Title, number, state and type badges
  - PR body rendered with markdown (GFM, collapsible)
  - Metadata: creator, repo, branch, dates, statistics (commits, +/-, files)
  - List of reviews with reviewer avatar, state, markdown body
- Global view (admin) vs personal view (authenticated user)

### Non-Functional
- Pagination with configurable size (default: 10)
- Search with implicit debounce (input change → reset to page 1)
- Responsive side drawer (sm: 600px, md: 700px, lg: 800px; max 50vw)
- Reviews in FIFO order

## Users

| Actor | View    | Screen    | API consumed                           |
| ----- | ------- | --------- | -------------------------------------- |
| Admin | Global  | `/prs`    | `/api/pull-requests`                   |
| User  | Personal | `/prs/me` | `/api/users/me/pull-requests`          |

## Screens

### PR Listing (`/prs`)

```
┌─────────────────────────────────────────────────────────────┐
│ 🔍 [Search by repository name, branch or creator...]        │
│ [Type: All types ▾] [State: All states ▾]                   │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ PR #123  │ repo-a  │ main     │ feature │ 🟢 Open  │ 2d │ │
│ │ PR #122  │ repo-b  │ fix/..   │ fix     │ 🔴 Closed│ 1d │ │
│ │ PR #121  │ repo-a  │ hotfix/  │ hotfix  │ 🟣 Merged│ 3h │ │
│ │ ...      │         │          │         │          │     │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ◀ 1 2 3 ... 10 ▶                                           │
└─────────────────────────────────────────────────────────────┘

  Click on a row → opens PrDetailDrawer (right side)
```

### PR Detail (Drawer)

```
┌─────────────────────────────────────────┐
│ ✕                                       │
│ ┌─────────────────────────────────────┐ │
│ │ PR Title #123           🟢 Open     │ │
│ │                                      │ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │ Markdown body (collapsible if   │ │ │
│ │ │ too long)                       │ │ │
│ │ └─────────────────────────────────┘ │ │
│ │                                      │ │
│ │ Creator: @user1     Repo: repo-a    │ │
│ │ Branch: main        Type: feature   │ │
│ │ Created: 2026-06-05 │ Updated: ...  │ │
│ │ Commits: 5 │ +120 │ -30 │ 8 files  │ │
│ │                                      │ │
│ │ Reviews (2)                          │ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │ ✅ Approved                     │ │ │
│ │ │ @reviewer1 · 2h ago            │ │ │
│ │ │ Looks good to me!              │ │ │
│ │ └─────────────────────────────────┘ │ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │ 💬 Commented                    │ │ │
│ │ │ @reviewer2 · 1h ago            │ │ │
│ │ │ Maybe check the edge case...   │ │ │
│ │ └─────────────────────────────────┘ │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Components

| Component            | File                                                                | Description                                        |
| -------------------- | ------------------------------------------------------------------- | -------------------------------------------------- |
| `DataTable`          | `src/components/ui/custom/data-table.tsx`                           | Generic paginated table with skeleton, expandable  |
| `Pagination`         | `src/components/ui/custom/pagination.tsx`                           | First/Prev/Next/Last controls                      |
| `PrDetailDrawer`     | `src/components/common/pr-detail-drawer/pr-detail-drawer.tsx`       | Side sheet with complete PR details                |
| `PrMetadata`         | `src/components/common/pr-detail-drawer/pr-metadata.tsx`            | PR metadata grid                                   |
| `PrReviewCard`       | `src/components/common/pr-detail-drawer/pr-review-card.tsx`         | Individual review card with markdown               |
| `PrReviewCardLayout` | `src/components/common/pr-detail-drawer/pr-review-card-layout.tsx`  | Layout with color based on review state            |
| `PrStateBadge`       | `src/components/common/badges/pr-state-badge.tsx`                   | Badge: Open (green), Closed (red), Merged (purple) |
| `PrTypeBadge`        | `src/components/common/badges/pr-type-badge.tsx`                    | PR type badge with category color                  |
| `MarkdownViewer`     | `src/components/common/markdown-viewer.tsx`                         | ReactMarkdown with GFM + collapsible               |
| `BranchColumn`       | `src/app/(authenticated)/prs/_components/columns/branch-column.tsx` | Branch column with git icon                        |
| `RepositoryColumn`   | `src/app/(authenticated)/prs/_components/columns/repository-column.tsx` | Repo column with colored badge               |

## Flows

### Navigation Flow: List → Detail

```mermaid
sequenceDiagram
    actor U as User
    participant UI as /prs
    participant RQ as React Query
    participant API as /api/pull-requests
    participant DB as PostgreSQL

    U->>UI: Navigate to /prs
    UI->>RQ: useQuery('pullRequests', page=1, limit=10)
    RQ->>API: GET /api/pull-requests?page=1&limit=10
    API->>DB: SELECT + COUNT (paginated)
    DB-->>API: PullRequest[] + total count
    API-->>RQ: { data: PullRequest[], meta: { total, page, limit } }
    RQ-->>UI: Render DataTable

    U->>UI: Types in search box
    UI->>RQ: useQuery('pullRequests', page=1, search="...")
    RQ->>API: GET /api/pull-requests?search=...
    API-->>RQ: Filtered results
    UI->>UI: Re-render table

    U->>UI: Click on PR row
    UI->>UI: setSelectedPr(pr) → opens PrDetailDrawer
    UI->>UI: Render metadata, body (markdown), reviews
    U->>UI: Click outside or ✕ → close drawer
```

### Filter Flow

```mermaid
flowchart LR
    subgraph "Filter Controls"
        Search["🔍 Search input"]
        Type["Type dropdown"]
        State["State dropdown"]
    end
    subgraph "React State"
        Filters["filters: { page, search, type?, state? }"]
    end
    subgraph "Query"
        QKey["queryKey: ['pullRequests', page, limit, search, type, state]"]
        API["fetchAllPullRequests(filters)"]
    end

    Search -->|onChange| Filters
    Type -->|onValueChange| Filters
    State -->|onValueChange| Filters
    Filters -->|reset page=1| QKey
    QKey --> API
```

### Pull Requests API (Backend)

```mermaid
flowchart TD
    subgraph "GET /api/pull-requests"
        PR[GET /api/pull-requests] --> REQ{Query params}
        REQ --> P[page: number]
        REQ --> L[limit: number]
        REQ --> S[search: string]
        REQ --> T[type: PullRequestType?]
        REQ --> ST[state: PullRequestState?]
    end

    subgraph "GET /api/users/me/pull-requests"
        ME[GET /api/users/me/pull-requests] --> REQ2{Query params}
        REQ2 --> P2[page: number]
        REQ2 --> L2[limit: number]
        REQ2 --> UID["uid (from session header)"]
    end

    PR --> MID[session: requiresAdmin]
    ME --> MID2[session: getSessionFromHeaders]
    MID & MID2 --> SRV[pull-request.service.ts: getPullRequest]
    SRV --> DB[(PostgreSQL)]
    DB --> SRV
    SRV --> JSON[JSON PaginatedResponse]
```

### Table Columns

| Column      | Admin (`/prs`)                                                   | User (`/prs/me`)                                                      |
| ----------- | ---------------------------------------------------------------- | --------------------------------------------------------------------- |
| Title       | `#number` + title + PrStateBadge + PrTypeBadge                   | `#number` + title + PrStateBadge + PrTypeBadge                        |
| Repository  | Colored badge with repo name                                     | Colored badge with repo name                                          |
| Branch      | Branch name with git icon                                        | Branch name with git icon                                             |
| Type        | PrTypeBadge                                                      | PrTypeBadge                                                           |
| State       | PrStateBadge                                                     | PrStateBadge                                                          |
| Creator     | Avatar + username (UserColumn)                                   | Avatar + username (UserColumn)                                        |
| Reviews     | N/A                                                              | N/A                                                                   |
| Created     | Relative formatted date (N days ago)                             | Relative formatted date                                               |
