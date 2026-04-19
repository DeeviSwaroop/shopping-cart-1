---
applyTo: "**/*"
---

# Security Guidelines

These security instructions apply to all files in the project. Follow these guidelines when generating, modifying, or reviewing code to ensure secure application development.

## OWASP Top 10 Protection

### 1. Injection Prevention

#### SQL Injection
- **Always use parameterized queries** (prepared statements)
- Never concatenate user input into SQL queries
- Use ORM frameworks properly (validate ORM-generated queries)

```javascript
// Bad: SQL injection vulnerable
const query = `SELECT * FROM users WHERE id = ${userId}`;

// Good: Parameterized query
const query = 'SELECT * FROM users WHERE id = ?';
db.execute(query, [userId]);
```

#### Command Injection
- Avoid executing shell commands with user input
- If necessary, use strict input validation and sanitization
- Use libraries that don't invoke shell (e.g., use Node.js APIs instead of shell commands)

### 2. Authentication & Session Management

#### Password Security
- **Never store passwords in plaintext**
- Use bcrypt, argon2, or scrypt for password hashing (min 10 rounds for bcrypt)
- Enforce strong password policies (min 12 characters, complexity)
- Implement account lockout after failed login attempts

```javascript
const bcrypt = require('bcrypt');

// Hash password
const saltRounds = 12;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword);
```

#### Session Management
- Use httpOnly and secure flags for cookies
- Implement session timeout (15-30 minutes of inactivity)
- Regenerate session IDs after login
- Implement CSRF protection for state-changing operations

```javascript
// Express.js session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,  // Prevents XSS attacks
    secure: true,    // HTTPS only
    sameSite: 'strict', // CSRF protection
    maxAge: 1800000  // 30 minutes
  }
}));
```

#### JWT Security
- Use strong secrets (256-bit minimum)
- Set short expiration times (5-15 minutes for access tokens)
- Implement refresh token rotation
- Store JWTs securely (httpOnly cookies, not localStorage)
- Validate all JWT claims (issuer, audience, expiration)

### 3. Cross-Site Scripting (XSS) Prevention

#### Input Validation
- Validate all user input against expected format
- Use allowlists (not blocklists) for input validation
- Reject invalid input (don't try to sanitize everything)

#### Output Encoding
- React escapes by default - rely on this behavior
- Never use `dangerouslySetInnerHTML` without sanitization
- Use DOMPurify for HTML sanitization when necessary
- Encode output for the correct context (HTML, JavaScript, CSS, URL)

```javascript
import DOMPurify from 'dompurify';

// Good: React escapes automatically
<div>{userInput}</div>

// When HTML is required, sanitize first
<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(userHtml, {
    ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong'],
    ALLOWED_ATTR: []
  })
}} />

// Bad: Never do this
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

#### Content Security Policy (CSP)
- Implement strict CSP headers
- Avoid `unsafe-inline` and `unsafe-eval`
- Use nonces or hashes for inline scripts

```javascript
// Express.js CSP middleware
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'nonce-{random}'"],
    styleSrc: ["'self'", "'nonce-{random}'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'", "https://api.example.com"]
  }
}));
```

### 4. Cross-Site Request Forgery (CSRF) Prevention

- Use CSRF tokens for all state-changing operations
- Verify origin and referer headers
- Use SameSite cookie attribute
- Implement double-submit cookie pattern for APIs

```javascript
// Express.js CSRF protection
const csrf = require('csurf');
app.use(csrf({ cookie: true }));

// Include CSRF token in forms
<form method="POST">
  <input type="hidden" name="_csrf" value={csrfToken} />
</form>
```

### 5. Security Misconfiguration

#### Security Headers
Implement all essential security headers:

```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: { /* config */ },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true
}));
```

#### Environment Configuration
- Never commit secrets to version control
- Use environment variables for configuration
- Different configs for dev/staging/production
- Disable debug mode in production
- Remove development dependencies from production builds

```javascript
// Use environment variables
const config = {
  apiKey: process.env.API_KEY,
  dbPassword: process.env.DB_PASSWORD,
  jwtSecret: process.env.JWT_SECRET
};

// Never hardcode secrets
const API_KEY = 'sk_live_abc123'; // ❌ BAD
```

#### Error Handling
- Don't expose stack traces to users
- Log detailed errors server-side
- Return generic error messages to clients
- Implement proper error boundaries (React)

### 6. Sensitive Data Exposure

#### Data in Transit
- **Always use HTTPS** (TLS 1.2+)
- Implement HSTS (HTTP Strict Transport Security)
- Don't transmit sensitive data in URL parameters
- Use secure WebSocket connections (wss://)

#### Data at Rest
- Encrypt sensitive data in database
- Use proper key management (KMS or vault services)
- Encrypt backups
- Securely delete data when no longer needed

#### Client-Side Storage
- **Never store sensitive data in localStorage or sessionStorage**
- Use httpOnly cookies for authentication tokens
- Clear sensitive data from memory after use
- Don't log sensitive information

```javascript
// Bad: Storing tokens in localStorage
localStorage.setItem('token', authToken); // ❌

// Good: Use httpOnly cookies (set by server)
// Token is not accessible to JavaScript
```

### 7. XML External Entities (XXE) Prevention

- Disable XML external entity processing
- Use JSON instead of XML when possible
- Validate and sanitize XML input
- Use secure XML parsers with XXE protection

### 8. Insecure Deserialization

- Don't deserialize untrusted data
- Validate data before deserialization
- Use type-safe serialization formats (JSON)
- Implement integrity checks (HMAC)

### 9. Using Components with Known Vulnerabilities

#### Dependency Management
- Regularly audit dependencies: `npm audit`
- Keep dependencies up to date
- Use `npm audit fix` to automatically update
- Review security advisories for critical dependencies
- Remove unused dependencies

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities (careful with breaking changes)
npm audit fix

# Check for outdated packages
npm outdated
```

#### Continuous Monitoring
- Enable Dependabot or similar tools
- Set up automated security scanning in CI/CD
- Monitor security advisories (GitHub Security Alerts)

### 10. Insufficient Logging & Monitoring

#### Security Logging
- Log all authentication attempts (success and failure)
- Log authorization failures
- Log input validation failures
- Log security-relevant events (password changes, permission changes)
- **Never log sensitive data** (passwords, tokens, PII)

```javascript
// Good: Log security events (no sensitive data)
logger.info('Login attempt', {
  username: sanitize(username),
  ip: req.ip,
  userAgent: req.get('user-agent'),
  timestamp: new Date().toISOString()
});

// Bad: Logging sensitive data
logger.info('Login attempt', {
  username: username,
  password: password  // ❌ Never log passwords
});
```

#### Monitoring & Alerting
- Implement real-time monitoring for suspicious activity
- Set up alerts for security events (multiple failed logins, privilege escalation)
- Monitor for anomalous behavior patterns
- Implement incident response procedures

## API Security

### Authentication
- Use OAuth 2.0 or OpenID Connect for authentication
- Implement proper API key management
- Use API gateways for centralized authentication

### Authorization
- Implement principle of least privilege
- Validate permissions on every request
- Use role-based access control (RBAC) or attribute-based access control (ABAC)
- Never trust client-side authorization checks

### Rate Limiting
- Implement rate limiting to prevent abuse
- Use different limits for authenticated vs. anonymous users
- Return appropriate HTTP status codes (429 Too Many Requests)

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});

app.use('/api/', limiter);
```

### Input Validation
- Validate all input on the server side
- Use schemas for request validation (e.g., Joi, Yup, express-validator)
- Reject requests with invalid data
- Limit request size to prevent DoS

## Frontend-Specific Security

### React Security
- Never use `eval()` or `Function()` with user input
- Validate props with PropTypes or TypeScript
- Sanitize user-generated URLs before using in `href`
- Be cautious with third-party React components
- Implement proper error boundaries

### State Management Security
- Don't store sensitive data in client-side state
- Validate data from global state before use
- Clear sensitive data from state when no longer needed
- Be cautious with Redux DevTools in production

### Third-Party Scripts
- Minimize use of third-party scripts
- Use Subresource Integrity (SRI) for CDN resources
- Implement CSP to restrict script sources
- Audit third-party dependencies regularly

```html
<!-- Good: Using SRI for CDN resources -->
<script 
  src="https://cdn.example.com/library.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/ux..."
  crossorigin="anonymous">
</script>
```

## Secure Development Practices

### Code Review Checklist
- [ ] All user input validated and sanitized
- [ ] No sensitive data in logs or error messages
- [ ] Authentication and authorization properly implemented
- [ ] HTTPS enforced for all communications
- [ ] Security headers configured correctly
- [ ] No hardcoded secrets or credentials
- [ ] Dependencies up to date and audited
- [ ] Proper error handling (no stack traces to users)
- [ ] CSRF protection implemented
- [ ] XSS prevention measures in place

### Security Testing
- Run SAST (Static Application Security Testing) tools
- Use DAST (Dynamic Application Security Testing) tools
- Conduct regular penetration testing
- Implement security regression tests
- Use tools like OWASP ZAP for vulnerability scanning

### Incident Response
- Have an incident response plan
- Know how to revoke compromised credentials
- Implement monitoring and alerting
- Document security incidents
- Conduct post-incident reviews

## References & Resources

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- OWASP Cheat Sheet Series: https://cheatsheetseries.owasp.org/
- CWE Top 25: https://cwe.mitre.org/top25/
- NIST Cybersecurity Framework: https://www.nist.gov/cyberframework
- Use Context7 MCP to fetch security documentation for specific libraries
- See project-specific security policies in .github/copilot-instructions.md

## Reporting Security Issues

If you discover a security vulnerability:
1. **Do NOT open a public issue**
2. Report to security team immediately
3. Include detailed reproduction steps
4. Provide impact assessment
5. Suggest mitigation if possible

Contact: [security contact from project]
