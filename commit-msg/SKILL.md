---
name: commit-msg
description: Generate conventional commit messages from repository changes.
---

# Generate Conventional Commit Messages

## Purpose

Generate clean commit messages following Conventional Commits specification.

## Trigger

- "生成 commit 信息"
- "create commit message"
- "查看更改并生成 commit"
- "生成符合规范的 commit 信息"
- "根据变更生成提交信息"

## Workflow

### Step 0: Prefer the Repository's Primary VCS

In this environment, prefer `jj` when the repository uses Jujutsu.

- If the repository is a `jj` repo, use the `jj` workflow below.
- If the repository is clearly a plain `git` repo, use the `git` fallback commands.

### Step 1: Check Status (based on VCS)

- **Default path: jj**

  ```bash
  jj status
  jj log --no-pager -r @ -T "self.description()"
  ```

- **Fallback for plain git repos**:

  ```bash
  git status
  ```

### Step 2: View Diff (based on VCS)

- **Default path: jj**

  ```bash
  jj diff
  jj diff --git  # show in git format
  ```

- **Fallback for plain git repos**:

  ```bash
  git diff
  ```

### Step 3: Read New Files (if any)

For untracked/new files, read their content to understand changes.

### Step 4: Analyze Changes

Determine:

- **Type**: feat, fix, docs, style, refactor, perf, test, chore
- **Scope**: module/component (errors, storage, api, etc.)
- **Subject**: concise description (≤50 chars, imperative mood, no period)

### Step 5: Generate Commit Message

Format: `<type>(<scope>): <subject>`

Example:

```
feat(errors, storage): initialize core modules
```

## Output Format

1. Summary of changes (brief)
2. Suggested commit message(s)

## Rules

- NO emojis
- Subject ≤50 chars
- Imperative mood (add, not added)
- No period at end
- Use scope in parentheses when helpful: feat(module): not feat:
