# zine-skills

Personal agent skills repository. Each subdirectory is a self-contained skill that can be loaded by the pi coding agent or other compatible agents.

## Structure

```
.
├── skills/
│   └── <category>/
│       └── <skill-name>/
│           ├── SKILL.md
│           └── ... (supporting files)
└── README.md
```

### Categories

- `skills/engineering-execution` — coding, debugging, testing, performance
- `skills/planning-requirements` — planning, grilling, PRDs, issue breakdown
- `skills/architecture-quality` — architecture reviews, repo conventions
- `skills/knowledge-obsidian` — Obsidian vault and knowledge-base workflows
- `skills/vcs-delivery` — version control and handoff
- `skills/skill-authoring` — creating and discovering skills

## Skills by Category

### Engineering Execution

| Skill | Description |
|-------|-------------|
| skills/engineering-execution/api-and-interface-design | Guides stable API and interface design |
| skills/engineering-execution/browser-testing-with-devtools | Tests in real browsers via Chrome DevTools MCP |
| skills/engineering-execution/ci-cd-and-automation | Automates CI/CD pipeline setup |
| skills/engineering-execution/code-review-and-quality | Conducts multi-axis code review |
| skills/engineering-execution/code-simplification | Simplifies code for clarity |
| skills/engineering-execution/deprecation-and-migration | Manages deprecation and migration |
| skills/engineering-execution/diagnose | Disciplined diagnosis loop for hard bugs |
| skills/engineering-execution/doubt-driven-development | Adversarial review of non-trivial decisions |
| skills/engineering-execution/endpoint-performance-diagnosis | Systematic endpoint performance bottleneck diagnosis |
| skills/engineering-execution/frontend-ui-engineering | Builds production-quality UIs |
| skills/engineering-execution/fullstack-dev | Full-stack backend & frontend integration guide |
| skills/engineering-execution/incremental-implementation | Delivers changes incrementally |
| skills/engineering-execution/llm-prompt-source-isolation | Isolates current user input from LLM reference context |
| skills/engineering-execution/observability-and-instrumentation | Instruments code for production visibility |
| skills/engineering-execution/performance-optimization | Optimizes application performance |
| skills/engineering-execution/security-and-hardening | Hardens code against vulnerabilities |
| skills/engineering-execution/source-driven-development | Grounds decisions in official documentation |
| skills/engineering-execution/tdd | Test-driven development with red-green-refactor loop |

### Planning & Requirements

| Skill | Description |
|-------|-------------|
| skills/planning-requirements/grill-me | Stress-test a plan with relentless questions |
| skills/planning-requirements/grill-with-docs | Stress-test a plan against the domain model and docs |
| skills/planning-requirements/idea-refine | Refines raw ideas into actionable concepts |
| skills/planning-requirements/implementation-design-planning | Turn requirements into confirmed designs and executable plans |
| skills/planning-requirements/to-issues | Break a plan into independently-grabbable tracker issues |
| skills/planning-requirements/to-prd | Turn conversation context into a PRD |
| skills/planning-requirements/zoom-out | Get a higher-level perspective on unfamiliar code |

### Architecture & Quality

| Skill | Description |
|-------|-------------|
| skills/architecture-quality/context-engineering | Optimizes agent context setup |
| skills/architecture-quality/create-agentsmd | Generate AGENTS.md for a repository |
| skills/architecture-quality/documentation-and-adrs | Records decisions and documentation |
| skills/architecture-quality/improve-codebase-architecture | Find deepening opportunities in codebases |
| skills/architecture-quality/setup-matt-pocock-skills | Scaffold repo config for Matt Pocock's skills |

### Knowledge Management & Obsidian

| Skill | Description |
|-------|-------------|
| skills/knowledge-obsidian/llm-wiki | LLM-driven personal knowledge base |
| skills/knowledge-obsidian/obsidian-bases | Obsidian Bases (.base files) |
| skills/knowledge-obsidian/obsidian-cli | Obsidian vault CLI operations |
| skills/knowledge-obsidian/obsidian-markdown | Obsidian Flavored Markdown |

### VCS & Delivery

| Skill | Description |
|-------|-------------|
| skills/vcs-delivery/commit-msg | Generate conventional commit messages |
| skills/vcs-delivery/handoff | Compact conversation into handoff document |
| skills/vcs-delivery/jujutsu | Jujutsu (jj) VCS operations guide |
| skills/vcs-delivery/shipping-and-launch | Prepares production launches |

### Skill Authoring & Discovery

| Skill | Description |
|-------|-------------|
| skills/skill-authoring/distill | Distill session context into reusable skills, docs, notes, or checklists |
| skills/skill-authoring/find-skills | Discover and install agent skills |
| skills/skill-authoring/using-agent-skills | Discovers and invokes agent skills |
| skills/skill-authoring/write-a-skill | Create new agent skills |

## Usage

Skills are typically symlinked into the agent's skills search path, e.g.:

```bash
ln -s ~/space/projects/zine-skills/skills ~/.pi/agent/skills/
```

Or configure your agent to load skills from this directory directly.

## License

Private — personal use only.
