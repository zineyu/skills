# Layer 2: Backend Development

## API Design

- **RESTful Principles**: Resources as nouns (`/users`), HTTP verbs for actions
- **Versioning**: `/v1/users` in URL or `Accept-Version: v1` header
- **Idempotency**: Safe retries for `POST`/`PATCH` via idempotency keys
- **Consistent Responses**: Standard envelope `{data, error, meta}`
- **Status Codes**: Use appropriate HTTP status codes
  - `200` OK, `201` Created, `204` No Content
  - `400` Bad Request, `401` Unauthorized, `403` Forbidden, `404` Not Found
  - `409` Conflict, `422` Unprocessable Entity
  - `429` Too Many Requests, `500` Internal Server Error
  - `502` Bad Gateway, `503` Service Unavailable
- **Pagination**: Use cursor-based for large datasets, offset for small
- **Filtering/Sorting**: Query parameters (`?status=active&sort=-created_at`)
- **Rate Limiting**: Return `429` with `Retry-After` header

```json
// Standard response envelope
{
  "data": { "id": 1, "name": "Alice" },
  "meta": { "page": 1, "per_page": 20, "total": 100 },
  "error": null
}
```

## Concurrency & Safety

- **Race Conditions**: Protect shared state with locks or atomic operations
- **Deadlock Prevention**: Lock ordering (always A then B), timeout strategies
- **Resource Limits**: Connection pooling, rate limiting, circuit breakers
- **Graceful Shutdown**: Drain requests before exiting (handle SIGTERM)
- **Thread Safety**: Document which functions are thread-safe
- **Avoid Shared Mutable State**: Prefer message passing over shared memory

## Caching Strategy

- **Cache-Aside**: Application manages cache explicitly
- **TTL Design**: Match cache lifetime to data volatility
- **Invalidation**: Evict on update, or use event-driven invalidation
- **Cache Penetration**: Handle cache misses with fallback (e.g., null object pattern)
- **Cache Stampede**: Use probabilistic early expiration or mutex locks
- **Cache Warming**: Pre-populate cache on startup for hot data

## Error Handling Patterns

- **HTTP Status Codes**: 4xx client errors, 5xx server errors
- **Error Envelope**: `{code, message, details, request_id}`
- **Validation Errors**: Field-level error messages with path
- **Circuit Breaker**: Fail fast when downstream is unhealthy
- **Retry with Backoff**: Exponential backoff + jitter for transient failures
- **Request ID Propagation**: Include request_id in all logs and errors for tracing

```json
// Error response
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ],
    "request_id": "req_abc123"
  }
}
```

## Middleware Patterns

- **Logging**: Request/response logging with timing
- **Authentication**: Verify JWT/API key before route handler
- **Authorization**: Check permissions after authentication
- **Validation**: Validate request body/params before business logic
- **Rate Limiting**: Prevent abuse per client/IP
- **Error Handling**: Catch unhandled errors, format response
- **CORS**: Handle cross-origin requests
- **Compression**: Gzip/Brotli response compression

**Order matters**:
```
Recovery → Logging → CORS → Rate Limit → Auth → Validation → Route Handler
```

## Backend Anti-Patterns

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| 200 OK with error body | Confuses clients | Use proper 4xx/5xx codes |
| No request IDs | Can't trace errors across services | Generate and propagate request_id |
| N+1 queries | Database performance killer | Use eager loading or JOINs |
| Synchronous calls to other services | Cascading failures | Use async with circuit breaker |
| Storing secrets in code/config | Security breach | Use secret management (Vault, AWS SM) |
| No rate limiting | DoS vulnerability | Implement rate limiting |
| Trusting client input | Injection attacks | Validate and sanitize all input |

## Backend Project Structure (Go example)

```
myproject/
├── cmd/                    # Main applications
│   ├── api/
│   │   └── main.go         # HTTP server entry
│   └── worker/
│       └── main.go         # Background worker
├── internal/               # Private application code
│   ├── domain/             # Business entities and interfaces
│   ├── service/            # Business logic
│   ├── repository/         # Data access layer
│   ├── handler/            # HTTP handlers/controllers
│   └── middleware/         # HTTP middleware
├── pkg/                    # Public library code (optional)
├── api/                    # API definitions (OpenAPI)
├── configs/                # Configuration files
├── migrations/             # Database migrations
└── scripts/                # Build and deployment scripts
```