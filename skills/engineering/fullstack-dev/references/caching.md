# Caching Patterns

Cache-aside (lazy loading) with explicit invalidation.

## Cache-Aside Pattern

```typescript
async function getUser(id: string): Promise<User> {
  const cached = await redis.get(`user:${id}`);
  if (cached) return JSON.parse(cached);

  const user = await userRepo.findById(id);
  if (!user) throw new NotFoundError('User', id);

  await redis.set(`user:${id}`, JSON.stringify(user), 'EX', 900);  // 15min TTL
  return user;
}
```

## Rules

```
✅ ALWAYS set TTL — never cache without expiry
✅ Invalidate on write (delete cache key after update)
✅ Use cache for reads, never for authoritative state

❌ Never cache without TTL (stale data is worse than slow data)
```

## Suggested TTLs

| Data Type | TTL |
|-----------|-----|
| User profile | 5-15 min |
| Product catalog | 1-5 min |
| Config / feature flags | 30-60 sec |
| Session | Match session duration |
