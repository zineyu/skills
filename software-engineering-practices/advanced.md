# Layer 3: Advanced Topics

## Performance Optimization

### Frontend Performance

- **Code Splitting**: Lazy load routes and heavy components
- **Bundle Analysis**: Use `rollup-plugin-visualizer` or similar
- **Tree Shaking**: Ensure dead code elimination works (avoid side effects in imports)
- **Image Optimization**: WebP, responsive images, lazy loading
- **Font Optimization**: `font-display: swap`, subset fonts
- **Resource Hints**: `preload`, `prefetch`, `preconnect`
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Service Workers**: Cache strategies for offline support
- **Virtual Scrolling**: For large lists (react-window, vue-virtual-scroller)

### Backend Performance

- **Connection Pooling**: Database and HTTP connections
- **Caching**: Multi-layer (CDN, application, database)
- **Async Processing**: Queue heavy work (background jobs)
- **Database Optimization**: Query optimization, indexing, connection pooling
- **Load Balancing**: Distribute traffic across instances
- **Compression**: Gzip/Brotli for responses
- **Rate Limiting**: Prevent resource exhaustion
- **Memory Management**: Profile for leaks, optimize allocations

## Distributed Systems Patterns

- **Circuit Breaker**: Fail fast when dependencies are unhealthy
  - States: Closed (normal), Open (failing), Half-Open (testing)
- **Bulkhead**: Isolate failures to contained compartments
  - Separate thread pools per dependency
- **Retry with Backoff**: Exponential backoff + jitter
  - `delay = min(base * 2^attempt + jitter, max_delay)`
- **Idempotency Keys**: Ensure safe retries for mutations
  - Client generates key, server deduplicates
- **Saga Pattern**: Distributed transactions through compensating actions
  - Choreography: Events trigger compensations
  - Orchestration: Central coordinator manages flow
- **Event Sourcing**: Store state changes as events for auditability
- **CQRS**: Separate read and write models

```python
# Example: Circuit Breaker
class CircuitBreaker:
    def __init__(self, failure_threshold=5, recovery_timeout=60):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.failures = 0
        self.last_failure_time = None
        self.state = "CLOSED"

    def call(self, func, *args, **kwargs):
        if self.state == "OPEN":
            if time.time() - self.last_failure_time > self.recovery_timeout:
                self.state = "HALF_OPEN"
            else:
                raise CircuitBreakerOpen()
        
        try:
            result = func(*args, **kwargs)
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise

    def _on_failure(self):
        self.failures += 1
        self.last_failure_time = time.time()
        if self.failures >= self.failure_threshold:
            self.state = "OPEN"

    def _on_success(self):
        self.failures = 0
        self.state = "CLOSED"
```

## Observability

### Metrics

- **RED Method**: Rate, Errors, Duration (for services)
- **USE Method**: Utilization, Saturation, Errors (for resources)
- **Golden Signals**: Latency, Traffic, Errors, Saturation
- **Histograms**: For latency distributions (p50, p95, p99)
- **Counters**: For monotonically increasing values (requests, errors)
- **Gauges**: For values that go up and down (queue depth, temperature)

### Logging

- **Structured Logs**: JSON format for machine parsing
- **Context Fields**: timestamp, level, service, request_id, user_id
- **Log Levels**: ERROR, WARN, INFO, DEBUG, TRACE
- **Sampling**: High-volume logs should be sampled
- **Correlation IDs**: Trace requests across services

### Tracing

- **Distributed Tracing**: Follow requests across service boundaries
- **Spans**: Represent operations with timing
- **Baggage**: Propagate context (user_id, tenant_id)
- **Sampling**: Head-based or tail-based sampling
- **OpenTelemetry**: Vendor-neutral instrumentation

## Scaling Strategies

### Horizontal Scaling

- **Load Balancing**: Round-robin, least connections, consistent hashing
- **Auto-scaling**: Scale based on CPU, memory, or custom metrics
- **Stateless Services**: Don't store session data locally
- **Database Sharding**: Partition data across multiple databases
- **CDN**: Cache static assets and API responses at edge

### Vertical Scaling

- **Resource Optimization**: Efficient algorithms and data structures
- **Caching**: Reduce database load
- **Connection Pooling**: Reuse expensive connections
- **Batch Processing**: Process data in chunks

### Database Scaling

- **Read Replicas**: Offload read traffic, handle replication lag
- **Connection Pooling**: Size based on `((core_count * 2) + effective_spindle_count)`
- **Read/Write Splitting**: Route reads to replicas, writes to primary
- **CQRS**: Separate read and write models for complex domains
- **Event Sourcing**: Store state changes as events for auditability
- **Partitioning**: Horizontal partitioning (sharding) for large tables

## Chaos Engineering

- **Game Days**: Scheduled failure injection exercises
- **Blast Radius Control**: Start small, expand gradually
- **Abort Conditions**: Automatic rollback if SLO violated
- **Hypothesis-Driven**: "If X fails, Y should handle it via Z"
- **Common Experiments**:
  - Terminate random instances
  - Introduce network latency
  - Simulate dependency failures
  - Fill disk/memory
  - Clock skew

## Advanced Anti-Patterns

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Premature optimization | Wasted effort, complex code | Profile first, optimize hot paths |
| Over-engineering | Unnecessary abstractions | YAGNI — You Aren't Gonna Need It |
| Distributed monolith | Tight coupling across services | Ensure true independence |
| Cache avalanche | Mass cache expiration | Stagger TTLs, circuit breaker |
| Thundering herd | Multiple requests for same cache miss | Request coalescing, singleflight |
| Retry storm | Cascading retries amplify failures | Exponential backoff, circuit breaker |
| Metastable failures | System can't recover after overload | Load shedding, backpressure |
| Golden hammer | Using one tool for everything | Right tool for the job |