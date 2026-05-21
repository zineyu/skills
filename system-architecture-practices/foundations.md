# Layer 1: Universal Architecture Principles

## SOLID Principles

- **Single Responsibility**: One reason to change per module/class/function
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Subtypes must be substitutable for base types
- **Interface Segregation**: Many small interfaces over one large one
- **Dependency Inversion**: Depend on abstractions, not concrete implementations

```typescript
// Dependency Inversion: Domain defines interface
interface UserRepository {
  findById(id: UserId): Promise<User>
  save(user: User): Promise<void>
}

// Infrastructure implements it
class PostgresUserRepository implements UserRepository {
  async findById(id: UserId): Promise<User> { /* ... */ }
  async save(user: User): Promise<void> { /* ... */ }
}
```

## Design Quality Attributes

- **Cohesion**: Related code stays together (high cohesion)
  - Functional cohesion: Elements contribute to a single task
  - Sequential cohesion: Elements in a sequence
  - Communicational cohesion: Elements operate on same data
- **Coupling**: Minimize dependencies between modules (low coupling)
  - Data coupling: Pass only data
  - Control coupling: One module controls flow of another (avoid)
  - Common coupling: Modules share global data (avoid)
- **Encapsulation**: Hide implementation details behind interfaces
- **Abstraction**: Essential characteristics visible, details hidden
- **Separation of Concerns**: Distinct aspects handled by distinct modules

## Architectural Thinking

- **Start Simple**: Begin with a modular monolith, extract services when needed
- **Evolution Over Revolution**: Evolve architecture based on real pain points
- **Trade-off Analysis**: Every decision has costs — document and justify
- **Fitness Functions**: Automated checks that validate architectural constraints
  - Cyclomatic complexity < 10
  - No circular dependencies between modules
  - Domain layer has no external dependencies
- **Conway's Law**: Team structure shapes system design
  - Align team boundaries with service boundaries
  - Two-pizza teams (6-10 people) per service

## Architecture Anti-Patterns

| Anti-Pattern | Description | Solution |
|--------------|-------------|----------|
| **Big Ball of Mud** | No discernible architecture | Introduce bounded contexts, refactor incrementally |
| **Distributed Monolith** | Services share DB, sync chains | Ensure service autonomy with async communication |
| **Over-engineering** | CQRS + Event Sourcing for simple CRUD | Start simple, add complexity when needed |
| **Anemic Domain Model** | Entities with only getters/setters | Encapsulate business behavior in entities |
| **Leaky Abstractions** | DB/HTTP details in domain layer | Keep domain pure, use adapters |
| **God Classes** | Single class handling multiple responsibilities | Split by bounded contexts |
| **Spaghetti Architecture** | Uncontrolled dependencies between modules | Enforce dependency direction with architecture tests |
| **Golden Hammer** | Using one pattern for everything | Choose patterns based on context |
| **Not Invented Here** | Rejecting external solutions | Evaluate build vs buy honestly |
| **Premature Optimization** | Optimizing before measuring | Profile first, optimize bottlenecks |

## Architecture Decision Records (ADR)

Document significant architectural decisions:

```markdown
# ADR-001: Use PostgreSQL over MongoDB

## Status
Accepted

## Context
Need a database for user and order data. Team has SQL expertise.

## Decision
Use PostgreSQL with proper schema design.

## Consequences
- ✅ Strong consistency, ACID transactions
- ✅ Team expertise
- ❌ Schema migrations required
- ❌ Horizontal scaling more complex
```

**Format**: Number, Title, Status, Context, Decision, Consequences
**Store**: `/docs/adr/ADR-NNN-title.md`
**Review**: Quarterly review of accepted ADRs