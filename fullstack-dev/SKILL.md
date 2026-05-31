---
name: fullstack-dev
description: "Full-stack backend architecture and frontend-backend integration guide. Use when building a full-stack app, creating REST API with frontend, scaffolding backend service, building todo/CRUD/real-time/chat app, Express + React, Next.js API, Node.js/Python/Go backend, designing service layers, implementing error handling, managing config/auth, setting up API clients, implementing auth flows, handling file uploads, adding real-time features (SSE/WebSocket), hardening for production. DO NOT TRIGGER when: pure frontend UI work, pure CSS/styling, database schema only."
license: MIT
metadata:
  category: full-stack
  version: "1.0.0"
---

# Full-Stack Development Practices

## Mandatory Workflow

**Follow in order before writing any code.**

**Step 0** — Gather: stack, service type, database, integration, real-time, auth.

**Step 1** — State decisions (structure, API client, auth, real-time, errors). See [project-structure](references/project-structure.md), [api-client-patterns](references/api-client-patterns.md), [auth-flow](references/auth-flow.md), [real-time](references/real-time.md), [error-handling](references/error-handling.md).

**Step 2** — Scaffold with the checklist below. Implement ALL items.

**Step 3** — Implement following linked references.

**Step 4** — Verify: build both sides, smoke-test `/health`, check integration (CORS, base URL, auth), test real-time sync if applicable.

**Step 5** — Handoff: what was built, how to run, what's missing, key files.

---

## Quick Start — New Backend Service

- [ ] Feature-first structure, [see guide](references/project-structure.md)
- [ ] Centralized typed config, env vars validated at startup
- [ ] Typed error hierarchy + global handler, [see guide](references/error-handling.md)
- [ ] Structured JSON logging with request ID, [see guide](references/logging-observability.md)
- [ ] Database migrations + connection pooling, [see guide](references/db-schema.md)
- [ ] Input validation on all endpoints
- [ ] Auth middleware, [see guide](references/auth-flow.md)
- [ ] Health checks (`/health`, `/ready`) + graceful shutdown, [see guide](references/production-hardening.md)
- [ ] CORS with explicit origins + security headers (helmet)
- [ ] `.env.example` committed

## Quick Start — Frontend-Backend Integration

- [ ] Typed API client configured, [see guide](references/api-client-patterns.md)
- [ ] Base URL from env var, auth token attached automatically
- [ ] API errors mapped to user-facing messages, loading states handled
- [ ] Type safety across boundary (shared types / tRPC / OpenAPI)
- [ ] CORS with explicit origins, refresh token flow (httpOnly cookie + retry on 401)

---

## Quick Navigation

| Need to… | Reference |
|----------|-----------|
| Project structure / layering | [project-structure.md](references/project-structure.md) |
| Config + secrets + CORS | [environment-management.md](references/environment-management.md) |
| Error handling (backend + frontend) | [error-handling.md](references/error-handling.md) |
| Database access / migrations | [db-schema.md](references/db-schema.md) |
| API client patterns | [api-client-patterns.md](references/api-client-patterns.md) |
| Auth / middleware / RBAC | [auth-flow.md](references/auth-flow.md) |
| Logging / observability | [logging-observability.md](references/logging-observability.md) |
| Background jobs | [background-jobs.md](references/background-jobs.md) |
| Caching | [caching.md](references/caching.md) |
| File uploads | [file-upload.md](references/file-upload.md) |
| Real-time (SSE / WebSocket) | [real-time.md](references/real-time.md) |
| Production hardening | [production-hardening.md](references/production-hardening.md) |
| Release checklist | [release-checklist.md](references/release-checklist.md) |
| API design | [api-design.md](references/api-design.md) |
| Testing strategy | [testing-strategy.md](references/testing-strategy.md) |

---

## Anti-Patterns

| # | ❌ Don't | ✅ Do Instead |
|---|---------|--------------|
| 1 | Business logic in controllers | Service layer |
| 2 | `process.env` scattered | Centralized typed config |
| 3 | `console.log` in production | Structured JSON logger |
| 4 | Generic `Error('oops')` | Typed error hierarchy |
| 5 | Direct DB calls in controllers | Repository pattern |
| 6 | No input validation | Validate at boundary (Zod/Pydantic) |
| 7 | Silent catch | Log + rethrow / return error |
| 8 | No health checks | `/health` + `/ready` |
| 9 | Hardcoded secrets | Environment variables |
| 10 | No graceful shutdown | Handle SIGTERM |
| 11 | Hardcoded API URL | Env var (`NEXT_PUBLIC_API_URL`) |
| 12 | JWT in localStorage | Memory + httpOnly refresh cookie |
| 13 | Raw API errors to users | Map to human-readable messages |
| 14 | Retry 4xx errors | Only retry 5xx |
| 15 | Blank screens while loading | Skeleton / spinner |
| 16 | Large uploads through server | Presigned URL → direct to S3 |
| 17 | Polling for real-time | SSE or WebSocket |
| 18 | Duplicate types across boundary | Shared types, tRPC, or OpenAPI |
