# Behavior-Driven Development (BDD)

## Core Principles

- **Discovery-Formulation-Automation**: Collaborate, specify, automate
- **Cross-role collaboration**: Business, dev, and QA together
- **Concrete examples**: Real business examples over abstract specs
- **Declarative over imperative**: Describe "what", not "how"
- **Living documentation**: Executable scenarios as tests AND docs

## The Three Amigos

1. **Business**: Knows the problem domain and requirements
2. **Developer**: Knows how to implement solutions
3. **Tester**: Knows how to verify behavior

**Workshop format**:
- Review user stories together
- Identify scenarios and edge cases
- Write Gherkin feature files collaboratively

## Gherkin Syntax

```gherkin
Feature: User authentication
  As a registered user
  I want to log in with my credentials
  So that I can access my account

  Background:
    Given a user with email "user@example.com" and password "secret123"

  Scenario: Successful login
    When the user attempts to log in with valid credentials
    Then the user should be authenticated
    And a session token should be generated
    And the last login timestamp should be updated

  Scenario: Failed login with wrong password
    When the user attempts to log in with password "wrong"
    Then the login should fail with error "Invalid credentials"
    And the failed attempt count should increase

  Scenario Outline: Password validation
    When the user attempts to log in with password "<password>"
    Then the login should <result>

    Examples:
      | password    | result                                     |
      | secret123   | succeed                                    |
      | wrong       | fail with error "Invalid credentials"      |
      |             | fail with error "Password is required"     |
```

## BDD Workflow

```
Discovery ──→ Formulation ──→ Automation
    │              │              │
    ▼              ▼              ▼
Three Amigos   Gherkin      Step Definitions
Discuss        Scenarios    + Domain Code
```

1. **Discovery**: Three Amigos discuss requirements, ask questions, identify edge cases
2. **Formulation**: Convert discussions into Gherkin scenarios
3. **Automation**: Bind scenarios to step definitions in code

## Step Definitions

```typescript
// bdd/steps/authentication.steps.ts
import { Given, When, Then, Before } from '@cucumber/cucumber'
import { expect } from 'chai'
import { AuthenticationService } from '../../src/application/authentication'
import { InMemoryUserRepository } from '../doubles/in-memory-user-repository'

let userRepository: InMemoryUserRepository
let authService: AuthenticationService
let result: { success: boolean; token?: string; error?: string }

Before(() => {
  userRepository = new InMemoryUserRepository()
  authService = new AuthenticationService(userRepository)
})

Given('a user with email {string} and password {string}', async (email: string, password: string) => {
  await userRepository.save({
    email,
    passwordHash: await hashPassword(password),
    failedAttempts: 0
  })
})

When('the user attempts to log in with valid credentials', async () => {
  result = await authService.login('user@example.com', 'secret123')
})

Then('the user should be authenticated', () => {
  expect(result.success).to.be.true
  expect(result.token).to.exist
})

Then('a session token should be generated', () => {
  expect(result.token).to.match(/^eyJ/)
})
```

## Feature Organization

```
features/
├── authentication/
│   ├── login.feature
│   ├── logout.feature
│   └── password-reset.feature
├── order-management/
│   ├── create-order.feature
│   ├── cancel-order.feature
│   └── track-order.feature
└── step-definitions/
    ├── authentication.steps.ts
    ├── order.steps.ts
    └── shared.steps.ts
```

## Anti-Patterns

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Feature-coupled steps | Can't reuse across features | Organize by domain concept |
| Conjunction steps | Too specialized, hard to reuse | Split into atomic steps |
| Imperative scenarios | UI coupling, brittle tests | Describe behavior, not interactions |
| UI selectors in Gherkin | Tests break on UI changes | Use business language only |
| Testing through UI | Slow, brittle | Test application layer directly |
| Missing edge cases | Incomplete coverage | Brainstorm edge cases in discovery |

## BDD vs TDD

| Aspect | BDD | TDD |
|--------|-----|-----|
| **Audience** | Business + Dev + QA | Developers |
| **Language** | Business language (Gherkin) | Technical language (code) |
| **Scope** | Feature/acceptance level | Unit level |
| **Output** | Executable specifications | Unit tests |
| **Best for** | Complex requirements, cross-team | All code, especially domain logic |

**Use both**: BDD for acceptance tests, TDD for unit tests.