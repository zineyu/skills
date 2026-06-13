# zine-skills

Personal agent skills repository. Each subdirectory is a self-contained skill that can be loaded by the pi coding agent or other compatible agents.

## Structure

```
.
├── <category>/
│   └── <skill-name>/
│       ├── SKILL.md
│       └── ... (supporting files)
└── README.md
```

### Categories

- `engineering-execution` — coding, debugging, testing, performance
- `planning-requirements` — planning, grilling, PRDs, issue breakdown
- `architecture-quality` — architecture reviews, repo conventions
- `knowledge-obsidian` — Obsidian vault and knowledge-base workflows
- `vcs-delivery` — version control and handoff
- `skill-authoring` — creating and discovering skills

## Skills by Category

### Engineering Execution

| Skill | Description |
|-------|-------------|
| engineering-execution/api-and-interface-design | Guides stable API and interface design |
| engineering-execution/browser-testing-with-devtools | Tests in real browsers via Chrome DevTools MCP |
| engineering-execution/ci-cd-and-automation | Automates CI/CD pipeline setup |
| engineering-execution/code-review-and-quality | Conducts multi-axis code review |
| engineering-execution/code-simplification | Simplifies code for clarity |
| engineering-execution/deprecation-and-migration | Manages deprecation and migration |
| engineering-execution/diagnose | Disciplined diagnosis loop for hard bugs |
| engineering-execution/doubt-driven-development | Adversarial review of non-trivial decisions |
| engineering-execution/endpoint-performance-diagnosis | Systematic endpoint performance bottleneck diagnosis |
| engineering-execution/frontend-ui-engineering | Builds production-quality UIs |
| engineering-execution/fullstack-dev | Full-stack backend & frontend integration guide |
| engineering-execution/incremental-implementation | Delivers changes incrementally |
| engineering-execution/observability-and-instrumentation | Instruments code for production visibility |
| engineering-execution/performance-optimization | Optimizes application performance |
| engineering-execution/security-and-hardening | Hardens code against vulnerabilities |
| engineering-execution/source-driven-development | Grounds decisions in official documentation |
| engineering-execution/tdd | Test-driven development with red-green-refactor loop |

### Planning & Requirements

| Skill | Description |
|-------|-------------|
| planning-requirements/grill-me | Stress-test a plan with relentless questions |
| planning-requirements/grill-with-docs | Stress-test a plan against the domain model and docs |
| planning-requirements/idea-refine | Refines raw ideas into actionable concepts |
| planning-requirements/to-issues | Break a plan into independently-grabbable tracker issues |
| planning-requirements/to-prd | Turn conversation context into a PRD |
| planning-requirements/zoom-out | Get a higher-level perspective on unfamiliar code |

### Architecture & Quality

| Skill | Description |
|-------|-------------|
| architecture-quality/context-engineering | Optimizes agent context setup |
| architecture-quality/create-agentsmd | Generate AGENTS.md for a repository |
| architecture-quality/documentation-and-adrs | Records decisions and documentation |
| architecture-quality/improve-codebase-architecture | Find deepening opportunities in codebases |
| architecture-quality/setup-matt-pocock-skills | Scaffold repo config for Matt Pocock's skills |

### Knowledge Management & Obsidian

| Skill | Description |
|-------|-------------|
| knowledge-obsidian/llm-wiki | LLM-driven personal knowledge base |
| knowledge-obsidian/obsidian-bases | Obsidian Bases (.base files) |
| knowledge-obsidian/obsidian-cli | Obsidian vault CLI operations |
| knowledge-obsidian/obsidian-markdown | Obsidian Flavored Markdown |

### VCS & Delivery

| Skill | Description |
|-------|-------------|
| vcs-delivery/commit-msg | Generate conventional commit messages |
| vcs-delivery/handoff | Compact conversation into handoff document |
| vcs-delivery/jujutsu | Jujutsu (jj) VCS operations guide |
| vcs-delivery/shipping-and-launch | Prepares production launches |

### Skill Authoring & Discovery

| Skill | Description |
|-------|-------------|
| skill-authoring/find-skills | Discover and install agent skills |
| skill-authoring/session-to-skill | Distill session experience into a reusable skill |
| skill-authoring/using-agent-skills | Discovers and invokes agent skills |
| skill-authoring/write-a-skill | Create new agent skills |

## Usage

Skills are typically symlinked into the agent's skills search path, e.g.:

```bash
ln -s ~/space/projects/zine-skills/~/.pi/agent/skills/
```

Or configure your agent to load skills from this directory directly.

## License

Private — personal use only.
