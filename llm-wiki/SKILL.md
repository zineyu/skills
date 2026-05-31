---
name: llm-wiki
description: LLM incremental knowledge base — LLM builds and maintains a persistent, interlinked Wiki from curated raw materials. Use when user says "ingest", "process inbox", "lint wiki", "query wiki", "llm wiki", or needs an LLM-driven knowledge base in Obsidian.
user-invocable: true
allowed-tools: "Read, Write, Edit, Bash, Glob, Grep"
---

# LLM Wiki

Unlike RAG, LLM Wiki is a **persistent, compounding knowledge base**: LLM extracts and integrates new materials into existing structured Markdown pages, updating entities, marking contradictions, and strengthening synthesis. Knowledge is compiled once and kept fresh.

```
{workspace}/
├── inbox/                # Pending buffer (user drops, LLM archives after processing)
├── raw/                  # Curated source materials (read-only for LLM)
│   ├── Articles/ Papers/ Books/ Podcasts/ Misc/
├── wiki/                 # LLM-generated and maintained knowledge
│   ├── index.md log.md
│   └── {topic}/
│       ├── index.md {page}.md
└── AGENTS.md
```

## Quick start

1. Check if `raw/`, `wiki/`, `AGENTS.md` exist. If not, ask user to initialize.
2. On initialization: create directory structure, empty `wiki/index.md`, `wiki/log.md`, and `AGENTS.md`.
3. Drop files into `raw/` or `inbox/`, then run **Ingest** below.

## Workflows

### Process Inbox
User says "process inbox". Scan `inbox/`, ingest each file, move originals to `raw/{category}/`, update `wiki/index.md` and `wiki/log.md`, commit. See [references/OPERATIONS.md](references/OPERATIONS.md).

### Ingest
User says "ingest" or "摄入". Find new files in `raw/`, read and analyze, write/update wiki pages, add wikilinks, record sources in frontmatter, update index and log, commit. See [references/OPERATIONS.md](references/OPERATIONS.md).

### Query
User asks a knowledge question. Read `wiki/index.md`, locate relevant pages, synthesize answer with wikilink citations. If the answer has standalone value, ask user whether to persist it as a new wiki page. See [references/OPERATIONS.md](references/OPERATIONS.md).

### Lint
User says "lint" or "检查". Scan wiki health: contradictions, orphaned pages, broken wikilinks, outdated content, missing pages for frequently mentioned concepts. Output report, append to `wiki/log.md`, commit. See [references/OPERATIONS.md](references/OPERATIONS.md).

## Advanced features

- Page templates, topic creation rules, and annotation syntax: [references/PAGE_FORMAT.md](references/PAGE_FORMAT.md)
- Permission matrix and tool integration (Obsidian, Web Clipper, version control): [references/INTEGRATION.md](references/INTEGRATION.md)
