# PR Review Pulse

> GitHub Pull Request analytics and review tracking dashboard

## Features

- 📊 Real-time PR metrics and KPIs
- 👥 User and repository management
- 🔔 GitHub webhook integration
- 📈 Time-series analytics
- 🎨 Modern UI with shadcn/ui
- 🔐 OAuth authentication via GitHub

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

## Quick Start

1. **Clone repository**
   ```bash
   git clone <repo-url>
   cd pr-review-pulse
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Start database**
   ```bash
   docker-compose up -d postgres
   ```

5. **Run migrations**
   ```bash
   bun run prisma:migrate
   ```

6. **Start development server**
   ```bash
   bun run dev
   ```

7. **Setup ngrok tunnel (for webhooks)**
   ```bash
   docker-compose up -d ngrok
   # Visit http://localhost:4040 to get public URL
   ```

8. **Configure GitHub webhook**
   - Go to repository settings → Webhooks
   - Add webhook URL: `<ngrok-url>/api/webhooks/github`
   - Select events: Pull requests, Pull request reviews
   - Set secret from `GITHUB_WEBHOOK_SECRET`

## Scripts

```bash
bun run dev               # Start development server
bun run build             # Build for production
bun run start             # Start production server
bun run lint              # Run Biome linter
bun run format            # Format code with Biome
bun run prisma:migrate    # Create/apply migrations
bun run prisma:studio     # Open Prisma Studio GUI
bun run prisma:reset      # Reset database
```

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

## Code Quality & Linting

This project uses **Biome** for linting and formatting. Three configurations are available:

| Config | Description | Use Case |
|--------|-------------|----------|
| `biome.json` | **Pragmatic** (Current) - `recommended` + critical rules | ⭐ Default - minimal config, auto-updates |
| `biome.essential.json` | **Essential** - 70 explicit anti-bug rules only | Explicit control, no auto-updates |
| `biome.full.json` | **Full** - 66 rules + style enforcement | Large teams, strict conventions |

### Key Rules (Current Config)
- `noConsole: error` → Use `logger` from `@/lib/logger`
- `useMaxParams: error` → Max 3 parameters (use object destructuring)
- `noArrayIndexKey: error` → No React `key={index}`
- `noDangerouslySetInnerHtml: error` → XSS prevention
- Plus ~80-100 rules from `"recommended": true`

## License

MIT
