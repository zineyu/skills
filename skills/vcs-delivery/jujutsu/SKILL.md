---
name: jujutsu
description: Work with Jujutsu, a Git-compatible VCS with mutable commits and automatic rebasing. Use when running git/VCS operations (commit, status, branch, push, etc.), especially when HEAD is detached or a `.jj/` directory exists. Essential safety instructions for agent environments.
allowed-tools: Bash(jj *)
---

# Jujutsu (jj) Version Control

Jujutsu (`jj`) is a distributed version control system that is Git-compatible but built around **mutable, evolving commits** called **changes**. It can replace or coexist with Git.

## Quick start

```bash
# View status
jj st

# Describe the current commit before coding
jj describe -m "Add feature X"
# or shorter alias
jj desc -m "Add feature X"

# View diff
jj diff

# Undo last operation
jj undo
```

## Core concepts unique to jj

- **Working copy is a commit**: Your working directory is always commit `@`. Almost every `jj` command auto-snapshots the working copy, so changes attach to `@` automatically. There is **no staging area / index**.
- **Changes and dual IDs**: A *change* is an evolving commit. It has a stable **change ID** (e.g. `kntqzsqt`) and a per-snapshot **commit ID** (e.g. `7fd1a60b`). Prefer change IDs when referring to work.
- **Commits are mutable**: You can freely amend, rebase, squash, split, and edit existing commits. Their change IDs stay stable; commit IDs change.
- **Anonymous branches**: You can create multiple children of the same commit without naming a branch. These are kept alive until explicitly abandoned.
- **Bookmarks (formerly "branches")**: Named pointers similar to Git branches, but they **do not automatically advance** when you create new commits. Move them explicitly.
- **Operation log**: Every repo-mutating operation is recorded in a DAG. You can undo (`jj undo`), revert a specific operation (`jj op revert`), or restore the whole repo to an earlier point (`jj op restore`).
- **Revsets**: A functional query language for selecting revisions. Examples: `@`, `@-`, `root()`, `trunk()`, `heads(all())`.
- **Conflicts are first-class**: Rebase/merge can produce conflicted commits without failing. You may keep working; descendants are auto-rebased and can inherit resolutions.
- **Immutable vs mutable commits**: By default, commits reachable from `trunk()`, tags, or untracked remote bookmarks are immutable. Use `--ignore-immutable` only when you understand the risk.
- **Root commit**: A virtual empty commit (`zzzzzzzz` / `00000000`) that is the ancestor of all history.

## Workflows

### Starting work (basic loop)

1. Run `jj st`. If `@` already has changes you want to keep separate, run `jj new` first.
2. Describe intent: `jj desc -m "Verb object"`
3. Make changes — they auto-attach to `@`.
4. Verify with `jj st`.
5. Start the next change with `jj new`.

### Squash workflow (good for crafting atomic commits)

1. Describe the target commit: `jj desc -m "Implement feature X"`
2. Create an empty scratch commit on top: `jj new`
3. Write code in the working copy.
4. Move selected changes into the described commit:
   - All changes: `jj squash`
   - Specific file: `jj squash path/to/file`
   - Interactively (avoid in agent environments): `jj squash -i`
5. Repeat from step 2 as needed.

Equivalent Git muscle memory: `jj squash` ≈ `git commit --amend`, but works between any change and its parent.

### Edit workflow (good for rewriting existing commits)

1. Create a new change with a message: `jj new -m "Implement feature X"`
2. Write code.
3. If you need to insert a commit before the current one: `jj new -B @ -m "Preparatory refactor"`
4. To switch `@` back to an earlier commit and continue editing it: `jj edit <change-id>` or `jj next --edit` / `jj prev --edit`.

### Working with Git remotes

```bash
# Clone a Git repository
jj git clone <url>

# Fetch
jj git fetch

# Push a tracked bookmark
jj bookmark set my-feature --to @
jj git push -b my-feature

# Push a single change as a new remote branch (useful for PRs)
jj git push -c @

# Push all tracked bookmarks
jj git push --tracked
```

### Using workspaces

Jujutsu workspaces are like Git worktrees: multiple working directories backed by a single repo. They are especially useful when an AI agent needs to work on a side task while you keep coding in the main directory.

1. Create a workspace: `jj workspace add ../my-project-task`
2. The agent works in `../my-project-task` with its own working-copy commit.
3. Continue working in the original directory; both share the same history.
4. When done, remove tracking: `jj workspace forget task-name` and delete the directory.

If a workspace's working copy becomes stale because another workspace rewrote its commit, run `jj workspace update-stale` to refresh it.

## Quick reference

| Action | Command |
|--------|---------|
| Status | `jj st` |
| Log | `jj log` / `jj log -p` |
| Diff | `jj diff` |
| New empty commit | `jj new` |
| New commit with message | `jj new -m "message"` |
| Commit current changes and move on | `jj commit -m "message"` |
| Describe | `jj desc -m "message"` |
| Edit commit | `jj edit <change-id>` |
| Previous / next commit | `jj prev -e` / `jj next -e` |
| Squash to parent | `jj squash` |
| Squash specific file | `jj squash path` |
| Auto-distribute changes | `jj absorb` |
| Abandon | `jj abandon <id>` |
| Restore / discard | `jj restore [paths]` |
| Restore from revision | `jj restore --from <id> path` |
| Undo | `jj undo` |
| Redo | `jj redo` |
| Rebase source + descendants | `jj rebase -s <id> -o <id>` |
| Rebase single revision | `jj rebase -r <id> -o <id>` |
| Create bookmark | `jj bookmark create <name> -r @` |
| Set / move bookmark | `jj bookmark set <name> --to @` |
| Push bookmark | `jj git push -b <name>` |
| Push change as new branch | `jj git push -c @` |
| Add workspace | `jj workspace add <path>` |
| List workspaces | `jj workspace list` |
| Forget workspace | `jj workspace forget <name>` |
| Update stale workspace | `jj workspace update-stale` |
| Operation log | `jj op log` |
| Restore repo state | `jj op restore <op-id>` |

## Agent environment rules

- **Always use `-m` flags** — editor prompts hang in non-interactive environments.
- **Verify with `jj st`** after `squash`, `abandon`, `rebase`, `restore`, `commit`, `edit`.
- **Avoid interactive commands**: `jj squash -i`, `jj split`, `jj resolve`, `jj diffedit`, `jj arrange` will hang.
- **Conflict resolution**: Edit conflicted files directly to remove conflict markers, then `jj st`. Do not run `jj resolve`.
- **Do not rewrite immutable commits** unless the user explicitly asks. If needed, pass `--ignore-immutable` and explain the risk.
- **Prefer change IDs** over commit IDs; they survive rewrites.

## Best practices

1. **Describe first** — set the commit message before coding.
2. **One change per commit** — atomic, focused commits.
3. **Use change IDs** — stable across rewrites.
4. **Refine commits** — leverage mutability for clean history.
5. **Bookmarks don't auto-advance** — manually `jj bookmark set` before pushing.
6. **Resolve conflicts lazily** — jj lets you keep working; fix them when ready.

See [REFERENCE.md](REFERENCE.md) for detailed workflows, Git integration, conflict handling, revsets, and operation log usage.
