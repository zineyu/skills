# Project Structure & Layering

Feature-first organization and three-layer architecture for full-stack backends.

## Feature-First vs Layer-First

```
✅ Feature-first                    ❌ Layer-first
src/                                src/
  orders/                             controllers/
    order.controller.ts                 order.controller.ts
    order.service.ts                    user.controller.ts
    order.repository.ts               services/
    order.dto.ts                        order.service.ts
    order.test.ts                       user.service.ts
  users/                              repositories/
    user.controller.ts                  ...
    user.service.ts
  shared/
    database/
    middleware/
```

## Three-Layer Architecture

```
Controller (HTTP) → Service (Business Logic) → Repository (Data Access)
```

| Layer | Responsibility | ❌ Never |
|-------|---------------|---------|
| Controller | Parse request, validate, call service, format response | Business logic, DB queries |
| Service | Business rules, orchestration, transaction mgmt | HTTP types (req/res), direct DB |
| Repository | Database queries, external API calls | Business logic, HTTP types |

## Dependency Injection

**TypeScript:**
```typescript
class OrderService {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly emailService: EmailService,
  ) {}
}
```

**Python:**
```python
class OrderService:
    def __init__(self, order_repo: OrderRepository, email_service: EmailService):
        self.order_repo = order_repo
        self.email_service = email_service
```

**Go:**
```go
type OrderService struct {
    orderRepo    OrderRepository
    emailService EmailService
}

func NewOrderService(repo OrderRepository, email EmailService) *OrderService {
    return &OrderService{orderRepo: repo, emailService: email}
}
```

## Common Issues

### "Where does this business rule go?"
- Involves HTTP (parsing, status codes) → **controller**
- Involves business decisions (pricing, permissions) → **service**
- Touches database → **repository**

### "Service is getting too big"
Symptom: one service > 500 lines, 20+ methods.
Fix: split by sub-domain — `OrderService` → `OrderCreationService` + `OrderFulfillmentService` + `OrderQueryService`.

### "Tests are slow because they hit the database"
Fix: unit tests mock repository (fast). Integration tests use test containers or transaction rollback. Never mock the service layer in integration tests.
