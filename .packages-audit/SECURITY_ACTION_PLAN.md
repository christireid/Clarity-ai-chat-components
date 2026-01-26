# Security Action Plan - API Consolidation

**Priority:** CRITICAL **Timeline:** Must complete before Phase 1 consolidation begins **Estimated
Effort:** 9 days (72 hours)

---

## Executive Summary

The API consolidation presents a significant opportunity to improve security by reducing attack
surface by 83%. However, critical vulnerabilities in logging, validation, and caching must be
addressed before consolidation begins.

**Status:** 🔴 BLOCKED - Security fixes required before proceeding

---

## Critical Security Issues (Fix Before Consolidation)

### 1. Secret Leakage in Loggers 🔴 CRITICAL

**Impact:** HIGH - API keys, passwords, and tokens exposed in production logs **Effort:** 2 days
**Priority:** P0 - MUST FIX FIRST

#### What's Wrong

```typescript
// Current code logs secrets in stack traces and error messages
logger.error(new Error(`Failed to connect: ${apiKey}`))
// Logs: "Failed to connect: sk-proj-abc123..."

// Stack traces contain environment variables
try {
  connectToAPI(process.env.OPENAI_API_KEY)
} catch (error) {
  logger.error(error) // Stack trace shows API key!
}
```

#### Fix Required

Create `/packages/utils/src/logger/secret-detection.ts` with:

- Pattern matching for API keys, tokens, passwords
- Recursive object redaction
- Stack trace sanitization

**Implementation:**

```bash
# Files to create
/packages/utils/src/logger/secret-detection.ts
/packages/utils/src/logger/__tests__/secret-detection.test.ts

# Files to modify
/packages/utils/src/logger/index.ts (add redaction)
/packages/error-handling/src/utils/error-logger.ts (add redaction)
/packages/memory/src/audit/audit-logger.ts (add redaction)
```

**Acceptance:**

- [ ] All logger calls redact 15+ secret patterns
- [ ] Test suite includes 50+ secret detection tests
- [ ] No secrets logged in test run
- [ ] Performance impact < 5ms per log

---

### 2. Password Exposure in ValidationError 🔴 CRITICAL

**Impact:** HIGH - Sensitive field values included in error responses **Effort:** 1 day
**Priority:** P0

#### What's Wrong

```typescript
// Current code can expose passwords in validation errors
ValidationError.field('password', 'Too short', 'TOO_SHORT', {
  value: 'user_password_123'  // ❌ EXPOSED!
});

// Error response to client:
{
  "field": "password",
  "message": "Too short",
  "value": "user_password_123"  // ❌ SENT TO CLIENT!
}
```

#### Fix Required

Add sensitive field detection to ValidationError:

- Detect sensitive field names (password, token, apiKey, etc.)
- Never include `value` for sensitive fields
- Sanitize field names and messages for XSS

**Implementation:**

```bash
# Files to modify
/packages/error-handling/src/errors/validation-error.ts

# Files to create
/packages/error-handling/src/errors/__tests__/validation-security.test.ts
```

**Acceptance:**

- [ ] 20+ sensitive field names detected
- [ ] No sensitive values in error responses
- [ ] XSS sanitization on all string fields
- [ ] Test coverage > 95%

---

### 3. XSS Vulnerabilities in HTML Sanitization 🔴 CRITICAL

**Impact:** HIGH - Cross-site scripting attacks possible **Effort:** 1 day **Priority:** P0

#### What's Wrong

```typescript
// Regex-based sanitization can be bypassed
const html = '<scr<script>ipt>alert(1)</script>'
sanitizeCodeHtml(html) // May not catch all bypasses

// Style injection
const style = 'background: url(javascript:alert(1))'
// Current code allows 'background' property
```

#### Fix Required

1. Add DOMPurify for untrusted HTML
2. Strengthen style attribute validation
3. Remove `background` from allowed properties (use `background-color`)
4. Add SVG sanitization

**Implementation:**

```bash
# Dependencies to add
pnpm add isomorphic-dompurify

# Files to modify
/packages/react/src/utils/security/sanitize-html.ts

# Files to create
/packages/react/src/utils/security/__tests__/xss-attacks.test.ts
```

**Acceptance:**

- [ ] DOMPurify integrated for user HTML
- [ ] All OWASP XSS test vectors blocked
- [ ] Style attribute hardened
- [ ] SVG sanitization added
- [ ] Penetration test passed

---

## High Priority Security Enhancements

### 4. Secure Cache Wrapper 🟡 HIGH

**Impact:** MEDIUM - Sensitive data cached and potentially leaked **Effort:** 2 days **Priority:**
P1 - Complete during Phase 1

#### Issue

Caches accept any data without filtering:

```typescript
cache.set('user-password', 'secret123') // ❌ Should be blocked
cache.set('api-key', 'sk-abc123') // ❌ Should be blocked
```

#### Fix

Create `SecureCache` wrapper:

- Detect sensitive keys (password, token, secret, etc.)
- Block caching of sensitive data
- Optional value sanitization
- Audit logging for blocked attempts

**Implementation:**

```bash
# Files to create
/packages/utils/src/cache/security.ts
/packages/utils/src/cache/__tests__/security.test.ts
```

**Acceptance:**

- [ ] 30+ sensitive key patterns detected
- [ ] Sensitive content detection
- [ ] Optional sanitization callback
- [ ] Audit logging integration

---

### 5. Stronger Cache Hash Function 🟡 HIGH

**Impact:** MEDIUM - Cache collision attacks possible **Effort:** 1 day **Priority:** P1

#### Issue

32-bit FNV-1a hash has ~1 in 4 billion collision probability:

```typescript
// Current hash is weak
getContentHash('admin-session') // 8-char hex = 32 bits
// Attacker could find collision in ~65,536 attempts (birthday attack)
```

#### Fix

Replace with SHA-256 (truncated) or multi-pass FNV-1a:

```typescript
// New: 128-bit hash (16 bytes)
getSecureContentHash('admin-session') // Collision: ~2^64 attempts
```

**Implementation:**

```bash
# Files to modify
/packages/utils/src/cache/index.ts

# Add benchmarks
/packages/utils/src/cache/__tests__/hash-benchmarks.test.ts
```

**Acceptance:**

- [ ] Hash collision resistance > 2^64
- [ ] Performance < 1ms per hash
- [ ] Backwards compatible option
- [ ] Benchmark tests added

---

### 6. XSS Protection in Validation Messages 🟡 HIGH

**Impact:** MEDIUM - Stored XSS via validation errors **Effort:** 1 day **Priority:** P1

#### Issue

Field names and messages not sanitized:

```typescript
ValidationError.field(
  '<script>alert(1)</script>', // ❌ XSS vector
  'Invalid input',
  'INVALID_FORMAT'
)
```

#### Fix

Sanitize all string fields before storage:

```typescript
import { escapeHtmlEntities } from '@clarity-chat/react/utils/security';

static field(field: string, message: string, code: ValidationErrorCode) {
  return new ValidationError(`Validation failed: ${message}`, {
    fields: [{
      field: escapeHtmlEntities(field.trim()),
      message: escapeHtmlEntities(message.trim()),
      code,
    }],
  });
}
```

**Implementation:**

```bash
# Files to modify
/packages/error-handling/src/errors/validation-error.ts

# Tests to add
/packages/error-handling/src/errors/__tests__/xss-validation.test.ts
```

**Acceptance:**

- [ ] All string fields escaped
- [ ] XSS test vectors blocked
- [ ] No rendering issues
- [ ] Performance impact < 1ms

---

## Medium Priority Enhancements

### 7. Context Size Limits 🟢 MEDIUM

**Effort:** 0.5 days **Priority:** P2 - Complete in Phase 4

Add limits to prevent DoS:

```typescript
const MAX_CONTEXT_KEYS = 10
const MAX_CONTEXT_VALUE_LENGTH = 1000
```

### 8. Content Security Policy Headers 🟢 MEDIUM

**Effort:** 0.5 days **Priority:** P2 - Complete in Phase 6

Add CSP helpers for code display:

```typescript
export function getCodeDisplayCSP(): string {
  return "default-src 'none'; style-src 'unsafe-inline'; script-src 'none'"
}
```

---

## Implementation Schedule

### Pre-Consolidation (Days 1-9) - REQUIRED

**Week 1: Critical Fixes**

- Day 1-2: Secret detection and redaction (Issue #1)
- Day 3: Sensitive field filtering (Issue #2)
- Day 4: XSS sanitization (Issue #3)
- Day 5: Security testing and validation

**Week 2: High Priority**

- Day 6-7: Secure cache wrapper (Issue #4)
- Day 8: Stronger hash function (Issue #5)
- Day 9: Validation XSS protection (Issue #6)

### During Consolidation (Phases 1-6)

**Phase 1-2: Security Validation**

- Run security tests after each package migration
- Audit for sensitive data exposure
- Check secret leakage

**Phase 3: Dead Code Cleanup**

- Verify no security utilities deleted
- Update security docs

**Phase 4-5: Enhancement & Testing**

- Add context limits (Issue #7)
- Add CSP helpers (Issue #8)
- Run penetration tests
- Security fuzz testing

**Phase 6: Documentation**

- Security patterns guide
- Migration security advisories
- Incident response updates

---

## Security Testing Requirements

### Automated Tests (CI/CD)

```bash
# Add to package.json scripts
{
  "test:security": "pnpm run test:secrets && pnpm run test:xss && pnpm run test:injection",
  "test:secrets": "jest --testMatch='**/*.security.test.ts'",
  "test:xss": "jest --testMatch='**/*.xss.test.ts'",
  "test:injection": "jest --testMatch='**/*.injection.test.ts'"
}
```

### Pre-Commit Hooks

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Check for secrets
echo "🔍 Scanning for secrets..."
pnpm run check:secrets || exit 1

# Run security tests
echo "🔒 Running security tests..."
pnpm run test:security || exit 1
```

### Security Scanners

```bash
# Install tools
pnpm add -D eslint-plugin-security
pnpm add -D @microsoft/eslint-plugin-sdl

# Run regularly
npm audit --audit-level=moderate
pnpm dlx trufflehog git file://. --since_commit HEAD~10
```

---

## Security Metrics & Monitoring

### Key Metrics to Track

| Metric                  | Current | Target   | How to Measure         |
| ----------------------- | ------- | -------- | ---------------------- |
| Secret Exposures        | Unknown | 0        | Automated log scanning |
| XSS Vulnerabilities     | Unknown | 0        | OWASP ZAP scan         |
| Cache Collisions        | Unknown | < 1/year | Cache statistics       |
| Sensitive Data in Cache | Unknown | 0        | Cache audit tool       |
| Validation Bypasses     | Unknown | 0        | Fuzz testing           |

### Monitoring Dashboard

```typescript
// Track in production
export interface SecurityMetrics {
  secretsRedacted: number
  sensitiveCacheBlocked: number
  xssBlocked: number
  validationErrors: number
  auditLogSize: number
}

// Alert on anomalies
if (metrics.secretsRedacted > 100) {
  alert('High secret redaction rate - investigate')
}
```

---

## Go-Live Checklist

Before consolidation can proceed:

### Critical Requirements (P0)

- [ ] Secret detection implemented and tested
- [ ] Sensitive field filtering added to ValidationError
- [ ] DOMPurify integrated for untrusted HTML
- [ ] 100% pass rate on security regression tests
- [ ] No secrets in test log output
- [ ] XSS test vectors all blocked
- [ ] Security team sign-off

### High Priority (P1)

- [ ] SecureCache wrapper created
- [ ] Stronger hash function implemented
- [ ] Validation XSS protection added
- [ ] Penetration test passed
- [ ] Security documentation updated

### Medium Priority (P2)

- [ ] Context size limits added
- [ ] CSP helpers implemented
- [ ] Security monitoring deployed
- [ ] Incident response plan tested

### Continuous Requirements

- [ ] All new code passes security linter
- [ ] No hardcoded secrets detected
- [ ] Dependencies scanned weekly
- [ ] Security training completed by team

---

## Risk Mitigation

### If Timeline Pressure

**Minimum Viable Security (MVS):**

1. Secret detection (2 days) - MUST HAVE
2. Sensitive field filtering (1 day) - MUST HAVE
3. DOMPurify integration (1 day) - MUST HAVE
4. Security regression tests (1 day) - MUST HAVE

**Total MVS: 5 days minimum**

Cannot proceed without these 4 items.

### If Security Issues Found

**Rollback Plan:**

1. Stop consolidation immediately
2. Assess severity (CVSS score)
3. If Critical/High: Rollback to previous version
4. Fix in isolation
5. Re-test before resuming
6. Document in security advisory

### If Resources Limited

**Prioritization:**

1. Focus on P0 (secret leakage, XSS)
2. P1 items can be done in parallel with Phase 1
3. P2 items can be deferred to Phase 4-5
4. Do NOT skip P0 items

---

## Success Criteria

### Quantitative Metrics

- ✅ 0 secrets in logs (verified by scanner)
- ✅ 0 XSS vulnerabilities (verified by OWASP ZAP)
- ✅ 0 sensitive data in validation errors
- ✅ 100% security test pass rate
- ✅ < 5ms performance overhead for security

### Qualitative Metrics

- ✅ Security team approval
- ✅ Penetration test report: "No critical/high issues"
- ✅ Code review: "Security patterns followed"
- ✅ Documentation: "Security guide complete"

---

## Contacts & Resources

**Security Team:** security@clarity-chat.com **Incident Response:** incidents@clarity-chat.com
**Escalation:** CTO, CISO

**Resources:**

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Secret Detection: https://trufflesecurity.com/trufflehog
- XSS Prevention:
  https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- Secure Coding: https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/

---

## Appendix: Quick Security Checks

### Before Each Commit

```bash
# 1. Check for secrets
git diff | grep -iE "(password|secret|api[_-]?key|token)" && echo "⚠️ Potential secret!"

# 2. Lint security
pnpm eslint --plugin security --fix

# 3. Run security tests
pnpm test:security
```

### Before Each PR

```bash
# 1. Full security scan
pnpm run check:secrets
pnpm audit
npm audit --audit-level=moderate

# 2. All tests
pnpm test

# 3. Generate security report
pnpm run test:security --coverage
```

### Before Each Release

```bash
# 1. Dependency audit
pnpm audit --audit-level=low
pnpm outdated

# 2. SAST scan
# (Configure CodeQL, Semgrep, or Snyk)

# 3. Penetration test
# (Run OWASP ZAP, Burp Suite)

# 4. Sign-off
# Security team review and approval
```

---

**Document Version:** 1.0 **Last Updated:** 2026-01-25 **Next Review:** Before Phase 1 consolidation
begins **Status:** 🔴 BLOCKED - Awaiting security fixes
