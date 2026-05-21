---
name: software-engineering-practices
description: Production-ready patterns for reliable, maintainable, scalable software. Covers frontend (React/Vue/TypeScript), backend (API/Concurrency), database (SQL/Redis), DevOps (K8s/SRE), languages (Go/Rust/Python), architecture (SOLID/DDD/Clean), and security (OWASP). Use when writing production code, designing schemas, configuring infrastructure, implementing features, or reviewing code quality.
triggers:
  layer-1: [always]
  layer-2:
    frontend: ["React", "Vue", "component", "JSX", "hook", "TypeScript", "JavaScript", "CSS", "Tailwind", "HTML", "Vite", "DOM", "frontend", "UI"]
    backend: ["API", "REST", "GraphQL", "HTTP", "endpoint", "service", "microservice", "server", "handler", "middleware"]
    database: ["SQL", "database", "schema", "table", "index", "query", "Redis", "cache", "PostgreSQL", "MySQL", "migration"]
    devops: ["Docker", "Kubernetes", "K8s", "etcd", "container", "deployment", "CI/CD", "monitoring", "SRE", "infrastructure"]
    language: ["Go", "Golang", "Rust", "goroutine", "channel", "ownership", "borrowing", "trait", "interface", "Python"]
    architecture: ["SOLID", "Clean Architecture", "DDD", "Domain-Driven Design", "microservice", "hexagonal", "layered", "CQRS"]
    security: ["OWASP", "XSS", "CSRF", "SQL injection", "authentication", "authorization", "JWT", "security"]
  layer-3:
    - trigger: ["deep", "advanced", "performance", "optimize", "security", "scale", "high-performance", "production"]
      modules: [advanced]
protected: false
---

# Software Engineering Best Practices

Production-ready patterns for building reliable, maintainable, and scalable software systems.

## Quick Navigation

| Domain | File | Keywords |
|--------|------|----------|
| **Universal Foundations** | [foundations.md](foundations.md) | Code quality, testing, error handling, documentation |
| **Frontend** | [frontend.md](frontend.md) | React, Vue, TypeScript, CSS, Tailwind, Vite |
| **Backend** | [backend.md](backend.md) | API design, concurrency, caching, error handling |
| **Database** | [database.md](database.md) | SQL, Redis, schema design, optimization |
| **DevOps** | [devops.md](devops.md) | Kubernetes, etcd, SRE, CI/CD |
| **Languages** | [languages.md](languages.md) | Go, Rust, Python best practices |
| **Architecture** | [architecture.md](architecture.md) | SOLID, Clean Architecture, DDD, microservices |
| **Security** | [security.md](security.md) | OWASP, input validation, auth, secrets |
| **Advanced** | [advanced.md](advanced.md) | Performance, distributed systems, observability |
| **Code Examples** | [examples/](examples/) | Working code snippets by topic |

## Usage

1. **Always check** [foundations.md](foundations.md) first — universal principles apply everywhere
2. **Pick a domain** based on what you're working on
3. **Review anti-patterns** in each domain to avoid common mistakes
4. **Consult advanced** topics only when needed (performance, scaling, security hardening)

## Core Principles (TL;DR)

- **Simplicity first**: Minimum code that solves the problem
- **Fail fast**: Validate inputs at boundaries, never swallow errors
- **Explicit over implicit**: Return errors, don't use `any` or `magic`
- **Test pyramid**: 70% unit, 20% integration, 10% E2E
- **One reason to change**: Single Responsibility per module
- **Code explains what, comments explain why**

## Project Structure Templates

See individual domain files for recommended project structures.

## References

- [React.dev](https://react.dev/learn) · [Vue.js](https://vuejs.org/guide/) · [TypeScript](https://www.typescriptlang.org/docs/)
- [Effective Go](https://go.dev/doc/effective_go) · [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/current/) · [Redis Best Practices](https://redis.io/topics/best-practices)
- [Kubernetes Docs](https://kubernetes.io/docs/) · [Google SRE Book](https://sre.google/sre-book/table-of-contents/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)