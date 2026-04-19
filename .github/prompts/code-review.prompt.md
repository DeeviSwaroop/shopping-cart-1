---
description: Perform comprehensive code review with security, quality, and best practices checks
agent: review
---

# Code Review

Perform a comprehensive code review of the selected code or file(s) following these guidelines:

## Security Analysis
- Check for common vulnerabilities (XSS, SQL injection, CSRF, authentication issues)
- Validate input sanitization and output encoding
- Review authentication and authorization logic
- Check for hardcoded secrets or sensitive data exposure
- Verify secure data transmission and storage practices

## Code Quality
- Assess code readability and maintainability
- Check for code smells and anti-patterns
- Verify proper error handling and logging
- Review naming conventions and code structure
- Identify opportunities for refactoring

## Best Practices
- Verify adherence to project coding standards (see ../.github/copilot-instructions.md)
- Check for proper use of design patterns
- Review dependency management and potential security issues
- Assess test coverage and testability
- Verify documentation completeness

## Performance
- Identify potential performance bottlenecks
- Check for inefficient algorithms or data structures
- Review memory usage and resource management
- Assess database query optimization
- Check for unnecessary re-renders or computations (React/UI)

## Integration with Quality Tools
If available, leverage project quality tools to:
- Check existing issues in the codebase
- Analyze code snippets for immediate feedback
- Reference project quality gates and metrics

## Output Format
Provide findings in the following structure:
1. **Summary**: Overall assessment and critical issues
2. **Security Issues**: Prioritized list with severity ratings
3. **Quality Issues**: Code quality concerns with recommendations
4. **Performance Issues**: Bottlenecks and optimization opportunities
5. **Recommendations**: Actionable next steps with priorities

Use #toolset:read-only for initial analysis, then provide detailed recommendations.
