# Security Module

Comprehensive security implementation for the Clarity Chat documentation site API.

## Overview

This module provides defense-in-depth security controls to protect against common web application
vulnerabilities:

- **Input Sanitization**: DOMPurify-based XSS prevention
- **Rate Limiting**: Redis-backed sliding window rate limiting
- **Injection Detection**: SQL, command, and prompt injection detection
- **Input Validation**: Length limits and format validation
- **Session Security**: UUID validation and sanitization

## Modules

### `sanitize.ts`

DOMPurify-based sanitization for user inputs.

**Key Functions:**

```typescript
// Sanitize user queries (strips ALL HTML)
sanitizeUserQuery(query: string): string

// Sanitize chat messages (allows basic formatting)
sanitizeChatMessage(message: string): string

// Create injection-safe prompts
createStructuredPrompt(userQuery: string, context?: string): string

// Validate session IDs
sanitizeSessionId(sessionId: string): string | null

// Sanitize user IDs
sanitizeUserId(userId: string): string

// Detect injection patterns
detectInjectionPatterns(input: string): { detected: boolean; patterns: string[] }
```

**Security Controls:**

- Strips all HTML tags from queries (XSS prevention)
- Allows only safe tags in messages (`<b>`, `<i>`, `<em>`, `<strong>`, `<code>`)
- Limits input length (500 chars for queries, 4KB for messages)
- Detects SQL injection patterns
- Detects command injection patterns
- Detects prompt injection patterns
- Detects path traversal attempts
- Uses structured prompts with clear delimiters

### `rate-limit.ts`

Redis-based rate limiting using Upstash.

**Key Functions:**

```typescript
// Check rate limit for docs-assistant API
checkDocsApiRateLimit(identifier: string): Promise<RateLimitResult>

// Check rate limit for live-demo-chat API
checkLiveDemoRateLimit(identifier: string): Promise<RateLimitResult>

// Get client identifier from request
getClientIdentifier(request: Request, userId?: string): string

// Create rate limit headers
createRateLimitHeaders(result: RateLimitResult): Record<string, string>
```

**Configuration:**

```bash
# Required environment variables
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here

# Optional configuration
DOCS_API_RATE_LIMIT=10      # Requests per minute (default: 10)
LIVE_DEMO_RATE_LIMIT=10     # Requests per minute (default: 10)
```

**Rate Limits:**

- **Default**: 10 requests per minute per IP/user
- **Algorithm**: Sliding window (more accurate than fixed window)
- **Fallback**: In-memory rate limiting when Redis unavailable
- **Distributed**: Works across multiple server instances

**Security Controls:**

- Sliding window algorithm prevents burst attacks
- Redis-backed for distributed rate limiting
- In-memory fallback prevents service disruption
- Rate limit headers inform clients of limits
- Automatic cleanup prevents memory leaks
- Supports both IP and user ID identification

## Usage

### Sanitizing User Input

```typescript
import { sanitizeUserQuery, sanitizeChatMessage } from '@/lib/security/sanitize'

// For search queries
const query = sanitizeUserQuery(userInput)

// For chat messages
const message = sanitizeChatMessage(userInput)
```

### Rate Limiting

```typescript
import {
  checkDocsApiRateLimit,
  getClientIdentifier,
  createRateLimitHeaders,
} from '@/lib/security/rate-limit'

// In API route
const identifier = getClientIdentifier(request, userId)
const result = await checkDocsApiRateLimit(identifier)

if (!result.allowed) {
  return Response.json(
    { error: 'Rate limit exceeded' },
    {
      status: 429,
      headers: createRateLimitHeaders(result),
    }
  )
}
```

### Injection Detection

```typescript
import { detectInjectionPatterns } from '@/lib/security/sanitize'

const check = detectInjectionPatterns(userInput)

if (check.detected) {
  console.warn('Malicious input detected:', check.patterns)
  return Response.json({ error: 'Invalid input detected' }, { status: 400 })
}
```

## Security Best Practices

### Defense in Depth

This module implements multiple layers of security:

1. **Input Validation**: Check format and length
2. **Injection Detection**: Pattern-based detection
3. **Sanitization**: DOMPurify removes dangerous content
4. **Rate Limiting**: Prevent abuse and DoS
5. **Structured Prompts**: Prevent prompt injection

### OWASP Top 10 Coverage

- **A01: Broken Access Control**: Rate limiting prevents abuse
- **A03: Injection**: SQL, command, and prompt injection detection
- **A04: Insecure Design**: Structured prompts and validation
- **A05: Security Misconfiguration**: Secure defaults and headers
- **A07: XSS**: DOMPurify sanitization

### Error Handling

Never leak sensitive information in errors:

```typescript
// ✅ Good - Generic error message
return Response.json({ error: 'Invalid input detected' }, { status: 400 })

// ❌ Bad - Exposes internals
return Response.json({ error: `SQL error at line 42: ${dbError}` }, { status: 500 })
```

### Logging

Log security events without sensitive data:

```typescript
// ✅ Good - No sensitive data
logger.warn('Malicious input detected', {
  patterns: ['SQL Injection'],
  timestamp: new Date().toISOString(),
})

// ❌ Bad - Logs user input
logger.warn(`Malicious input: ${userInput}`)
```

## Testing

Run security tests:

```bash
# Run all security tests
pnpm test lib/security/__tests__

# Run sanitization tests
pnpm test lib/security/__tests__/sanitize.test.ts

# Run rate limiting tests
pnpm test lib/security/__tests__/rate-limit.test.ts

# Run integration tests
pnpm test lib/security/__tests__/api-security.test.ts
```

## Performance

### Sanitization

- **DOMPurify**: ~1ms per query
- **Pattern Detection**: ~0.1ms per query
- **Total Overhead**: < 2ms per request

### Rate Limiting

- **Redis**: ~2-5ms per check (network latency)
- **In-memory Fallback**: < 0.1ms per check
- **Cache**: Results cached in memory

## Monitoring

Monitor security metrics:

- **Rate Limit Hits**: Track 429 responses
- **Injection Attempts**: Log detected patterns
- **Failed Validations**: Track 400 errors
- **Redis Health**: Monitor connection status

## Troubleshooting

### Redis Connection Issues

If Redis is unavailable:

1. Check `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
2. System automatically falls back to in-memory rate limiting
3. Check logs for "Rate limiting disabled" warnings

### False Positives

If legitimate input is blocked:

1. Check `detectInjectionPatterns` patterns
2. Adjust patterns in `sanitize.ts`
3. Consider context-specific validation

### Rate Limit Too Strict

To adjust rate limits:

```bash
# Increase to 20 requests per minute
DOCS_API_RATE_LIMIT=20
LIVE_DEMO_RATE_LIMIT=20
```

## Security Checklist

- [x] All user inputs sanitized with DOMPurify
- [x] Rate limiting enforced on all API endpoints
- [x] Input validation for length and format
- [x] SQL injection detection
- [x] Command injection detection
- [x] Prompt injection detection
- [x] Path traversal prevention
- [x] Session ID validation (UUID format)
- [x] User ID sanitization
- [x] Structured prompts prevent injection
- [x] Error messages don't leak secrets
- [x] Rate limit headers in responses
- [x] Redis-backed distributed rate limiting
- [x] In-memory fallback for resilience
- [x] Comprehensive test coverage

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [Upstash Rate Limiting](https://upstash.com/docs/redis/features/ratelimiting)
- [Prompt Injection Prevention](https://simonwillison.net/2023/Apr/14/worst-that-can-happen/)
