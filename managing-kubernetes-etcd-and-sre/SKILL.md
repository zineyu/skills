---
name: managing-kubernetes-etcd-and-sre
description: Use when configuring K8s RBAC and resource policies, setting up etcd clusters with TLS, defining SLOs and error budgets, or building observability and alerting stacks. Covers cluster security, consensus clustering, and reliability engineering.
---

# DevOps Best Practices

Production-ready patterns for cloud-native infrastructure and operations.

## Available Guides

### Kubernetes
**File**: [kubernetes.md](references/kubernetes.md)

Core principles:
- Least privilege: RoleBindings, no wildcard permissions
- Resource management: Requests/Limits, ResourceQuotas, LimitRanges
- Defense in depth: Pod Security Standards, Network Policies, Secrets encryption

### etcd
**File**: [etcd.md](references/etcd.md)

Core principles:
- Odd member count: 3 or 5 nodes for Raft consensus
- Dedicated resources: SSD/NVMe, independent disks, TLS for all traffic
- Regular backups: `etcdctl snapshot save`, `etcdctl defrag`

### SRE
**File**: [sre.md](references/sre.md)

Core principles:
- SLO-driven operations: Define SLIs, set error budgets
- Eliminate toil: Keep manual work under 50%, automate repetitive tasks
- Blameless postmortems: Focus on systemic improvements

## When to Use Each

| Task | Guide |
|------|-------|
| Secure K8s deployment, RBAC, resource policies | [kubernetes.md](references/kubernetes.md) |
| etcd cluster setup, TLS, backup/restore | [etcd.md](references/etcd.md) |
| SLO/SLI definitions, error budgets, alerting | [sre.md](references/sre.md) |

## References

- [Kubernetes Official Docs](https://kubernetes.io/docs/)
- [etcd Official Docs](https://etcd.io/docs/v3.5/)
- [Google SRE Book](https://sre.google/sre-book/table-of-contents/)
