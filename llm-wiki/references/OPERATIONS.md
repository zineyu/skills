# Operations

Detailed workflows for LLM Wiki.

## Process Inbox

Complete pipeline: pending → Wiki → archive.

1. **Detect**: List files in `inbox/`. Empty → inform user.
2. **Process each**: Run standard ingest flow (extract knowledge → write to Wiki → cross-reference).
3. **Classify and archive**: Move original files from `inbox/` to `raw/{Articles|Papers|Books|Podcasts|Misc}/`.
4. **Update system**: Update `wiki/index.md`, append `wiki/log.md`, commit.
5. **Report**: Count processed, destinations, new/updated pages.

## Ingest

Triggered when user says "ingest" or "摄入". If files are in `inbox/`, prefer **Process Inbox**.

### Flow

1. **Discover new materials**: Use `jj status` or file timestamps to find unprocessed files in `raw/`.
2. **Read and analyze**:
   - Read the full material.
   - Identify core concepts, entities, arguments, data points, methodologies.
   - Decide which pages to create and which to update.
3. **Write to Wiki**:
   - Create summary pages for substantial materials.
   - Update relevant entity/concept pages: append new info, revise summaries.
   - Mark contradictions: `> ⚠️ Contradiction` + compare existing vs new source.
   - Record source path in frontmatter `sources`.
4. **Maintain cross-references**:
   - Add `[[wikilink]]` to related pages.
   - Same topic: `[[PageName]]`
   - Cross-topic: `[[Topic/PageName]]`
   - Raw material: `[[raw/Articles/Filename.md]]`
5. **Update index and log**:
   - Update `wiki/index.md` with new/changed pages and summaries.
   - Append to `wiki/log.md`:
     ```markdown
     ## [YYYY-MM-DD] ingest | {Material title}
     - New: [[Topic/PageA]], [[Topic/PageB]]
     - Updated: [[Topic/PageC]], [[Topic/PageD]]
     ```
6. **Commit**:
   ```bash
   jj commit -m "ingest: {summary}"
   ```
7. **Report**: List new/updated pages, flag contradictions or open questions.

### Decision: Create vs Update

| Situation | Action |
|-----------|--------|
| Standalone title + 3+ key points | Create new page |
| 1–2 additions to existing topic | Append to existing page |
| Conflicts with existing content | Append + `⚠️ Contradiction` |
| Uncertain | Update existing page |

## Query

Triggered when user asks a knowledge question.

1. **Locate**: Read `wiki/index.md`, find relevant topics and pages.
2. **Deep dive**: Read relevant pages, synthesize information.
3. **Answer**: Provide synthesized answer with wikilink citations.
4. **Persist (critical)**: If the answer has standalone value (comparative analysis, new connections, deep explanation), **ask the user** whether to save it as a new wiki page. This compounds exploration results into the knowledge base.

## Lint

Triggered when user says "lint" or "检查".

Scan wiki health:

| Issue | Check method |
|-------|-------------|
| **Contradictions** | Same topic described differently across pages |
| **Orphaned** | Pages with zero incoming links (`grep "[[PageName]]"` in `wiki/`) |
| **Broken links** | Wikilink targets do not exist |
| **Outdated** | Content superseded by newer sources (check `sources` timeline) |
| **Gaps** | Important concepts mentioned often but lacking dedicated pages |

Output report → append to `wiki/log.md` → commit.
