# Skill 格式规范

> SKILL.md 的结构、frontmatter 格式、description 写法，以及 supporting files 的组织方式。

---

## Frontmatter

每个 SKILL.md 必须包含 YAML frontmatter，字段如下：

| Field | Required | Description |
|-------|:--------:|-------------|
| `name` | ✅ | 小写 kebab-case 标识符，与目录名一致。例如 `to-prd`、`commit-msg` |
| `description` | ✅ | 第三方描述，≤1024 字符。第一句说明能力，第二句 "Use when [triggers]" |

```markdown
---
name: skill-name
description: Brief description of what this does. Use when [specific trigger conditions].
---
```

### Description 写法

Description 是 agent 在选择 skill 时**唯一能看到的字段**。必须让 agent 明确知道：

1. 这个 skill 提供什么能力
2. 何时触发（具体关键词、上下文、场景）

**好例子**：

```yaml
description: Test-driven development with red-green-refactor loop. Use when user wants to build features or fix bugs using TDD, mentions "red-green-refactor", wants integration tests, or asks for test-first development.
```

**差例子**：

```yaml
description: Helps with testing.
```

差例子中 agent 无法区分这个 skill 与其他测试相关 skill 的差别。

---

## SKILL.md 正文结构

### 常见章节

技能文件通常按以下顺序组织：

| 章节 | 用途 | 何时需要 |
|------|------|----------|
| `## Philosophy` / `## Purpose` | 核心理念，为什么这个技能重要 | 复杂技能（tdd、doubt-driven-development） |
| `## Overview` | 一句话概述 | 几乎所有技能 |
| `## Workflow` / `## Process` | 分步指导 | 所有有操作流程的技能 |
| `## Quick start` | 最小可用示例 | 工具类技能（obsidian-markdown） |
| `## Checklist` | 检查清单（checkbox 格式） | 有质量门槛的技能 |
| `## Anti-Patterns` / `## Common Mistakes` / `## Red Flags` | 不应该做的事 + 原因 | 有常见陷阱的技能 |
| `## Rules` | 硬性约束 | 有明确禁止操作的技能 |
| `## Output Format` | 期望的输出格式 | 生成结构化输出的技能（commit-msg） |
| `## References` | 外部资源链接 | 引用官方文档的技能 |

### 长度控制

- SKILL.md 建议 ≤100 行
- 超过 100 行时，应将详细内容拆分到 supporting files
- 超过 500 行必须拆分

### Supporting Files

Supporting files 放在 skill 目录内，最多一层嵌套。常见类型：

```
skill-name/
├── SKILL.md           # 主文件（必需）
├── REFERENCE.md       # 详细参考
├── references/        # 引用文件目录
│   ├── PROPERTIES.md
│   └── CALLOUTS.md
└── scripts/           # 工具脚本（可选）
    └── helper.py
```

引用格式：`[REFERENCE.md](REFERENCE.md)` 或 `[PROPERTIES.md](references/PROPERTIES.md)`

---

## 代码示例

使用代码块展示正确/错误的做法对比：

```
**Good example**:
```typescript
export function createTask(data: TaskInput, options?: { notify?: boolean }) {
  const shouldNotify = options?.notify ?? false;
}
```

**Bad example**:
```typescript
// Avoid: unsafe defaults
export function createTask(data: TaskInput) {
  notify(data);  // silently sends notifications
}
```

---

## Checklist 格式

使用 checkbox 格式（`- [ ]`），放在代码块内以保持可读性：

```
## Pre-Implementation Checklist

- [ ] Confirm interface changes with user
- [ ] Identify deep module opportunities
- [ ] List behaviors to test
```

---

## 禁止模式

- ❌ 不要在 SKILL.md 中嵌入时间敏感信息（版本号、日期）
- ❌ 不要写超过 100 行的 SKILL.md 而不拆分
- ❌ 不要使用 emoji 作为主要传达手段（仅可作辅助）
- ❌ 不在 description 中写 "This skill..." —— agent 已知这是 skill
- ❌ 不要在 skill 目录内嵌套超过一层的 references 引用
