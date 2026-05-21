# Layer 2: DevOps & Infrastructure

## Kubernetes

- **Least Privilege**: Grant minimum permissions needed (RBAC)
- **Resource Management**: Define Requests/Limits on all containers
  - `requests`: Guaranteed resources (scheduling)
  - `limits`: Maximum resources (hard cap)
- **ResourceQuotas**: Prevent namespace resource exhaustion
- **LimitRanges**: Default resource constraints
- **Pod Security Standards**: Enforce restricted profile
- **Network Policies**: Restrict pod-to-pod communication
- **Secrets Encryption**: Encrypt secrets at rest (KMS)
- **High Availability**: Control plane across failure domains
- **PodDisruptionBudgets**: Ensure minimum replicas during disruptions
- **Liveness/Readiness Probes**: Proper health checks
- **Graceful Shutdown**: Handle SIGTERM, set `terminationGracePeriodSeconds`

```yaml
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
      containers:
      - name: app
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 5
```

## etcd

- **Odd Member Count**: Run 3 or 5 node clusters for Raft consensus
- **Dedicated Resources**: SSD/NVMe, independent disks, no shared I/O
- **Transport Security**: TLS for all peer and client communication
- **Regular Backups**: `etcdctl snapshot save`, `etcdctl defrag`
- **Monitoring**: Track critical metrics
  - `etcd_server_has_leader`: Should be 1
  - `etcd_disk_wal_fsync_duration_seconds`: Should be <10ms
- **Quota Management**: Prevent unbounded growth
- **Compaction**: Regular history compaction

## SRE Practices

- **SLO-driven Operations**: Define SLIs, set error budgets
- **Eliminate Toil**: Keep manual work under 50%, automate repetitive tasks
- **Embrace Risk**: 100% availability is neither realistic nor necessary
- **Observability Trinity**: Metrics, Logging, Tracing
- **Blameless Postmortems**: Focus on systemic improvements, not blame
- **Error Budgets**: Balance reliability vs feature velocity
- **SLI Examples**:
  - Availability: 99.9% (43.8 min downtime/month)
  - Latency: 95th percentile < 200ms
  - Error Rate: < 0.1% of requests

## CI/CD Pipeline

- **Build Once**: Same artifact promoted through environments
- **Automated Testing**: Unit, integration, and security scans in CI
- **Infrastructure as Code**: Terraform, Pulumi, or CloudFormation
- **GitOps**: Git as source of truth for infrastructure
- **Immutable Infrastructure**: Replace, don't mutate
- **Blue/Green Deployment**: Zero-downtime deployments
- **Canary Releases**: Gradual rollout with automatic rollback
- **Feature Flags**: Decouple deployment from release

```yaml
# Example: CI/CD stages
stages:
  - build
  - test
  - security-scan
  - deploy-staging
  - e2e-tests
  - deploy-production

build:
  script:
    - docker build -t $IMAGE:$CI_COMMIT_SHA .
    - docker push $IMAGE:$CI_COMMIT_SHA

test:
  script:
    - npm test
    - npm run test:integration

security-scan:
  script:
    - trivy image $IMAGE:$CI_COMMIT_SHA
    - npm audit
```

## Observability

- **Metrics**: Prometheus, Grafana, Datadog
  - RED method: Rate, Errors, Duration
  - USE method: Utilization, Saturation, Errors
- **Logging**: Structured logs (JSON), centralized aggregation
  - Include: timestamp, level, service, request_id, message
  - Log levels: ERROR, WARN, INFO, DEBUG
- **Tracing**: Distributed tracing for request flows
  - OpenTelemetry, Jaeger, Zipkin
  - Trace across service boundaries
- **Alerting**: SLO-based alerts, not threshold-based
  - Alert on symptoms, not causes
  - Page sparingly; ticket for non-urgent issues

## DevOps Anti-Patterns

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Using `cluster-admin` daily | Bypasses all RBAC | Use impersonation with low-priv accounts |
| No resource limits | Noisy neighbor, resource exhaustion | Set Requests/Limits on all containers |
| Running as root | Container escape risk | Set `runAsNonRoot: true` |
| Even etcd node count | 4 nodes fail with 2 down (no quorum) | Always use odd count |
| Threshold-based alerts | "CPU > 80%" causes alert fatigue | SLO-based symptom alerts |
| 100% availability target | Blocks innovation, unachievable | Realistic SLOs with error budgets |
| Manual deployments | Human error, slow | Automate CI/CD pipeline |
| No monitoring | Blind to issues | Implement metrics, logs, traces |

## K8s Manifests Structure

```
k8s-manifests/
├── base/
│   ├── namespaces.yaml
│   ├── network-policies/
│   ├── rbac/
│   └── pod-security/
├── apps/
│   ├── app-a/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   ├── hpa.yaml
│   │   └── pdb.yaml
│   └── app-b/
├── infra/
│   ├── ingress/
│   ├── cert-manager/
│   └── monitoring/
└── overlays/              # Kustomize environments
    ├── dev/
    ├── staging/
    └── prod/
```