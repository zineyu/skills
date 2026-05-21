---
name: llm-wiki
description: LLM Wiki 个人知识库模式 — LLM 增量构建和维护的结构化知识库。当用户说"ingest"、"摄入"、"处理资料"、"lint wiki"、"检查wiki"、"query wiki"、"llm wiki"、提及将资料整合到知识库、或需要在 Obsidian vault 中维护由 LLM 驱动的知识库时使用。支持三层架构：raw（原始资料，只读）→ wiki（LLM 维护的知识页面）→ schema（本文件）。
user-invocable: true
allowed-tools: "Read, Write, Edit, Bash, Glob, Grep"
---

# LLM Wiki

> LLM 增量构建和维护的结构化知识库模式。

## 核心概念

大多数人的 LLM + 文档体验是 RAG：上传文件 → LLM 检索 → 生成答案。每次查询都从零拼凑知识，没有积累。

LLM Wiki 不同：LLM **增量构建一个持久的、互连的 Wiki**——结构化 Markdown 文件，介于你和原始资料之间。当你添加新资料，LLM 不只是索引，而是提取关键信息并**整合到已有 Wiki**——更新实体页、修订主题摘要、标记矛盾、强化综合。知识编译一次，持续保鲜，而非每次查询时重新推导。

**Wiki 是持久的复利产物**。交叉引用已存在，矛盾已标注，综合已反映全部资料。每添加一份资料、每问一个问题，Wiki 都在变得更丰富。

## 架构

三层结构：

```
{workspace}/
├── inbox/                # 📥 待处理缓冲区（用户投放，LLM 处理后归档并清空）
├── raw/                  # 原始资料（不可变，LLM 只读）
│   ├── Articles/         #   文章/博客
│   ├── Papers/           #   学术论文
│   ├── Books/            #   书籍章节
│   ├── Podcasts/         #   播客/访谈
│   └── Misc/             #   其他
├── wiki/                 # LLM 生成和维护的知识库
│   ├── index.md          #   全局内容目录
│   ├── log.md            #   按时间顺序的操作日志
│   └── {topic}/          #   主题子目录
│       ├── index.md      #     主题入口页
│       └── {page}.md     #     知识页面
└── AGENTS.md             # Schema（本文件的实例化版本）
```

- **inbox/**：临时缓冲区。用户通过 Obsidian 手动创建、Web Clipper 剪藏等方式投放。LLM 处理后归档到 `raw/` 并清空。
- **raw/**：用户策展的资料。只读——绝不修改。这是真相来源。
- **wiki/**：LLM 全权维护。所有 Markdown 由 LLM 生成和更新。用户阅读，LLM 编写。
- **AGENTS.md**：告诉 LLM 结构、约定和工作流。用户和 LLM 共同演化。

## 启动检测

**每次触发时首先检查**当前工作目录是否已有 LLM Wiki：

1. 检查 `raw/`、`wiki/`、`AGENTS.md` 是否存在
2. 若存在 → 直接执行操作（ingest / query / lint）
3. 若不存在 → 询问用户是否要在当前目录初始化 LLM Wiki

### 初始化新 Wiki

若用户同意初始化：

1. 创建目录结构：`raw/Articles/`、`raw/Papers/`、`raw/Books/`、`raw/Podcasts/`、`raw/Misc/`
2. 创建 `wiki/index.md`（空索引）
3. 创建 `wiki/log.md`（空日志）
4. 创建 `AGENTS.md`（写入本 skill 的实例化版本，针对当前领域定制）
5. 提交并告知用户

## 操作零：Process Inbox（处理收件箱）

用户说 **"处理 inbox"** 或 **"process inbox"** 时执行。完整流水线：待处理 → Wiki → 归档。

### 流程

1. **检测**：`jj status` 看 `inbox/` 下文件。空则告知用户。

2. **逐份处理**：对每个文件执行标准 ingest 流程（提取知识 → 写入 Wiki → 交叉引用）。

3. **分类归档**：将原始文件从 `inbox/` **移动**到 `raw/` 对应子目录（Articles/Papers/Books/Podcasts/Misc）。

4. **更新系统**：更新 `wiki/index.md`，追加 `wiki/log.md`，提交。

5. **汇报**：处理份数、去向、新建/更新页面。

## 操作一：Ingest（摄入）

用户将资料直接放入 `raw/` 后说 **"ingest"** 或 **"摄入"** 时执行。若资料在 `inbox/` 中，优先使用"处理 inbox"。

### 流程

1. **发现新资料**：通过 `jj status` 或比较文件时间，找到 `raw/` 中未处理的新文件

2. **读取并分析**：
   - 通读资料全文
   - 识别：核心概念、实体、论点、数据点、方法论
   - 判断哪些是新建页面、哪些应追加到已有页面

3. **写入 Wiki**：
   - 为重要资料创建摘要页（资料足够丰富时）
   - 更新相关实体/概念页：追加新信息、修订摘要
   - 标注矛盾：`> ⚠️ 矛盾标注` + 已有内容 vs 新来源对比
   - 在 frontmatter 的 `sources` 字段记录来源路径

4. **维护交叉引用**：
   - 新增 `[[wikilink]]` 连接相关页面
   - 同主题内：`[[页面名]]`
   - 跨主题：`[[主题/页面名]]`
   - 原始资料：`[[raw/Articles/文件名.md]]`

5. **更新索引与日志**：
   - 更新 `wiki/index.md`：新增/变更页面及摘要
   - 追加 `wiki/log.md`：
     ```markdown
     ## [YYYY-MM-DD] ingest | {资料标题}
     - 新建: [[主题/页面A]]、[[主题/页面B]]
     - 更新: [[主题/页面C]]、[[主题/页面D]]
     ```

6. **提交**：
   ```bash
   jj commit -m "ingest: {资料摘要}"
   ```

7. **汇报**：向用户列出新建/更新的页面，标注矛盾或待确认信息。

### 判断：新建 vs 更新

- 独立标题 + 3 个以上要点 → 新建页面
- 对已有主题的 1-2 个补充 → 追加到已有页面
- 与已有内容矛盾 → 追加 + `⚠️ 矛盾标注`
- 不确定 → 更新已有页面

## 操作二：Query（查询）

用户提出知识性问题时执行。

1. **定位**：先读 `wiki/index.md`，找到相关主题和页面
2. **深入**：读取相关页面，综合信息
3. **回答**：综合回答，标注来源（wikilink）
4. **沉淀（关键）**：若回答本身有独立价值（对比分析、新连接、深度解释），**主动询问用户**是否将其沉淀为新 Wiki 页面。这使探索成果也复利到知识库中。

## 操作三：Lint（检查）

用户说 **"lint"** 或 **"检查"** 时执行。

扫描 Wiki 健康：

| 问题 | 检查方法 |
|------|----------|
| **矛盾** | 不同页面对同一主题的论述是否冲突 |
| **孤立** | 无入链的页面（在 `wiki/` 中 grep `[[页面名]]` 计数） |
| **断裂** | wikilink 指向的文件是否存在 |
| **过时** | 被新资料取代的内容（检查 sources 时间线） |
| **缺口** | 被多次提及但无独立页面的重要概念 |

输出报告 → 追加 `wiki/log.md` → 提交。

## 页面格式

### 知识页面

```markdown
---
type: page
topic: {子目录名}
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: ["raw/Articles/xxx.md"]
---

# {标题}

## 概述
1-2 句。

## 核心内容

## 相关页面
- [[...]] — 关系

## 演化记录
- [YYYY-MM-DD] 变更说明
```

### 主题入口 (index.md)

```markdown
---
type: index
topic: {子目录名}
updated: YYYY-MM-DD
---

# {主题名}

> 一句话描述。

## 页面
- [[页面A]] — 摘要

## 待深入
- [ ] 待探索
```

### 标注

```markdown
> ⚠️ **矛盾标注**：已有... 新来源... 待解决...

> 🤔 **待验证**：仅来自单一来源。
```

## 新主题创建

某方向积累 3+ 个独立页面且与现有主题明显不同时：

1. `wiki/` 下创建 `{topic}/` 目录
2. 创建 `{topic}/index.md`
3. 更新 `wiki/index.md`
4. 记录到 `wiki/log.md`

**宁可少建，尽量归入已有主题。**

## 权限

| 路径 | LLM 权限 |
|------|----------|
| `raw/` | 只读 |
| `wiki/` | 全权读写 |
| `AGENTS.md` | 读写（需与用户协商） |
| `assets/` | 只读 |

## 与其他工具协同

- **Obsidian**：用户的 Wiki 浏览器。LLM 编辑文件，用户在 Obsidian 中看图、跟链接、检查图谱。
- **Web Clipper**：浏览器扩展，一键剪藏网页到 `raw/`。
- **Obsidian 图谱视图**：看 Wiki 的结构——哪些页面是枢纽、哪些是孤岛。
- **version control**：Wiki 就是 Markdown 文件的 git/jj 仓库，自带版本历史。
