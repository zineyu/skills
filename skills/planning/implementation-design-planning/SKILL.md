---
name: implementation-design-planning
description: Turns a PRD, issue, or rough request into a concrete implementation design and executable plan through scoped codebase exploration and user confirmation. Use when the user asks to discuss implementation方案, refine a technical approach, write an implementation plan, or turn a confirmed spec/design into task-by-task engineering work.
---

# Implementation Design Planning

## Quick start

1. Read the source material first: issue, PRD, spec, current docs, and the code paths likely to change.
2. Summarize the actual flow and the smallest likely change boundary.
3. Offer 2-3 implementation approaches with tradeoffs and one recommendation.
4. Ask for confirmation on the decisive contract or scope choice.
5. Write a short design doc once confirmed.
6. Write an implementation plan with file paths, test-first steps, commands, and expected results.

## Workflow

### 1. Explore before proposing

- Read the requirement source and local project instructions.
- Inspect the exact code entry points, existing tests, DTOs/contracts, and call chain.
- Identify what is explicitly out of scope.
- Preserve dirty user changes; do not mix unrelated work.

### 2. Discuss concrete options

Present options at the boundary that matters:

- Minimal local fix.
- Contract/interface extension.
- Larger restructuring only if it removes real risk.

For each option, state compatibility, blast radius, test impact, and the recommended choice. Ask one blocking question at a time.

### 3. Freeze the design

Write down:

- Files/components affected.
- Interface changes and compatibility rules.
- Data flow before and after.
- Error/fallback behavior.
- Tests that prove the real bug is fixed.
- Explicit non-goals.

Keep the design short. Do not implement until the user approves it.

### 4. Write the implementation plan

The plan should be executable by a fresh engineer:

- Start with goal, architecture, and tech stack.
- Include a file map.
- Split into small tasks.
- For every code-changing task, include failing test, command, expected failure, implementation snippet, passing command.
- Include final verification and diff review.

Prefer one focused regression test over broad test churn.

## Lessons Learned

- A PRD can say "minimal fix", but user discussion may intentionally change the contract; update the design before planning.
- The useful artifact is not the chat transcript. Distill the decision flow, contract choice, fallback behavior, and verification path.
- Implementation plans fail when they say "add tests" without exact assertions and commands.
- Existing code shape beats generic architecture ideals. Reuse local DTOs, tests, and conventions first.

## Checklist

- [ ] Requirement source and code path were read.
- [ ] 2-3 approaches were compared.
- [ ] User confirmed the key contract/scope decision.
- [ ] Design doc records compatibility and non-goals.
- [ ] Plan has exact files, snippets, commands, and expected outcomes.
- [ ] Verification covers the reported reproduction case.
