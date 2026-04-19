---
applyTo: "**/*.test.{js,jsx}"
---

# Testing Guidelines

These instructions apply to all test files in the project. Follow these guidelines when writing, reviewing, or generating tests.

## Testing Framework

### Stack
- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing (prefer over Enzyme)
- **jest-axe**: Accessibility testing
- **Chrome DevTools MCP**: E2E and browser automation testing

### Configuration
Tests are configured via `jest.config.js` and run through Maven's frontend-maven-plugin. Test files use `.test.js` or `.test.jsx` extension.

## Test Structure

### File Organization
- Place test files next to the source files they test
- Name test files with `.test.js` or `.test.jsx` extension
- Use descriptive `describe` blocks to group related tests
- Use clear `it`/`test` descriptions that read like specifications

Example structure:
```javascript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import MyComponent from './MyComponent';

expect.extend(toHaveNoViolations);

describe('MyComponent', () => {
  describe('rendering', () => {
    it('should render with required props', () => {
      // Test
    });
    
    it('should render loading state', () => {
      // Test
    });
  });
  
  describe('user interactions', () => {
    it('should handle button click', async () => {
      // Test
    });
  });
  
  describe('accessibility', () => {
    it('should have no accessibility violations', async () => {
      // Test
    });
  });
});
```

## React Testing Library Best Practices

### Query Priority (in order of preference)
1. **getByRole**: Queries by ARIA role (most accessible)
2. **getByLabelText**: Queries by associated label (for form inputs)
3. **getByPlaceholderText**: Queries by placeholder (for inputs without labels)
4. **getByText**: Queries by visible text content
5. **getByDisplayValue**: Queries by form input value
6. **getByAltText**: Queries by img alt text
7. **getByTitle**: Queries by title attribute
8. **getByTestId**: Last resort (use only when necessary)

Example:
```javascript
// Good: Query by role (accessible)
const button = screen.getByRole('button', { name: /submit/i });

// Good: Query by label (accessible)
const input = screen.getByLabelText(/username/i);

// Acceptable: Query by text
const heading = screen.getByText(/welcome/i);

// Bad: Query by test ID (not accessible)
const element = screen.getByTestId('submit-button');
```

### User Interactions
Use `@testing-library/user-event` for realistic user interactions (prefer over `fireEvent`):

```javascript
import userEvent from '@testing-library/user-event';

test('user can type and submit form', async () => {
  render(<LoginForm />);
  
  // Type text
  await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
  
  // Click button
  await userEvent.click(screen.getByRole('button', { name: /login/i }));
  
  // Verify outcome
  await waitFor(() => {
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });
});
```

### Async Testing
Use `waitFor`, `findBy*`, or `waitForElementToBeRemoved` for async operations:

```javascript
// Good: waitFor for assertions
await waitFor(() => {
  expect(screen.getByText(/success/i)).toBeInTheDocument();
});

// Good: findBy (combines getBy + waitFor)
const element = await screen.findByText(/success/i);

// Good: Wait for element to be removed
await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
```

## Test Coverage Requirements

### Minimum Coverage
- **Line coverage**: 80%+
- **Branch coverage**: 75%+
- **Function coverage**: 80%+
- **Statement coverage**: 80%+

### What to Test
✅ **Do test:**
- User-visible behavior
- Different component states (loading, error, success)
- User interactions (clicks, typing, form submission)
- Edge cases and error scenarios
- Accessibility compliance
- Integration with APIs/services

❌ **Don't test:**
- Implementation details (internal state, private methods)
- Third-party library internals
- Trivial code (simple getters/setters)
- Styles and CSS (unless critical to functionality)

## Mocking

### API Mocking
Mock external API calls to avoid network requests in tests:

```javascript
// Mock fetch globally
global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

test('fetches and displays data', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ name: 'John Doe' })
  });
  
  render(<UserProfile userId="123" />);
  
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
  
  expect(fetch).toHaveBeenCalledWith('/api/users/123');
});
```

### Component Mocking
Mock child components to isolate testing:

```javascript
jest.mock('./HeavyComponent', () => {
  return function HeavyComponent() {
    return <div data-testid="heavy-component">Mocked Heavy Component</div>;
  };
});
```

### Timer Mocking
Use Jest's fake timers for testing time-dependent code:

```javascript
jest.useFakeTimers();

test('displays message after delay', () => {
  render(<DelayedMessage />);
  
  expect(screen.queryByText(/delayed/i)).not.toBeInTheDocument();
  
  jest.advanceTimersByTime(3000);
  
  expect(screen.getByText(/delayed/i)).toBeInTheDocument();
});

jest.useRealTimers();
```

## Accessibility Testing

### jest-axe Integration
Include accessibility tests for all UI components:

```javascript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('MyComponent accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<MyComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should be keyboard navigable', () => {
    render(<MyComponent />);
    
    const button = screen.getByRole('button');
    button.focus();
    
    expect(button).toHaveFocus();
  });
});
```

### Keyboard Navigation Testing
Test keyboard accessibility explicitly:

```javascript
test('can navigate form with keyboard', async () => {
  render(<ContactForm />);
  
  // Tab to first input
  await userEvent.tab();
  expect(screen.getByLabelText(/name/i)).toHaveFocus();
  
  // Tab to second input
  await userEvent.tab();
  expect(screen.getByLabelText(/email/i)).toHaveFocus();
  
  // Submit with Enter
  await userEvent.keyboard('{Enter}');
  await waitFor(() => {
    expect(screen.getByText(/submitted/i)).toBeInTheDocument();
  });
});
```

## Snapshot Testing

### When to Use Snapshots
- Use sparingly (prefer explicit assertions)
- Good for: Complex DOM structures, data transformations
- Bad for: Component output (changes frequently)

### Best Practices
```javascript
test('renders correct structure', () => {
  const { container } = render(<MyComponent data={mockData} />);
  expect(container.firstChild).toMatchSnapshot();
});

// Update snapshots: npm test -- -u
```

## E2E Testing with Chrome DevTools MCP

For end-to-end workflows, use Chrome DevTools MCP server:

```javascript
// E2E test example (run separately from unit tests)
describe('User login flow', () => {
  it('should allow user to login and access dashboard', async () => {
    // Use Chrome DevTools MCP tools:
    // - mcp_chrome-devtoo_new_page
    // - mcp_chrome-devtoo_fill
    // - mcp_chrome-devtoo_evaluate_script
    // See .vscode/mcp.json for configuration
  });
});
```

## Test Utilities

### Custom Render Helper
Create a custom render helper with providers:

```javascript
// test-utils.js
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';

export function renderWithProviders(ui, options) {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        {ui}
      </ThemeProvider>
    </BrowserRouter>,
    options
  );
}

export * from '@testing-library/react';
export { renderWithProviders as render };
```

### Shared Test Data
Create factories for test data:

```javascript
// test-factories.js
export function createUser(overrides = {}) {
  return {
    id: '123',
    name: 'Test User',
    email: 'test@example.com',
    ...overrides
  };
}
```

## Running Tests

### Commands
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- MyComponent.test.js

# Run tests matching pattern
npm test -- --testNamePattern="user interactions"
```

### CI/CD Integration
Tests run automatically in CI/CD pipeline via Maven:
```bash
mvn clean test
```

## Debugging Tests

### Debug in VS Code
Use VS Code's Jest extension or debugging configuration:
1. Set breakpoint in test file
2. Run "Debug Test" from VS Code
3. Inspect variables and step through code

### Debugging Tips
```javascript
// Print rendered output
import { screen, debug } from '@testing-library/react';
debug(); // Prints entire DOM
debug(screen.getByRole('button')); // Prints specific element

// Check what's currently rendered
screen.logTestingPlaygroundURL(); // Opens Testing Playground
```

## Common Pitfalls

### ❌ Don't: Test implementation details
```javascript
// Bad: Testing internal state
expect(wrapper.state('count')).toBe(5);

// Good: Test user-visible behavior
expect(screen.getByText('Count: 5')).toBeInTheDocument();
```

### ❌ Don't: Use `waitFor` with side effects
```javascript
// Bad: Side effect in waitFor
await waitFor(() => {
  fireEvent.click(button); // Side effect!
});

// Good: Trigger event, then wait for result
fireEvent.click(button);
await waitFor(() => {
  expect(screen.getByText(/success/i)).toBeInTheDocument();
});
```

### ❌ Don't: Query before elements exist
```javascript
// Bad: Element doesn't exist yet
const button = screen.getByRole('button');
await waitFor(() => { /* ... */ });

// Good: Use findBy (waits for element)
const button = await screen.findByRole('button');
```

## References

- React Testing Library: https://testing-library.com/react
- Jest: Use Context7 MCP to fetch latest Jest documentation
- jest-axe: https://github.com/nickcolley/jest-axe
- Chrome DevTools MCP: See .vscode/mcp.json
- Project standards: See .github/copilot-instructions.md
