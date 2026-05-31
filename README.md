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
| commit-msg | Generate conventional commit messages |
| create-agentsmd | Generate AGENTS.md for a repository |
| diagnose | Disciplined diagnosis loop for hard bugs |
| find-skills | Discover and install agent skills |
| fullstack-dev | Full-stack backend & frontend integration |
| grill-me | Interview-style stress-test for plans |
| grill-with-docs | Grill against domain model and update docs |
| handoff | Compact conversation into handoff document |
| improve-codebase-architecture | Find deepening opportunities in codebases |
| jujutsu | Jujutsu (jj) VCS operations guide |
| llm-wiki | LLM-driven personal knowledge base |
| obsidian-bases | Obsidian Bases (.base files) |
| obsidian-cli | Obsidian vault CLI operations |
| obsidian-markdown | Obsidian Flavored Markdown |
| setup-matt-pocock-skills | Scaffold repo config for Matt Pocock's skills |
| tdd | Test-driven development |
| to-issues | Break plans into tracker issues |
| to-prd | Turn conversation into a PRD |
| write-a-skill | Create new agent skills |
| zoom-out | Zoom out for broader context or higher-level perspective |

## Usage

Skills are typically symlinked into the agent's skills search path, e.g.:

```bash
ln -s ~/space/projects/zine-skills/~/.pi/agent/skills/
```

Or configure your agent to load skills from this directory directly.

## License

Private — personal use only.
