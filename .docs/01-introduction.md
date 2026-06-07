# Module 01: Introduction

## Overview

**PR Review Pulse** is a SaaS platform that enables development teams to monitor and analyze GitHub Pull Request metrics. It connects via GitHub OAuth for authentication and receives real-time events via webhooks to keep data synchronized.

### Key Capabilities

- Real-time synchronization of PRs and reviews via GitHub webhooks
- KPI Dashboard: open PRs, PRs without reviews, approved pending merge, merged
- Time-series charts: daily PR creation/close/merge activity
- PR type distribution: feature, fix, hotfix, refactor, docs, test, release, chore
- Paginated tables with search and filters for PRs, repositories, and users
- Side drawer with PR details and review cards with markdown
- Role-based access control: admin (global) vs user (personal)
- Dark/light/system theme

## Detailed Tech Stack

| Category        | Technology                                   |
| --------------- | -------------------------------------------- |
| Framework       | Next.js 16 (App Router)                      |
| Language        | TypeScript                                   |
| Runtime         | Bun                                          |
| Database        | PostgreSQL 17                                |
| ORM             | Prisma                                       |
| Authentication  | NextAuth.js v4 + GitHub OAuth                |
| Server State    | TanStack React Query v5                      |
| Validation      | Zod                                          |
| UI              | shadcn/ui + Tailwind CSS v4 + Recharts       |
| Linter          | Biome                                        |
| Logger          | Winston (daily rotate file)                  |

## Data Model (ER)

```mermaid
erDiagram
    User ||--o{ PullRequest : "creates"
    User ||--o{ PullRequest : "merges"
    User ||--o{ PullRequestReview : "reviews"
    User ||--o{ Repository : "owns"
    Repository ||--o{ PullRequest : "contains"
    PullRequest ||--o{ PullRequestReview : "has"

    User {
        int id PK
        string username UK
        string email
        string url
        string avatar_url
        enum access_status "pending | active | blocked"
        enum role "admin | user"
        bigint github_id UK
        datetime created_at
        datetime updated_at
    }

    Repository {
        int id PK
        string url
        string name UK
        string description
        int owner_id FK
        boolean fork
        boolean private
        bigint github_id UK
        datetime created_at
        datetime updated_at
        datetime pushed_at
    }

    PullRequest {
        int id PK
        int number
        string title
        text body
        int repository_id FK
        enum type "feature | fix | hotfix | refactor | docs | test | release | chore | no_ticket"
        string branch
        int creator_id FK
        int merged_by_id FK "nullable"
        string url
        enum state "open | closed | merged"
        int commits
        int additions
        int deletions
        int changed_files
        bigint github_id UK
        datetime created_at
        datetime updated_at
        datetime merged_at "nullable"
        datetime closed_at "nullable"
    }

    PullRequestReview {
        int id PK
        int pull_request_id FK
        int reviewer_id FK "nullable"
        text body "nullable"
        string url
        bigint github_id UK
        datetime approved_at "nullable"
        datetime submitted_at
        enum state "approved | changes_requested | commented | dismissed"
    }
```

## General Data Flow

```mermaid
sequenceDiagram
    participant GH as GitHub
    participant WH as Webhook API
    participant DB as PostgreSQL
    participant API as REST API
    participant UI as Frontend (React Query)

    Note over GH,UI: --- INGESTION (via webhook) ---
    GH->>WH: POST /api/webhooks/github (PR/review event)
    WH->>WH: Verify HMAC signature
    WH->>WH: Validate payload with Zod
    WH->>DB: Upsert User / Repository / PR / Review
    DB-->>WH: Confirmation
    WH-->>GH: 200 OK

    Note over GH,UI: --- QUERY (via React Query) ---
    UI->>API: GET /api/pull-requests/kpis
    API->>DB: Raw SQL aggregation
    DB-->>API: Results
    API-->>UI: JSON response
    UI->>UI: Render KPIs
```

## Authentication Flow

```mermaid
flowchart TD
    A[Unauthenticated user] --> B{Navigates to protected route?}
    B -->|Yes| C[Redirect to /login]
    B -->|No| D[Public page: /login]
    C --> D
    D --> E[Click "Sign in with GitHub"]
    E --> F[Redirect to GitHub OAuth]
    F --> G{User authorizes?}
    G -->|No| D
    G -->|Yes| H[NextAuth Callback]
    H --> I[Upsert user in DB]
    I --> J{access_status = active?}
    J -->|Yes| K[Generate JWT + session]
    K --> L[Redirect to / based on role]
    J -->|No| M[Redirect to /access-status]
    L --> N[Admin -> /prs]
    L --> O[User -> /prs/me]
```

## Directory Structure

```
src/
├── app/
│   ├── (authenticated)/   # Protected routes (sidebar layout)
│   │   ├── dashboard/
│   │   ├── prs/
│   │   ├── repositories/
│   │   └── users/
│   ├── (public)/          # Public routes
│   │   ├── login/
│   │   └── access-status/
│   └── api/               # REST API
│       ├── auth/
│       ├── pull-requests/
│       ├── repositories/
│       ├── users/
│       └── webhooks/github/
├── components/            # UI components
│   ├── common/            # Dashboard, badges, drawer
│   ├── providers/         # Session, Theme, Query providers
│   └── ui/                # shadcn/ui + custom
├── constants/             # Config, routes, menu
├── contracts/             # Zod schemas + TS types
├── hooks/                 # Custom hooks
├── lib/                   # Prisma singleton, axios, logger
├── middlewares/           # Session + roles middleware
├── services/              # Frontend services (axios wrappers)
└── utils/                 # Formatters, handlers, utils
```
