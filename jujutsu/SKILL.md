---
name: jujutsu
description: Work with Jujutsu, a Git-compatible VCS with mutable commits and automatic rebasing. Use when running git/VCS operations (commit, status, branch, push, etc.), especially when HEAD is detached or a `.jj/` directory exists. Essential safety instructions for agent environments.
allowed-tools: Bash(jj *)
---

# Jujutsu (jj) Version Control

## Quick start

```bash
# View status
jj st

# Describe the current commit before coding
jj desc -m "Add feature X"

# View diff
jj diff

# Undo last operation
jj undo
```

## Core concepts

- **Working copy is a commit**: Your working directory is always commit `@`. Changes auto-snapshot on any jj command. No staging area.
- **Commits are mutable**: Freely modify commits with `jj squash`, `jj absorb`, `jj edit`. No need for fixup commits.
- **Change IDs are stable**: Prefer change IDs (e.g. `tqpwlqmp`) over commit IDs — they persist across rewrites.

## Workflows

### Starting work

1. Run `jj st`. If `@` has changes, run `jj new` first.
2. Describe intent: `jj desc -m "Verb object"`
3. Make changes — they auto-attach to `@`.
4. Verify with `jj st`.

### Refining commits

| Goal | Command |
|------|---------|
| Move changes to parent | `jj squash` |
| Auto-distribute to ancestors | `jj absorb` |
| Drop a commit | `jj abandon <change-id>` |
| Discard uncommitted changes | `jj restore [paths]` |
| Restore from revision | `jj restore --from <id> path` |

## Quick reference

| Action | Command |
|--------|---------|
| Status | `jj st` |
| Log | `jj log` / `jj log -p` |
| Diff | `jj diff` |
| New commit | `jj new` |
| Describe | `jj desc -m "message"` |
| Edit commit | `jj edit <change-id>` |
| Squash to parent | `jj squash` |
| Auto-distribute | `jj absorb` |
| Abandon | `jj abandon <id>` |
| Undo | `jj undo` |
| Create bookmark | `jj bookmark create <name> -r@` |
| Move bookmark | `jj bookmark move <name> --to @` |
| Push | `jj git push -b <name>` |

## Agent environment rules

- **Always use `-m` flags** — editor prompts hang in non-interactive environments.
- **Verify with `jj st`** after `squash`, `abandon`, `rebase`, `restore`.
- **Avoid interactive commands**: `jj squash -i`, `jj split`, `jj resolve` will hang.
- **Conflict resolution**: Edit files directly to remove conflict markers, then `jj st`.

## Best practices

1. **Describe first** — set the commit message before coding.
2. **One change per commit** — atomic, focused commits.
3. **Use change IDs** — stable across rewrites.
4. **Refine commits** — leverage mutability for clean history.
5. **Bookmarks don't auto-advance** — manually `jj bookmark move` before pushing.

See [REFERENCE.md](REFERENCE.md) for detailed workflows, Git integration, and conflict handling.
