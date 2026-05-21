# Test-Driven Development (TDD)

## Core Principles

- **Red-Green-Refactor cycle**: Write failing test, make it pass, refactor
- **Test first**: Write tests before implementation code
- **Test list**: List all scenarios before starting
- **Baby steps**: One test at a time, small changes only
- **Eliminate duplication**: Refactor to remove code and test duplication

## The Three Laws of TDD

1. You may not write production code until you have a failing unit test
2. You may not write more of a unit test than is sufficient to fail
3. You may not write more production code than is sufficient to pass the test

## Testing Pyramid

```
      /\
     /  \     E2E Tests (Few, slow, expensive)
    /----\
   /      \   Integration Tests (Some, medium speed)
  /--------\
 /          \ Unit Tests (Many, fast, cheap)
/------------\
```

## Red-Green-Refactor Cycle

```
Red: Write a failing test
  │
  ▼
Green: Write minimal code to pass
  │
  ▼
Refactor: Clean up while tests pass
  │
  ▼
Repeat
```

## Example: TDD in Practice

```typescript
// Step 1: Write failing test (Red)
// money.test.ts
import { Money } from './money'

describe('Money', () => {
  test('adds two amounts', () => {
    const five = Money.dollar(5)
    const result = five.add(Money.dollar(5))
    expect(result).toEqual(Money.dollar(10))
  })

  test('multiplies by factor', () => {
    const five = Money.dollar(5)
    expect(five.times(2)).toEqual(Money.dollar(10))
  })
})

// Step 2: Minimal implementation (Green)
// money.ts
export class Money {
  constructor(private amount: number, private currency: string) {}

  static dollar(amount: number): Money {
    return new Money(amount, 'USD')
  }

  add(other: Money): Money {
    return new Money(this.amount + other.amount, this.currency)
  }

  times(multiplier: number): Money {
    return new Money(this.amount * multiplier, this.currency)
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency
  }
}

// Step 3: Refactor (improve design while tests pass)
// - Extract interface? Not yet, YAGNI
// - Add validation? Next test
```

## TDD Strategies

### Chicago School (Classic TDD)
- Test behavior through public interfaces
- Use real collaborators where possible
- Mock only external systems (DB, HTTP)

### London School (Mockist TDD)
- Test interactions between objects
- Heavy use of mocks/stubs
- Outside-in development

### When to Use Each
- **Chicago**: Domain logic, algorithms, calculations
- **London**: External interactions, controller/handler testing

## Test Naming Conventions

```typescript
// Descriptive names that explain behavior
describe('UserRegistration', () => {
  describe('when email is valid', () => {
    it('creates a new user account', () => { /* ... */ })
    it('sends welcome email', () => { /* ... */ })
  })

  describe('when email already exists', () => {
    it('returns conflict error', () => { /* ... */ })
    it('does not send email', () => { /* ... */ })
  })
})
```

## Anti-Patterns

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Skipping refactor | Technical debt accumulates | Always refactor after green |
| False positive | Test passes but doesn't verify | Write meaningful assertions |
| Writing all tests at once | Design changes cause rework | One test at a time |
| Horizontal slicing | Write all tests, then all code | Vertical slices: test → code → repeat |
| Testing implementation | Tests break on refactoring | Test behavior, not structure |
| Slow tests | Feedback loop too long | Keep unit tests under 10ms |
| Brittle tests | Break on minor changes | Test public API, not internals |

## TDD Project Structure

```
src/
├── domain/
│   └── money.ts
├── application/
│   └── register-user.ts
└── tests/
    ├── unit/
    │   ├── domain/
    │   │   └── money.test.ts
    │   └── application/
    │       └── register-user.test.ts
    ├── integration/
    │   └── persistence/
    │       └── user-repository.test.ts
    └── e2e/
        └── user-registration.test.ts
```