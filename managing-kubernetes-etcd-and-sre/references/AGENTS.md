# DEVOPS BEST PRACTICES

**Type:** AI Skill Library
**Topics:** 3 (Kubernetes, etcd, SRE)
**Files:** 4 markdown files

## OVERVIEW

Infrastructure and operations best practices: container orchestration, distributed consensus, and reliability engineering.

## STRUCTURE

```
devops-best-practices/
├── SKILL.md            # Index
├── kubernetes.md       # K8s security, RBAC, resource management
├── etcd.md             # Raft consensus, clustering, backup
├── sre.md              # SLOs, error budgets, observability
└── references/         # Empty (future expansion)
```

## WHERE TO LOOK

| Task | File | Key Section |
|------|------|-------------|
| Secure K8s deployment | `kubernetes.md` | Pod Security, RBAC, Network Policies |
| etcd cluster setup | `etcd.md` | TLS, odd node count, SSD requirements |
| SLO/SLI definitions | `sre.md` | Error budgets, burn rate alerts |
| Resource quotas | `kubernetes.md` | Requests/Limits, ResourceQuotas |

## CONVENTIONS

- **K8s**: Least privilege, defense in depth, resource limits always set
- **etcd**: Odd member count (3/5), dedicated SSD, TLS required
- **SRE**: SLO-driven (not threshold), <50% toil, blameless postmortems

## ANTI-PATTERNS

| Pattern | File | Problem |
|---------|------|---------|
| `cluster-admin` daily use | `kubernetes.md` | Bypasses all RBAC controls |
| No resource limits | `kubernetes.md` | Noisy neighbor, exhaustion |
| Even etcd node count | `etcd.md` | No quorum with 2 nodes down |
| Threshold alerts (CPU > 80%) | `sre.md` | Alert fatigue |
| 100% availability target | `sre.md` | Unachievable, blocks innovation |

## QUICK REFERENCE

```yaml
# K8s Security Context (always include)
securityContext:
  runAsNonRoot: true
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: true
  capabilities:
    drop: [ALL]
```

## NOTES

- K8s guide focuses on security/operations (not app deployment patterns)
- etcd guide assumes on-prem or self-managed (not managed EKS/GKE etcd)
- SRE guide covers Google-style SRE (error budgets, not traditional ops)
