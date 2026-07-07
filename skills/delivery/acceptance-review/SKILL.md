---
name: acceptance-review
description: Check whether the current branch satisfies the active spec, issue, PRD, handoff, or acceptance criteria, and whether it is ready for PR or merge. Use when the user asks to verify completion, validate acceptance, check if an issue/spec/PRD is done, compare implementation against requirements, perform pre-PR acceptance, or review remaining gaps before delivery.
---

# Acceptance Review

## Quick Start

1. Identify the source of truth: current issue, spec, PRD, handoff, user message, or linked tracker item.
2. Extract concrete acceptance criteria before reading the diff.
3. Compare the current branch against the criteria using code, tests, migrations, docs, and UI behavior as evidence.
4. Review the diff for real delivery risks, not style preferences.
5. Report `done`, `not done`, or `uncertain`, with evidence and the smallest remaining fix or verification step.

## Workflow

### 1. Locate The Requirements

Use the most specific artifact available, in this order:

1. User-provided spec, issue, PRD, handoff, screenshot, or checklist.
2. Local task docs such as `docs/`, `.trellis/`, `.github/issues/`, tracker exports, or handoff files.
3. PR body, branch name, commit message, or recent conversation context.

Do not invent requirements. If the artifact is missing, say what was checked and mark uncovered areas as `uncertain`.

### 2. Build An Acceptance Matrix

Convert the requirement into a short matrix:

```text
Criterion | Status | Evidence | Gap
```

Status values:

- `done`: implemented and supported by code or tests.
- `not done`: missing, wrong, or contradicted by current behavior.
- `uncertain`: cannot be proven from available artifacts or requires runtime/manual validation.

Keep criteria user-visible and behavior-oriented. Avoid splitting one behavior into many implementation details unless each has an independent failure mode.

### 3. Inspect The Current Branch

Prefer the project VCS and repo rules. In a `jj` repo, use `jj st`, `jj diff`, `jj log`, and `jj show`; avoid destructive git commands.

Check only what can affect acceptance:

- Backend/API contracts, persistence rules, migrations, permissions, and concurrency paths.
- Frontend state, form defaults, list rendering, empty/error states, mobile touch targets, and destructive-action protection.
- Tests that prove behavior through public interfaces.
- Documentation or config when the requirement explicitly includes rollout or operations.

Use structural code tools when the repo provides them. Use text search for literal strings and file discovery.

### 4. Run Targeted Verification

Run the narrowest checks that prove the criteria:

- Unit or integration tests for changed behavior.
- Type-check/build for touched frontend or typed code.
- Migration/schema checks when data shape changed.
- Browser/device/manual checks for visual or interaction acceptance.

If a check is expensive, unavailable, or would modify external state, report it as a remaining verification gap instead of pretending it passed.

### 5. Review Delivery Risk

Before saying “done”, scan for real blockers:

- Data loss, authorization bypass, privacy leaks, destructive operations without protection.
- Broken API compatibility, missing migrations, uniqueness/soft-delete conflicts, race conditions.
- UI state regressions: stale data, duplicate keys, unsafe defaults, unusable mobile controls.
- Missing test coverage for the riskiest changed behavior.

Do not report style, naming, or speculative improvements as blockers. If no P0/P1/P2 risk is found, say so plainly.

## Output Format

Start with the verdict:

```text
Verdict: done | not done | uncertain
```

Then include:

- Acceptance matrix with criteria, status, evidence, and gaps.
- Risk review findings, ordered by severity, only if they are real and actionable.
- Verification commands run and their result.
- Remaining gaps, limited to what blocks confidence or delivery.

For PR readiness, add the recommended commit/PR title only when asked.

## Checklist

- [ ] Requirement source was identified and cited.
- [ ] Acceptance criteria were extracted before judging the diff.
- [ ] Each `done` item has file/test/runtime evidence.
- [ ] Each `uncertain` item names the exact missing verification.
- [ ] Review findings are real delivery risks, not preferences.
- [ ] Final answer is short enough for a handoff or PR comment.
