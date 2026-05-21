# Layer 2: Database Design

## Schema Design

- **Normalization**: Through 1NF, 2NF, 3NF to reduce redundancy
- **Primary Keys**: Every table must have a primary key (prefer UUID or auto-increment)
- **Foreign Keys**: Must have constraints for referential integrity
- **Data Types**: Choose appropriate types (minimum viable)
- **Indexing**: Strategic indexing for WHERE, JOIN, ORDER BY columns
- **Denormalization**: Consider for read-heavy analytics/reporting (know the tradeoffs)
- **Soft Deletes**: Use `deleted_at` timestamp instead of hard deletes
- **Timestamps**: Include `created_at` and `updated_at` on every table

## SQL Best Practices

- **Always use EXPLAIN ANALYZE**: Before optimizing queries
- **Strategic Indexing**:
  - Equality columns first, range columns last in composite indexes
  - Covering indexes for hot queries (index-only scans)
  - Don't over-index (writes become slower)
- **Specify exact columns**: Never `SELECT *`
- **Prefer EXISTS/NOT EXISTS**: Over IN/NOT IN for subqueries
- **Use keyset pagination**: `WHERE id > last` instead of `OFFSET`
- **Batch operations**: Bulk insert/update instead of row-by-row
- **Avoid N+1 queries**: Use JOINs or eager loading
- **Use transactions**: Wrap related operations in transactions
- **Connection pooling**: Size pools based on workload

```sql
-- Good: Keyset pagination
SELECT * FROM posts
WHERE created_at < '2024-01-01'
ORDER BY created_at DESC
LIMIT 20;

-- Good: Covering index
CREATE INDEX idx_posts_user_created
ON posts(user_id, created_at)
INCLUDE (title, slug);  -- PostgreSQL 11+
```

## Redis Best Practices

- **Data Structures**: Use appropriate types
  - Hashes for objects (up to 100 fields)
  - Sorted Sets for rankings/time-series
  - Sets for unique collections
  - Strings for simple values
- **Always set TTL**: On cache keys to prevent unbounded growth
- **Memory efficiency**: Short namespaced keys, small values
- **Avoid blocking operations**: Use SCAN instead of KEYS
- **Pipeline commands**: Batch operations to reduce round trips
- **Lua scripts**: For atomic multi-key operations
- **Plan for operations**: Sharding, connection pooling, persistence

```bash
# Good: Namespaced keys with TTL
SET user:123:profile "{...}" EX 3600
SET user:123:settings "{...}" EX 3600

# Good: Using SCAN instead of KEYS
SCAN 0 MATCH user:* COUNT 100
```

## Migration Strategy

- **Versioned migrations**: Sequential numbering or timestamps
- **Up/down migrations**: Each migration has forward and rollback
- **Idempotent migrations**: Safe to run multiple times
- **Test migrations**: Run on staging before production
- **Never modify existing migrations** after they've been applied
- **Backwards compatible**: Schema changes must be backwards compatible
- **Data migrations**: Separate schema and data migrations

```
migrations/
├── 001_create_users.up.sql
├── 001_create_users.down.sql
├── 002_add_user_indexes.up.sql
├── 002_add_user_indexes.down.sql
└── 003_seed_admin_user.up.sql
```

## Database Anti-Patterns

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| `SELECT *` | Unnecessary I/O, breaks index-only scans | List only needed columns |
| Functions on indexed columns | `DATE(created_at)` prevents index use | Use range queries |
| Large OFFSET pagination | `OFFSET 100000` scans and discards rows | Use keyset pagination |
| No foreign key constraints | Data orphans and corruption | Define FK constraints |
| KEYS command | Blocks entire server | Use SCAN |
| JSON in Strings | Can't update atomically, parsing overhead | Use Hashes or RedisJSON |
| No TTL on cache keys | Unbounded memory growth | Always set EXPIRE |
| Missing indexes | Full table scans | Analyze query patterns |
| Over-indexing | Slow writes, large storage | Index only hot queries |

## Database Project Structure

```
database/
├── migrations/              # Database migrations
│   ├── 001_create_users.up.sql
│   ├── 001_create_users.down.sql
│   └── ...
├── schema/                  # Schema definitions
│   ├── tables/
│   ├── views/
│   └── functions/
├── seeds/                   # Initial data
├── tests/                   # Data integrity tests
└── docs/
    ├── er-diagram.md
    └── data-dictionary.md
```