# Security Headers

> **Wave 3.4 Enhancement** | **Status**: ✅ Complete | **Updated**: January 26, 2026

## Overview

Wave 3.4 added comprehensive security headers to all routes, implementing defense-in-depth against
common web vulnerabilities including XSS, clickjacking, MIME-sniffing, and unauthorized feature
access.

## Headers Applied

### X-Content-Type-Options

```http
X-Content-Type-Options: nosniff
```

**Purpose**: Prevents MIME-sniffing attacks where browsers try to guess content types.

**Protection Against**:

- Malicious JavaScript execution via misinterpreted file types
- Content-Type confusion attacks
- Drive-by downloads

**Implementation**:

```typescript
// apps/streamlined-docs/middleware.ts
response.headers.set('X-Content-Type-Options', 'nosniff')
```

### Permissions-Policy

```http
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
```

**Purpose**: Restricts browser feature access to prevent unauthorized use of sensitive APIs.

**Disabled Features**:

- `camera=()` - No camera access
- `microphone=()` - No microphone access
- `geolocation=()` - No location tracking
- `payment=()` - No payment API access

**Why**: Documentation sites don't need these features. Denying access reduces attack surface.

**Implementation**:

```typescript
// apps/streamlined-docs/middleware.ts
response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()')
```

### Content-Security-Policy (CSP)

```http
Content-Security-Policy: default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://api.openai.com https://api.anthropic.com;
```

**Purpose**: Prevents XSS attacks by controlling resource loading.

**Policy Breakdown**:

- `default-src 'self'` - Only load resources from same origin by default
- `script-src 'self' 'unsafe-inline' 'unsafe-eval'` - Required for Next.js (working to remove unsafe
  directives)
- `style-src 'self' 'unsafe-inline'` - Allow inline styles (used by Tailwind)
- `img-src 'self' data: https:` - Allow images from all HTTPS sources
- `connect-src` - Whitelist AI API endpoints

**Trade-offs**:

- `'unsafe-inline'` and `'unsafe-eval'` reduce CSP effectiveness
- Required for Next.js build system
- Future: Migrate to nonce-based CSP

**Implementation**:

```typescript
// apps/streamlined-docs/middleware.ts
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://api.openai.com https://api.anthropic.com",
].join('; ')

response.headers.set('Content-Security-Policy', csp)
```

### X-Frame-Options

```http
X-Frame-Options: DENY
```

**Purpose**: Prevents clickjacking attacks by disallowing embedding in iframes.

**Implementation**:

```typescript
// apps/streamlined-docs/middleware.ts
response.headers.set('X-Frame-Options', 'DENY')
```

**Note**: Modern browsers prefer CSP `frame-ancestors` directive, but X-Frame-Options provides
fallback for older browsers.

---

## CSRF Protection

All mutating API requests (POST, PUT, DELETE) require a CSRF token to prevent cross-site request
forgery attacks.

### Client-Side Usage

The `apiFetch` wrapper automatically includes CSRF tokens:

```typescript
// apps/streamlined-docs/lib/api-client.ts
import { apiFetch } from '@/lib/api-client'

// Automatically includes CSRF token in X-CSRF-Token header
const response = await apiFetch('/api/docs-assistant', {
  method: 'POST',
  body: JSON.stringify({ query: 'What is Clarity?' }),
})
```

### Server-Side Validation

Middleware validates CSRF tokens automatically:

```typescript
// apps/streamlined-docs/middleware.ts
import { validateCsrfToken } from '@/lib/csrf'

export function middleware(request: NextRequest) {
  // Skip validation for GET/HEAD/OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return NextResponse.next()
  }

  // Validate CSRF token
  const token = request.headers.get('X-CSRF-Token')
  if (!validateCsrfToken(token)) {
    return new NextResponse('Invalid CSRF token', { status: 403 })
  }

  return NextResponse.next()
}
```

### Token Generation

CSRF tokens are generated per session and stored in HttpOnly cookies:

```typescript
// apps/streamlined-docs/lib/csrf.ts
import { randomBytes } from 'crypto'

export function generateCsrfToken(): string {
  return randomBytes(32).toString('hex')
}

export function setCsrfCookie(response: NextResponse, token: string): void {
  response.cookies.set('csrf-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
  })
}
```

---

## Secure Cookies

All cookies use security best practices:

### Cookie Attributes

```typescript
// Example cookie configuration
response.cookies.set('session', sessionId, {
  httpOnly: true, // Not accessible via JavaScript
  secure: true, // HTTPS only (production)
  sameSite: 'strict', // CSRF protection
  maxAge: 60 * 60 * 24, // 24 hours
  path: '/', // Available site-wide
})
```

### Attribute Explanations

| Attribute  | Purpose                                    | Value               |
| ---------- | ------------------------------------------ | ------------------- |
| `httpOnly` | Prevents XSS attacks from stealing cookies | `true`              |
| `secure`   | Ensures cookies only sent over HTTPS       | `true` (production) |
| `sameSite` | Prevents CSRF attacks                      | `'strict'`          |
| `maxAge`   | Limits session lifetime                    | `86400` (24 hours)  |
| `path`     | Limits cookie scope                        | `'/'`               |

### Security Benefits

1. **XSS Protection**: `httpOnly` prevents JavaScript access to cookies
2. **MITM Protection**: `secure` prevents cookie transmission over HTTP
3. **CSRF Protection**: `sameSite: 'strict'` blocks cross-site requests
4. **Session Expiry**: `maxAge` limits damage from stolen sessions

---

## Testing Security Headers

### Manual Testing

```bash
# Check all security headers
curl -I http://localhost:3000/ | grep -i "x-content\|permissions\|content-security\|x-frame"

# Expected output:
# X-Content-Type-Options: nosniff
# Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
# Content-Security-Policy: default-src 'self'; ...
# X-Frame-Options: DENY
```

### Automated Testing

```bash
# Run security test suite
pnpm test tests/security/

# Run specific header tests
pnpm test tests/security/headers.test.ts
```

### Security Header Scanner

Use online tools to verify header configuration:

- [Security Headers](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)

---

## Testing CSRF Protection

### Manual Testing

```bash
# Should fail (no token)
curl -X POST http://localhost:3000/api/docs-assistant \
  -H "Content-Type: application/json" \
  -d '{"query":"test"}'

# Expected: 403 Forbidden

# Should succeed (with valid token)
# 1. Get CSRF token from cookie
# 2. Include in X-CSRF-Token header
curl -X POST http://localhost:3000/api/docs-assistant \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: <token-from-cookie>" \
  -H "Cookie: csrf-token=<token-from-cookie>" \
  -d '{"query":"test"}'

# Expected: 200 OK with response
```

### Automated Testing

```typescript
// tests/security/csrf.test.ts
import { describe, it, expect } from 'vitest'

describe('CSRF Protection', () => {
  it('blocks requests without CSRF token', async () => {
    const response = await fetch('/api/docs-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'test' }),
    })

    expect(response.status).toBe(403)
  })

  it('allows requests with valid CSRF token', async () => {
    // Get CSRF token
    const token = await getCsrfToken()

    const response = await fetch('/api/docs-assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': token,
      },
      body: JSON.stringify({ query: 'test' }),
    })

    expect(response.status).toBe(200)
  })
})
```

---

## Security Checklist

Use this checklist to verify security header implementation:

- [ ] `X-Content-Type-Options: nosniff` present on all responses
- [ ] `Permissions-Policy` restricts unnecessary features
- [ ] `Content-Security-Policy` configured with minimal `unsafe-*` directives
- [ ] `X-Frame-Options: DENY` prevents clickjacking
- [ ] CSRF tokens validated on all mutating requests (POST/PUT/DELETE)
- [ ] All cookies have `HttpOnly`, `Secure`, and `SameSite=Strict`
- [ ] Security headers tested with automated tests
- [ ] Headers validated with online security scanners
- [ ] CSP violations monitored in production

---

## Common Issues & Solutions

### Issue: CSP Blocks Inline Scripts

**Symptom**: Console errors about blocked inline scripts.

**Cause**: Strict CSP policy without `'unsafe-inline'`.

**Solution**: Use nonce-based CSP or hash-based CSP:

```typescript
// Generate nonce
const nonce = randomBytes(16).toString('base64')

// Add to CSP
const csp = `script-src 'self' 'nonce-${nonce}'`

// Use in script tags
<script nonce={nonce}>...</script>
```

### Issue: CSRF Token Mismatch

**Symptom**: API requests fail with 403 Forbidden.

**Cause**: Token in header doesn't match cookie.

**Solution**: Ensure token is read from cookie and included in header:

```typescript
// Get token from cookie
const token = document.cookie
  .split('; ')
  .find((row) => row.startsWith('csrf-token='))
  ?.split('=')[1]

// Include in request
fetch('/api/endpoint', {
  method: 'POST',
  headers: { 'X-CSRF-Token': token },
})
```

### Issue: Cookies Not Sent in Cross-Origin Requests

**Symptom**: CSRF token missing in requests from different subdomain.

**Cause**: `SameSite=Strict` blocks cross-site cookie sending.

**Solution**: Use `SameSite=Lax` for same-site but cross-origin scenarios:

```typescript
response.cookies.set('csrf-token', token, {
  sameSite: 'lax', // Allows cookies on top-level navigation
})
```

---

## Performance Impact

Security headers have minimal performance impact:

- **Header Size**: ~200 bytes per response
- **Validation Time**: <1ms for CSRF token validation
- **Cookie Overhead**: ~100 bytes per request

**Recommendation**: Always enable security headers. The protection far outweighs the negligible
performance cost.

---

## Future Improvements

1. **Migrate to Nonce-Based CSP**: Remove `'unsafe-inline'` and `'unsafe-eval'`
2. **Add CSP Reporting**: Monitor violations with `report-uri` or `report-to`
3. **Implement Subresource Integrity**: Add `integrity` attributes to external scripts
4. **Enable HSTS**: Add `Strict-Transport-Security` header for HTTPS enforcement
5. **Add Expect-CT**: Certificate Transparency monitoring

---

## Related Documentation

- [Data Validation Patterns](./data-validation.md) - Zod schema validation
- [Security Best Practices](../security/best-practices.md) - OWASP compliance
- [Security Runbook](../runbooks/security.md) - Security audit procedures

---

## References

- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [MDN: HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

---

**Last Updated**: January 26, 2026 (Wave 3.4 Security Hardening)
