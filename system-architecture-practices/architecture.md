# Architecture Styles

## Clean Architecture / Hexagonal Architecture

### Core Principles

- **Domain logic at the center**: Dependencies point inward
- **Outer layers depend on inner layers**: Framework, UI, database are outer
- **Domain defines interfaces (Ports)**: Infrastructure implements (Adapters)
- **Design domain model before persistence/API concerns**
- **Apply SOLID principles** at class and system levels
- **Start simple**: Modular monolith first, microservices when needed

### Layer Structure

```
┌───────────────────────────────────────────────┐
│  External Concerns (UI, Framework, DB)        │
│  ───────────────────────────────────────────  │
│  Adapter Layer (Controllers, Repositories)    │
│  ───────────────────────────────────────────  │
│  Application Layer (Use Cases, Services)      │
│  ───────────────────────────────────────────  │
│  Domain Layer (Entities, Value Objects)       │  ▲ Dependencies point inward
└───────────────────────────────────────────────┘
```

### Dependency Rule

High-level modules shouldn't depend on low-level modules. Both depend on abstractions.

```typescript
// Domain defines the interface (Port)
interface LoadAccountPort {
  loadAccount(id: AccountId, baselineDate: Date): Promise<Account>
}

// Infrastructure implements (Adapter)
class AccountPersistenceAdapter implements LoadAccountPort {
  constructor(private accountRepository: AccountJpaRepository) {}

  async loadAccount(id: AccountId, baselineDate: Date): Promise<Account> {
    const account = await this.accountRepository.findById(id.value)
    // Map JPA entity to domain entity
    return this.mapToDomain(account)
  }
}
```

### Package Organization

- **Package by layer**: Technical separation (controllers/, services/, repositories/)
- **Package by feature**: Domain separation (order/, payment/, inventory/)
- **Recommendation**: Package by feature with Clean Architecture layers inside

```
src/
├── account/                    # Feature module
│   ├── domain/                 # Domain layer
│   │   ├── account.ts
│   │   └── activity.ts
│   ├── application/            # Application layer
│   │   ├── port/
│   │   │   ├── in/
│   │   │   │   └── send-money.ts      # Input port (use case)
│   │   │   └── out/
│   │   │       └── load-account.ts    # Output port (repository)
│   │   └── service/
│   │       └── send-money-service.ts  # Use case implementation
│   └── adapter/                # Adapter layer
│       ├── persistence/
│       │   └── account-persistence-adapter.ts
│       └── web/
│           └── account-controller.ts
└── shared/
    └── money.ts
```

## Layered Architecture

### Classic Layers

1. **Presentation Layer**: UI, API controllers, DTOs
2. **Application Layer**: Use cases, application services, transaction boundaries
3. **Domain Layer**: Business logic, entities, value objects, domain services
4. **Infrastructure Layer**: Database, external APIs, messaging, file system

### Rules

- Layers can only depend on layers below them
- Domain layer has zero external dependencies
- Cross-layer communication goes through well-defined interfaces
- DTOs for layer boundaries, domain objects inside domain layer

```typescript
// Presentation Layer (Controller)
class OrderController {
  constructor(private placeOrderUseCase: PlaceOrderUseCase) {}

  async createOrder(req: Request, res: Response): Promise<void> {
    const command = new PlaceOrderCommand(
      req.body.customerId,
      req.body.items
    )
    const result = await this.placeOrderUseCase.execute(command)
    res.status(201).json({ orderId: result.orderId })
  }
}

// Application Layer (Use Case)
class PlaceOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private eventPublisher: EventPublisher
  ) {}

  async execute(command: PlaceOrderCommand): Promise<PlaceOrderResult> {
    const order = new Order(
      OrderId.generate(),
      new CustomerId(command.customerId)
    )
    
    for (const item of command.items) {
      order.addItem(item.productId, item.price, item.quantity)
    }
    
    await this.orderRepository.save(order)
    await this.eventPublisher.publishAll(order.getEvents())
    
    return { orderId: order.id }
  }
}

// Domain Layer (Entity)
class Order {
  // ... domain logic only, no framework dependencies
}
```

## Microservices

### Characteristics

- **Service Boundaries**: Align with bounded contexts
- **Autonomy**: Independent deployability, separate databases
- **Communication**: Async messaging preferred over sync RPC
- **Data Ownership**: Each service owns its data
- **Challenges**: Distributed transactions, eventual consistency, operational complexity

### When to Use

| Factor | Microservices | Monolith |
|--------|--------------|----------|
| Team size | > 10 developers | < 10 developers |
| Domain complexity | Complex, clear boundaries | Simple, evolving |
| Deployment frequency | Multiple times daily | Weekly/monthly |
| Scale needs | Independent service scaling | Uniform scaling |
| Technology diversity | Multiple languages/frameworks | Single stack |

### Communication Patterns

```
Synchronous (REST/gRPC):
  Order Service → HTTP → Payment Service
  Pros: Simple, immediate response
  Cons: Tight coupling, cascading failures

Asynchronous (Message Queue):
  Order Service → Event Bus → Payment Service
  Pros: Loose coupling, resilience
  Cons: Complexity, eventual consistency
```

**Recommendation**: Use async for most inter-service communication, sync only when immediate response is required.

## Modular Monolith

- **Modules as Services**: Internal module boundaries mirror service boundaries
- **Single Deployment**: Deploy as one unit
- **Future Extraction**: Modules can become services when needed
- **Benefits**: Simpler operations, transactions within module, easier refactoring
- **Best for**: Growing teams with evolving domains

## Saga Pattern

Distributed transaction through sequence of local transactions:

### Orchestration

Central coordinator manages saga flow:

```
Saga Orchestrator
    │
    ├─→ Order Service: Create Order
    │   └─→ OK / Compensate: Cancel Order
    │
    ├─→ Payment Service: Process Payment
    │   └─→ OK / Compensate: Refund Payment
    │
    └─→ Inventory Service: Reserve Stock
        └─→ OK / Compensate: Release Stock
```

### Choreography

Services react to events, no central coordinator:

```
Order Service          Payment Service        Inventory Service
    │                       │                       │
    │── OrderPlaced ───────→│                       │
    │                       │── PaymentProcessed ──→│
    │                       │                       │── StockReserved
    │                       │                       │
```

### Strangler Fig Pattern

Gradually migrate legacy systems:

1. Place proxy in front of legacy system
2. Incrementally build new functionality
3. Route traffic to new services
4. Eventually retire legacy components

```
User → API Gateway → Legacy System
            │
            ├─→ /orders/* → New Order Service
            ├─→ /users/* → New User Service
            └─→ /* → Legacy System (fallback)
```

## Architecture Comparison

| Style | Coupling | Scalability | Complexity | When to Use |
|-------|----------|-------------|------------|-------------|
| **Monolith** | High | Vertical | Low | Small team, simple domain |
| **Modular Monolith** | Medium | Vertical | Medium | Growing team, evolving domain |
| **Microservices** | Low | Horizontal | High | Multiple teams, complex domain |
| **Serverless** | Low | Auto | Medium | Event-driven, variable load |

## Clean Architecture Project Template

```
src/
├── domain/              # Domain layer (innermost, no external deps)
│   ├── entities/
│   ├── valueobjects/
│   ├── events/
│   └── repositories/    # Interfaces only
├── application/         # Application layer
│   ├── port/
│   │   ├── in/         # Input ports (use case interfaces)
│   │   └── out/        # Output ports (persistence interfaces)
│   └── service/        # Use case implementations
├── adapter/            # Adapter layer
│   ├── persistence/
│   └── web/
└── configuration/      # Wiring/assembly layer
```