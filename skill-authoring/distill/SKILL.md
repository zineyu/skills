---
name: distill
description: 从当前或历史 agent 会话中提炼可复用产物（skill、项目文档、note、检查清单），并按适用范围归类存储。Use when 用户要求“把会话经验沉淀下来”“整理这次会话”“从这段对话中提取 skill/note/文档”“distill”。
---

# Distill

## Quick start

1. 明确用户想提炼的产物类型：项目文档、skill、通用 note、检查清单。
2. 判断适用范围：
   - **项目专用**：写入当前项目的 `docs/` 子目录或 `.pi/agent/skills/`，并在 `AGENTS.md` 中维护索引。
   - **通用 skill/note**：询问用户希望存放到哪个 skill 仓库或 notes 目录。
3. 抽象内容：不要复制聊天记录，提炼触发条件、决策流程、检查清单、模板。
4. 写入并校验路径、frontmatter、索引、一致性。

## Workflow

### 1. 定位材料

- **当前会话**：直接复用已确认的上下文和交付物。
- **历史会话**：用 `find . -maxdepth 1 -type f -printf '%T@ %f\n' | sort -nr` 定位 `.jsonl`；先抽 `user/assistant` 摘要，避免整读。

### 2. 判断产物与范围

| 用户意图 | 产物 | 默认位置 |
|---|---|---|
| 整理项目协议/配置/UI/操作约定 | 项目文档 | `<project>/docs/<topic>/` |
| 提炼可复用 agent 能力 | skill | 项目级：`<project>/.pi/agent/skills/<name>/SKILL.md`；通用：用户指定的 skill 仓库 |
| 记录教训、流程、决策 | note | 用户指定的 notes / wiki 目录 |
| 验收、发布、复现前检查 | 检查清单 | 随文档或 skill 附在 `## Checklist` |

### 3. 项目专用文档：写入 `docs/` 并更新 `AGENTS.md`

当产物只对当前项目有效时：

1. 选择或创建合适的 `docs/<topic>/` 子目录（如 `protocol/`、`models/`、`desktop/`、`operations/`）。
2. 写入 Markdown，保持简短、可执行、不过度嵌入一次性细节。
3. 在 `AGENTS.md` 的 Documentation index 中新增一行：
   - 说明查看时机
   - 指向新增文档路径
4. 如果相关术语也出现在 `CONTEXT.md`，在对应条目中添加反向链接。

### 4. 通用 skill：询问存放位置

当产物跨项目复用时：

1. 先在目标 skills 目录查重。
2. 能力相同则更新；能力不同则新建。
3. **必须询问用户**希望存放到哪个位置（如 `~/.agents/skills/`、`zine-skills`、项目级 `.pi/agent/skills/`）。
4. 写入 `SKILL.md`：frontmatter + Quick start + Workflow + Lessons learned + Checklist。

### 5. 校验

- [ ] 路径正确，文件非空。
- [ ] 项目文档已在 `AGENTS.md` 索引中体现。
- [ ] `CONTEXT.md` 术语与分类文档无冲突，必要时互相链接。
- [ ] skill 的 description 包含 `Use when ...`。
- [ ] 没有提交真实密钥或敏感信息。
- [ ] 主文件控制在 100 行内；超出则拆 `REFERENCE.md` / `EXAMPLES.md`。

## Lessons learned

- 项目文档和通用 skill 不要混存。项目文档随仓库走，通用 skill 需要用户显式选择位置。
- `AGENTS.md` 应该是一份活的索引，而不是详尽的说明书。新增分类后必须同步更新索引表。
- 术语表（`CONTEXT.md`）与分类文档之间要互相引用，避免未来 agent 只读其一。
- 示例配置中的 API key 用占位符如 `PLACEHOLDER`，不要用 `sk-...` 等形似真实密钥的字符串。
- 不要直接把聊天记录粘贴成文档；要抽象为「何时查看、包含什么、如何使用」。
