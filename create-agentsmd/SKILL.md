---
name: create-agentsmd
description: 'Prompt for generating an AGENTS.md file for a repository'
---

# Create high‑quality AGENTS.md file

AGENTS.md is an open format designed to provide coding agents with the context and instructions they need to work effectively on a project.

## Workflow

1. **Check for existing AGENTS.md** in the target directory and its parents.
   - If it exists: read it, ask the user whether to update, overwrite, or append.
   - If it does not exist: proceed to step 2.
2. **Collect context** by asking the user the diagnostic questions below. Do not generate the file before receiving answers.
3. **Generate the file** using the template and priority rules below.
4. **Show a preview** and ask for confirmation before writing.

## Diagnostic questions (ask before generating)

Ask the user these questions; use sensible defaults if they decline to answer:

1. What is the project's tech stack and primary language?
2. What are the exact build and test commands?
3. What code-style or linting rules should the agent enforce?
4. Are there any security gotchas, secrets management rules, or operations that require explicit user confirmation?
5. Is this a monorepo with subprojects that need separate AGENTS.md files?

## What is AGENTS.md?

README.md files are for humans: quick starts, project descriptions, and contribution guidelines.

AGENTS.md complements this by containing the extra, sometimes detailed context coding agents need: build steps, tests, and conventions that might clutter a README or aren't relevant to human contributors.

We intentionally kept it separate to:

- Give agents a clear, predictable place for instructions.
- Keep READMEs concise and focused on human contributors.
- Provide precise, agent-focused guidance that complements existing README and docs.

## Key Principles

### 1. Cover what matters (Required sections)

Every AGENTS.md must include these sections if they apply:

- **Project overview** — one sentence plus key architectural decisions.
- **Build and test commands** — exact shell commands, not descriptions.
- **Code style guidelines** — formatter, linter, and any non-default rules.
- **Testing instructions** — how to run tests, required coverage thresholds, test locations.

### 2. Add extra instructions (Optional sections)

Include only if relevant to the project:

- Commit message or pull-request guidelines.
- Security gotchas or secrets-handling rules.
- Deployment steps or environment setup.
- Large-dataset handling or performance constraints.
- Anything you'd tell a new teammate on day one.

### 3. Large monorepo? Use nested AGENTS.md files for subprojects

Place another AGENTS.md inside each package. Agents automatically read the nearest file in the directory tree, so the closest one takes precedence and every subproject can ship tailored instructions.

### 4. Reference over embedding

The `AGENTS.md` body should only contain what the Coding Agent needs at startup; content that is only needed later should be stored in the `docs/` directory.
For example: PR creation guidelines are only needed after completing the code work, so they should be placed in the `docs/` directory, and the `AGENTS.md` should inform the Agent to read them when it needs to create a PR.

### 5. Never embed

Do **not** include:

- API keys, tokens, passwords, or any secrets.
- Personal local paths or machine-specific configuration.
- Temporary scripts, one-off debugging commands, or TODOs without issue links.
- Large blocks of copied documentation; use links instead.

## Output template

Use this structure as the default. Omit sections that do not apply; do not add sections not listed above without user approval.

```markdown
# AGENTS.md

> One-sentence project overview.

## Build & Test

- Build: `exact command`
- Test: `exact command`
- Lint / Format: `exact command`

## Code Style

- Formatter: name and version
- Linter: name and version
- Key rules: list non-default or project-specific rules

## Testing

- Framework: name
- Location: path pattern (e.g., `src/**/*.test.ts`)
- Coverage threshold: percentage or "none"

## Security & Safety

- Operations requiring confirmation: list them
- Secrets management: where they live, how they are injected

## Extra Instructions

- Anything else from the optional sections above

## References

- `docs/pr-guidelines.md` — PR creation guidelines (read before opening a PR)
- Other `docs/` files the agent should consult later
```
