# Security Review Criteria

> Canonical security criteria for NextJS applications

## Server/Client Boundaries

### Critical Checks
- [ ] Server Actions are in files with `"use server"` directive
- [ ] Client components are marked with `"use client"` directive
- [ ] No secrets accessible from client components
- [ ] Environment variables use correct prefix (`NEXT_PUBLIC_` only for client-safe values)
- [ ] Database connections only in server code

### Code Patterns

```tsx
// CORRECT: Server Action with validation
"use server"
import { z } from 'zod'

const schema = z.object({ name: z.string().min(1) })

export async function createUser(formData: FormData) {
  const parsed = schema.safeParse({ name: formData.get('name') })
  if (!parsed.success) return { error: parsed.error.flatten() }
  // ... safe to proceed
}

// INCORRECT: Unvalidated Server Action
"use server"
export async function createUser(formData: FormData) {
  const name = formData.get('name') // Unvalidated!
  await db.user.create({ data: { name } })
}
```

## Input Validation

### Critical Checks
- [ ] All Server Action inputs validated with Zod or Valibot
- [ ] FormData properly parsed and typed
- [ ] URL parameters sanitized before use
- [ ] Database queries use parameterized statements (no string concatenation)
- [ ] File uploads validated (type, size, content)

### Validation Schema Pattern

```typescript
import { z } from 'zod'

// Define strict schemas
const UserInputSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  email: z.string().email().toLowerCase(),
  age: z.number().int().min(0).max(150).optional(),
})

// Always use safeParse, not parse
const result = UserInputSchema.safeParse(input)
if (!result.success) {
  return { error: result.error.flatten() }
}
// result.data is now typed and validated
```

## XSS Prevention

### Critical Checks
- [ ] No `dangerouslySetInnerHTML` without sanitization
- [ ] User content escaped before rendering
- [ ] HTML attributes properly sanitized
- [ ] URLs validated before use in href/src
- [ ] SVG content sanitized if user-provided

### Sanitization Pattern

```tsx
import DOMPurify from 'dompurify'

// CORRECT: Sanitized HTML
<div
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(userContent)
  }}
/>

// INCORRECT: Raw user HTML
<div dangerouslySetInnerHTML={{ __html: userContent }} />
```

## CSRF Protection

### Critical Checks
- [ ] Server Actions automatically include CSRF tokens (NextJS built-in)
- [ ] Sensitive mutations require authentication check
- [ ] Rate limiting on authentication endpoints
- [ ] Session tokens are httpOnly and secure

## Content Security Policy

### Recommended Headers

```typescript
// next.config.js or middleware.ts
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';"
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains'
  }
]
```

## Severity Levels

| Issue | Severity | Action |
|-------|----------|--------|
| Unvalidated Server Action inputs | Critical | Block merge |
| `dangerouslySetInnerHTML` without sanitization | Critical | Block merge |
| Secrets in client code | Critical | Block merge |
| Missing auth check on mutation | High | Must fix |
| No rate limiting | Medium | Should fix |
| Missing CSP headers | Medium | Should fix |
