---
name: system-architecture-practices
description: Architecture and design methodology best practices covering TDD, BDD, DDD, Clean Architecture, Hexagonal Architecture, design patterns, and microservices. Use when designing system structure, defining domain models, implementing testing strategies, organizing complex business logic, or choosing between monolith and microservices.
triggers:
  layer-1: [always]
  layer-2:
    methodology: ["TDD", "BDD", "DDD", "test-driven", "behavior-driven", "domain-driven", "red-green-refactor", "Gherkin", "ubiquitous language", "bounded context", "aggregate"]
    architecture: ["Clean Architecture", "Hexagonal", "Onion", "Ports and Adapters", "layered", "microservices", "monolith", "modular", "SOLID", "dependency inversion"]
    design: ["design pattern", "factory", "strategy", "observer", "adapter", "repository", "unit of work", "CQRS", "event sourcing", "saga"]
    testing: ["unit test", "integration test", "mock", "stub", "contract test", "test double"]
  layer-3:
    - trigger: ["deep", "advanced", "enterprise", "scale", "distributed", "evolution", "legacy", "migration"]
      modules: [ddd-advanced, architecture-advanced, testing-advanced, patterns-advanced]
protected: false
---

# System Architecture Best Practices

Patterns and methodologies for designing robust, maintainable, and evolvable software systems.

## Quick Navigation

| Topic | File | Keywords |
|-------|------|----------|
| **Foundations** | [foundations.md](foundations.md) | SOLID, cohesion, coupling, encapsulation |
| **TDD** | [tdd.md](tdd.md) | Red-green-refactor, testing pyramid, laws of TDD |
| **BDD** | [bdd.md](bdd.md) | Gherkin, Three Amigos, living documentation |
| **DDD** | [ddd.md](ddd.md) | Bounded contexts, aggregates, domain events |
| **Architecture Styles** | [architecture.md](architecture.md) | Clean, Hexagonal, Layered, Microservices |
| **Design Patterns** | [patterns.md](patterns.md) | GoF, CQRS, Event Sourcing, Saga |
| **Testing Strategies** | [testing.md](testing.md) | Test doubles, contract testing, port testing |
| **Code Examples** | [examples/](examples/) | Go, Rust, TypeScript implementations |

## Decision Flowchart

```
Starting a new backend project?
    │
    ├─→ Simple CRUD with low traffic?
    │   └─→ MVC / Repository pattern
    │
    ├─→ Complex business logic?
    │   └─→ Clean Architecture / DDD
    │
    ├─→ Need executable specs for business rules?
    │   └─→ BDD with Gherkin
    │
    └─→ Multiple teams, independent deployments?
        └─→ Modular monolith → Microservices (later)
```

## Core Principles

1. **Start Simple**: Begin with modular monolith, extract services when needed
2. **Evolution Over Revolution**: Evolve architecture based on real pain points
3. **Dependencies Point Inward**: Domain at center, frameworks at edges
4. **Conway's Law**: Team structure shapes system design
5. **Test-Driven**: Red-green-refactor for all business logic
6. **Fitness Functions**: Automated checks that validate architectural constraints

## Comparison: TDD vs BDD vs DDD

| Aspect | TDD | BDD | DDD |
|--------|-----|-----|-----|
| **Focus** | Code correctness | Business behavior | Domain modeling |
| **Who participates** | Developers | Business + Dev + QA | Domain experts + Developers |
| **Output** | Unit tests | Executable specs | Domain model |
| **When to use** | All code | Complex requirements | Complex business logic |

## References

- [Kent Beck - Canon TDD](https://tidyfirst.substack.com/p/canon-tdd)
- [Martin Fowler - TDD](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
- [Cucumber BDD Documentation](https://cucumber.io/docs/bdd/)
- [Eric Evans - Domain-Driven Design](https://en.wikipedia.org/wiki/Domain-driven_design)
- [Robert C. Martin - Clean Architecture](https://tms-outsource.com/blog/posts/clean-architecture-in-software-development/)