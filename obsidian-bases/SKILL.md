---
name: obsidian-bases
description: Create and edit Obsidian Bases (.base files) with views, filters, formulas, and summaries. Use when working with .base files, creating database-like views of notes, or when the user mentions Bases, table views, card views, filters, or formulas in Obsidian.
---

# Obsidian Bases

## Quick start

1. Create a `.base` file with valid YAML
2. Add `filters` to select notes (by tag, folder, property)
3. Add `formulas` (optional) for computed properties
4. Add `views` (`table`, `cards`, `list`, `map`) with `order`
5. Validate YAML and test in Obsidian

```yaml
filters:
  and:
    - file.hasTag("task")
    - 'file.ext == "md"'

formulas:
  days_until: 'if(due, (date(due) - today()).days, "")'

views:
  - type: table
    name: "Tasks"
    order: [file.name, status, due, formula.days_until]
```

## Core syntax

- [Filters, operators, and properties](references/SYNTAX.md#filter-syntax)
- [Formula syntax and key functions](references/SYNTAX.md#formula-syntax)
- [View types and summary formulas](references/SYNTAX.md#view-types)
- [Complete examples](references/EXAMPLES.md)
- [Troubleshooting](references/TROUBLESHOOTING.md)

## Advanced features

- Custom summary formulas: `summaries: { name: 'values.mean()' }`
- Property display names: `properties: { prop: { displayName: "Name" } }`
- View-specific filters, grouping, and limits
- Embed in Markdown: `![[MyBase.base#View Name]]`
- Full functions reference: [FUNCTIONS_REFERENCE.md](references/FUNCTIONS_REFERENCE.md)

## References

- [Bases Syntax](https://help.obsidian.md/bases/syntax)
- [Functions](https://help.obsidian.md/bases/functions)
- [Views](https://help.obsidian.md/bases/views)
- [Formulas](https://help.obsidian.md/formulas)
