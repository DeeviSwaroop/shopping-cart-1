---
description: Generate comprehensive test suite with coverage requirements
agent: testing
---

# Generate Tests

Generate a comprehensive test suite for the selected code or component following these guidelines:

## Test Types
Generate appropriate tests based on the code type:
- **Unit Tests**: For functions, classes, and utilities
- **Integration Tests**: For API endpoints, database interactions, component integration
- **E2E Tests**: For user workflows and critical paths (using Chrome DevTools MCP)
- **Accessibility Tests**: For UI components (WCAG compliance)
- **Performance Tests**: For performance-critical code

## Test Framework Integration
Use the project's testing infrastructure:
- **JavaScript/React**: Jest + React Testing Library
- **E2E**: Chrome DevTools MCP (#toolset:testing)
- **Assertions**: Follow project patterns (see ../.github/copilot-instructions.md)

## Test Coverage Requirements
- Aim for 80%+ code coverage
- Cover all edge cases and error scenarios
- Include positive and negative test cases
- Test boundary conditions
- Mock external dependencies appropriately

## Test Structure
Follow this structure for each test file:
```javascript
describe('Component/Function Name', () => {
  // Setup
  beforeEach(() => {
    // Initialize mocks, test data
  });

  // Teardown
  afterEach(() => {
    // Clean up
  });

  describe('Feature/Method Name', () => {
    it('should handle normal case', () => {
      // Arrange
      // Act
      // Assert
    });

    it('should handle edge case', () => {
      // Test edge cases
    });

    it('should handle error case', () => {
      // Test error handling
    });
  });
});
```

## Best Practices
- Write descriptive test names
- Keep tests isolated and independent
- Use meaningful assertions
- Avoid test duplication
- Test behavior, not implementation
- Include accessibility checks for UI components

## E2E Test Automation
For end-to-end tests, use #toolset:testing (Chrome DevTools MCP):
- Create test scenarios covering critical user workflows
- Include form validation, navigation, and state management tests
- Test across different viewport sizes (responsive design)
- Verify error messages and loading states

## Output
Generate:
1. Test file(s) with comprehensive test suite
2. Coverage report interpretation
3. Recommendations for additional test scenarios
4. Integration instructions for CI/CD pipeline

Use #toolset:development to create test files and #toolset:testing to execute and validate.
