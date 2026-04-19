# Digital Assistant – Copilot Agent System Instructions

## Custom Agent System (2025)

This project uses **custom agents** (`.agent.md` files) stored in `.github/agents/` to provide specialized AI assistance across the full SDLC. Custom agents replace the legacy chat modes system with enhanced capabilities:

### Available Custom Agents

- **Design Agent** (`design`): UX/UI design, user research, accessibility, system architecture
- **Development Agent** (`development`): Feature implementation, API integration, secure coding
- **Testing Agent** (`testing`): Test strategy, automation, performance and accessibility testing
- **Refactor Agent** (`refactor`): Code optimization, technical debt reduction, modernization
- **Review Agent** (`review`): Security audit, code quality analysis, compliance validation
- **Ops Agent** (`ops`): Deployment, monitoring, CI/CD, infrastructure automation

### Agent Handoffs

Agents support **handoffs** - guided transitions between specialized agents with context preservation:

- **Design → Development**: Design specs with acceptance criteria → Implementation
- **Development → Testing**: Implemented code → Comprehensive validation
- **Testing → Review**: Test results → Security and quality audit
- **Testing → Refactor**: Performance issues → Code optimization
- **Review → Ops**: Approved code → Deployment
- **Review → Refactor**: Quality issues → Technical debt resolution
- **Ops → Design**: Production insights → Next iteration planning
- **Ops → Development**: Production bugs → Fixes

Handoff buttons appear after agent responses, pre-filling prompts with relevant context.

### Subagent Usage with `runSubagent`

The `runSubagent` tool enables agents to spawn autonomous subagents for complex, multi-step tasks:

**When to Use Subagents:**
- Parallel execution of independent research or analysis tasks
- Complex multi-environment operations (e.g., testing across multiple browsers)
- Deep investigation that requires autonomous exploration and synthesis
- Tasks that benefit from isolated execution with a specific focus

**Best Practices:**
- Provide detailed, autonomous instructions to subagents
- Specify expected deliverables and format for results
- Use for tasks that don't require frequent user interaction
- Have subagent store results in MCP Memory for main agent review

**Example Pattern:**
```
Use runSubagent to perform comprehensive security audit across authentication, input validation, and data protection, storing findings in memory for review agent analysis.
```

## MCP Tooling: Context7, Memory, SequentialThinking, Chrome DevTools

Agents must leverage the following MCP tools for advanced context, planning, and automation:

- **MCP Memory** (`memory/*`): Store and retrieve dynamic project context, structure, and state/todo tracking. Always update memory after any structural or state change. Use memory as the single source of truth for dynamic context and project status.

- **MCP Context7** (`context7/*`): Fetch authoritative, up-to-date documentation for any library or package used in the project. Always use Context7 before implementing, updating, or debugging third-party dependencies.

- **MCP Sequential Thinking** (`sequential-thinking/*`): Plan, execute, and reflect on complex tasks stepwise. Use for robust, auditable, and explainable agentic workflows. Break down problems into manageable steps with reflection.

- **MCP Chrome DevTools** (`chrome-devtools/*`): Automate browser-based UI testing, performance analysis, and end-to-end validation. Replaces Playwright MCP. Use for simulating user interactions and verifying UI/UX behaviors.

- **MCP DeepWiki** (`deepwiki/*`): Access GitHub repository documentation and code examples. Use for understanding external codebases and integration patterns.

**Example Usage:**
- Use MCP Memory to store the current todo list and update it after each step
- Use MCP Context7 to fetch the latest API docs before implementing a new feature
- Use MCP SequentialThinking to plan a multi-step refactor with reflection after each step
- Use MCP Chrome DevTools to automate E2E testing and performance profiling

## Project Context & Structure

Agents must dynamically reference the project context and structure from MCP Memory. Use `#memory` as the primary source for up-to-date project context, structure, and state tracking.

## Core Principles

- **Security First:** Prioritize secure coding practices in all suggestions. Generate safe and robust code to prevent vulnerabilities.
- **VS Code Integration:** Be mindful of the configured VS Code settings, extensions, debugging configurations (`launch.json` if present), and tasks. Ensure code integrates seamlessly with these configurations.
- **JavaScript & React:** Generate code that adheres to JavaScript and React best practices and is compatible with the project's codebase.
- **Testing Integration:** Ensure code integrates seamlessly with the existing React Testing Library and Jest infrastructure. Write testable code and suggest appropriate tests.
- **Maven Awareness:** Consider the Maven build process and frontend-maven-plugin when suggesting dependencies, build steps, or runtime configurations.
- **ESLint & Prettier Compliance:** Generate code that is compliant with the project's ESLint and Prettier configurations.
- **Maintainability:** Strive for code that is easy to understand, modify, and extend.
- **Debugging:** Consider debugging setup and source maps for effective debugging of JavaScript code.

## Tool Usage Guidelines

### Memory Management

- Always check MCP Memory first for existing project context and patterns
- Update memory with new learnings, patterns, and project state changes
- Use memory to maintain consistency across sessions and agents
- Tag entities appropriately for easy retrieval and organization

**Important:** Vision model functions are NOT available in this project. Do NOT use any tool or function that requires a vision model, image, or screenshot processing. Attempting to use these will result in errors such as:

> Sorry, your request failed. Please try again. Request id: ...
> Reason: Request Failed: 400 {"error":{"message":"missing required Copilot-Vision-Request header for vision requests","code":""}}

Always ensure that all automation, testing, and agentic workflows use only non-vision tools and functions.

### Documentation Research

- Use MCP Context7 for authoritative library and framework documentation
- Always fetch the latest docs before implementing new features or debugging
- Reference specific documentation versions in code comments
- Store frequently used documentation patterns in memory

Agents must use all available tools—including MCP tools and #get_vscode_api—to maximize efficiency, context-awareness, and automation. Select the most appropriate tool for each step, and always explain your reasoning before making a tool call. Below is a summary of available tools and their recommended usage (use the exact tool name in your workflow):

### Planning & Execution

- Use MCP SequentialThinking for complex, multi-step tasks
- Break down problems into manageable, verifiable steps
- Plan before executing, and revise plans as needed
- Document decision-making process and rationale

### Testing & Validation
- Use MCP Chrome DevTools for comprehensive UI/UX testing
- Integrate browser automation with existing test infrastructure
- Validate all user-facing changes with automated tests

- Test across different browsers and devices where applicable

- **fetch_webpage**: Gather information from URLs or perform internet research (always use for up-to-date info on third-party packages).

## Dynamic Project Context & Structure Referencing

Agents must always provide accurate project context and structure in their instructions. To achieve this:

- On initial execution, agents must initialize MCP Memory with the current project context and structure.
- If the project context or structure changes, agents must update MCP Memory accordingly.
- Agents must also keep MCP Memory updated and reference it for project state tracking.
- In all instructions, agents must reference the context and structure using `#memory` and ensure the information is current.

## Expanded Workflow Steps

1. Fetch Provided URLs: Use `fetch_webpage` for all URLs, recursively gather all relevant information.
2. Deeply Understand the Problem: Carefully read the issue and think critically before coding. Use sequential thinking to break down the problem into manageable parts.
3. Codebase Investigation: Explore relevant files and directories, search for key functions/classes/variables, read and understand code snippets, identify root causes, and validate your understanding.
4. Internet Research: Use `fetch_webpage` to search Google and recursively gather all relevant information.
5. Develop a Detailed Plan: Outline a specific, simple, and verifiable sequence of steps. Create a todo list in markdown format to track progress. Each time you complete a step, check it off and display the updated todo list.
6. Making Code Changes: Always read the relevant file contents or section before editing (read up to 2000 lines for context). Make small, testable, incremental changes. If a patch is not applied correctly, attempt to reapply it.
7. Debugging: Use `get_errors` to check for problems. Debug for as long as needed to identify the root cause. Use print statements, logs, or temporary code to inspect program state. Revisit assumptions if unexpected behavior occurs.

## Reference & Symbol Usage Guidelines

Agents must use the following reference syntax to efficiently navigate, document, and communicate about the codebase, context, and tools:

- File references - Reference a specific file using the format: filename or path/to/filename
- Folder references - Reference a folder using the format: foldername or path/to/folder
- `#sym:<symbol>`: Reference a code symbol, function, class, or variable (e.g., `#sym:validateUserInput`).
- `#codebase`: Reference the entire codebase context.
- `#semantic_search`: Reference the semantic search tool for codebase queries.
- `#get_vscode_api`: Reference the VS Code API tool for extension development or integration.
- `#vscodeAPI`: Reference VS Code API documentation or usage.
- `#memory`: Reference MCP Memory for project context, state, and knowledge tracking.

**How to Use References:**
- Use references in prompts, planning, documentation, and when updating `#memory`.
- When describing changes, debugging, or planning, always reference the relevant file, folder, symbol, or tool using the above syntax.
- For tool invocation, use references to clarify which part of the codebase or which API/tool is being targeted.
- When documenting progress or issues, include references for traceability and clarity.

**Examples:**
- "Update the Button component to fix the bug in the handleClick function."
- "Refer to the src/components folder for all UI components."
- "Use #get_vscode_api to fetch VS Code extension API details."
- "Document the change in #memory referencing #sym:validateUserInput."
- "Search the #codebase using #semantic_search for usages of #sym:handleUserInput."

**Best Practices:**
- Always use references for context when communicating, planning, or documenting.
- Use `#codebase` when referring to the entire project or when searching for global context.
- Use `#vscodeAPI`, `#get_vscode_api`, and `#semantic_search` for all VS Code API and semantic search-related queries and integration steps.
- Ensure all TODOs and status updates in `#memory` include relevant references for auditability.


## Enhanced MultiAgent Workflow Framework

All agents must follow this standardized 12-step workflow that ensures systematic memory management and seamless collaboration:

### Phase 1: Preparation & Context
1. **Memory Bank Update (UMB)**: Execute UMB command to refresh and clean knowledge base
2. **Memory Check**: Search existing patterns using `mcp_memory_search_nodes`
3. **Context Analysis**: Understand current state, requirements, and constraints

### Phase 2: Research & Planning  
4. **Research & Intelligence Gathering**: Multi-source research strategy:
   - **Documentation**: `mcp_context7` for library/framework docs
   - **Repository Analysis**: `mcp_deepwiki_ask_question` for code examples and patterns
   - **Web Research**: `fetch_webpage` for latest best practices and solutions
5. **Risk Assessment**: Identify potential issues, vulnerabilities, and mitigations
6. **Sequential Planning**: Use `mcp_sequential-th_sequentialthinking` for detailed execution plan

### Phase 3: Execution & Validation
7. **Execute**: Perform mode-specific actions with quality checks
8. **Comprehensive Validation**: Multi-layer testing and verification (automated + manual)
9. **Performance Analysis**: Measure and benchmark results against objectives

### Phase 4: Learning & Handoff
10. **Knowledge Extraction**: Extract patterns, lessons learned, and improvements
11. **Memory Bank Cleanup (UMB)**: Update memory and prepare clean state for next agent
12. **Documentation & Handoff**: Prepare comprehensive package for next mode

### UMB 2.0 Integration Standards
Execute UMB at workflow start (step 1), runtime, and end (step 11):

#### **Initial UMB**: Active Cleanup + Context Loading
- **Validation Cleanup**: `mcp_memory_delete_entities` for invalid/outdated entities
- **Relationship Cleanup**: `mcp_memory_delete_relations` for broken relationships
- **Duplicate Removal**: Consolidate similar patterns using `mcp_memory_delete_observations`
- **Context Refresh**: Load current, validated project state using `mcp_memory_search_nodes`

#### **Final UMB**: Learning Consolidation + Handoff Preparation  
- **Learning Storage**: Store new insights using `mcp_memory_create_entities`
- **Obsolete Data Removal**: Delete outdated context using `mcp_memory_delete_entities`
- **Handoff Optimization**: Prepare clean, validated data for next mode
- **Memory Compression**: Optimize knowledge base for performance and accuracy

## Universal Memory Schemas & Standards

### **Standard Entity Types:**
- `project_context`: Current project state, configuration, and requirements
- `task_context`: Active task details, scope, and specifications  
- `mode_output`: Results, deliverables, and artifacts from each mode
- `handoff_package`: Structured data passed between modes
- `pattern_library`: Reusable patterns, templates, and best practices
- `quality_metrics`: Performance, coverage, security, and quality data
- `risk_register`: Issues, vulnerabilities, mitigations, and assessments
- `learning_insight`: Extracted knowledge, improvements, and optimizations

### **Standard Relationship Types:**
- `inherits_from`: Pattern inheritance and specialization chains
- `depends_on`: Dependencies, prerequisites, and requirements
- `validates`: Validation, verification, and quality relationships
- `improves`: Enhancement, optimization, and upgrade relationships
- `replaces`: Superseding, deprecation, and evolution relationships
- `contributes_to`: Value-add and contribution relationships

### **Memory Entity Validation Rules:**

#### Entity Creation Requirements:
- **Unique Names**: Each entity must have a globally unique name (use underscores for spaces: `User_Authentication_Pattern`)
- **Atomic EntityType**: Use singular, lowercase types with underscores (e.g., `pattern_library`, not `patterns` or `PatternLibrary`)
- **Minimum Observations**: Every entity must have at least one observation at creation
- **Active Voice Relations**: All `relationType` values must use active voice (e.g., `implements`, `extends`, `validates`)

#### Observation Formatting Guidelines:
```markdown
**Format**: [Date]: [Category] - [Atomic Fact]

**Examples:**
- "2025-12-01: Implementation - React component uses memo hook for performance optimization"
- "2025-12-01: Testing - Jest test coverage increased from 75% to 92% after refactoring"
- "2025-12-01: Security - Input validation added using Joi schema with sanitization"

**Best Practices:**
- One fact per observation (atomic information units)
- Include dates for temporal tracking
- Prefix with category for filtering (Implementation, Testing, Security, Performance, etc.)
- Use specific metrics when available (percentages, counts, versions)
- Reference specific files, functions, or symbols when relevant
```

#### Memory Lifecycle & Cleanup Procedures:

**When to Archive/Delete Entities:**
- Outdated patterns superseded by newer implementations (use `replaces` relation first)
- Task contexts completed more than 30 days ago (unless marked as reference)
- Temporary debugging entities created during investigation
- Duplicate entities with overlapping observations

**Cleanup Workflow:**
```markdown
1. **Identify Candidates**: Use `mcp_memory_search_nodes` to find old/duplicate entities
2. **Validate Relations**: Check if entity has `depends_on` or `contributes_to` relations
3. **Archive Decision**: If referenced by active entities, consolidate observations; otherwise delete
4. **Execute Cleanup**: Use `mcp_memory_delete_entities` for removal
5. **Update Relations**: Remove broken relations using `mcp_memory_delete_relations`
6. **Document**: Add observation to `project_context` entity documenting cleanup
```

**Memory Health Checklist (Run during UMB):**
- [ ] No duplicate entity names exist
- [ ] All entities have minimum 1 observation
- [ ] All relations reference existing entities (no broken links)
- [ ] Observations follow formatting guidelines
- [ ] Outdated entities archived or deleted
- [ ] Entity types use standard taxonomy

### **Schema Usage Examples:**

#### Example 1: Creating a Pattern Library Entity
```javascript
// Tool: mcp_memory_create_entities
{
  "entities": [{
    "name": "React_Performance_Optimization_Pattern",
    "entityType": "pattern_library",
    "observations": [
      "2025-12-01: Implementation - Use React.memo for expensive component re-renders",
      "2025-12-01: Implementation - useCallback for functions passed as props to memoized components",
      "2025-12-01: Performance - Reduces render time by 40% in list components with 100+ items",
      "2025-12-01: Best Practice - Profile with React DevTools before applying optimization"
    ]
  }]
}
```

#### Example 2: Creating Task Context with Relations
```javascript
// Step 1: Create task entity
{
  "entities": [{
    "name": "Implement_User_Authentication_Feature",
    "entityType": "task_context",
    "observations": [
      "2025-12-01: Scope - Add JWT-based authentication with refresh tokens",
      "2025-12-01: Requirements - Support email/password and OAuth2 providers",
      "2025-12-01: Timeline - Sprint 12, 5-day estimate",
      "2025-12-01: Acceptance - Must pass security review and achieve 95% test coverage"
    ]
  }]
}

// Step 2: Create relations
{
  "relations": [{
    "from": "Implement_User_Authentication_Feature",
    "to": "Security_Best_Practices_Library",
    "relationType": "depends_on"
  }, {
    "from": "Implement_User_Authentication_Feature",
    "to": "React_Performance_Optimization_Pattern",
    "relationType": "validates"
  }]
}
```

#### Example 3: Learning Insight Extraction
```javascript
// After completing a task, extract learnings
{
  "entities": [{
    "name": "JWT_Token_Refresh_Learning",
    "entityType": "learning_insight",
    "observations": [
      "2025-12-01: Challenge - Token refresh caused race conditions in parallel API calls",
      "2025-12-01: Solution - Implemented request queuing with mutex lock pattern",
      "2025-12-01: Outcome - Zero race conditions in 1000+ test iterations",
      "2025-12-01: Reusable - Pattern applicable to any async resource with refresh logic",
      "2025-12-01: Reference - Code in src/auth/tokenManager.js lines 45-89"
    ]
  }]
}

// Create relation to pattern library for future reuse
{
  "relations": [{
    "from": "JWT_Token_Refresh_Learning",
    "to": "Async_Resource_Management_Pattern",
    "relationType": "contributes_to"
  }]
}
```

### **Universal Handoff Package Format:**
```markdown
### [Source Mode] → [Target Mode] Handoff Package
**Context**: Current state and transition requirements
**Deliverables**: Specific outputs and artifacts
**Quality Metrics**: Performance, coverage, and validation data  
**Risk Assessment**: Issues, mitigations, and recommendations
**Success Criteria**: Validation requirements for target mode
**Memory References**: Key entities and relationships to preserve
```

### Cross-Mode Handoff Standards
Each agent must prepare a standardized handoff package:
- **Deliverables Summary**: What was accomplished with measurable outcomes
- **Quality Metrics**: Coverage, performance, security scores, benchmarks
- **Risk Register**: Issues identified, mitigations applied, remaining risks
- **Next Phase Requirements**: Specific needs and context for next agent
- **Memory References**: Key knowledge entities and relationships stored
- **Validation Checklist**: Items for next agent to verify and build upon

## Agent Workflow & Autonomous Problem Solving (with MCP Tools)

You are an agent. You must keep going until the user’s query is completely resolved, before ending your turn and yielding back to the user.

**Planning & Execution:**
- Use MCP SequentialThinking to break down the problem into steps, plan, and execute each step, revising as needed.
- Store and update the todo list and current state in MCP Memory after each step.

**Context & Documentation:**
- Use MCP Memory for all dynamic context, structure, and state/todo tracking.
- Use MCP Context7 to fetch and reference up-to-date documentation for any library, package, or API you use or modify.

**Testing & Validation:**
- Use MCP Chrome DevTools for browser-based automated testing and UI validation.
- Integrate Chrome DevTools MCP with Jest/React Testing Library for comprehensive test coverage.

**General Guidance:**
- Always tell the user what you are going to do before making a tool call.
- Never end your turn until all todo items are checked off and the solution is fully validated.
- Use MCP tools for all planning, context, documentation, and testing steps as described above.

## Expanded Workflow Steps

1. Fetch Provided URLs: Use `fetch_webpage` for all URLs, recursively gather all relevant information.
2. Deeply Understand the Problem: Carefully read the issue and think critically before coding. Use sequential thinking to break down the problem into manageable parts.
3. Codebase Investigation: Explore relevant files and directories, search for key functions/classes/variables, read and understand code snippets, identify root causes, and validate your understanding.
4. Internet Research: Use `fetch_webpage` to search Google and recursively gather all relevant information.
5. Develop a Detailed Plan: Outline a specific, simple, and verifiable sequence of steps. Create a todo list in markdown format to track progress. Each time you complete a step, check it off and display the updated todo list.
6. Making Code Changes: Always read the relevant file contents or section before editing (read up to 2000 lines for context). Make small, testable, incremental changes. If a patch is not applied correctly, attempt to reapply it.
7. Debugging: Use `get_errors` to check for problems. Debug for as long as needed to identify the root cause. Use print statements, logs, or temporary code to inspect program state. Revisit assumptions if unexpected behavior occurs.
8. Testing: Run tests after each change to verify correctness. Integrate seamlessly with React Testing Library and Jest. Suggest appropriate test assertions.
9. Iterate until the root cause is fixed and all tests pass.
10. Reflect and validate comprehensively. After tests pass, write additional tests to ensure correctness and remember there are hidden tests that must also pass.

## How to create a Todo List

Use the following format to create a todo list:
```markdown
- [ ] Step 1: Description of the first step
- [ ] Step 2: Description of the second step
- [ ] Step 3: Description of the third step
```
Do not use HTML tags or other formatting for the todo list. Always use markdown as shown above.

## Specific Instructions

1. **Code Generation:**
    * Generate code compatible with the project's architecture and style.
    * Prioritize existing libraries/components.
    * Suggest unit, integration, and end-to-end tests.
    * Follow secure coding practices (input validation, output encoding, XSS protection).
    * Favor functional programming for clarity and testability.
    * Consider accessibility and responsiveness for UI components.

2. **Debugging:**
    * Be aware of VS Code debugging configurations (e.g., `launch.json`).
    * Generate code that is easily debuggable.
    * Consider logging and error handling for external APIs/services.
    * Leverage source maps for debugging.
    * Consider VS Code Remote-Containers if relevant.
    * If tests fail, suggest using the VS Code Jest extension.

3. **Testing:**
    * Facilitate unit and integration testing.
    * Provide test examples.
    * Integrate with React Testing Library and Jest.
    * Suggest appropriate test assertions.
    * Consider GitHub Copilot's testing features.

4. **Memory Management and Project State Tracking:**
    * Always use `#memory` to store and retrieve project state, context, and todo tracking.
    * Use MCP Memory tools to create entities for: project context, task context, patterns, quality metrics, and learning insights.
    * Always update `#memory` after any task with: summary of changes, problems and resolutions, progress, environment fixes/issues, and TODO state.
    * Example workflow: Create task entity → Update with progress → Store learnings → Clean up on completion.

5. **Referencing Information:**
    * Use the following syntax to reference specific elements:
        * #file: - code in a specific file
        * #folder: - reference a folder
        * `#memory`: project context and state from MCP Memory
        * `#sym:functionName`: code symbol reference
        * `#testFailure`: previous test failures
        * `#usages`: usage details

## Additional Best Practices & Guidance

* **Accessibility & Internationalization:** Always consider accessibility (WCAG standards) and internationalization/localization when generating UI components or documentation. Ensure interfaces are usable for all users and support multiple languages where appropriate.

* **Error Handling & Recovery:** Document and handle errors gracefully. Implement fallback strategies and provide clear, actionable user messaging for error scenarios. Always log and track error handling decisions in the changelog and project status.

* **Security Updates:** Regularly check for and apply security updates to all dependencies. Document any security-related changes, updates, or patches in the changelog and project status for auditability.

* **Performance Considerations:** Consider performance optimizations in all code and architectural decisions. Document any major performance-related changes or improvements in the changelog and project status.

## Copilot-Specific Guidance & Cross-Referencing

Agents must always consult copilot-instructions.md (this file) for all Copilot agent guidance, prompt crafting, and Copilot-specific instructions. All guidance is consolidated in this single source. Use `#memory` to store project-specific context and patterns learned during agent execution.

## Reference Consistency & Audit Trail

All reference syntaxes must be documented and used consistently throughout instructions, prompts, and documentation:
- #file: - Reference a specific file
- #folder: - Reference a folder
- `#sym:<symbol>`: Reference a code symbol
- `#codebase`: Reference the entire codebase
- `#semantic_search`: Reference semantic search tool
- `#get_vscode_api`: Reference VS Code API tool
- `#vscodeAPI`: Reference VS Code API docs
- `#testFailure`: Reference test failures
- `#usages`: Reference usage details
- `#memory`: Reference MCP Memory for context and state

Agents must always reference the source of any instruction, change, or decision for maximum traceability and auditability.

## Tool Sets & Prompt Files (2025 Enhancement)

### Tool Sets Configuration

Tool sets are defined in `.vscode/toolsets.jsonc` (workspace source) and deployed to user profile via `.vscode/update_toolsets.ps1`. This two-tier architecture enables team collaboration while maintaining functional `#toolset:` references.

**Available Tool Sets:**
- **#toolset:memory-context**: MCP Memory + Context7 + DeepWiki tools for knowledge management
- **#toolset:planning**: Sequential Thinking + search tools for structured problem-solving
- **#toolset:development**: File creation, editing, and code management tools
- **#toolset:testing**: Test execution, Chrome DevTools MCP, and quality verification tools
- **#toolset:execution**: Terminal commands, task execution, and build tools
- **#toolset:python**: Python environment and package management
- **#toolset:read-only**: Safe exploration tools (no file modifications) for research/planning phases

**Setup Required:** Team members must run `.vscode\update_toolsets.ps1` once (or after toolsets updates) to deploy toolsets to their user profile. This enables `#toolset:` references in prompts, agents, and chat.

**Usage in Agents:** Reference tool sets in agent files using the `tools` array, or use `#toolset:name` syntax in agent instructions.

**Usage in Prompts:** Reference tool sets using `#toolset:name` syntax in prompt files and chat messages.

**Documentation:** See `.github/docs/TOOLSETS_GUIDE.md` for detailed setup instructions, architecture explanation, and troubleshooting.

### Reusable Prompt Files

Prompt files (`.prompt.md`) in `.github/prompts/` define common workflows:

- **code-review.prompt.md**: Comprehensive code review with security, quality, performance checks
- **generate-tests.prompt.md**: Test suite generation with coverage requirements
- **plan-feature.prompt.md**: Feature planning with architecture and risk assessment
- **deploy-checklist.prompt.md**: Pre-deployment verification and quality gates

**Usage:** Invoke prompts in chat using `/prompt-name` or select from prompt picker. Prompts automatically engage the specified agent and provide structured guidance.



### Language & Framework-Specific Instructions

Instructions files in `.github/instructions/` with `applyTo` glob patterns:

- **javascript-react.instructions.md** (`applyTo: "**/*.{js,jsx}"`): React component guidelines, hooks best practices, security, performance, testing
- **testing.instructions.md** (`applyTo: "**/*.test.{js,jsx}"`): Jest, React Testing Library, accessibility testing, mocking strategies
- **security.instructions.md** (`applyTo: "**/*"`): OWASP Top 10 protection, secure coding practices, dependency management

These instructions automatically apply when working with matching files, providing context-aware guidance.

## Change Log & Instruction Enhancements

Agents must log any enhancements or changes made to these instructions in a dedicated section, referencing the relevant file and reason. Example:
```
#changelog:2025-12-01: Comprehensive agent system overhaul - renamed all agents (removed Mode suffix), updated collections and prompts, fixed broken file references, replaced PROJECT_STATUS.md/PROJECT_CONTEXT.md with memory-based approach. See #memory for current state.
#changelog:2025-12-01: Added explicit guidance for MCP Memory (context/state/todo), MCP Context7 (library/package docs), MCP SequentialThinking (planning/execution), and MCP Chrome DevTools (browser-based testing). See this file for usage patterns and requirements.
#changelog:2025-01-15: Added Tool Sets configuration (.vscode/toolsets.jsonc), Prompt Files (.github/prompts/), Collections (.github/collections/), and Language-Specific Instructions (.github/instructions/) to enhance agent system organization and reusability.
```
This ensures all updates are tracked and can be audited for future improvements.