# E2Assist - MultiAgent System

## Overview

This project utilizes an advanced **MultiAgent System** living in the `.github` folder to provide specialized AI assistance across different development workflows. The system is designed to provide comprehensive, context-aware assistance for all aspects of software development.

## Enhanced 12-Step Unified Workflow

All agents follow a standardized 12-step workflow ensuring systematic memory management and seamless collaboration:

### Phase 1: Preparation & Context
1. **Memory Bank Update (UMB)**: Execute UMB command to refresh and clean knowledge base
2. **Memory Check**: Search existing patterns using `mcp_memory_search_nodes`
3. **Context Analysis**: Understand current state, requirements, and constraints

### Phase 2: Research & Planning  
4. **Research & Intelligence Gathering**: Multi-source research strategy
5. **Risk Assessment**: Identify potential issues, vulnerabilities, and mitigations
6. **Sequential Planning**: Use `mcp_sequential-th_sequentialthinking` for detailed execution plan

### Phase 3: Execution & Validation
7. **Execute**: Perform mode-specific actions with quality checks
8. **Comprehensive Validation**: Multi-layer testing and verification
9. **Performance Analysis**: Measure and benchmark results against objectives

### Phase 4: Learning & Handoff
10. **Knowledge Extraction**: Extract patterns, lessons learned, and improvements
11. **Memory Bank Cleanup (UMB)**: Update memory and prepare clean state for next agent
12. **Documentation & Handoff**: Prepare comprehensive package for next mode

## MCP Tool Integration

The system leverages advanced MCP (Model Context Protocol) tools for enhanced capabilities:

- **MCP Memory** (`memory/*`): Dynamic project context, structure, and state/todo tracking
- **MCP Context7** (`context7/*`): Authoritative, up-to-date documentation for any library or package  
- **MCP SequentialThinking** (`sequential-thinking/*`): Stepwise planning, execution, and reflection
- **MCP Chrome DevTools** (`chrome-devtools/*`): Browser automation, testing, performance profiling
- **MCP DeepWiki** (`deepwiki/*`): GitHub repository documentation and code examples

### Subagent Capabilities

Agents can spawn autonomous **subagents** using `runSubagent` for:
- Parallel research and analysis across multiple domains
- Complex multi-environment testing and validation
- Deep investigation requiring autonomous exploration
- Isolated execution of specialized tasks

Subagents store results in MCP Memory for main agent review and synthesis.

## Custom Agents (2025)

Custom agents (`.agent.md` files in `.github/agents/`) provide specialized AI assistance with:
- **Agent-specific tool access**: Each agent has tailored tools for its domain
- **Handoffs**: Guided transitions between agents with context preservation
- **Memory integration**: All agents share knowledge via MCP Memory
- **Subagent support**: Spawn autonomous subagents for complex tasks

### 1. Design Agent (`design`)
**Focus**: User experience, interface design, system architecture, and user research

- **Specializations**: UX/UI design, personas, journey mapping, accessibility, design systems, information architecture
- **Tools**: Search, fetch, GitHub repo, DeepWiki, Context7, Memory, Sequential Thinking, VS Code API
- **Outputs**: Design specifications, wireframes, user stories, accessibility requirements, technical architecture
- **Handoffs to**: Development (start implementation)

### 2. Development Agent (`development`)
**Focus**: Feature implementation, coding, API integration, and secure development

- **Specializations**: React/TypeScript development, API integration, security implementation, performance optimization
- **Tools**: Full editing, search, run commands/tasks, Chrome DevTools, Memory, Sequential Thinking, Context7, SonarQube
- **Outputs**: Production-ready code, API implementations, security configurations, unit tests
- **Handoffs to**: Testing (run tests)

### 3. Testing Agent (`testing`)
**Focus**: Quality assurance, test automation, performance and accessibility testing

- **Specializations**: Test strategy, unit/integration/E2E testing, performance testing, accessibility testing, security testing
- **Tools**: Full editing, search, run commands/tasks/tests, Chrome DevTools, Memory, Sequential Thinking, SonarQube, Subagent
- **Outputs**: Test suites, coverage reports, performance benchmarks, accessibility validation, test results
- **Handoffs to**: Review (request code review), Refactor (address quality issues)

### 4. Refactor Agent (`refactor`)
**Focus**: Code optimization, technical debt reduction, modernization, and performance tuning

- **Specializations**: Code optimization, architecture modernization, technical debt resolution, security hardening
- **Tools**: Full editing, search, run commands/tasks/tests, Chrome DevTools, Memory, Sequential Thinking, Context7, SonarQube, Subagent
- **Outputs**: Optimized code, performance improvements, technical debt reduction summary, security enhancements
- **Handoffs to**: Testing (validate refactoring), Review (security review)

### 5. Review Agent (`review`)
**Focus**: Security audit, code quality analysis, standards compliance, and documentation review

- **Specializations**: Security auditing, code quality analysis, standards compliance, performance review, documentation audit
- **Tools**: Search, run commands/tasks, Chrome DevTools, Memory, Sequential Thinking, Context7, DeepWiki, SonarQube, Subagent
- **Outputs**: Security audit reports, code quality assessments, compliance verification, performance analysis
- **Handoffs to**: Ops (deploy to production), Refactor (address technical debt)

### 6. Ops Agent (`ops`)
**Focus**: Deployment, infrastructure automation, monitoring, and DevOps workflows

- **Specializations**: Infrastructure automation, CI/CD, monitoring/observability, security operations, release management
- **Tools**: Run commands/tasks, search, Chrome DevTools, Memory, Sequential Thinking, Context7, DeepWiki, Subagent
- **Outputs**: Deployment configurations, monitoring setups, infrastructure status reports, operational procedures
- **Handoffs to**: Design (new feature design), Development (fix production issues)

## Usage Instructions

### Selecting Custom Agents

In VS Code Copilot Chat, select agents from the **agent dropdown menu**:

1. Open Copilot Chat panel
2. Click the agent selector dropdown (default: `@agent`)
3. Choose a custom agent: `design`, `development`, `testing`, `refactor`, `review`, `ops`
4. Ask your question or describe your task

### Using Handoffs

After an agent completes a response, **handoff buttons** may appear:

- **"Start Implementation"** (Design → Development)
- **"Run Tests"** (Development → Testing)
- **"Request Code Review"** (Testing → Review)
- **"Refactor for Quality"** (Testing → Refactor)
- **"Validate Refactoring"** (Refactor → Testing)
- **"Security Review"** (Refactor → Review)
- **"Deploy to Production"** (Review → Ops)
- **"Request Refactoring"** (Review → Refactor)
- **"New Feature Design"** (Ops → Design)
- **"Fix Production Issues"** (Ops → Development)

Click a handoff button to transition to the next agent with pre-filled context.

### Workflow Examples

**Full SDLC Flow:**
1. **Design Agent**: Create user stories and design specifications
   - Stores design decisions in MCP Memory
   - Click "Start Implementation" handoff
2. **Development Agent**: Implement features following design specs
   - Retrieves design context from memory
   - Writes code, integrates APIs, adds unit tests
   - Click "Run Tests" handoff
3. **Testing Agent**: Comprehensive validation
   - Executes tests, measures coverage, validates accessibility
   - Identifies performance bottlenecks
   - Click "Request Code Review" handoff
4. **Review Agent**: Security and quality audit
   - Performs security scan, code quality analysis
   - Verifies compliance standards
   - Click "Deploy to Production" handoff
5. **Ops Agent**: Deployment and monitoring
   - Executes deployment, configures monitoring
   - Tracks production metrics
   - Click "New Feature Design" to start next iteration

**Parallel Research with Subagents:**
```
@testing Use runSubagent to analyze test coverage gaps across authentication, 
data validation, and error handling modules in parallel, storing findings in 
memory for consolidated review.
```

**Context-Aware Development:**
```
@development Implement the user authentication feature from the design specs 
stored in memory, following the security patterns and API integration guidelines.
```

**Testing and Review Cycle:**
1. Use `/testing` to create comprehensive test suites
2. Use `/review` to audit code quality and security
3. Agents share findings through standardized handoff packages
4. Performance metrics and quality scores tracked across modes

## Cross-Mode Collaboration

### Standardized Handoff Packages
Each agent prepares comprehensive handoff documentation:
- **Deliverables Summary**: Measurable outcomes and accomplishments
- **Quality Metrics**: Coverage, performance, security scores
- **Risk Register**: Issues identified and mitigations applied
- **Memory References**: Key knowledge entities stored
- **Validation Checklist**: Items for next agent to verify

### Shared Memory System
- All agents use MCP Memory for persistent knowledge sharing
- Context, patterns, and learnings preserved across sessions
- Dynamic project structure and state tracking
- Consistent terminology and patterns across agents

## File Structure

```
.github/
├── copilot-instructions.md          # Core system instructions
├── agents/                          # Custom agent definitions
│   ├── design.agent.md
│   ├── development.agent.md
│   ├── testing.agent.md
│   ├── refactor.agent.md
│   ├── review.agent.md
│   └── ops.agent.md
├── docs/                            # Comprehensive guides
│   └── TOOLSETS_GUIDE.md
├── instructions/                    # Language-specific instructions
│   ├── javascript-react.instructions.md
│   ├── testing.instructions.md
│   ├── security.instructions.md
│   └── sonarqube_mcp.instructions.md
├── prompts/                         # Reusable prompt files
│   ├── code-review.prompt.md
│   ├── generate-tests.prompt.md
│   ├── plan-feature.prompt.md
│   └── deploy-checklist.prompt.md
└── memory.json                      # MCP Memory persistent storage
```

## Best Practices

### For Users
1. **Start with appropriate mode**: Choose the agent mode that matches your current task
2. **Provide context**: Share relevant project context and requirements
3. **Use handoff packages**: Review agent handoff documentation for continuity
4. **Leverage memory**: Agents maintain context across sessions for better continuity

### For Agents
1. **Follow 12-step workflow**: Ensure systematic execution and quality
2. **Use MCP tools**: Leverage all available MCP tools for enhanced capabilities
3. **Update memory**: Store learnings and context for cross-mode collaboration
4. **Prepare handoffs**: Create comprehensive packages for seamless transitions

## Integration with Project

The MultiAgent System integrates seamlessly with the Digital Assistant UI project:
- **Codebase Awareness**: Agents understand React/TypeScript architecture
- **Tool Integration**: Works with existing Jest, Playwright, and build tools
- **Security Focus**: Prioritizes secure coding and vulnerability assessment
- **Performance Optimization**: Continuous focus on performance and user experience

## Advanced Features

### UMB (Update Memory Bank) Integration
- **Initial UMB**: Refreshes knowledge and loads current context
- **Final UMB**: Stores insights and prepares clean state for handoff
- **Dynamic Updates**: Memory updated after structural or state changes

### Multi-Source Research Strategy
- **Documentation Research**: MCP Context7 for authoritative library docs
- **Repository Analysis**: MCP DeepWiki for code examples and patterns  
- **Web Research**: fetch_webpage for latest best practices
- **Memory Integration**: All research stored and cross-referenced

### Comprehensive Validation
- **Automated Testing**: Integration with existing test infrastructure
- **Security Validation**: Vulnerability scanning and secure coding practices
- **Performance Analysis**: Benchmarking and optimization measurement
- **Quality Metrics**: Coverage, maintainability, and compliance tracking

---

For detailed technical specifications and workflow implementation, see:
- Individual agent files in `.github/agents/`
- Reusable prompt files in `.github/prompts/`
- Workflow collections in `.github/collections/`
- Comprehensive guides in `.github/docs/`