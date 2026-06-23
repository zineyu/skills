---
name: newapi-tenant-token-practices
description: Best practices for NewAPI tenant token naming and lifecycle. Use when working with NewAPI accounts as tenants, naming tokens to distinguish users or business flows under a tenant, token create-or-reuse lifecycle, tenant/group routing, or access denied and 403 errors.
---

# NewAPI Tenant Token Practices

## Quick Start

1. Treat each NewAPI account as a tenant; use token names to distinguish users, business flows, or services under that tenant.
2. Resolve the target tenant, group, or channel from your application's routing context and deployment configuration; keep local routing terms separate from NewAPI's upstream concepts.
3. Build a deterministic token name from prefix, business context, and user or service identity, then reuse an active token if it is still available.
4. Save the token naming rule in project documentation so future agents and operators can reproduce it consistently.
5. If the token is missing, expired, or out of quota, mark it inactive and create a new one in the resolved tenant/group.

## Workflow

NewAPI API reference: https://www.newapi.ai/zh/docs/api

### 1. Resolve the tenant/routing inputs

In NewAPI, each account represents a tenant. Within a tenant, distinguish different users, businesses, or services by deterministic token names. Applications may maintain their own routing keys, source labels, or group maps; treat those as local configuration, not generic NewAPI features. Keep tenant and group names exact; a one-character mismatch is enough to produce a 403 upstream.

### 2. Name the token deterministically

Use a short ASCII slug that encodes the business context and user or service identity. Keep the name stable for the same context/identity pair, and cap it so the upstream admin API accepts it. If a username or display label is available, include it only when it fits without making the name exceed the limit.

### 3. Document the naming rule

Record the exact token naming convention in the project's documentation before or alongside implementation. Include the pattern, allowed fields, normalization rules, length limit, collision handling, and examples for common user, service, and business-flow tokens. Do not leave the rule only in code or environment variables; future agents should be able to find and follow the documented convention.

### 4. Reuse before creating

Check the latest active token first. If the token still has quota and is not expired, reuse it. If usage lookup fails, prefer the existing token over inventing a new one unless there is a clear creation failure.

### 5. Create and persist

Create the token through the NewAPI admin endpoint with the resolved tenant/group, quota, and expiry. Persist the returned key plus the token id, name, group, and routing context in the local store so later requests can reuse it.

### 6. Debug access denied

For 403s or "no permission" responses, check these in order:

1. The effective application routing context.
2. The local mapping from that context to the NewAPI tenant/group.
3. The upstream group's model permissions.
4. Any reused token row that was created before the mapping changed.
5. Whether the token should be invalidated and recreated instead of reused.

## Checks

Before considering the work done, confirm:

- The group mapping matches the intended upstream group name exactly.
- The token name is deterministic for the same user/source pair.
- The token naming convention is saved in project documentation with examples and limits.
- Stale tokens from an old group are marked inactive or deleted.
- The code prefers reuse when the token is still valid.
- The next request path that previously failed with 403 is exercised again.
