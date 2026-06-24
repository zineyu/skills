# Jujutsu Reference

## Viewing history

```bash
# Recent commits
jj log

# With patches
jj log -p

# Specific commit
jj show <change-id>

# Working copy diff
jj diff
```

## Moving between commits

```bash
# New empty commit on top of current
jj new

# New commit with message
jj new && jj desc -m "Commit message"

# Edit existing commit (working copy becomes that commit)
jj edit <change-id>

# Edit previous / next commit
jj prev -e
jj next -e
```

## Refining commits in detail

### Squashing

Move changes from current commit into its parent:

```bash
jj squash
```

Avoid `jj squash -i` — interactive mode hangs in agent environments.

### Splitting

Avoid `jj split` — it is interactive and will hang. Instead:

```bash
# Move changes out of current commit
jj restore path/to/file.txt

# Create a new commit for them
jj new && jj desc -m "Separate change"
```

### Absorbing

Automatically distribute working copy changes to the commits that last modified those lines:

```bash
jj absorb
```

### Restoring files

```bash
# Discard all uncommitted changes
jj restore

# Discard specific files
jj restore path/to/file.txt

# Restore from a specific revision
jj restore --from <change-id> path/to/file.txt
```

## Working with bookmarks

Bookmarks are jj's equivalent to git branches:

```bash
# Create bookmark at current commit
jj bookmark create my-feature -r@

# Move bookmark to a different commit
jj bookmark move my-feature --to <change-id>

# List bookmarks
jj bookmark list

# Delete bookmark
jj bookmark delete my-feature
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

### Pushing

```bash
# Push a bookmark
jj git push -b <bookmark-name>

# Move bookmark first, then push
jj bookmark move my-feature --to @
jj git push -b my-feature
```

Before pushing:

1. Bookmark points to the correct commit.
2. Commits are refined and atomic.
3. User has explicitly requested the push.

## Handling conflicts

jj allows committing conflicts and resolving them later:

```bash
# View conflicts
jj st
```

**Agent resolution**: Do not use `jj resolve` (interactive). Edit conflicted files directly to remove conflict markers, then run `jj st` to verify.
