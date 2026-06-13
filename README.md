# zine-skills

Personal agent skills repository. Each subdirectory is a self-contained skill that can be loaded by the pi coding agent or other compatible agents.

## Structure

```
.
├── <skill-name>/
│   ├── SKILL.md
│   └── ... (supporting files)
└── README.md
```

## Skills by Category

### Engineering Execution

| Skill | Description |
|-------|-------------|
| diagnose | Disciplined diagnosis loop for hard bugs |
| endpoint-performance-diagnosis | Systematic endpoint performance bottleneck diagnosis |
| fullstack-dev | Full-stack backend & frontend integration guide |
| tdd | Test-driven development with red-green-refactor loop |

### Planning & Requirements

| Skill | Description |
|-------|-------------|
| grill-me | Stress-test a plan with relentless questions |
| grill-with-docs | Stress-test a plan against the domain model and docs |
| to-issues | Break a plan into independently-grabbable tracker issues |
| to-prd | Turn conversation context into a PRD |
| zoom-out | Get a higher-level perspective on unfamiliar code |

### Architecture & Quality

| Skill | Description |
|-------|-------------|
| create-agentsmd | Generate AGENTS.md for a repository |
| improve-codebase-architecture | Find deepening opportunities in codebases |
| setup-matt-pocock-skills | Scaffold repo config for Matt Pocock's skills |

### Knowledge Management & Obsidian

| Skill | Description |
|-------|-------------|
| llm-wiki | LLM-driven personal knowledge base |
| obsidian-bases | Obsidian Bases (.base files) |
| obsidian-cli | Obsidian vault CLI operations |
| obsidian-markdown | Obsidian Flavored Markdown |

### VCS & Delivery

| Skill | Description |
|-------|-------------|
| commit-msg | Generate conventional commit messages |
| handoff | Compact conversation into a handoff document |
| jujutsu | Jujutsu (jj) VCS operations guide |

### Skill Authoring & Discovery

| Skill | Description |
|-------|-------------|
| find-skills | Discover and install agent skills |
| session-to-skill | Distill session experience into a reusable skill |
| write-a-skill | Create new agent skills |

## Usage

Skills are typically symlinked into the agent's skills search path, e.g.:

```bash
ln -s ~/space/projects/zine-skills/~/.pi/agent/skills/
```

Or configure your agent to load skills from this directory directly.

## License

Private — personal use only.
