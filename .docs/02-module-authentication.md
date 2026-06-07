# Module 02: Authentication

## Requirements

### Functional
- Login via GitHub OAuth
- Automatic user registration on first login
- Access control based on status (`pending`, `active`, `blocked`)
- Access control based on role (`admin`, `user`)
- Post-login redirect based on user role
- Logout
- Session persistence via JWT + cookies

### Non-Functional
- Secure session with httpOnly cookies
- API routes return 401/403 without HTML redirect
- Protection middleware applied to all routes

## Users

| Actor     | Description                                   | Permissions                                   |
| --------- | --------------------------------------------- | --------------------------------------------- |
| Visitor   | Unauthenticated user                          | Only `/login`, `/access-status`               |
| Pending   | Authenticated but not approved by an admin    | Only `/access-status`                         |
| Blocked   | Access revoked by an admin                    | Only `/access-status`                         |
| User      | Standard role, authenticated and active       | `/dashboard/me`, `/prs/me`                    |
| Admin     | Administrator role, authenticated and active  | All routes (`/dashboard`, `/prs`, `/users`, `/repositories`) |

## Screens

### Login (`/login`)
- Header with application name
- "Sign in with GitHub" button
- Floating footer with links to GitHub and LinkedIn (author's)
- Background with particle animation (CanvasParticles)

```mermaid
flowchart TD
    subgraph "Login Screen"
        Title["PR Review Pulse"]
        Subtitle["Log in with your GitHub account"]
        Btn["Sign in with GitHub"]
        Footer["GitHub | LinkedIn"]
    end
```

### Access Status (`/access-status`)
Shows user status when not active:
- **Pending**: yellow icon, message "Access Pending — Your access request is pending approval"
- **Blocked**: red icon, message "Access Blocked — Your account has been blocked"
- "Go to login" button that logs out

## Flows

### Login Flow

```mermaid
sequenceDiagram
    actor U as User
    participant Login as /login
    participant GH as GitHub
    participant NextAuth as NextAuth Handler
    participant DB as PostgreSQL
    participant JWT as JWT Token

    U->>Login: Navigate to /login
    U->>Login: Click "Sign in with GitHub"
    Login->>GH: Redirect to GitHub OAuth
    GH->>U: Authorize app?
    U->>GH: Yes
    GH->>NextAuth: Callback with code
    NextAuth->>NextAuth: signIn callback validates profile
    NextAuth->>DB: upsertGitHubUser()
    DB-->>NextAuth: User (with role + access_status)
    NextAuth->>NextAuth: jwt callback adds uid, role, access_status
    NextAuth->>NextAuth: session callback merge token
    NextAuth->>U: Session cookie
    U->>U: Redirect to / (proxy decides destination)
```

### Route Protection Flow (Middleware)

```mermaid
flowchart TD
    REQ[Request] --> PROXY[proxy.ts middleware]
    PROXY --> PUBLIC{Is public route?}
    PUBLIC -->|Yes| NEXT[NextResponse.next]
    PUBLIC -->|No| AUTH{Has valid JWT?}
    AUTH -->|No| API{Is /api/*?}
    API -->|Yes| 401[401 Unauthorized JSON]
    API -->|No| LOGIN[Redirect to /login]
    AUTH -->|Yes| ACTIVE{access_status = active?}
    ACTIVE -->|No| ACCESS[Redirect to /access-status]
    ACTIVE -->|Yes| ROLE{Role has access to route?}
    ROLE -->|Yes| INJECT[Inject headers uid, role, access_status]
    INJECT --> NEXT
    ROLE -->|No| 404[Redirect to /404]
```

### API Session Validation

```mermaid
sequenceDiagram
    participant API as API Route
    participant Session as session.middleware.ts
    participant Roles as roles.middleware.ts

    API->>Session: getSessionFromHeaders(headers)
    Session->>Session: Validate uid (number), role, access_status=active
    alt Invalid
        Session-->>API: throw 401
    end
    Session-->>API: user { uid, role, accessStatus }
    API->>Roles: requiresAdmin(headers)
    Roles->>Roles: Validate role=admin
    alt Not admin
        Roles-->>API: throw 403
    end
    Roles-->>API: admin user
    API->>API: Execute business logic
```
