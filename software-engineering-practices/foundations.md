# Layer 1: Universal Foundations

Always applicable regardless of technology stack.

## Code Quality

- **Single Responsibility**: One reason to change per module/function/class
- **DRY Principle**: Don't repeat yourself — extract shared logic into reusable units
- **KISS**: Simple solutions over clever ones; avoid premature optimization
- **Meaningful Names**: Variables, functions, and types should reveal intent without comments
- **Comments Explain Why**: Code explains what; comments explain business logic or non-obvious decisions
- **No Magic Numbers**: Extract constants with descriptive names
- **Keep Functions Short**: Under 20-30 lines; extract helper functions for clarity

## Testing Foundations

- **Test Pyramid**: 70% unit, 20% integration, 10% E2E
- **Arrange-Act-Assert**: Structure every test with these three sections
- **One Concept Per Test**: Test one thing, with a clear descriptive name
- **Avoid Logic in Tests**: No conditionals or loops in test code
- **Fast Feedback**: Unit tests should run in milliseconds
- **Test Behavior, Not Implementation**: Test outputs given inputs, not internal state
- **Independent Tests**: Tests must not depend on execution order or shared mutable state

## Error Handling

- **Fail Fast**: Validate inputs at boundaries; reject invalid data immediately
- **Explicit Over Implicit**: Return errors, don't swallow them
- **Contextual Messages**: Wrap errors with context (`fmt.Errorf("...: %w", err)`)
- **Graceful Degradation**: Handle failures without crashing the system
- **Never Ignore Errors**: `_` discards are code smells; always handle or document why ignored
- **Differentiate Error Types**: User errors (4xx) vs system errors (5xx) vs programming errors (bugs)
- **Early Returns**: Reduce nesting by returning errors early

## Documentation

- **README First**: Every project needs a clear README with setup, usage, and contribution guide
- **API Documentation**: Document endpoints, parameters, and error codes
- **Architecture Decision Records (ADRs)**: Record significant decisions with context and consequences
- **CHANGELOG**: Track changes between versions (keepachangelog.com format)
- **Code Comments**: Explain why, not what; link to issues/PRs for complex decisions
- **Runbooks**: Document operational procedures (on-call, incident response)

## Version Control

- **Atomic Commits**: One logical change per commit
- **Conventional Commits**: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
- **Branch Strategies**: Feature branches, trunk-based, or GitFlow — pick one and stick to it
- **Pull Request Reviews**: Mandatory before merging; review for logic, security, and style
- **Semantic Versioning**: `MAJOR.MINOR.PATCH` — breaking.feature.fix
- **Write Good Commit Messages**: Imperative mood, 50-char subject, blank line, 72-char body
- **Rebase Over Merge**: Keep linear history for feature branches; merge only to main

## Code Review Guidelines

- **Review for correctness first**, then style, then optimization
- **Explain the why** behind requested changes, not just the what
- **Approve with comments** for minor issues; request changes for blocking issues
- **Check for security**: Input validation, auth checks, secret exposure
- **Check for tests**: New features need tests; bug fixes need regression tests
- **Be constructive**: Suggest improvements, don't just point out problems
- **Respond promptly**: Aim for <24h turnaround on reviews

## Anti-Patterns (Universal)

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| God object | Single class/module knows too much | Split by responsibility |
| Deep nesting | Hard to read and test | Early returns, extract functions |
| Copy-paste code | Duplication breeds bugs | Extract shared utilities |
| Commented-out code | Clutters codebase | Delete it; git remembers |
| TODO without issue | Forgotten work | Create tickets, reference in comment |
| Premature optimization | Wasted effort, complex code | Profile first, optimize hot paths |
| Magic strings/numbers | Unmaintainable, error-prone | Named constants |
| Hard-coded config | Can't adapt to environments | Environment variables or config files |