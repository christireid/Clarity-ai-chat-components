# Security Review: bad-security.tsx

## CRITICAL VULNERABILITIES

### 1. Unvalidated Server Action (Line 9-18)
```
Risk: HIGH
Attack Vector: Malicious input could inject invalid data, escalate privileges (role field)
```

**Current Code:**
```tsx
export async function createUser(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const role = formData.get('role') as string
  await db.user.create({ data: { name, email, role } })
}
```

**Fix:**
```tsx
import { z } from 'zod'

const CreateUserSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  email: z.string().email(),
  role: z.enum(['user', 'admin']).default('user'),
})

export async function createUser(formData: FormData) {
  const parsed = CreateUserSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    role: formData.get('role'),
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten() }
  }

  await db.user.create({ data: parsed.data })
  return { success: true }
}
```

### 2. SQL Injection (Line 21-25)
```
Risk: CRITICAL
Attack Vector: Attacker passes `'; DROP TABLE users; --` as query
```

**Current Code:**
```tsx
const users = await db.$queryRaw`
  SELECT * FROM users WHERE name LIKE '%${query}%'
`
```

**Fix:**
```tsx
const users = await db.user.findMany({
  where: {
    name: { contains: query, mode: 'insensitive' }
  }
})
```

### 3. Secret Exposed to Client (Line 32)
```
Risk: CRITICAL
Attack Vector: API key visible in browser bundle, can be extracted
```

**Current Code:**
```tsx
const API_KEY = process.env.OPENAI_API_KEY
```

**Fix:**
Remove from client component. Access via Server Action or API route only.

### 4. XSS via dangerouslySetInnerHTML (Line 39-41)
```
Risk: HIGH
Attack Vector: User submits `<script>stealCookies()</script>` as message
```

**Current Code:**
```tsx
<div dangerouslySetInnerHTML={{ __html: content }} />
```

**Fix:**
```tsx
import DOMPurify from 'dompurify'

<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
```

### 5. Sensitive Action Without Confirmation (Line 44-46)
```
Risk: MEDIUM
Attack Vector: CSRF attack tricks user into clicking delete
```

**Fix:**
- Add confirmation dialog
- Require re-authentication for account deletion
- Use Server Action with CSRF token (built-in to Next.js Server Actions)

### 6. Server Environment Variable in Client (Line 52-55)
```
Risk: LOW (will be undefined, but indicates misunderstanding)
```

**Fix:**
Use `NEXT_PUBLIC_` prefix for client-safe variables, or fetch status from API.

## SUMMARY

| Issue | Severity | Line |
|-------|----------|------|
| Unvalidated Server Action | HIGH | 9-18 |
| SQL Injection | CRITICAL | 21-25 |
| Secret in Client | CRITICAL | 32 |
| XSS | HIGH | 39-41 |
| Missing Confirmation | MEDIUM | 44-46 |
| Wrong Env Var Usage | LOW | 52-55 |

**Verdict: BLOCK MERGE** - 2 critical vulnerabilities must be fixed.
