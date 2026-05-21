# Layer 3: Architecture & Design

## SOLID Principles

- **Single Responsibility**: One reason to change per class/module
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Subtypes must be substitutable for base types
- **Interface Segregation**: Clients shouldn't depend on methods they don't use
- **Dependency Inversion**: Depend on abstractions, not concretions

## Clean Architecture

- **Dependency Rule**: Inner layers don't know about outer layers
- **Layers** (inner → outer):
  1. **Entities**: Business objects and rules (no dependencies)
  2. **Use Cases**: Application business rules (orchestrate entities)
  3. **Interface Adapters**: Convert data for use cases and frameworks
  4. **Frameworks/Drivers**: External tools (DB, web framework, UI)
- **Cross boundaries via interfaces**: Use cases define interfaces, outer layers implement
- **Framework independence**: Business logic doesn't depend on web framework or database

```
┌─────────────────────────────┐
│    Frameworks/Drivers       │  Web, DB, External APIs
│    ( outer layer )          │
├─────────────────────────────┤
│    Interface Adapters       │  Controllers, Presenters, Gateways
│    ( middle layer )         │
├─────────────────────────────┤
│    Use Cases                │  Application Business Rules
│    ( inner layer )          │
├─────────────────────────────┤
│    Entities                 │  Enterprise Business Rules
│    ( core layer )           │
└─────────────────────────────┘
```

## Domain-Driven Design (DDD)

- **Ubiquitous Language**: Same terms in code, docs, and conversations
- **Bounded Contexts**: Split domain into isolated contexts with explicit boundaries
- **Entities**: Objects with identity (e.g., `User` with UUID)
- **Value Objects**: Immutable objects without identity (e.g., `Money`, `Address`)
- **Aggregates**: Cluster of entities/value objects with aggregate root
- **Domain Events**: Capture significant business events (`OrderPlaced`)
- **Repositories**: Abstract data access; one per aggregate root
- **Domain Services**: Business logic that doesn't belong to an entity/value object
- **Application Services**: Orchestrate use cases, no business logic

```go
// Example: Aggregate Root with Domain Events
type Order struct {
  id        OrderID
  items     []OrderItem
  status    OrderStatus
  events    []DomainEvent
}

func (o *Order) Pay() error {
  if o.status != Pending {
    return errors.New("order not pending")
  }
  o.status = Paid
  o.events = append(o.events, OrderPaid{OrderID: o.id})
  return nil
}
```

## Hexagonal Architecture (Ports & Adapters)

- **Domain** at center, independent of frameworks
- **Ports**: Interfaces defining what the domain needs (driven) or provides (driving)
- **Adapters**: Implementations of ports (REST adapter, DB adapter)
- **Testability**: Swap adapters for mocks in tests
- **Technology agnostic**: Change DB or web framework without touching domain

## Microservices Patterns

- **Database per Service**: Each service owns its data
- **API Gateway**: Single entry point, handles auth, routing, rate limiting
- **Event Sourcing**: Store state changes as events for auditability
- **CQRS**: Separate read and write models
- **Saga Pattern**: Distributed transactions via compensating actions
- **Circuit Breaker**: Fail fast when service is unhealthy
- **Bulkhead**: Isolate failures to contained compartments
- **Strangler Fig**: Gradually migrate from monolith to microservices

## Monolith vs Microservices Decision Matrix

| Factor | Monolith | Microservices |
|--------|----------|---------------|
| Team size | < 10 developers | > 10 developers |
| Domain complexity | Simple, clear boundaries | Complex, evolving domain |
| Deployment frequency | Weekly/monthly | Multiple times daily |
| Scale needs | Uniform scaling | Independent service scaling |
| Technology diversity | Single stack | Multiple languages/frameworks |
| Operational maturity | Limited | Mature DevOps/SRE |

## Architecture Anti-Patterns

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Big Ball of Mud | No structure, everything coupled | Introduce layers and boundaries |
| God Service | One service does everything | Split by bounded context |
| Shared Database | Services tightly coupled | Database per service |
| Distributed Monolith | Microservices that must deploy together | Ensure true independence |
| Premature Microservices | Overhead without benefit | Start with modular monolith |
| Anemic Domain Model | Logic in services, not entities | Rich domain models with behavior |
| Leaky Abstractions | Implementation details exposed | Hide internals, expose intent |
| Magic Strings/Numbers | Unmaintainable constants | Named constants, enums |