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

- `skills/engineering` — coding, debugging, testing, performance, security
- `skills/planning` — planning, grilling, PRDs, issue breakdown
- `skills/architecture` — architecture reviews, repo conventions, decisions
- `skills/obsidian` — Obsidian vault and knowledge-base workflows
- `skills/delivery` — version control, handoff, launch
- `skills/authoring` — creating and discovering skills

## Skills by Category

### Engineering

| Skill | Description |
|-------|-------------|
| skills/engineering/api-and-interface-design | Guides stable API and interface design |
| skills/engineering/browser-testing-with-devtools | Tests in real browsers via Chrome DevTools MCP |
| skills/engineering/ci-cd-and-automation | Automates CI/CD pipeline setup |
| skills/engineering/code-review-and-quality | Conducts multi-axis code review |
| skills/engineering/code-simplification | Simplifies code for clarity |
| skills/engineering/deprecation-and-migration | Manages deprecation and migration |
| skills/engineering/diagnose | Disciplined diagnosis loop for hard bugs |
| skills/engineering/doubt-driven-development | Adversarial review of non-trivial decisions |
| skills/engineering/endpoint-performance-diagnosis | Systematic endpoint performance bottleneck diagnosis |
| skills/engineering/frontend-ui-engineering | Builds production-quality UIs |
| skills/engineering/fullstack-dev | Full-stack backend & frontend integration guide |
| skills/engineering/incremental-implementation | Delivers changes incrementally |
| skills/engineering/llm-prompt-source-isolation | Isolates current user input from LLM reference context |
| skills/engineering/newapi-tenant-token-practices | Best practices for NewAPI tenant token lifecycle |
| skills/engineering/observability-and-instrumentation | Instruments code for production visibility |
| skills/engineering/performance-optimization | Optimizes application performance |
| skills/engineering/security-and-hardening | Hardens code against vulnerabilities |
| skills/engineering/source-driven-development | Grounds decisions in official documentation |
| skills/engineering/tdd | Test-driven development with red-green-refactor loop |

### Planning

| Skill | Description |
|-------|-------------|
| skills/planning/grill-me | Stress-test a plan with relentless questions |
| skills/planning/grill-with-docs | Stress-test a plan against the domain model and docs |
| skills/planning/idea-refine | Refines raw ideas into actionable concepts |
| skills/planning/implementation-design-planning | Turn requirements into confirmed designs and executable plans |
| skills/planning/to-slice | Break a plan into independently-grabbable slices |
| skills/planning/to-spec | Turn conversation context into a spec |
| skills/planning/zoom-out | Get a higher-level perspective on unfamiliar code |

### Architecture

| Skill | Description |
|-------|-------------|
| skills/architecture/context-engineering | Optimizes agent context setup |
| skills/architecture/create-agentsmd | Generate AGENTS.md for a repository |
| skills/architecture/documentation-and-adrs | Records decisions and documentation |
| skills/architecture/improve-codebase-architecture | Find deepening opportunities in codebases |
| skills/architecture/setup-matt-pocock-skills | Scaffold repo config for Matt Pocock's skills |

### Obsidian

| Skill | Description |
|-------|-------------|
| skills/obsidian/llm-wiki | LLM-driven personal knowledge base |
| skills/obsidian/obsidian-bases | Obsidian Bases (.base files) |
| skills/obsidian/obsidian-cli | Obsidian vault CLI operations |
| skills/obsidian/obsidian-markdown | Obsidian Flavored Markdown |

### Delivery

| Skill | Description |
|-------|-------------|
| skills/delivery/acceptance-review | Check if a branch satisfies spec and is ready for PR/merge |
| skills/delivery/commit-msg | Generate conventional commit messages |
| skills/delivery/handoff | Compact conversation into handoff document |
| skills/delivery/jujutsu | Jujutsu (jj) VCS operations guide |
| skills/delivery/shipping-and-launch | Prepares production launches |

### Authoring

| Skill | Description |
|-------|-------------|
| skills/authoring/distill | Distill session context into reusable skills, docs, notes, or checklists |
| skills/authoring/find-skills | Discover and install agent skills |
| skills/authoring/write-skills | Create new agent skills |

## Usage

Skills are typically symlinked into the agent's skills search path, e.g.:

```bash
ln -s ~/space/projects/zine-skills/skills ~/.pi/agent/skills/
```

Or configure your agent to load skills from this directory directly.

## License

Private — personal use only.
