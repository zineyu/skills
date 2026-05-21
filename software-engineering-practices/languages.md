# Layer 2: Programming Languages

## Go

- **Simplicity over cleverness**: Simple, direct solutions
- **Composition over inheritance**: Interfaces and struct embedding
- **Explicit error handling**: Check errors immediately, don't ignore with `_`
- **Concurrency via goroutines**: Share memory by communicating
- **Package-oriented design**: Short, meaningful package names
- **Use `context.Context`**: Pass through call chains for cancellation/timeouts
- **Graceful shutdown**: Handle SIGTERM, drain goroutines
- **Avoid reflection**: Prefer code generation over reflection
- **Use `pprof`**: Profile memory and CPU to find bottlenecks

```go
// Good: Explicit error handling
func fetchUser(ctx context.Context, id string) (*User, error) {
  user, err := db.GetUser(ctx, id)
  if err != nil {
    return nil, fmt.Errorf("get user %s: %w", id, err)
  }
  return user, nil
}

// Good: Interface at call site (Go idiom)
type UserStore interface {
  GetUser(ctx context.Context, id string) (*User, error)
}

func GetUserHandler(store UserStore) http.HandlerFunc {
  return func(w http.ResponseWriter, r *http.Request) {
    user, err := store.GetUser(r.Context(), r.URL.Query().Get("id"))
    if err != nil {
      http.Error(w, err.Error(), http.StatusInternalServerError)
      return
    }
    json.NewEncoder(w).Encode(user)
  }
}
```

### Go Anti-Patterns

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Ignoring errors with `_` | Silent failures | Always check errors |
| Using `panic` for normal errors | Unwinding stack | Return `error` |
| Interface pollution | Single implementation interfaces | Use concrete types, extract interfaces at call site |
| Goroutine leaks | Resource exhaustion | Use `context.WithCancel`, `sync.WaitGroup` |
| Global state | Hard to test, race conditions | Pass dependencies as parameters |
| `nil` interface values | Unexpected nil behavior | Check for nil before use |

## Rust

- **Ownership and borrowing first**: Use references (`&T`, `&mut T`), avoid unnecessary clones
- **Explicit error handling**: `Result<T, E>` and `Option<T>`, use `?` operator
- **Zero-cost abstractions**: Iterators over index loops, `&str` over `String`
- **Type safety through newtypes**: Wrapper structs for compile-time distinction
- **Workspace-based modularity**: Cargo workspaces for large projects
- **Minimize `unsafe`**: Encapsulate, document invariants
- **Async patterns**: Understand `Pin`, `Waker`, executor internals
- **FFI safety**: C ABI compatibility, memory layout guarantees
- **Proc macros**: Derive macros for boilerplate reduction

```rust
// Good: Error handling with ?
use std::fs::File;
use std::io::{self, Read};

fn read_config(path: &str) -> Result<String, io::Error> {
  let mut file = File::open(path)?;
  let mut contents = String::new();
  file.read_to_string(&mut contents)?;
  Ok(contents)
}

// Good: Newtype pattern for type safety
struct UserId(u64);
struct OrderId(u64);

fn find_user(id: UserId) -> Option<User> { /* ... */ }
// find_user(OrderId(1)) // Compile error!
```

### Rust Anti-Patterns

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Over-cloning | Unnecessary allocations | Use references `&T` |
| `unwrap()` in production | Panic on error | Use `?` or `match` on `Result` |
| `Rc`/`Arc` when borrowing works | Reference counting overhead | Simple references |
| `unsafe` without documentation | Undefined behavior risk | Document invariants, minimize scope |
| Ignoring `Result` with `let _ =` | Silent failures | Handle errors explicitly |
| String in APIs | Unnecessary allocation | Use `&str` for read-only |

## Python

- **Type hints**: Use `mypy` for static type checking
- **Dataclasses**: For simple data containers (Python 3.7+)
- **Pydantic**: For validation and serialization
- **Async/await**: For I/O-bound concurrency (`asyncio`)
- **Context managers**: For resource management (`with` statement)
- **F-strings**: For string formatting (Python 3.6+)
- **List/dict comprehensions**: For simple transformations
- **Generators**: For lazy evaluation and large datasets
- **Virtual environments**: Isolate dependencies per project
- **Black + isort**: Consistent formatting and import sorting

```python
# Good: Type hints and dataclass
from dataclasses import dataclass
from typing import Optional

@dataclass
class User:
    id: int
    name: str
    email: str
    avatar_url: Optional[str] = None

# Good: Async I/O
import asyncio
import aiohttp

async def fetch_users() -> list[User]:
    async with aiohttp.ClientSession() as session:
        async with session.get("https://api.example.com/users") as resp:
            data = await resp.json()
            return [User(**u) for u in data]
```

### Python Anti-Patterns

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Mutable default arguments | Shared state across calls | Use `None` as default |
| Bare `except:` | Catches `SystemExit`, `KeyboardInterrupt` | Use `except Exception:` |
| `x is True` | Unpythonic | Use `if x:` |
| Global mutable state | Hard to test, race conditions | Pass state explicitly |
| String concatenation in loops | O(n²) performance | Use `str.join()` or list |
| Not using `with` for files | Resource leaks | Use context managers |
| `from module import *` | Namespace pollution | Explicit imports |

## Language Comparison: Error Handling

| Language | Pattern | Example |
|----------|---------|---------|
| Go | Multiple returns | `value, err := fn()` |
| Rust | `Result<T, E>` | `let v = fn()?` |
| Python | Exceptions | `try/except` or `Optional` |
| TypeScript | Union types | `Result<T, Error>` or `try/catch` |

## Language Comparison: Concurrency

| Language | Primitive | Best For |
|----------|-----------|----------|
| Go | Goroutines + channels | I/O-bound and CPU-bound |
| Rust | `async/await` + Tokio | High-performance I/O |
| Python | `asyncio` | I/O-bound (not CPU-bound) |
| Python | Multiprocessing | CPU-bound (GIL workaround) |