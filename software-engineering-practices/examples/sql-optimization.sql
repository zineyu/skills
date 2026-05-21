-- SQL Best Practices Examples

-- ✅ Good: Covering index for common query
CREATE INDEX idx_posts_author_date
ON posts(author_id, created_at DESC)
INCLUDE (title, slug, status);

-- ✅ Good: Efficient pagination with keyset
-- Instead of: SELECT * FROM posts ORDER BY created_at DESC LIMIT 20 OFFSET 10000
-- Use:
SELECT id, title, slug, created_at
FROM posts
WHERE created_at < '2024-01-01'
ORDER BY created_at DESC
LIMIT 20;

-- ✅ Good: EXISTS instead of IN for subqueries
-- Instead of: SELECT * FROM users WHERE id IN (SELECT user_id FROM orders WHERE amount > 1000)
-- Use:
SELECT u.id, u.name, u.email
FROM users u
WHERE EXISTS (
    SELECT 1 FROM orders o
    WHERE o.user_id = u.id
    AND o.amount > 1000
);

-- ✅ Good: Batch insert with ON CONFLICT
INSERT INTO users (id, name, email, updated_at)
VALUES 
    ('1', 'Alice', 'alice@example.com', NOW()),
    ('2', 'Bob', 'bob@example.com', NOW()),
    ('3', 'Charlie', 'charlie@example.com', NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    updated_at = NOW();

-- ✅ Good: Partial index for filtered queries
CREATE INDEX idx_active_users_email
ON users(email)
WHERE status = 'active';

-- ✅ Good: JSONB indexing for document queries
CREATE INDEX idx_products_metadata
ON products USING GIN (metadata jsonb_path_ops);

-- Query using the GIN index
SELECT * FROM products
WHERE metadata @> '{"category": "electronics"}';

-- ✅ Good: Window functions instead of self-joins
SELECT 
    id,
    name,
    department,
    salary,
    AVG(salary) OVER (PARTITION BY department) as dept_avg,
    RANK() OVER (PARTITION BY department ORDER BY salary DESC) as dept_rank
FROM employees;

-- ✅ Good: CTE for readable complex queries
WITH monthly_revenue AS (
    SELECT 
        DATE_TRUNC('month', created_at) as month,
        SUM(amount) as revenue
    FROM orders
    WHERE status = 'completed'
    GROUP BY 1
)
SELECT 
    month,
    revenue,
    LAG(revenue) OVER (ORDER BY month) as prev_month,
    ROUND(
        (revenue - LAG(revenue) OVER (ORDER BY month)) / 
        LAG(revenue) OVER (ORDER BY month) * 100, 
        2
    ) as growth_pct
FROM monthly_revenue
ORDER BY month DESC;

-- ❌ Bad: SELECT *
-- SELECT * FROM users WHERE id = 1;  -- ❌ Unnecessary I/O

-- ✅ Good: Select only needed columns
SELECT id, name, email FROM users WHERE id = 1;

-- ❌ Bad: Function on indexed column
-- SELECT * FROM orders WHERE DATE(created_at) = '2024-01-01';  -- ❌ Can't use index

-- ✅ Good: Range query instead
SELECT * FROM orders 
WHERE created_at >= '2024-01-01' 
AND created_at < '2024-01-02';

-- ✅ Good: Transaction for consistency
BEGIN;
    UPDATE accounts SET balance = balance - 100 WHERE id = 1;
    UPDATE accounts SET balance = balance + 100 WHERE id = 2;
    INSERT INTO transactions (from_id, to_id, amount) VALUES (1, 2, 100);
COMMIT;