# Background Jobs & Async Processing

Patterns for offloading work from request handlers.

## Rules

```
✅ All jobs must be IDEMPOTENT (same job running twice = same result)
✅ Failed jobs → retry (max 3) → dead letter queue → alert
✅ Workers run as SEPARATE processes (not threads in API server)

❌ Never put long-running tasks in request handlers
❌ Never assume job runs exactly once
```

## Idempotent Job Pattern

```typescript
async function processPayment(data: { orderId: string }) {
  const order = await orderRepo.findById(data.orderId);
  if (order.paymentStatus === 'completed') return;  // already processed
  await paymentGateway.charge(order);
  await orderRepo.updatePaymentStatus(order.id, 'completed');
}
```
