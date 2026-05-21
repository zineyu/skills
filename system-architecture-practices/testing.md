# Testing Strategies

## Test Doubles

| Type | Description | Use When |
|------|------------|----------|
| **Dummy** | Passed around but never used | Filling parameter lists |
| **Fake** | Working implementation with shortcuts | In-memory database |
| **Stub** | Returns canned answers to calls | Controlling indirect inputs |
| **Mock** | Objects with expectations, verify interactions | Verify method calls |
| **Spy** | Records interactions for later verification | Verify without setting expectations |

```typescript
// Fake: In-memory repository
class InMemoryOrderRepository implements OrderRepository {
  private orders: Map<string, Order> = new Map()

  async findById(id: OrderId): Promise<Order | null> {
    return this.orders.get(id.value) || null
  }

  async save(order: Order): Promise<void> {
    this.orders.set(order.id.value, order)
  }
}

// Stub: Fixed response
class StubPaymentGateway implements PaymentGateway {
  constructor(private shouldSucceed: boolean = true) {}

  async charge(amount: Money): Promise<PaymentResult> {
    return this.shouldSucceed
      ? { success: true, transactionId: 'txn_123' }
      : { success: false, error: 'Insufficient funds' }
  }
}

// Mock: Verify interactions
class MockEventPublisher implements EventPublisher {
  private publishedEvents: DomainEvent[] = []

  async publish(event: DomainEvent): Promise<void> {
    this.publishedEvents.push(event)
  }

  assertEventPublished(eventType: string): void {
    const found = this.publishedEvents.some(e => e.constructor.name === eventType)
    if (!found) {
      throw new Error(`Expected event ${eventType} to be published`)
    }
  }

  assertNoEventsPublished(): void {
    if (this.publishedEvents.length > 0) {
      throw new Error('Expected no events to be published')
    }
  }
}
```

## Testing Pyramid in Practice

```
        /\
       /  \     E2E (5%)
      /----\    ──────────────────
     /      \   Integration (15%)
    /--------\  ──────────────────
   /          \ Unit (80%)
  /------------\
```

### Unit Tests

- Test one unit (class/function) in isolation
- Fast (< 10ms), deterministic
- Use test doubles for dependencies
- Cover edge cases and error paths

```typescript
// Unit test with fake repository
describe('PlaceOrderUseCase', () => {
  let orderRepository: InMemoryOrderRepository
  let eventPublisher: MockEventPublisher
  let useCase: PlaceOrderUseCase

  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository()
    eventPublisher = new MockEventPublisher()
    useCase = new PlaceOrderUseCase(orderRepository, eventPublisher)
  })

  it('creates order with items', async () => {
    const command = new PlaceOrderCommand('customer-1', [
      { productId: 'prod-1', price: 10, quantity: 2 }
    ])

    const result = await useCase.execute(command)

    const savedOrder = await orderRepository.findById(result.orderId)
    expect(savedOrder).not.toBeNull()
    expect(savedOrder!.getTotal().amount).toBe(20)
  })

  it('publishes OrderPlaced event', async () => {
    const command = new PlaceOrderCommand('customer-1', [
      { productId: 'prod-1', price: 10, quantity: 1 }
    ])

    await useCase.execute(command)

    eventPublisher.assertEventPublished('OrderPlaced')
  })
})
```

### Integration Tests

- Test multiple units working together
- Use real infrastructure (test database)
- Slower than unit tests (< 1s)
- Cover happy paths and common error cases

```typescript
// Integration test with real database
describe('OrderRepository', () => {
  let db: TestDatabase
  let repository: PostgresOrderRepository

  beforeAll(async () => {
    db = await TestDatabase.create()
    repository = new PostgresOrderRepository(db.connection)
  })

  afterAll(async () => {
    await db.destroy()
  })

  beforeEach(async () => {
    await db.truncate('orders', 'order_items')
  })

  it('saves and retrieves order', async () => {
    const order = new Order(OrderId.generate(), new CustomerId('cust-1'))
    order.addItem(new ProductId('prod-1'), Money.dollar(10), 2)

    await repository.save(order)
    const retrieved = await repository.findById(order.id)

    expect(retrieved).not.toBeNull()
    expect(retrieved!.id).toEqual(order.id)
    expect(retrieved!.getTotal().amount).toBe(20)
  })
})
```

### E2E Tests

- Test complete user journeys
- Use real infrastructure and external services (or wire mocks)
- Slow (> 1s), fewer in number
- Cover critical paths only

```typescript
// E2E test
describe('Order Placement Flow', () => {
  let app: TestApplication

  beforeAll(async () => {
    app = await TestApplication.start()
  })

  afterAll(async () => {
    await app.stop()
  })

  it('customer can place an order', async () => {
    // Register customer
    const customer = await app.api.registerCustomer({
      email: 'test@example.com',
      name: 'Test User'
    })

    // Add items to cart
    await app.api.addToCart(customer.id, { productId: 'prod-1', quantity: 2 })

    // Place order
    const order = await app.api.placeOrder(customer.id)

    // Verify order created
    expect(order.status).toBe('PENDING')
    expect(order.total).toBe(20)

    // Verify inventory updated
    const stock = await app.api.getStock('prod-1')
    expect(stock.quantity).toBeLessThan(100) // Assuming started with 100
  })
})
```

## Contract Testing

Verify compatibility between services:

### Consumer-Driven

```typescript
// Consumer: Order Service expects Payment Service to accept this request
const paymentContract = {
  consumer: 'order-service',
  provider: 'payment-service',
  interactions: [
    {
      description: 'charge payment',
      request: {
        method: 'POST',
        path: '/payments',
        body: {
          orderId: string,
          amount: number,
          currency: 'USD' | 'EUR'
        }
      },
      response: {
        status: 201,
        body: {
          transactionId: string,
          status: 'SUCCESS' | 'FAILED'
        }
      }
    }
  ]
}
```

### Provider Verification

```typescript
// Provider: Payment Service verifies it satisfies all consumers
describe('Payment Service Contract', () => {
  it('satisfies order-service contract', async () => {
    const result = await verifier.verifyProvider({
      provider: 'payment-service',
      pactBrokerUrl: 'https://pact-broker.example.com',
      consumerVersionSelectors: [{ mainBranch: true }],
      providerBranch: 'main'
    })

    expect(result).toBeTruthy()
  })
})
```

## Testing in Architecture

### Port Testing (Domain Logic)

Test use cases against ports with mock adapters:

```typescript
describe('SendMoneyUseCase', () => {
  let loadAccountPort: MockLoadAccountPort
  let updateAccountPort: MockUpdateAccountPort
  let useCase: SendMoneyUseCase

  beforeEach(() => {
    loadAccountPort = new MockLoadAccountPort()
    updateAccountPort = new MockUpdateAccountPort()
    useCase = new SendMoneyUseCase(loadAccountPort, updateAccountPort)
  })

  it('transfers money between accounts', async () => {
    const sourceAccount = Account.withBalance(Money.of(100))
    const targetAccount = Account.withBalance(Money.of(50))
    
    loadAccountPort.withAccount(sourceAccount.id, sourceAccount)
    loadAccountPort.withAccount(targetAccount.id, targetAccount)

    const command = new SendMoneyCommand(
      sourceAccount.id,
      targetAccount.id,
      Money.of(30)
    )

    const result = await useCase.execute(command)

    expect(result).toBe(true)
    expect(sourceAccount.getBalance().amount).toBe(70)
    expect(targetAccount.getBalance().amount).toBe(80)
  })
})
```

### Adapter Testing

Test adapters against real infrastructure:

```typescript
describe('AccountPersistenceAdapter', () => {
  let adapter: AccountPersistenceAdapter
  let db: TestDatabase

  beforeEach(async () => {
    db = await TestDatabase.create()
    adapter = new AccountPersistenceAdapter(db.connection)
  })

  it('loads account with activities', async () => {
    // Setup test data in database
    await db.insert('account', { id: 'acc-1', balance: 100 })
    await db.insert('activity', { account_id: 'acc-1', amount: 50, type: 'DEPOSIT' })

    const account = await adapter.loadAccount(
      new AccountId('acc-1'),
      new Date('2024-01-01')
    )

    expect(account.getBalance().amount).toBe(100)
    expect(account.getActivities()).toHaveLength(1)
  })
})
```

## Anti-Patterns

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Testing implementation | Tests break on refactoring | Test behavior, not structure |
| Brittle tests | Break on minor changes | Test public API, avoid selectors |
| Slow test suite | Long feedback loop | Keep unit tests fast, mock external deps |
| Missing edge cases | Incomplete coverage | Boundary value analysis, equivalence classes |
| Mocking everything | Tests don't verify real behavior | Use real collaborators where possible |
| Test data pollution | Tests affect each other | Reset state before each test |
| Testing through UI | Slow, brittle | Test application layer directly |
| Ignoring flaky tests | Lose trust in test suite | Quarantine, fix root cause |