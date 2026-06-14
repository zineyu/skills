# Skill 目录结构

> 分类目录组织、命名约定、文件布局规范。

---

## 顶层结构

```
zine-skills/
├── <category>/
│   └── <skill-name>/
│       ├── SKILL.md
│       └── ... (supporting files)
└── README.md
```

每个 skill 是其分类目录下的一个子目录，包含 `SKILL.md` 主文件及可选的 supporting files。

---

## 六个分类目录

| Category | Scope | Example skills |
|----------|-------|---------------|
| `engineering-execution/` | 编码、调试、测试、性能 | tdd, diagnose, incremental-implementation |
| `planning-requirements/` | 计划、需求、PRD、issue 拆分 | to-prd, to-issues, idea-refine |
| `architecture-quality/` | 架构 review、上下文工程、文档 | improve-codebase-architecture, context-engineering |
| `knowledge-obsidian/` | Obsidian vault 和知识库操作 | obsidian-markdown, obsidian-cli, llm-wiki |
| `vcs-delivery/` | 版本控制与交付 | commit-msg, jujutsu, shipping-and-launch |
| `skill-authoring/` | skill 的发现、创建和使用 | write-a-skill, find-skills, using-agent-skills |

### 分类原则

- 按功能领域分组，不按技术栈
- 一个 skill 只属于一个分类
- 新 skill 放入最匹配的分类；不确定时优先 `engineering-execution/`

---

## 命名约定

| 对象 | 样式 | 示例 |
|------|------|------|
| 分类目录 | kebab-case | `engineering-execution/`, `vcs-delivery/` |
| Skill 目录 | kebab-case | `commit-msg/`, `incremental-implementation/` |
| SKILL.md | 固定文件名 | `SKILL.md` |
| Supporting files | kebab-case .md 或合理后缀 | `PROPERTIES.md`, `REFERENCE.md` |
| Frontmatter `name` | kebab-case，与目录名一致 | `name: commit-msg` |

---

## Skill 目录内容

```
skill-name/
├── SKILL.md           # 主指令文件（必需）
├── <supporting>.md    # 详细参考 / 示例（可选，拆分时用）
├── references/        # 引用目录（可选，量大时用）
│   ├── topic-a.md
│   └── topic-b.md
└── scripts/           # 工具脚本（可选）
    └── helper.py
```

### 何时添加 Supporting Files

| 条件 | 做法 |
|------|------|
| SKILL.md 超过 100 行 | 拆分出 `REFERENCE.md` 或 `references/*.md` |
| 内容有明显子域 | 每个子域一个文件（如 obsidian-markdown 的 `CALLOUTS.md`、`EMBEDS.md`） |
| 需要确定性操作 | 添加 `scripts/` 目录存放工具脚本 |

### 引用约定

- 从 SKILL.md 引用 supporting files 时使用相对路径：`[REFERENCE.md](REFERENCE.md)`
- 引用深度最多一层（`references/file.md`）
- 不支持 `../` 跨目录引用

---

## README.md 同步

当新增或删除 skill 时，必须同步更新 `README.md` 中对应分类的 skill 表格。

表格格式：
```markdown
| Skill | Description |
|-------|-------------|
| <category>/<skill-name> | <description 摘要> |
```

---

## 禁止模式

- ❌ 不要在分类目录下直接放 SKILL.md —— 每个 skill 必须是独立子目录
- ❌ 不要使用大写或混合命名 —— 统一 kebab-case
- ❌ 不要嵌套超过两层的 skill 目录（`a/b/SKILL.md`）
- ❌ 不要让 `name` frontmatter 与目录名不一致
