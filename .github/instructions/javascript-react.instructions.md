---
applyTo: "**/*.{js,jsx}"
---

# JavaScript & React Development Guidelines

These instructions apply to all JavaScript and React files in the project. Follow these guidelines when generating, modifying, or reviewing JavaScript/React code.

## Code Style & Standards

### JavaScript Modern Syntax
- Use ES6+ features (arrow functions, destructuring, spread operator, template literals)
- Prefer `const` for immutable bindings, `let` for mutable (never use `var`)
- Use async/await for asynchronous operations (not raw Promises or callbacks)
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access

### React Component Guidelines
- Write functional components with hooks (not class components)
- Use named exports for components (easier to refactor and find usages)
- Keep components small and focused (single responsibility principle)
- Prefer composition over prop drilling (use Context API when appropriate)

Example:
```javascript
// Good: Functional component with hooks
export function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUser(userId).then(setUser).finally(() => setLoading(false));
  }, [userId]);
  
  if (loading) return <LoadingSpinner />;
  return <div>{user?.name}</div>;
}

// Bad: Class component
export class UserProfile extends React.Component {
  // Avoid class components
}
```

### Hooks Best Practices
- Follow React hooks rules (only call at top level, only in React functions)
- Use `useCallback` for functions passed as props to memoized components
- Use `useMemo` for expensive computations
- Use `useEffect` for side effects (API calls, subscriptions, manual DOM changes)
- Properly specify dependencies in hook dependency arrays

### PropTypes & Type Safety
- Always define PropTypes for component props
- Use `PropTypes.shape()` for object props
- Mark required props explicitly
- Consider migrating to TypeScript for better type safety

Example:
```javascript
import PropTypes from 'prop-types';

UserProfile.propTypes = {
  userId: PropTypes.string.isRequired,
  onUpdate: PropTypes.func,
  settings: PropTypes.shape({
    theme: PropTypes.string,
    notifications: PropTypes.bool
  })
};
```

## Security Best Practices

### Input Validation & Sanitization
- **Always** validate and sanitize user input
- Never trust data from external sources (APIs, URL params, localStorage)
- Use DOMPurify or similar for HTML sanitization
- Validate input on both client and server side

### XSS Prevention
- React escapes values by default - rely on this behavior
- Never use `dangerouslySetInnerHTML` unless absolutely necessary
- If you must use `dangerouslySetInnerHTML`, sanitize with DOMPurify
- Be cautious with user-generated URLs (sanitize before using in href)

Example:
```javascript
// Good: React escapes automatically
<div>{userInput}</div>

// Dangerous: Only if sanitized
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(userHtml) 
}} />

// Bad: Never do this
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### Authentication & Authorization
- Store tokens securely (httpOnly cookies preferred over localStorage)
- Implement proper CSRF protection
- Always validate permissions on both client and server
- Never store sensitive data in component state or localStorage

## Performance Optimization

### Rendering Optimization
- Use `React.memo()` for components that render often with same props
- Use `useCallback()` for functions passed to memoized children
- Use `useMemo()` for expensive calculations
- Avoid inline functions in JSX (unless trivial or using useCallback)
- Use React DevTools Profiler to identify performance bottlenecks

### Bundle Size & Code Splitting
- Use dynamic imports for route-based code splitting
- Lazy load heavy components with `React.lazy()` and `Suspense`
- Avoid importing entire libraries (use tree-shakeable imports)
- Monitor bundle size with webpack-bundle-analyzer

Example:
```javascript
// Good: Lazy loading
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyComponent />
    </Suspense>
  );
}

// Good: Tree-shakeable import
import { debounce } from 'lodash-es';

// Bad: Imports entire library
import _ from 'lodash';
```

## Testing Guidelines

### React Testing Library Best Practices
- Test behavior, not implementation details
- Query by accessible attributes (role, label, text) not test IDs
- Use `userEvent` for realistic user interactions
- Test loading states, error states, and edge cases
- Avoid testing implementation details (state, props)

Example:
```javascript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('submits form with valid data', async () => {
  const onSubmit = jest.fn();
  render(<LoginForm onSubmit={onSubmit} />);
  
  // Good: Query by accessible role and label
  await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
  await userEvent.type(screen.getByLabelText(/password/i), 'password123');
  await userEvent.click(screen.getByRole('button', { name: /login/i }));
  
  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123'
    });
  });
});
```

### Test Coverage Requirements
- Aim for 80%+ code coverage
- Cover all user interactions and edge cases
- Test error states and loading states
- Include accessibility tests (see testing.instructions.md)

## Accessibility (WCAG 2.1 AA)

### Semantic HTML
- Use semantic HTML elements (`<button>`, `<nav>`, `<main>`, `<article>`)
- Provide meaningful `alt` text for images
- Use proper heading hierarchy (`<h1>` → `<h6>`)

### ARIA & Keyboard Navigation
- Add ARIA labels where semantic HTML is insufficient
- Ensure all interactive elements are keyboard accessible
- Manage focus for modals, dropdowns, and dynamic content
- Test keyboard navigation (Tab, Enter, Escape)

### Testing Accessibility
- Use `jest-axe` in tests to catch accessibility issues
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Verify color contrast ratios (WCAG AA: 4.5:1 for text)

Example:
```javascript
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

test('should have no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Error Handling

### Error Boundaries
- Implement error boundaries for critical sections
- Provide fallback UI for errors
- Log errors for monitoring and debugging

### API Error Handling
- Always handle API errors gracefully
- Provide user-friendly error messages
- Implement retry logic for transient failures
- Show loading states during API calls

Example:
```javascript
function UserData({ userId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUser(userId)
      .then(setData)
      .catch(err => {
        console.error('Failed to fetch user:', err);
        setError('Unable to load user data. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [userId]);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  return <UserDisplay user={data} />;
}
```

## ESLint & Prettier

- Always run ESLint before committing
- Fix all ESLint errors (warnings should be addressed or suppressed with justification)
- Use Prettier for consistent code formatting
- Configure pre-commit hooks to enforce linting and formatting

```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Format code
npm run format
```

## Dependencies & Security

- Regularly update dependencies (use `npm audit` to check for vulnerabilities)
- Review dependency licenses for compliance
- Avoid dependencies with known security issues
- Use exact versions in package-lock.json (committed to repo)

## Documentation

- Add JSDoc comments for complex functions
- Document component props with PropTypes
- Maintain README for component usage examples
- Update documentation when changing component APIs

## References

- React Hooks: Use Context7 MCP to fetch latest React documentation
- Security: See security.instructions.md in this folder
- Testing: See testing.instructions.md in this folder
- Project standards: See ../.github/copilot-instructions.md
