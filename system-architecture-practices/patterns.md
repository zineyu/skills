# Design Patterns & Advanced Patterns

## GoF Design Patterns

### Creational Patterns

| Pattern | When to Use | Example |
|---------|------------|---------|
| **Factory Method** | Delegate instantiation to subclasses | `NotificationFactory.create(type)` |
| **Abstract Factory** | Create families of related objects | `UIComponentFactory.createButton()` |
| **Builder** | Construct complex objects step by step | `OrderBuilder.addItem().setCustomer().build()` |
| **Singleton** | One instance globally accessible | Database connection pool (use with caution) |
| **Prototype** | Clone existing objects | Copy document templates |

```typescript
// Builder Pattern
class OrderBuilder {
  private customerId?: CustomerId
  private items: OrderItem[] = []

  withCustomer(customerId: CustomerId): this {
    this.customerId = customerId
    return this
  }

  addItem(productId: ProductId, price: Money, quantity: number): this {
    this.items.push(new OrderItem(productId, price, quantity))
    return this
  }

  build(): Order {
    if (!this.customerId) throw new Error('Customer required')
    const order = new Order(OrderId.generate(), this.customerId)
    this.items.forEach(item => order.addItem(item.productId, item.price, item.quantity))
    return order
  }
}

// Usage
const order = new OrderBuilder()
  .withCustomer(new CustomerId('123'))
  .addItem(product1.id, Money.dollar(10), 2)
  .addItem(product2.id, Money.dollar(5), 1)
  .build()
```

### Structural Patterns

| Pattern | When to Use | Example |
|---------|------------|---------|
| **Adapter** | Convert interface to another | REST adapter for domain repository |
| **Decorator** | Add behavior without subclassing | Logging, caching, retry wrappers |
| **Facade** | Simplify complex subsystem | Payment gateway facade |
| **Proxy** | Control access to object | Lazy loading, access control |
| **Composite** | Tree structures | Organization hierarchy, file system |

```typescript
// Decorator Pattern
interface PaymentProcessor {
  process(payment: Payment): Promise<PaymentResult>
}

class StripePaymentProcessor implements PaymentProcessor {
  async process(payment: Payment): Promise<PaymentResult> {
    // Call Stripe API
  }
}

class LoggingPaymentProcessor implements PaymentProcessor {
  constructor(private wrapped: PaymentProcessor) {}

  async process(payment: Payment): Promise<PaymentResult> {
    console.log(`Processing payment: ${payment.id}`)
    const start = Date.now()
    try {
      const result = await this.wrapped.process(payment)
      console.log(`Payment succeeded in ${Date.now() - start}ms`)
      return result
    } catch (error) {
      console.error(`Payment failed: ${error}`)
      throw error
    }
  }
}

// Usage
const processor = new LoggingPaymentProcessor(
  new StripePaymentProcessor()
)
```

### Behavioral Patterns

| Pattern | When to Use | Example |
|---------|------------|---------|
| **Strategy** | Interchangeable algorithms | Payment methods (credit, paypal, crypto) |
| **Observer** | Event subscription | Domain event listeners |
| **Command** | Encapsulate request as object | Undo/redo, job queues |
| **Template Method** | Algorithm skeleton with steps | Data export (CSV, JSON, XML) |
| **State** | State-dependent behavior | Order state machine |

```typescript
// Strategy Pattern
interface PricingStrategy {
  calculateDiscount(order: Order, customer: Customer): Money
}

class VipPricingStrategy implements PricingStrategy {
  calculateDiscount(order: Order, customer: Customer): Money {
    return customer.isVip() ? order.getTotal().times(0.10) : Money.zero()
  }
}

class SeasonalPricingStrategy implements PricingStrategy {
  calculateDiscount(order: Order): Money {
    const isHoliday = this.isHolidaySeason()
    return isHoliday ? order.getTotal().times(0.15) : Money.zero()
  }
}

class CompositePricingStrategy implements PricingStrategy {
  constructor(private strategies: PricingStrategy[]) {}

  calculateDiscount(order: Order, customer: Customer): Money {
    return this.strategies.reduce(
      (discount, strategy) => discount.add(strategy.calculateDiscount(order, customer)),
      Money.zero()
    )
  }
}
```

## CQRS (Command Query Responsibility Segregation)

Separate read and write models:

```typescript
// Command side (writes)
class PlaceOrderCommand {
  constructor(
    readonly customerId: string,
    readonly items: OrderItemDto[]
  ) {}
}

class OrderCommandHandler {
  async handle(command: PlaceOrderCommand): Promise<void> {
    const order = new Order(OrderId.generate(), new CustomerId(command.customerId))
    // ... add items, validate, save
    await this.orderRepository.save(order)
    await this.eventPublisher.publish(new OrderPlaced(order.id, order.getTotal()))
  }
}

// Query side (reads)
class OrderQueryHandler {
  async getOrderSummary(orderId: string): Promise<OrderSummary> {
    // Optimized query for UI
    return this.db.query(`
      SELECT o.id, o.status, c.name as customer_name,
             SUM(oi.price * oi.quantity) as total
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = $1
      GROUP BY o.id, c.name
    `, [orderId])
  }
}
```

**When to use**: Read/write asymmetry, different scaling needs, complex queries

## Event Sourcing

Store state changes as events, not current state:

```typescript
// Event Store: Append-only log
interface EventStore {
  append(streamId: string, events: DomainEvent[]): Promise<void>
  readStream(streamId: string): Promise<DomainEvent[]>
}

// Aggregate rebuilds state from events
class Order {
  private status: OrderStatus = OrderStatus.PENDING
  private items: OrderItem[] = []

  static reconstitute(events: DomainEvent[]): Order {
    const order = new Order()
    for (const event of events) {
      order.apply(event)
    }
    return order
  }

  private apply(event: DomainEvent): void {
    if (event instanceof OrderItemAdded) {
      this.items.push(new OrderItem(event.productId, event.price, event.quantity))
    } else if (event instanceof OrderPaid) {
      this.status = OrderStatus.PAID
    }
    // ... handle other events
  }

  addItem(productId: ProductId, price: Money, quantity: number): void {
    // Validate business rules
    this.apply(new OrderItemAdded(productId, price, quantity))
  }
}
```

**Benefits**: Audit trail, temporal queries, replay capability
**Costs**: Complexity, event schema evolution, learning curve

## Saga Pattern (Detailed)

### Orchestration Saga

```typescript
class OrderSaga {
  constructor(
    private orderService: OrderService,
    private paymentService: PaymentService,
    private inventoryService: InventoryService
  ) {}

  async execute(orderId: OrderId, payment: Payment): Promise<void> {
    const compensations: (() => Promise<void>)[] = []

    try {
      // Step 1: Create order
      await this.orderService.createOrder(orderId)
      compensations.push(() => this.orderService.cancelOrder(orderId))

      // Step 2: Process payment
      await this.paymentService.charge(payment)
      compensations.push(() => this.paymentService.refund(payment.id))

      // Step 3: Reserve inventory
      await this.inventoryService.reserve(orderId)
      compensations.push(() => this.inventoryService.release(orderId))

    } catch (error) {
      // Compensate in reverse order
      for (const compensate of compensations.reverse()) {
        try {
          await compensate()
        } catch (compensationError) {
          // Log for manual intervention
          console.error('Compensation failed:', compensationError)
        }
      }
      throw error
    }
  }
}
```

### Choreography Saga

```typescript
// Order Service emits event
class OrderService {
  async createOrder(command: CreateOrderCommand): Promise<void> {
    const order = new Order(command.customerId, command.items)
    await this.orderRepository.save(order)
    await this.eventBus.publish(new OrderCreated(order.id, order.getTotal()))
  }
}

// Payment Service reacts to event
class PaymentEventHandler {
  async onOrderCreated(event: OrderCreated): Promise<void> {
    try {
      await this.paymentService.charge(event.orderId, event.total)
      await this.eventBus.publish(new PaymentProcessed(event.orderId))
    } catch (error) {
      await this.eventBus.publish(new PaymentFailed(event.orderId, error.message))
    }
  }
}

// Inventory Service reacts to payment success
class InventoryEventHandler {
  async onPaymentProcessed(event: PaymentProcessed): Promise<void> {
    await this.inventoryService.reserve(event.orderId)
    await this.eventBus.publish(new InventoryReserved(event.orderId))
  }
}
```

## Outbox Pattern

Ensure atomic "database + message queue" operations:

```typescript
class OrderService {
  async placeOrder(command: PlaceOrderCommand): Promise<void> {
    await this.db.transaction(async (trx) => {
      // 1. Save order
      const order = new Order(command.customerId, command.items)
      await this.orderRepository.save(order, trx)

      // 2. Save event to outbox table (same transaction)
      await trx('outbox').insert({
        type: 'OrderPlaced',
        payload: JSON.stringify(new OrderPlaced(order.id)),
        created_at: new Date()
      })
    })
    // Transaction commits → both order and outbox saved atomically
  }
}

// Background worker polls outbox and publishes to message queue
class OutboxPoller {
  async poll(): Promise<void> {
    const messages = await this.db('outbox')
      .where('processed_at', null)
      .limit(100)

    for (const msg of messages) {
      try {
        await this.messageQueue.publish(msg.type, msg.payload)
        await this.db('outbox')
          .where('id', msg.id)
          .update({ processed_at: new Date() })
      } catch (error) {
        console.error('Failed to publish outbox message:', error)
        // Retry with exponential backoff
      }
    }
  }
}
```