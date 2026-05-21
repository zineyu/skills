---
name: self-improve
version: 1.0.0
description: "Review conversation history and automatically create or update skills based on learned patterns, user corrections, and non-trivial workflows. This is the agent's procedural memory system — turn experience into reusable knowledge."
metadata:
  hermes:
    tags: [memory, skills, learning, procedural-memory]
    category: agent-core
    requires_toolsets: [memory, skills]
---

# Self-Improvement Skill

## When to Use

Trigger a self-improvement review when:
- A complex task (5+ tool calls) completes successfully
- The user corrected your approach, style, or output format
- You discovered a non-trivial workaround, debugging path, or tool pattern
- A loaded skill was wrong, missing steps, or outdated
- The user said "remember this" or expressed frustration about repeated behavior

## Review Triggers

### Automatic Triggers (Background)
Hermes automatically spawns background reviews based on:
- **Iteration count**: After N turns (configurable via `skill_nudge_interval`)
- **Session end**: When conversation concludes
- **Complex task**: After 5+ tool calls in a single task

### Manual Trigger
```
/self-improve    # Trigger immediate review
```

## Review Process

### Step 1: Analyze Conversation
Scan the conversation for **skill signals**:

| Signal | Action |
|--------|--------|
| User correction (style/format/approach) | Update governing skill |
| "Remember this" / "Don't do X again" | Embed preference in skill |
| Non-trivial technique/fix discovered | Create/update skill |
| Skill was wrong/outdated | Patch immediately |
| Frustration about repeated behavior | Update skill + memory |

### Step 2: Decide Action (Preference Order)

1. **UPDATE A CURRENTLY-LOADED SKILL**
   - Check which skills were loaded via `/skill-name` or `skill_view`
   - If one covers the learning, PATCH it first
   - Use `skill_manage(action="patch")` for targeted fixes

2. **UPDATE AN EXISTING UMBRELLA SKILL**
   - Use `skills_list()` + `skill_view()` to find the right skill
   - Patch with new pitfalls, steps, or broader triggers

3. **ADD A SUPPORT FILE**
   - `references/<topic>.md` — session-specific detail, API docs excerpts
   - `templates/<name>.<ext>` — starter files, boilerplate
   - `scripts/<name>.<ext>` — verification scripts, probes
   - Use `skill_manage(action="write_file")`
   - Add one-line pointer in SKILL.md

4. **CREATE A NEW CLASS-LEVEL SKILL**
   - Name at CLASS level: `kubernetes-deployment`, not `fix-ingress-bug-2024`
   - Must have rich SKILL.md + references/ directory
   - Use `skill_manage(action="create")`

### Step 3: Execute Update

**For patches:**
```python
skill_manage(
    action="patch",
    name="skill-name",
    old_string="old text to find",
    new_string="new replacement text"
)
```

**For new skills:**
```python
skill_manage(
    action="create",
    name="new-skill-name",
    content="""---
name: new-skill-name
description: "What this skill does"
---

# Skill Title

## When to Use
Trigger conditions...

## Procedure
1. Step one
2. Step two

## Pitfalls
- Known failure modes

## Verification
How to confirm it worked.
""",
    category="devops"  # optional
)
```

## Skill Naming Rules

✅ **Good names** (class-level):
- `kubernetes-deployment`
- `python-debugging`
- `api-error-handling`
- `git-workflow`

❌ **Bad names** (session-specific):
- `fix-pr-1234`
- `debug-yesterday-error`
- `react-router-v6-migration-today`
- `audit-security-march-2024`

## User Preference Embedding

When user expresses preferences, embed in **both**:
- **Memory**: "User prefers concise responses" (who the user is)
- **Skill**: Update the skill governing that task (how to do it)

Example:
```
User: "Stop explaining so much, just give me the command"
→ Memory: "User prefers command-first, minimal explanation"
→ Skill (terminal-operations): Add pitfall: "Default to command + brief explanation. Only elaborate when asked."
```

## Review Prompts

### Skill-Only Review
```
Review the conversation and update the skill library. Be ACTIVE — most sessions produce at least one skill update.

Target shape: CLASS-LEVEL skills with rich SKILL.md and references/ directory.

Signals (any one warrants action):
• User corrected style, tone, format, or approach
• Non-trivial technique/fix/workaround discovered
• A loaded skill was wrong or outdated

Preference order:
1. Update currently-loaded skill
2. Update existing umbrella skill
3. Add support file (references/templates/scripts)
4. Create new class-level umbrella

'Nothing to save.' is a real option but should NOT be the default.
```

### Combined Review (Memory + Skills)
```
Review the conversation and update two things:

**Memory**: who the user is. Save facts and durable preferences.

**Skills**: how to do this class of task. Be ACTIVE — most sessions produce at least one skill update.

Act on whichever dimension has real signal. If genuinely nothing stands out, say 'Nothing to save.'
```

## Integration with Curator

The [Curator](/docs/user-guide/features/curator) handles maintenance at scale:
- Auto-transitions: active → stale → archived (30/90 days)
- LLM review: proposes consolidations, patches drift
- Pinning: protects important skills from auto-archive

**You focus on**: Creating and updating skills during sessions
**Curator handles**: Long-term maintenance, deduplication, cleanup

## CLI Commands

```bash
# Trigger manual review
hermes self-improve

# Curator maintenance
hermes curator status          # View skill library health
hermes curator run --dry-run   # Preview what curator would do
hermes curator pin <skill>     # Protect skill from archive
hermes curator backup          # Snapshot skill library
```

## Best Practices

1. **Be active**: Default to updating, not skipping
2. **Class-level names**: Never session-specific
3. **Patch preferred**: More token-efficient than full edit
4. **Embed preferences**: Both memory AND skills
5. **Support files**: Use references/ for detail, templates/ for starters
6. **Note overlaps**: Mention overlapping skills for curator consolidation
7. **User corrections are gold**: First-class skill signals
