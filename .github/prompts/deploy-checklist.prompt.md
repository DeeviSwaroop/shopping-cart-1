---
description: Pre-deployment verification checklist with quality gates
agent: ops
---

# Deployment Checklist

Run through this comprehensive deployment checklist before releasing to production:

## Code Quality Verification
- [ ] All tests pass (unit, integration, E2E)
- [ ] Code coverage meets threshold (80%+)
- [ ] No critical or high-severity linting errors
- [ ] SonarQube quality gate passes (if available)
- [ ] Code review completed and approved
- [ ] No TODOs or FIXME comments in production code

## Security Verification
- [ ] Security scan completed with no critical issues
- [ ] Dependencies scanned for vulnerabilities (npm audit, etc.)
- [ ] Secrets and credentials properly managed (no hardcoded values)
- [ ] Authentication and authorization tested
- [ ] Input validation and sanitization verified
- [ ] HTTPS/TLS configuration validated
- [ ] CORS and CSP policies configured correctly

## Performance Verification
- [ ] Performance tests executed and benchmarks met
- [ ] No memory leaks detected
- [ ] Database queries optimized
- [ ] API response times within acceptable range
- [ ] Frontend bundle size optimized
- [ ] Caching strategy implemented and tested
- [ ] Load testing completed (if applicable)

## Functional Verification
- [ ] All acceptance criteria met
- [ ] User flows tested end-to-end
- [ ] Edge cases and error scenarios handled
- [ ] Cross-browser compatibility verified (if applicable)
- [ ] Responsive design tested across viewports (if applicable)
- [ ] Accessibility requirements met (WCAG compliance)
- [ ] Internationalization/localization verified (if applicable)

## Infrastructure & Environment
- [ ] Environment variables configured correctly
- [ ] Database migrations tested
- [ ] Rollback plan documented and tested
- [ ] Monitoring and alerting configured
- [ ] Logging properly configured
- [ ] Backup and disaster recovery tested
- [ ] Resource limits and auto-scaling configured

## Documentation
- [ ] README updated with new features
- [ ] API documentation updated (if applicable)
- [ ] Architecture diagrams updated (if applicable)
- [ ] Deployment instructions documented
- [ ] Troubleshooting guide updated
- [ ] Changelog/release notes prepared

## Communication & Coordination
- [ ] Stakeholders notified of deployment
- [ ] Maintenance window scheduled (if required)
- [ ] Support team briefed on changes
- [ ] Rollback procedure communicated
- [ ] Post-deployment verification plan in place

## Post-Deployment Verification
Execute after deployment:
1. **Smoke Tests**: Verify critical paths work in production
2. **Monitoring**: Check dashboards for errors, performance issues
3. **User Feedback**: Monitor support channels for issues
4. **Metrics**: Verify success metrics are tracking correctly

## Automated Checks
Use available tools to automate verification:
```bash
# Run all tests
npm test

# Check code coverage
npm run test:coverage

# Run linter
npm run lint

# Security audit
npm audit

# Build verification
npm run build

# E2E tests (if configured)
npm run test:e2e
```

Use #toolset:execution to run verification commands, #toolset:testing for automated tests, and #toolset:memory-context to store deployment learnings for future reference.

If any checks fail, handoff to appropriate agent:
- Test failures → @testing agent
- Security issues → @review agent
- Performance issues → @refactor agent
- Build failures → @development agent
