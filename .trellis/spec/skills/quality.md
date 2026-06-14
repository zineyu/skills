# Skill 质量标准

> Skill 内容的质量检查清单、禁用模式，以及 review 流程。

---

## 核心原则

Skill 是写给 AI agent 的指令集。高质量 skill = agent 能正确理解并执行，不需要用户额外解释。

---

## 内容质量检查清单

### 准确性

- [ ] 所有代码示例可执行（语法正确、无虚构 API）
- [ ] 命令示例在当前环境中可运行
- [ ] 引用的文件路径和外部 URL 有效
- [ ] 不包含幻觉内容（编造的概念、不存在的工具）

### 清晰性

- [ ] Description 包含明确的触发条件（"Use when..."）
- [ ] 每个 checklist item 是具体可验证的，而非模糊的 ("code is clean")
- [ ] 术语在全文一致使用
- [ ] 复杂概念有 Bad/Good 对比示例

### 可执行性

- [ ] 步骤按可执行顺序排列
- [ ] 每个步骤的输入/输出明确
- [ ] 错误处理和边界情况有说明
- [ ] 不需要用户额外解释就能执行

### 完整性

- [ ] 覆盖了 description 中声称的所有场景
- [ ] 有足够的示例说明关键概念
- [ ] 预检条件（preconditions）明确列出
- [ ] 后检条件（postconditions）或输出格式明确

---

## 常见缺陷

| 缺陷 | 示例 | 修正 |
|------|------|------|
| **模糊触发条件** | "Use when coding" | "Use when implementing multi-file changes, building features from task breakdowns, or refactoring" |
| **不可验证的 checklist** | "Code is good" | "All existing tests pass, new tests cover the changed behavior, type checker reports zero errors" |
| **缺失反例** | 只展示正确做法 | 同时展示错误做法 + 解释为什么错 |
| **过长的 SKILL.md** | 200 行未拆分 | 拆分到 supporting files |
| **虚构代码** | 写了项目中不存在的 API | 从真实项目代码中提取示例 |
| **跳过前置步骤** | 直接写代码不检查环境 | 先列 "Before you start" checklist |

---

## Review Checklist

Skill 提交前应通过以下检查：

```
[ ] Description: 包含能力描述 + 触发条件（"Use when..."）
[ ] Frontmatter: name 与目录名一致，description ≤1024 字符
[ ] 长度: SKILL.md ≤100 行（或已合理拆分）
[ ] 无时间敏感信息: 无硬编码版本号、日期
[ ] 术语一致: 同一概念全文使用相同名称
[ ] 示例完整: 关键模式有实际的代码/命令示例
[ ] 路径有效: 所有内部链接和引用路径正确
[ ] README: 已同步 skill 表格
```

---

## 内容更新流程

1. 修改 SKILL.md 或 supporting files
2. 运行 review checklist
3. 如果 SKILL.md 超过 100 行，拆分为 supporting files
4. 如果涉及新增/删除/重命名 skill，更新 `README.md`
5. 提交时使用 `docs(skills): <summary>` 格式的 commit message

---

## 禁用模式

- ❌ 不要在 skill 中包含主观价值判断（"the best way"、"always preferred"）
- ❌ 不要在 description 中宣传或夸耀
- ❌ 不要假设特定的 IDE 或编辑器环境（除非 skill 专门针对该平台）
- ❌ 不要在 skill 中嵌入项目特定的硬编码路径（使用相对路径或模板变量）
- ❌ 不要跳过反例 —— 知道什么不该做和知道什么该做同样重要
