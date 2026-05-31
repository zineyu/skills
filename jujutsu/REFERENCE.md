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
