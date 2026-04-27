# PR Review Pulse

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.x-black?logo=bun)](https://bun.sh/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue?logo=postgresql)](https://www.postgresql.org/)

> **Track and analyze GitHub Pull Request metrics in real-time**  
> A comprehensive dashboard for PR analytics, review tracking, and team performance insights

## ✨ Features

- 📊 **Real-time KPIs** — Track PR lifecycle metrics (time to review, merge time, approval rates)
- 🔔 **GitHub Webhooks** — Automatic PR event synchronization (open, review, merge, close)
- 📈 **Analytics Dashboard** — Time-series charts, distribution graphs, and trend analysis
- 👥 **Multi-user Support** — Team and individual contributor dashboards
- 🎨 **Modern UI** — Built with shadcn/ui and Tailwind CSS
- 🔐 **GitHub OAuth** — Secure authentication with GitHub accounts

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL 17
- **State:** React Query (TanStack Query)
- **Styling:** Tailwind CSS 4, shadcn/ui
- **Auth:** NextAuth.js v4
- **Runtime:** Bun 1.x
- **Linting/Formatting:** Biome

## Prerequisites

- Bun >= 1.1.0
- Node.js >= 22.14.0
- PostgreSQL >= 17
- GitHub OAuth App credentials
- ngrok (for webhook development)

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/DiegoIpaez/pr-review-pulse.git
cd pr-review-pulse

# Install dependencies
bun install

# Setup environment
cp .env.example .env

# Start database
docker-compose up -d postgres

# Run migrations
bun run prisma:migrate

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## ⚡ Quickstart

**Minimal setup to see the dashboard:**

```bash
# 1. Clone and install
git clone https://github.com/DiegoIpaez/pr-review-pulse.git && cd pr-review-pulse
bun install

# 2. Minimal .env (using defaults)
echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pr_review_pulse" > .env
echo "NEXT_AUTH_SECRET=$(openssl rand -base64 32)" >> .env
echo "NEXT_PUBLIC_BASE_URL=http://localhost:3000" >> .env

# 3. Start & seed
docker-compose up -d postgres
bun run prisma:migrate
bun run dev
```

Visit `http://localhost:3000` and sign in with your GitHub account (OAuth setup required).

## 📖 Setup Guide

### 1. GitHub OAuth App

Create a GitHub OAuth App at [github.com/settings/developers](https://github.com/settings/developers):

- **Homepage URL:** `http://localhost:3000`
- **Callback URL:** `http://localhost:3000/api/auth/callback/github`

Add to `.env`:
```bash
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

### 2. GitHub Webhooks (Optional)

For real-time PR event synchronization:

```bash
# Start ngrok tunnel
docker-compose up -d ngrok

# Get public URL
curl http://localhost:4040/api/tunnels | grep public_url
```

Configure webhook in your GitHub repository:
- **URL:** `https://your-ngrok-url.ngrok.io/api/webhooks/github`
- **Content type:** `application/json`
- **Secret:** Value from `GITHUB_WEBHOOK_SECRET` in `.env`
- **Events:** `pull_request`, `pull_request_review`, `pull_request_review_comment`

## 🔍 API Reference

### Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/pull-requests` | List all pull requests | ✅ |
| `GET` | `/api/pull-requests/kpis` | Global KPI metrics | ✅ |
| `GET` | `/api/pull-requests/distribution` | PR type distribution | ✅ |
| `GET` | `/api/users/me/pull-requests` | Current user's PRs | ✅ |
| `GET` | `/api/users/me/pull-requests/kpis` | User-specific KPIs | ✅ |
| `GET` | `/api/repositories` | List repositories | ✅ |
| `GET` | `/api/users` | List users | ✅ |
| `POST` | `/api/webhooks/github` | GitHub webhook receiver | 🔑 |

**Example Request:**

```bash
# Get PR KPIs
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/pull-requests/kpis

# Response
{
  "avgTimeToFirstReview": 3.5,
  "avgTimeToMerge": 24.2,
  "approvalRate": 0.85,
  "totalPRs": 156
}
```

**Swagger Documentation:** Visit `/docs` when running locally

## ⚙️ Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ | - | PostgreSQL connection string |
| `NEXT_PUBLIC_BASE_URL` | ✅ | - | App base URL (e.g., `http://localhost:3000`) |
| `NEXT_AUTH_SECRET` | ✅ | - | NextAuth.js encryption secret (min 32 chars) |
| `GITHUB_CLIENT_ID` | ✅ | - | GitHub OAuth App Client ID |
| `GITHUB_CLIENT_SECRET` | ✅ | - | GitHub OAuth App Client Secret |
| `GITHUB_WEBHOOK_SECRET` | ⚠️ | - | Webhook signature secret (optional but recommended) |
| `AUTH_TRUST_HOST` | ❌ | `false` | Set to `true` in development only |

**Generate secrets:**
```bash
# NEXT_AUTH_SECRET
openssl rand -base64 32

# GITHUB_WEBHOOK_SECRET
openssl rand -hex 32
```

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server (port 3000) |
| `bun run build` | Build for production |
| `bun run start` | Start production server |
| `bun run lint` | Run Biome linter |
| `bun run format` | Format code with Biome |
| `bun run prisma:migrate` | Create and apply migrations |
| `bun run prisma:studio` | Open Prisma Studio GUI |
| `bun run prisma:reset` | Reset database (⚠️ deletes all data) |

## Project Structure

```
src/
├── app/                     # Next.js App Router
│   ├── (authenticated)/     # Protected routes
│   │   ├── admin/           # Admin dashboard
│   │   └── collaborator/    # Collaborator views
│   ├── (public)/            # Public routes
│   ├── api/                 # API routes
│   └── docs/                # Swagger documentation
├── components/              # Reusable components
├── lib/                     # Utilities & clients
├── services/                # Frontend services
├── middlewares/             # Request middlewares
├── contracts/               # Zod schemas & types
├── hooks/                   # Custom React hooks
└── generated/               # Prisma generated files

prisma/
└── schema.prisma            # Database schema
```

## 🏗️ Architecture

```
Client → React Query → API Route → Service → Prisma → PostgreSQL
```

**Layer Responsibilities:**

| Layer | Responsibility | Example |
|-------|----------------|---------|
| **Components** | UI rendering + React Query | `PullRequestTable.tsx` |
| **React Query** | Data fetching & caching | `usePullRequests()` hook |
| **API Routes** | HTTP handling only | `app/api/pull-requests/route.ts` |
| **Services** | Business logic | `pullRequest.service.ts` |
| **Prisma** | Database queries | `prisma.pullRequest.findMany()` |

**Key Principles:**
- ✅ Use Bun, not npm/yarn
- ✅ Use `logger` from `@/lib/logger`, never `console.log`
- ✅ All validation with Zod schemas
- ✅ Services live in `src/app/api/**/[name].service.ts`
- ✅ React Query for all server state

## 🤝 Contributing

### Development Setup

1. Fork and clone the repository
2. Install dependencies: `bun install`
3. Start database: `docker-compose up -d postgres`
4. Run migrations: `bun run prisma:migrate`
5. Start dev server: `bun run dev`

### Code Standards

**Commit Convention (Conventional Commits):**
```bash
# Format: <type>(<scope>): <description>

feat(api): add PR distribution endpoint
fix(ui): resolve table pagination bug
docs(readme): update environment variables
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Pre-commit Checks:**
- ✅ Biome linting + formatting
- ✅ Commitlint validation
- ✅ TypeScript type checking

**Critical Rules:**
- Never use `console.log` → Use `logger` from `@/lib/logger`
- Max 3 function parameters → Use object destructuring
- No business logic in API routes → Move to services
- No direct Prisma instantiation → Use `@/lib/clients/prisma-client`

### Pull Request Checklist

- [ ] Code follows project conventions (see `.github/instructions/`)
- [ ] All types validated with Zod schemas
- [ ] API routes only handle HTTP (business logic in services)
- [ ] React Query used for all data fetching
- [ ] Biome linting passes (`bun run lint`)
- [ ] No `console.log` statements (use `logger`)
- [ ] Commits follow conventional format

### Biome Configs

| Config | Description | Use Case |
|--------|-------------|----------|
| `biome.json` | **Pragmatic** (Current) | ⭐ Default - `recommended` + critical rules |
| `biome.essential.json` | **Essential** | 70 explicit anti-bug rules only |
| `biome.full.json` | **Full** | 66 rules + strict style enforcement |

## 📄 License

MIT © 2026 Diego Iván Paez

See [LICENSE](LICENSE) for details.
