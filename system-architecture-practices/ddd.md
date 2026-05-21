# Domain-Driven Design (DDD)

## Core Principles

- **Focus on the domain**: Code structure matches business terminology
- **Ubiquitous language**: Shared language across team, code, and docs
- **Bounded contexts**: Multiple models for different parts of the system
- **Aggregate design**: Small consistency boundaries with single root entity
- **Domain events**: Cross-aggregate eventual consistency through events

## Strategic Patterns

### Bounded Context

Explicit boundary where a domain model applies. Each context has its own:
- Ubiquitous language
- Domain model
- Database schema
- Team ownership

```
┌─────────────────────┐     ┌─────────────────────┐
│   Sales Context     │     │  Inventory Context  │
│                     │     │                     │
│   Product (price)   │     │   Product (stock)   │
│   Order (total)     │     │   StockItem (qty)   │
│   Customer (credit) │     │   Warehouse (loc)   │
└─────────────────────┘     └─────────────────────┘
```

### Context Mapping

Relationships between bounded contexts:

| Pattern | Direction | Description |
|---------|-----------|-------------|
| **Partnership** | Mutual | Teams coordinate on joint deliverables |
| **Shared Kernel** | Mutual | Common model subset shared by teams |
| **Customer-Supplier** | One-way | Upstream provides, downstream consumes |
| **Conformist** | One-way | Downstream accepts upstream model as-is |
| **Anti-Corruption Layer** | One-way | Downstream isolates from upstream model |
| **Open Host Service** | One-way | Upstream publishes language for consumers |
| **Published Language** | One-way | Well-documented shared interchange format |

## Tactical Patterns

### Entity

Object with unique identity that persists over time.

```typescript
// Entity: identified by ID, mutable
class Order {
  constructor(
    private id: OrderId,
    private customerId: CustomerId,
    private items: OrderItem[],
    private status: OrderStatus
  ) {}

  addItem(product: Product, quantity: number): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new Error('Can only add items to pending orders')
    }
    this.items.push(new OrderItem(product.id, product.price, quantity))
  }

  cancel(): void {
    if (this.status === OrderStatus.SHIPPED) {
      throw new Error('Cannot cancel shipped orders')
    }
    this.status = OrderStatus.CANCELLED
    this.recordEvent(new OrderCancelled(this.id))
  }

  getTotal(): Money {
    return this.items.reduce((sum, item) => 
      sum.add(item.price.times(item.quantity)), 
      Money.zero()
    )
  }
}
```

### Value Object

Immutable object defined by attributes, no identity.

```typescript
// Value Object: immutable, compared by value
class Money {
  constructor(
    readonly amount: number,
    readonly currency: string
  ) {
    if (amount < 0) throw new Error('Amount cannot be negative')
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add different currencies')
    }
    return new Money(this.amount + other.amount, this.currency)
  }

  times(factor: number): Money {
    return new Money(this.amount * factor, this.currency)
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency
  }
}
```

### Aggregate

Cluster of entities and value objects treated as a single unit.

**Rules**:
- One aggregate root per aggregate
- External references only to aggregate root
- Invariant enforcement within aggregate boundary
- Small aggregates (1-3 entities ideally)

```typescript
// Aggregate: Order is root, OrderItem is child
class Order {
  private items: OrderItem[] = []
  private events: DomainEvent[] = []

  constructor(
    readonly id: OrderId,
    readonly customerId: CustomerId
  ) {}

  addItem(productId: ProductId, price: Money, quantity: number): void {
    // Invariant: max 10 items per order
    if (this.items.length >= 10) {
      throw new Error('Order cannot have more than 10 items')
    }
    this.items.push(new OrderItem(productId, price, quantity))
  }

  removeItem(productId: ProductId): void {
    this.items = this.items.filter(item => !item.productId.equals(productId))
  }

  getTotal(): Money {
    return this.items.reduce(
      (sum, item) => sum.add(item.price.times(item.quantity)),
      Money.zero()
    )
  }

  getEvents(): DomainEvent[] {
    return [...this.events]
  }

  clearEvents(): void {
    this.events = []
  }

  private recordEvent(event: DomainEvent): void {
    this.events.push(event)
  }
}
```

### Domain Events

Record of something that happened in the domain.

```typescript
// Domain Event: immutable, named in past tense
interface DomainEvent {
  readonly occurredOn: Date
}

class OrderPlaced implements DomainEvent {
  readonly occurredOn = new Date()
  constructor(
    readonly orderId: OrderId,
    readonly customerId: CustomerId,
    readonly total: Money
  ) {}
}

class OrderCancelled implements DomainEvent {
  readonly occurredOn = new Date()
  constructor(
    readonly orderId: OrderId,
    readonly reason: string
  ) {}
}
```

### Repository

Abstract collection-like interface for aggregates.

```typescript
// Repository interface (defined in domain)
interface OrderRepository {
  findById(id: OrderId): Promise<Order | null>
  findByCustomer(customerId: CustomerId): Promise<Order[]>
  save(order: Order): Promise<void>
}

// Implementation (in infrastructure)
class PostgresOrderRepository implements OrderRepository {
  constructor(private db: Knex) {}

  async findById(id: OrderId): Promise<Order | null> {
    const row = await this.db('orders').where('id', id.value).first()
    if (!row) return null
    return this.mapToDomain(row)
  }

  async save(order: Order): Promise<void> {
    await this.db('orders').insert({
      id: order.id.value,
      customer_id: order.customerId.value,
      status: order.status,
      total: order.getTotal().amount
    })
    // Persist events
    for (const event of order.getEvents()) {
      await this.db('domain_events').insert({
        type: event.constructor.name,
        payload: JSON.stringify(event),
        occurred_on: event.occurredOn
      })
    }
    order.clearEvents()
  }
}
```

### Domain Service

Business logic that doesn't belong to an entity or value object.

```typescript
// Domain Service: business logic spanning multiple aggregates
class PricingService {
  calculateDiscount(order: Order, customer: Customer): Money {
    let discount = Money.zero()
    
    // VIP customers get 10% off
    if (customer.isVip()) {
      discount = order.getTotal().times(0.10)
    }
    
    // Orders over $100 get $5 off
    if (order.getTotal().amount > 100) {
      discount = discount.add(Money.dollar(5))
    }
    
    return discount
  }
}
```

## Anti-Patterns

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Anemic domain model | Logic in services, not entities | Encapsulate behavior in entities |
| Big aggregates | Performance issues, conflicts | Keep aggregates small (1-3 entities) |
| Language inconsistency | Communication gaps | Align code with business terms |
| CRUD-driven design | Missing domain concepts | Model behavior, not just data |
| Direct aggregate modification | Bypassing aggregate root | Always modify through root |
| Missing domain events | Hidden side effects | Record significant changes as events |
| Over-engineering | Too many patterns for simple domain | Start with basic entities |

## DDD Project Structure

```
src/
├── domain/                  # Domain layer (core)
│   ├── aggregates/
│   │   └── order.ts         # Order aggregate root
│   ├── entities/
│   │   └── customer.ts      # Customer entity
│   ├── value-objects/
│   │   ├── money.ts
│   │   └── address.ts
│   ├── events/
│   │   ├── order-placed.ts
│   │   └── order-cancelled.ts
│   ├── services/
│   │   └── pricing-service.ts
│   └── repositories/        # Interfaces only
│       └── order-repository.ts
├── application/             # Application layer
│   ├── commands/
│   │   └── place-order.ts
│   ├── queries/
│   │   └── get-order.ts
│   └── services/
│       └── order-application-service.ts
├── infrastructure/          # Infrastructure layer
│   ├── persistence/
│   │   └── postgres-order-repository.ts
│   ├── messaging/
│   │   └── event-publisher.ts
│   └── external/
│       └── payment-gateway.ts
└── interfaces/              # Interface adapters
    ├── web/
    │   └── order-controller.ts
    ├── cli/
    └── events/
        └── order-event-handler.ts
```