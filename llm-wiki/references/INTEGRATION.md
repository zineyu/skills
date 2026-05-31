# Integration

Permissions and tool ecosystem for LLM Wiki.

## Permissions

| Path | LLM Permission |
|------|---------------|
| `raw/` | Read-only |
| `wiki/` | Full read-write |
| `AGENTS.md` | Read-write (negotiate with user) |
| `assets/` | Read-only |

## Tool Ecosystem

- **Obsidian**: User's Wiki browser. LLM edits files; user views images, follows links, inspects the graph.
- **Web Clipper**: Browser extension to clip web pages directly into `raw/`.
- **Obsidian Graph View**: Visualize Wiki structure — identify hub pages and isolated nodes.
- **Version Control**: Wiki is a Markdown git/jj repository with built-in history.
