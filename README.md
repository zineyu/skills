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

## Skills List

| Skill | Description |
|-------|-------------|
| browser-cdp | Control Chrome via CDP for browser automation |
| commit-msg | Generate conventional commit messages |
| diagnose | Disciplined diagnosis loop for hard bugs |
| find-skills | Discover and install agent skills |
| fullstack-dev | Full-stack backend & frontend integration |
| grill-me | Interview-style stress-test for plans |
| grill-with-docs | Grill against domain model and update docs |
| handoff | Compact conversation into handoff document |
| improve-codebase-architecture | Find deepening opportunities in codebases |
| jujutsu | Jujutsu (jj) VCS operations guide |
| llm-wiki | LLM-driven personal knowledge base |
| managing-kubernetes-etcd-and-sre | K8s, etcd, and SRE practices |
| obsidian-bases | Obsidian Bases (.base files) |
| obsidian-cli | Obsidian vault CLI operations |
| obsidian-markdown | Obsidian Flavored Markdown |
| self-improve-skill | Auto-create skills from learned patterns |
| setup-matt-pocock-skills | Setup Matt Pocock's skills |
| software-engineering-practices | Production-ready software patterns |
| system-architecture-practices | Architecture & design methodology |
| tdd | Test-driven development |
| to-issues | Break plans into tracker issues |
| to-prd | Turn conversation into a PRD |
| vue-ecosystem | Vue.js 3 ecosystem best practices |
| web-design-guidelines | Web Interface Guidelines review |
| write-a-skill | Create new agent skills |
| zoom-out | (no description yet) |

## Usage

Skills are typically symlinked into the agent's skills search path, e.g.:

```bash
ln -s ~/space/projects/zine-skills/~/.pi/agent/skills/
```

Or configure your agent to load skills from this directory directly.

## License

Private — personal use only.
