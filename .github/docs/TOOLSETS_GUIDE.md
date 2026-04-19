# Tool Sets Usage Guide

## Overview

Tool sets provide logical groupings of MCP (Model Context Protocol) and VS Code tools for easier reference and organization. This project uses a **two-tier toolsets architecture**:

1. **Workspace Configuration** (`.vscode/toolsets.jsonc`): Source of truth for tool organization, maintained in version control
2. **User Profile Deployment** (`%APPDATA%\Code\User\prompts\.das-tools.toolsets.jsonc`): Functional toolsets file that enables `#toolset:` references

### Why Two Tiers?

VS Code/GitHub Copilot requires toolsets to be in the **user profile prompts directory** for `#toolset:` syntax to work. However, this creates a challenge for team collaboration since user profile files aren't shared via repositories.

**Our Solution**: Keep the source in the workspace (shareable via Git) and use an automated deployment script to copy it to your user profile.

## Quick Setup

### Install Toolsets (First Time or After Updates)

```powershell
# From repository root
.\.vscode\update_toolsets.ps1
```

This copies `.vscode/toolsets.jsonc` to your user profile as `.das-tools.toolsets.jsonc`, enabling `#toolset:` references.

### Verify Installation

```powershell
.\.vscode\update_toolsets.ps1 -Verify
```

### Remove Toolsets

```powershell
.\.vscode\update_toolsets.ps1 -Remove
```

## Architecture

```
┌─────────────────────┐     ┌──────────────────────┐
│  Workspace Source   │────▶│  User Profile Deploy │
│  (toolsets.jsonc)   │     │  (.das-tools.        │
│                     │     │   toolsets.jsonc)    │
│  Version Controlled │     │  Enables #toolset:   │
└─────────────────────┘     └──────────────────────┘
         │                            │
         ▼                            ▼
┌─────────────────────────────────────────────────┐
│  Agent Files & Prompts Can Use #toolset:        │
│  (.agent.md, .prompt.md, chat, instructions)    │
└─────────────────────────────────────────────────┘
```

### Components

1. **Workspace Source** (`.vscode/toolsets.jsonc`): Defines logical groupings of tools, maintained in Git
2. **Deployment Script** (`.vscode/update_toolsets.ps1`): Copies toolsets to user profile with correct naming
3. **User Profile Toolsets** (`%APPDATA%\Code\User\prompts\.das-tools.toolsets.jsonc`): Functional file that VS Code loads
4. **Agent Files** (`.github/agents/*.agent.md`): Can reference toolsets via `#toolset:name` syntax
5. **Prompt Files** (`.github/prompts/*.prompt.md`): Can use `#toolset:` references in workflow steps

## Available Tool Sets

### 1. `memory-context`
**Purpose**: Persistent knowledge management and documentation access

**Tools Included**:
- MCP Memory tools (`mcp_memory_*`): Create entities, add observations, search nodes, manage knowledge graph
- MCP Context7 tools (`mcp_context7_*`): Resolve library IDs, fetch up-to-date documentation
- MCP DeepWiki tools (`mcp_deepwiki_*`): Access GitHub repository documentation

**Use Cases**:
- Storing project context and state
- Fetching library/framework documentation
- Researching code examples from GitHub repos
- Maintaining persistent knowledge across sessions

**Example**:
```markdown
Use #toolset:memory-context to store the current project state and fetch React documentation
```

### 2. `planning`
**Purpose**: Structured thinking and multi-step problem solving

**Tools Included**:
- Sequential thinking (`mcp_sequential-th_sequentialthinking`)
- Todo list management (`manage_todo_list`)
- Search tools (`semantic_search`, `grep_search`, `file_search`)
- File exploration (`list_dir`, `read_file`)
- Web research (`fetch_webpage`)

**Use Cases**:
- Breaking down complex problems
- Creating and tracking todo lists
- Researching codebase patterns
- Planning multi-step implementations

**Example**:
```markdown
Use #toolset:planning to analyze the codebase and create an implementation plan
```

### 3. `development`
**Purpose**: Code creation and modification

**Tools Included**:
- File creation (`create_file`, `create_directory`)
- Code editing (`replace_string_in_file`, `multi_replace_string_in_file`)
- Notebook editing (`edit_notebook_file`)
- Code analysis (`list_code_usages`, `get_errors`, `get_changed_files`)

**Use Cases**:
- Creating new files and folders
- Editing existing code
- Refactoring across multiple files
- Analyzing code usage and errors

**Example**:
```markdown
Use #toolset:development to implement the new feature across multiple files
```

### 4. `testing`
**Purpose**: Validation, verification, and browser automation

**Tools Included**:
- Test execution (`run_tests`, `test_failure`, `get_errors`)
- Chrome DevTools MCP (`mcp_chrome-devtoo_*`): Browser automation, page interaction, network inspection

**Use Cases**:
- Running unit and integration tests
- Automating browser-based UI testing
- Performance profiling
- End-to-end validation

**Example**:
```markdown
Use #toolset:testing to run all tests and verify the UI with browser automation
```

### 5. `execution`
**Purpose**: Running commands, scripts, and build tasks

**Tools Included**:
- Terminal commands (`run_in_terminal`, `get_terminal_output`)
- Task execution (`create_and_run_task`, `get_task_output`)
- Terminal interaction (`terminal_last_command`, `terminal_selection`)

**Use Cases**:
- Building the project
- Running scripts
- Executing npm/maven commands
- Deploying applications

**Example**:
```markdown
Use #toolset:execution to build the project and run the deployment script
```

### 6. `python`
**Purpose**: Python environment and package management

**Tools Included**:
- Environment configuration (`configure_python_environment`)
- Environment details (`get_python_environment_details`, `get_python_executable_details`)
- Package management (`install_python_packages`)

**Use Cases**:
- Setting up Python environments
- Installing dependencies
- Managing virtual environments
- Running Python scripts

**Example**:
```markdown
Use #toolset:python to configure the environment and install required packages
```

### 7. `read-only`
**Purpose**: Safe exploration and analysis without file modifications

**Tools Included**:
- Search tools (`semantic_search`, `grep_search`, `file_search`)
- File reading (`read_file`, `list_dir`, `list_code_usages`)
- Error checking (`get_errors`)
- Research tools (`fetch_webpage`, MCP Memory/Context7/DeepWiki tools)
- Planning (`mcp_sequential-th_sequentialthinking`)

**Use Cases**:
- Analyzing codebases safely
- Research and discovery phases
- Code review without modifications
- Planning before implementation

**Example**:
```markdown
Use #toolset:read-only to explore the codebase and understand the architecture
```

## Usage Patterns

### In Chat Messages
Reference tool sets using `#toolset:name` syntax:

```
Use #toolset:memory-context to store the current state, then use #toolset:development to implement the changes
```

### In Prompt Files
Tool sets help describe workflows in prompt files:

```markdown
---
description: Analyze codebase and create refactoring plan
agent: refactor
---

# Refactoring Analysis

Use #toolset:read-only to explore the code, then use #toolset:planning to create a detailed refactoring plan.
```

### In Agent Files
Agents define tools using wildcards or individual tool names (NOT tool set references):

```yaml
---
description: 'Development Agent'
tools: ['edit', 'search', 'memory/*', 'context7/*', 'chrome-devtools/*']
model: Claude Sonnet 4
---
```

**Note**: Agent files use individual tools or wildcards (e.g., `memory/*` for all memory tools), not tool set names.

## Best Practices

### 1. **Use Tool Sets for Documentation**
Tool sets serve as living documentation of available capabilities. Reference them when describing workflows or explaining agent capabilities.

### 2. **Combine Tool Sets for Complex Workflows**
Most tasks require multiple tool sets working together:

```
1. Use #toolset:planning to break down the problem
2. Use #toolset:memory-context to fetch documentation
3. Use #toolset:development to implement changes
4. Use #toolset:testing to validate the solution
```

### 3. **Start with Read-Only for Analysis**
When exploring unfamiliar code, start with `#toolset:read-only` to safely analyze before making changes.

### 4. **Store Results in Memory**
Always use `#toolset:memory-context` to store findings, decisions, and progress for future reference.

### 5. **Sequential Thinking for Complex Tasks**
For multi-step problems, use `#toolset:planning` with sequential thinking to break down and track progress.

## Common Workflows

### Research → Plan → Implement → Test
```
1. #toolset:read-only - Understand existing code
2. #toolset:planning - Create implementation plan
3. #toolset:memory-context - Store plan and context
4. #toolset:development - Implement changes
5. #toolset:testing - Validate implementation
```

### Debug → Fix → Verify
```
1. #toolset:testing - Run tests to identify failures
2. #toolset:read-only - Analyze failing code
3. #toolset:planning - Plan fix approach
4. #toolset:development - Apply fixes
5. #toolset:testing - Re-run tests to verify
```

### Research Library → Integrate → Document
```
1. #toolset:memory-context - Fetch library documentation (Context7)
2. #toolset:planning - Plan integration approach
3. #toolset:development - Implement integration
4. #toolset:testing - Test integration
5. #toolset:memory-context - Store integration patterns
```

## Extending Tool Sets

To add a new tool set:

1. Edit `.vscode/toolsets.jsonc` (workspace source)
2. Add a new top-level object with tools array
3. Document the tool set in this guide
4. **Run `.vscode\update_toolsets.ps1`** to deploy to user profile
5. Update relevant agents and prompts

Example:
```jsonc
{
  "new-toolset": {
    "description": "Description of what this tool set does",
    "tools": [
      "tool_name_1",
      "tool_name_2"
    ]
  }
}
```

## Team Setup Instructions

### For Team Members

When you clone this repository or after toolsets are updated:

1. **Install toolsets** (first time or after updates):
   ```powershell
   .\.vscode\update_toolsets.ps1
   ```

2. **Verify installation**:
   ```powershell
   .\.vscode\update_toolsets.ps1 -Verify
   ```

3. **Start using `#toolset:` references** in prompts, agents, and chat!

### For Repository Maintainers

When updating toolsets:

1. Edit `.vscode/toolsets.jsonc`
2. Update this guide if adding/removing tool sets
3. Commit changes to Git
4. Run `.vscode\update_toolsets.ps1` locally to test
5. Notify team members to re-run the script

## Troubleshooting

### `#toolset:` references not working
- Run `.vscode\update_toolsets.ps1 -Verify` to check installation
- Ensure toolsets are deployed to user profile (not just in workspace)
- Verify VS Code has reloaded after installation

### Outdated toolsets
- Run `.vscode\update_toolsets.ps1` to sync with latest workspace version
- Check with `-Verify` flag to see if update is needed

### Tool not available in agent
- Check that the tool is included in the agent's `tools` array or referenced tool set
- Verify the tool is activated in your VS Code environment

### Tool set reference not working
- Verify the tool set name matches exactly (case-sensitive)
- Example: `#toolset:memory-context` not `#toolset:Memory-Context`

### MCP server not configured
- Verify MCP servers are properly configured in `.vscode/settings.json`
- Check that required MCP servers are running

## User Profile vs Workspace: Understanding the Two-Tier System

### Why This Architecture?

VS Code/GitHub Copilot loads toolsets from **user profile only** (`%APPDATA%\Code\User\prompts\`). However, team collaboration requires version-controlled configuration in the **workspace repository**.

### Solution: Hybrid Approach

1. **Source of Truth**: `.vscode/toolsets.jsonc` (workspace, Git-tracked)
2. **Deployment Target**: `%APPDATA%\Code\User\prompts\.das-tools.toolsets.jsonc` (user profile)
3. **Automation**: `update_toolsets.ps1` bridges the gap

### Benefits

- ✅ **Team Collaboration**: Configuration shared via Git
- ✅ **Version Control**: Track toolsets changes over time
- ✅ **Easy Setup**: One script command for new team members
- ✅ **Automatic Updates**: Re-run script when workspace version changes
- ✅ **Functional `#toolset:` References**: Work in prompts, agents, and chat

### Alternative: Manual Setup (Not Recommended)

If you prefer not to use the script, you can manually:
1. Open Command Palette (`Ctrl+Shift+P`)
2. Run "Chat: Configure Tool Sets"
3. Copy content from `.vscode/toolsets.jsonc`
4. Paste into user profile toolset file

⚠️ **Note**: Manual setup requires repeating these steps whenever toolsets are updated in the repository
