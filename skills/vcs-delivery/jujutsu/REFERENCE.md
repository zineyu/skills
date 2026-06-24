# Jujutsu Reference

## Core concepts

### Change vs commit

A **change** is a commit as it evolves over time. It is identified by a stable **change ID** (e.g. `kntqzsqt`). Every specific snapshot of a change has a **commit ID** (e.g. `7fd1a60b`). When you rewrite a change, the change ID stays the same but the commit ID changes.

- Change IDs use characters in the `k-z` range, so they never collide visually with hexadecimal commit IDs.
- In `jj log`, the change ID appears on the left, the commit ID on the right.
- Prefer change IDs for all user-facing references.

### Working copy is a commit (`@`)

Your working directory is always represented by a commit called `@`. Almost every `jj` command snapshots the working copy at the start and updates it at the end. There is no separate staging area.

- `@` is a revset symbol for the current working-copy commit.
- `@-` is the parent of `@`.
- `@+` is a child of `@`.

### Root commit

Every repo has a virtual **root commit** with change ID `zzzzzzzz` and commit ID `00000000`. It is empty and is the ancestor of all history. Refer to it with `root()` in revsets.

### Anonymous branches

`jj` is branchless by default. You can create multiple children of the same commit without naming anything. These are called **anonymous branches**. They survive until explicitly abandoned with `jj abandon`. Use `jj log -r 'heads(all())'` to see all current heads.

### Bookmarks

Bookmarks are `jj`'s equivalent to Git branches. Unlike Git branches, they **do not automatically advance** when you create new commits.

```bash
# Create a bookmark at current commit
jj bookmark create my-feature -r @

# Move an existing bookmark to a different commit
jj bookmark set my-feature --to @

# Move backwards (dangerous; use only before pushing)
jj bookmark set my-feature --to @- --allow-backwards

# Delete / forget
jj bookmark delete my-feature
jj bookmark forget my-feature

# List bookmarks
jj bookmark list
```

### Operation log

Every mutating operation is recorded as a node in a DAG. You can inspect and undo history of history itself.

```bash
jj op log                    # list operations
jj undo                      # undo the last operation
jj redo                      # redo the most recently undone operation
jj op revert <op-id>         # revert a specific operation
jj op restore <op-id>        # restore the entire repo to that operation
jj --at-op=<op-id> log       # view repo as it looked then
```

Operations also enable **lock-free concurrency**: concurrent `jj` commands record divergent operations that are merged when next inspected.

### Revsets

A **revset** is a functional language for selecting revisions. Most `jj` commands accept a `-r` argument.

Common symbols:

| Symbol | Meaning |
|--------|---------|
| `@` | working-copy commit |
| `@-` | parent of working copy |
| `root()` | virtual root commit |
| `trunk()` | default remote's default branch (or `root()` if none) |
| `all()` | all visible commits |
| `mine()` | commits authored by current user |

Common operators:

| Operator | Meaning |
|----------|---------|
| `x-` | parents of `x` |
| `x+` | children of `x` |
| `::x` | ancestors of `x` |
| `x::` | descendants of `x` |
| `x::y` | DAG path from `x` to `y` |
| `x..y` | ancestors of `y` but not ancestors of `x` |
| `x \| y` | union |
| `x & y` | intersection |
| `~x` | complement |

Common functions:

| Function | Meaning |
|----------|---------|
| `heads(x)` | commits in `x` with no descendants within `x` |
| `roots(x)` | commits in `x` with no ancestors within `x` |
| `ancestors(x, depth)` | ancestors limited by depth |
| `descendants(x, depth)` | descendants limited by depth |
| `bookmarks()` | local bookmarks |
| `remote_bookmarks()` | remote bookmarks |
| `description(pattern)` | commits whose description matches |
| `author(pattern)` | commits by author |
| `files(pattern)` | commits touching paths |
| `conflicts()` | conflicted commits |
| `immutable()` / `mutable()` | immutable / mutable commits |

Example useful log revsets:

```bash
jj log -r '@ | root() | bookmarks()'
jj log -r 'heads(all())'
jj log -r 'trunk()..@'
jj log -r 'author("Steve") & description(substring:print)'
```

### Conflicts

`jj` treats conflicts as first-class. A rebase or merge that introduces conflicts still succeeds. The conflicted commits are marked `(conflict)` in `jj log`. Descendants are automatically rebased and can stay conflicted or become resolved as you edit upstream commits.

Conflict markers in files are richer than Git's:

```text
<<<<<<< conflict 1 of 1
+++++++ snapshot label
... snapshot content ...
%%%%%%%
... diff content ...
>>>>>>> conflict 1 of 1 ends
```

In agent environments, resolve conflicts by editing files directly, then verify with `jj st`. Do not use `jj resolve`, which is interactive.

## Viewing history

```bash
# Recent commits
jj log

# With patches
jj log -p

# Show all visible commits
jj log -r 'all()'

# Specific commit
jj show <change-id>

# Working copy diff
jj diff

# Diff of a specific commit
jj diff -r <change-id>

# See how a change evolved
jj evolog -r <change-id>
```

## Moving between commits

```bash
# New empty commit on top of current
jj new

# New commit with message
jj new -m "Commit message"

# New commit on top of a specific revision
jj new <change-id>

# Insert a new commit before the current one
jj new -B @ -m "Preparatory change"

# Insert a new commit after a specific one
jj new --insert-after <change-id>

# Edit existing commit (working copy becomes that commit)
jj edit <change-id>

# Edit previous / next commit
jj prev -e
jj next -e

# Move @ to a sibling
jj new <change-id>
```

## Refining commits in detail

### Squashing

Move changes from current commit into its parent:

```bash
jj squash
jj squash path/to/file
```

Avoid `jj squash -i` — interactive mode hangs in agent environments.

### Committing

`jj commit -m "msg"` is equivalent to `jj describe -m "msg"` followed by `jj new`. With file arguments, selected paths stay in `@` and the rest move to a new child commit.

```bash
jj commit -m "Add feature"
jj commit path/to/file -m "Part A"
```

### Splitting

Avoid `jj split` — it is interactive and will hang. Alternatives:

```bash
# Move changes out of current commit
jj restore path/to/file.txt

# Create a new commit for them
jj new && jj desc -m "Separate change"

# Or use commit with paths
jj commit path/to/keep.txt -m "Part A"
```

### Absorbing

Automatically distribute working copy changes to the commits that last modified those lines:

```bash
jj absorb
jj absorb src/
jj absorb -f @ -t mutable()
```

### Restoring files

```bash
# Discard all uncommitted changes in @
jj restore

# Discard specific files
jj restore path/to/file.txt

# Restore from a specific revision into @
jj restore --from <change-id> path/to/file.txt

# Undo the changes introduced by a specific commit
jj restore --changes-in <change-id>
```

### Rebase

```bash
# Rebase a single revision (without descendants)
jj rebase -r <id> -o <target>

# Rebase a revision and its descendants
jj rebase -s <id> -o <target>

# Rebase a whole branch relative to a destination
jj rebase -b <id> -o <target>

# Insert before / after existing commits
jj rebase -r <id> --insert-before <target>
jj rebase -r <id> --insert-after <target>
```

Rebases in `jj` always succeed; conflicts are recorded if necessary.

## Workflows in depth

### Squash workflow

Best when you want to craft clean, atomic commits.

1. Describe the target commit: `jj desc -m "Implement feature X"`
2. Create scratch commit: `jj new`
3. Write code.
4. Move code into the described commit:
   - `jj squash`
   - `jj squash path/to/file`
5. Repeat.

This gives you the power of Git's index with fewer concepts.

### Edit workflow

Best when you think in terms of editing existing commits.

1. `jj new -m "Feature X"`
2. Write code.
3. If you need a commit before this one: `jj new -B @ -m "Refactor"`
4. Switch back to continue editing: `jj next --edit` / `jj edit <id>`

### Anonymous branch workflow

```bash
# Start two features from the same parent
jj new trunk -m "Feature A"
jj new trunk -m "Feature B"

# View all active heads
jj log -r 'heads(all())'
```

### Stacked PRs / multi-branch workflow

Create several PRs from `trunk`:

```bash
jj new trunk -m "PR 1 part 1"
jj new -m "PR 1 part 2"
jj git push -c @

jj new trunk -m "PR 2"
jj git push -c @
```

When upstream updates, rebase all your branches at once:

```bash
jj git fetch
jj rebase -s 'all:roots(trunk..@)' -o trunk
```

You can also create a merge commit whose parents are all your PR heads, work on top of it, then `jj squash` changes into the appropriate branch.

## Working with bookmarks

Bookmarks are jj's equivalent to git branches:

```bash
# Create bookmark at current commit
jj bookmark create my-feature -r@

# Move existing bookmark to a different commit
jj bookmark set my-feature --to <change-id>

# List bookmarks
jj bookmark list

# Delete bookmark
jj bookmark delete my-feature

# Forget bookmark without pushing deletion
jj bookmark forget my-feature
```

Bookmarks do **not** automatically advance when you create new commits. Always move them before pushing.

## Workspaces

Jujutsu workspaces provide multiple working directories backed by a single repo, similar to Git worktrees. They are especially useful when you want an AI agent to work on a separate task in parallel while you continue in the main directory.

### Creating and using workspaces

```bash
# Create a new workspace in a sibling directory
jj workspace add ../my-project-task

# List all workspaces
jj workspace list

# Show the current workspace's root directory
jj workspace root

# Show another workspace's root directory
jj workspace root --name my-project-task

# Rename the current workspace
jj workspace rename my-project-task
```

Each workspace has its own working-copy commit. In `jj log`, other workspaces appear as `<workspace name>@`. All workspaces share the same repository history, so changes committed in one workspace are immediately visible in the others.

### Removing workspaces

```bash
# Stop tracking a workspace (does not delete files on disk)
jj workspace forget my-project-task

# Then delete the directory separately
rm -rf ../my-project-task
```

Use `jj workspace forget` before deleting the directory. If you delete the directory first, the repo will still know about the workspace until you run `jj workspace forget`.

### Stale working copies

If one workspace rewrites the working-copy commit of another workspace, the affected workspace's files become stale. Run:

```bash
jj workspace update-stale
```

This updates the working-copy files to match the current operation. A workspace can also become stale if a command is interrupted (e.g., by `^C`) before it finishes updating the working copy.

### Workspaces vs. Git worktrees

| Concept | Git worktrees | Jujutsu workspaces |
|--------|---------------|--------------------|
| Multiple working directories | `git worktree add` | `jj workspace add` |
| Each has its own checked-out commit | Yes | Yes |
| Share object/history storage | Yes | Yes |
| Remove tracking | `git worktree remove` | `jj workspace forget` |
| Recover stale copy | Manual checkout | `jj workspace update-stale` |

In colocated repos (where both `.jj/` and `.git/` exist), jj workspaces and Git worktrees can coexist, but prefer `jj workspace` commands for jj-managed working copies to avoid confusing either tool.

## Git integration

### Clone and init

```bash
# Clone a git repository
jj git clone <url>

# Initialize jj in an existing git repo
jj git init --colocate
```

### Colocated repos

In repos where both `.jj/` and `.git/` exist, you can use both tools. Important:

- Always ensure work is committed in jj before switching to git.
- After git operations, jj will detect and incorporate changes on next command.

```bash
# Switch to git mode
jj st                  # ensure clean
git checkout <branch>

# Switch back to jj mode
jj edit <change-id>
```

### Fetching and pushing

```bash
# Fetch from default remote
jj git fetch

# Push a bookmark
jj bookmark set my-feature --to @
jj git push -b my-feature

# Push a change as a new remote branch (PR workflow)
jj git push -c @

# Push all tracked bookmarks
jj git push --tracked

# Push all bookmarks including new ones
jj git push --all
```

Push uses force-with-lease-like safety checks by default. If the remote has moved since your last fetch, fetch first and resolve any bookmark conflicts.

Before pushing:

1. Bookmark points to the correct commit.
2. Commits are refined and atomic.
3. User has explicitly requested the push.

## Handling conflicts

jj allows committing conflicts and resolving them later:

```bash
# View conflicts
jj st

# See which commits are conflicted
jj log -r 'conflicts()'
```

**Agent resolution**: Do not use `jj resolve` (interactive). Edit conflicted files directly to remove conflict markers, then run `jj st` to verify. Because `jj` records conflicts in commits, you can also resolve by editing the conflicted commit directly (`jj edit <id>`) or by creating a resolution commit on top and squashing it in (`jj new <id>`, edit, `jj squash`).
