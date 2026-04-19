---
description: Create detailed implementation plan with architecture considerations
agent: design
---

# Plan Feature

Create a detailed implementation plan for a new feature following these guidelines:

## Requirements Analysis
1. **User Story**: Define clear user story with acceptance criteria
2. **Scope**: Identify in-scope and out-of-scope items
3. **Dependencies**: List technical and feature dependencies
4. **Constraints**: Identify limitations, requirements, and edge cases

## Architecture Design
1. **System Context**: How does this feature fit into the existing architecture?
2. **Component Design**: Identify new components, services, or modules needed
3. **Data Model**: Define data structures, entities, and relationships
4. **API Design**: Specify API endpoints, request/response formats (if applicable)
5. **UI/UX Design**: Describe user interface changes and user flows (if applicable)

## Technical Approach
1. **Technology Stack**: Identify technologies, libraries, frameworks to use
   - Research latest documentation for any new libraries using Context7 MCP server
   - Find code examples from similar projects using DeepWiki MCP server
2. **Design Patterns**: Specify design patterns and architectural patterns to apply
3. **Integration Points**: Identify integration with existing systems, APIs, or services
4. **Security Considerations**: List security requirements and threat mitigations
5. **Performance Considerations**: Identify performance requirements and optimization strategies

## Implementation Plan
Break down into phases with clear milestones:

### Phase 1: Foundation
- [ ] Setup project structure
- [ ] Configure dependencies
- [ ] Create data models/schemas
- [ ] Setup testing infrastructure

### Phase 2: Core Implementation
- [ ] Implement core business logic
- [ ] Create API endpoints/services
- [ ] Add error handling and validation
- [ ] Write unit tests

### Phase 3: Integration
- [ ] Integrate with existing systems
- [ ] Add UI components (if applicable)
- [ ] Implement E2E tests
- [ ] Add logging and monitoring

### Phase 4: Polish & Deploy
- [ ] Code review and refactoring
- [ ] Security audit
- [ ] Performance optimization
- [ ] Documentation and deployment

## Risk Assessment
Identify potential risks and mitigation strategies:
- **Technical Risks**: Complexity, dependencies, integration challenges
- **Resource Risks**: Time, expertise, availability
- **Security Risks**: Vulnerabilities, data exposure
- **Performance Risks**: Scalability, bottlenecks

## Success Criteria
Define measurable success criteria:
- **Functional**: Feature works as specified
- **Quality**: Code coverage, code quality metrics
- **Performance**: Response times, throughput, resource usage
- **Security**: No critical vulnerabilities, passes security scan
- **Usability**: Meets accessibility standards, positive user feedback

## Next Steps
1. Review plan with stakeholders
2. Estimate effort and timeline
3. Assign tasks to team members
4. Begin Phase 1 implementation

Use #toolset:read-only for research and analysis, #toolset:memory-context for documentation lookup, and #toolset:planning for structured thinking.

After planning is complete, handoff to @development agent for implementation.
