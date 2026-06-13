# Page Format

Templates and rules for LLM Wiki pages.

## Knowledge Page

```markdown
---
type: page
topic: {subdirectory}
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: ["raw/Articles/xxx.md"]
---

# {Title}

## Overview
1–2 sentences.

## Core Content

## Related Pages
- [[...]] — relationship

## Change Log
- [YYYY-MM-DD] change description
```

## Topic Index (index.md)

```markdown
---
type: index
topic: {subdirectory}
updated: YYYY-MM-DD
---

# {Topic Name}

> One-line description.

## Pages
- [[PageA]] — summary

## To Explore
- [ ] open question
```

## Annotations

```markdown
> ⚠️ **Contradiction**: existing... new source... pending resolution...

> 🤔 **Unverified**: from a single source only.
```

## Creating a New Topic

When a direction accumulates 3+ independent pages clearly distinct from existing topics:

1. Create `{topic}/` directory under `wiki/`.
2. Create `{topic}/index.md`.
3. Update `wiki/index.md`.
4. Record in `wiki/log.md`.

**Prefer fewer topics; fold into existing topics when possible.**
