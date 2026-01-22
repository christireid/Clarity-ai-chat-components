# Tool Security Guide

**Version**: 1.0
**Last Updated**: 2026-01-22
**Status**: 🔴 REQUIRED READING FOR ALL TOOL DEVELOPERS

---

## Table of Contents

1. [Overview](#overview)
2. [Security Principles](#security-principles)
3. [Common Vulnerabilities](#common-vulnerabilities)
4. [Secure Tool Development](#secure-tool-development)
5. [Input Validation](#input-validation)
6. [Output Sanitization](#output-sanitization)
7. [Resource Management](#resource-management)
8. [Approval Requirements](#approval-requirements)
9. [Security Checklist](#security-checklist)
10. [Examples](#examples)

---

## Overview

Tools in the Clarity AI Chat system execute on behalf of users with their permissions. **A vulnerable tool can compromise the entire application and user data**. This guide provides security requirements and best practices for tool developers.

### Critical Security Rule

**⚠️ NEVER TRUST USER INPUT ⚠️**

All tool parameters come from:
- User messages (untrusted)
- LLM outputs (untrusted)
- External APIs (untrusted)

Every parameter must be validated, sanitized, and treated as potentially malicious.

---

## Security Principles

### 1. Principle of Least Privilege
- Tools should request minimum necessary permissions
- Scope access to specific resources only
- Never run with elevated privileges by default

### 2. Defense in Depth
- Multiple layers of validation
- Fail securely (deny by default)
- Validate at boundaries (input, output, API calls)

### 3. Secure by Default
- Safe configuration out of the box
- Opt-in for dangerous features
- Clear warnings for risky operations

### 4. Fail Safely
- Errors should not expose sensitive information
- Failed operations should not leave system in unsafe state
- Always clean up resources on error

---

## Common Vulnerabilities

### 🔴 CRITICAL: Code Injection

**DON'T:**
```typescript
// VULNERABLE to arbitrary code execution
export const evalTool = createTool({
  name: 'eval',
  execute: async ({ code }) => {
    return eval(code) // ❌ NEVER DO THIS
  }
})
```

**DO:**
```typescript
// Use safe alternatives
export const mathTool = createTool({
  name: 'calculate',
  execute: async ({ expression }) => {
    // Use a safe expression parser like mathjs or expr-eval
    const { evaluate } = await import('mathjs')
    return evaluate(expression)
  }
})
```

### 🔴 CRITICAL: SQL Injection

**DON'T:**
```typescript
// VULNERABLE to SQL injection
export const queryTool = createTool({
  name: 'query_db',
  execute: async ({ userId }) => {
    const query = `SELECT * FROM users WHERE id = '${userId}'` // ❌ UNSAFE
    return db.query(query)
  }
})
```

**DO:**
```typescript
// Use parameterized queries
export const queryTool = createTool({
  name: 'query_db',
  execute: async ({ userId }) => {
    // Validate input
    if (!/^\d+$/.test(userId)) {
      throw new Error('Invalid user ID format')
    }
    // Use parameterized query
    return db.query('SELECT * FROM users WHERE id = ?', [userId])
  }
})
```

### 🔴 CRITICAL: Command Injection

**DON'T:**
```typescript
// VULNERABLE to command injection
export const fileTool = createTool({
  name: 'read_file',
  execute: async ({ filename }) => {
    const output = await exec(`cat ${filename}`) // ❌ UNSAFE
    return output
  }
})
```

**DO:**
```typescript
// Use safe file APIs
export const fileTool = createTool({
  name: 'read_file',
  execute: async ({ filename }) => {
    // Validate filename (no path traversal)
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      throw new Error('Invalid filename')
    }
    // Use safe Node.js APIs
    const { readFile } = await import('fs/promises')
    return readFile(join(SAFE_DIR, filename), 'utf-8')
  }
})
```

### 🟠 HIGH: Path Traversal

**DON'T:**
```typescript
// VULNERABLE to path traversal
export const fileTool = createTool({
  name: 'read_file',
  execute: async ({ path }) => {
    return fs.readFileSync(path, 'utf-8') // ❌ Can read any file
  }
})
```

**DO:**
```typescript
import { resolve, normalize, relative } from 'path'

export const fileTool = createTool({
  name: 'read_file',
  execute: async ({ path }) => {
    const SAFE_DIR = '/app/user-files'

    // Normalize and resolve path
    const normalized = normalize(path)
    const resolved = resolve(SAFE_DIR, normalized)

    // Ensure resolved path is within safe directory
    const rel = relative(SAFE_DIR, resolved)
    if (rel.startsWith('..') || path.isAbsolute(rel)) {
      throw new Error('Access denied: path outside safe directory')
    }

    return fs.readFileSync(resolved, 'utf-8')
  }
})
```

### 🟠 HIGH: Cross-Site Scripting (XSS)

**DON'T:**
```typescript
// VULNERABLE to XSS if result contains user input
export const searchTool = createTool({
  name: 'search',
  execute: async ({ query }) => {
    return `<div>Results for: ${query}</div>` // ❌ Unescaped HTML
  }
})
```

**DO:**
```typescript
import DOMPurify from 'dompurify'

export const searchTool = createTool({
  name: 'search',
  execute: async ({ query }) => {
    // Return plain text or sanitize HTML
    return {
      query: DOMPurify.sanitize(query),
      results: []
    }
  }
})
```

### 🟡 MEDIUM: Denial of Service (DoS)

**DON'T:**
```typescript
// VULNERABLE to DoS via resource exhaustion
export const generateTool = createTool({
  name: 'generate',
  execute: async ({ count }) => {
    const items = []
    for (let i = 0; i < count; i++) { // ❌ Unbounded loop
      items.push(await expensiveOperation())
    }
    return items
  }
})
```

**DO:**
```typescript
export const generateTool = createTool({
  name: 'generate',
  execute: async ({ count }) => {
    // Validate and limit resource usage
    const MAX_COUNT = 100
    if (count > MAX_COUNT) {
      throw new Error(`Count must be <= ${MAX_COUNT}`)
    }

    const items = []
    for (let i = 0; i < count; i++) {
      items.push(await expensiveOperation())
    }
    return items
  }
})
```

---

## Secure Tool Development

### Tool Template

```typescript
import { z } from 'zod'
import { createTool } from '@clarity-chat/tools'
import DOMPurify from 'dompurify'

export const secureTool = createTool({
  name: 'secure_example',
  description: 'A secure tool template',

  // 1. Define strict schema
  schema: z.object({
    userId: z.string().regex(/^\d+$/, 'User ID must be numeric'),
    action: z.enum(['read', 'write']),
    data: z.string().max(1000, 'Data must be <= 1000 characters')
  }),

  // 2. Require approval for sensitive operations
  requiresApproval: true,

  // 3. Set timeout to prevent hangs
  timeout: 10000, // 10 seconds

  execute: async ({ userId, action, data }, context) => {
    // 4. Additional runtime validation
    if (!context.user || context.user.id !== userId) {
      throw new Error('Unauthorized: user ID mismatch')
    }

    // 5. Sanitize inputs
    const sanitizedData = DOMPurify.sanitize(data)

    try {
      // 6. Perform operation with timeout
      const result = await performOperation(action, sanitizedData)

      // 7. Sanitize outputs
      return {
        success: true,
        result: DOMPurify.sanitize(result)
      }
    } catch (error) {
      // 8. Safe error handling (no sensitive info)
      console.error('[secureTool] Error:', error)
      throw new Error('Operation failed. Please try again.')
    }
  }
})
```

---

## Input Validation

### Always Validate

```typescript
import { z } from 'zod'

// Use Zod for runtime validation
const schema = z.object({
  // String validation
  username: z.string()
    .min(3, 'Username too short')
    .max(20, 'Username too long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Invalid characters'),

  // Number validation with range
  age: z.number()
    .int('Age must be integer')
    .min(0, 'Age must be positive')
    .max(150, 'Age too large'),

  // Email validation
  email: z.string().email('Invalid email'),

  // URL validation
  website: z.string().url('Invalid URL'),

  // Enum validation (allowlist)
  role: z.enum(['user', 'admin', 'guest']),

  // Array validation with constraints
  tags: z.array(z.string()).max(10, 'Too many tags'),

  // Optional fields
  bio: z.string().max(500).optional()
})
```

### Allowlists vs Denylists

**✅ Prefer Allowlists:**
```typescript
// GOOD: Only allow specific values
const allowedActions = ['read', 'write', 'delete']
if (!allowedActions.includes(action)) {
  throw new Error('Invalid action')
}
```

**❌ Avoid Denylists:**
```typescript
// BAD: Easy to bypass
const forbiddenChars = ['<', '>', '&']
if (forbiddenChars.some(char => input.includes(char))) {
  throw new Error('Invalid characters')
}
// Attacker can use Unicode: \u003C instead of <
```

---

## Output Sanitization

### HTML Output

```typescript
import DOMPurify from 'dompurify'

// Always sanitize user-controlled HTML
const sanitized = DOMPurify.sanitize(userInput, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
  ALLOWED_ATTR: ['href']
})
```

### JSON Output

```typescript
// Ensure safe JSON serialization
function safeJSONStringify(obj: unknown): string {
  return JSON.stringify(obj, (key, value) => {
    // Remove sensitive keys
    if (key === 'password' || key === 'secret') {
      return '[REDACTED]'
    }
    // Prevent prototype pollution
    if (key === '__proto__' || key === 'constructor') {
      return undefined
    }
    return value
  })
}
```

---

## Resource Management

### Timeouts

```typescript
export const apiTool = createTool({
  name: 'api_call',
  timeout: 10000, // Always set timeout
  execute: async ({ url }) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 9000)

    try {
      const response = await fetch(url, { signal: controller.signal })
      return response.json()
    } finally {
      clearTimeout(timeoutId)
    }
  }
})
```

### Rate Limiting

```typescript
const rateLimiter = new Map<string, number>()

export const rateLimitedTool = createTool({
  name: 'limited',
  execute: async (params, context) => {
    const userId = context.user?.id
    if (!userId) throw new Error('Unauthorized')

    // Check rate limit
    const lastCall = rateLimiter.get(userId) || 0
    const now = Date.now()
    if (now - lastCall < 1000) {
      throw new Error('Rate limit exceeded. Try again in 1 second.')
    }

    rateLimiter.set(userId, now)

    // Perform operation
    return await performOperation()
  }
})
```

### Memory Limits

```typescript
export const fileTool = createTool({
  name: 'read_file',
  execute: async ({ filename }) => {
    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

    const stats = await fs.stat(filename)
    if (stats.size > MAX_FILE_SIZE) {
      throw new Error('File too large (max 10MB)')
    }

    return fs.readFile(filename, 'utf-8')
  }
})
```

---

## Approval Requirements

### When to Require Approval

Tools should require user approval if they:

1. **Modify data**: Write, update, or delete operations
2. **Access sensitive information**: Personal data, credentials, etc.
3. **Perform irreversible actions**: Send emails, make purchases, etc.
4. **Make external API calls**: Especially paid or rate-limited APIs
5. **Execute code**: Any form of code execution
6. **Access filesystem**: Read or write files
7. **Network operations**: Make HTTP requests

### Implementation

```typescript
export const sensitiveToolcreate Tool({
  name: 'delete_account',
  description: 'Permanently delete user account',

  // Require approval
  requiresApproval: true,

  // Add clear warning
  approvalMessage: '⚠️ This will PERMANENTLY delete your account and all data. This cannot be undone.',

  execute: async ({ userId }, context) => {
    // Double-check approval status
    if (!context.approved) {
      throw new Error('Operation requires approval')
    }

    // Perform operation
    await deleteAccount(userId)
    return { success: true }
  }
})
```

---

## Security Checklist

Before deploying a tool, verify:

### Input Security
- [ ] All parameters validated with Zod schema
- [ ] String lengths limited
- [ ] Numbers have min/max bounds
- [ ] Enums used for fixed choices (allowlists)
- [ ] No direct string concatenation in queries
- [ ] File paths validated (no traversal)
- [ ] URLs validated and limited to allowed domains

### Output Security
- [ ] HTML content sanitized with DOMPurify
- [ ] Sensitive data redacted from outputs
- [ ] Error messages don't expose internal details
- [ ] JSON serialization is safe

### Resource Management
- [ ] Timeout set (< 30 seconds recommended)
- [ ] Memory limits enforced
- [ ] Rate limiting implemented
- [ ] Cleanup handlers for resources
- [ ] AbortSignal supported

### Authorization
- [ ] User context validated
- [ ] Approval required for sensitive operations
- [ ] Permissions checked before execution
- [ ] Audit logging implemented

### Error Handling
- [ ] Try-catch around all async operations
- [ ] Finally blocks for cleanup
- [ ] Safe error messages (no stack traces)
- [ ] Failed operations don't leave partial state

---

## Examples

### Example 1: Secure Weather Tool

```typescript
import { z } from 'zod'
import { createTool } from '@clarity-chat/tools'

export const weatherTool = createTool({
  name: 'get_weather',
  description: 'Get current weather for a location',

  schema: z.object({
    location: z.string()
      .min(2, 'Location too short')
      .max(100, 'Location too long')
      .regex(/^[a-zA-Z0-9\s,.-]+$/, 'Invalid location format')
  }),

  timeout: 5000,

  execute: async ({ location }) => {
    // Sanitize location for API call
    const sanitized = location.replace(/[^\w\s,.-]/g, '')

    try {
      const response = await fetch(
        `https://api.weather.com/v1/current?location=${encodeURIComponent(sanitized)}`,
        {
          signal: AbortSignal.timeout(4000),
          headers: {
            'Authorization': `Bearer ${process.env.WEATHER_API_KEY}`
          }
        }
      )

      if (!response.ok) {
        throw new Error('Weather API request failed')
      }

      const data = await response.json()

      // Return safe subset of data
      return {
        location: sanitized,
        temperature: data.temperature,
        conditions: data.conditions
      }
    } catch (error) {
      console.error('[weatherTool] Error:', error)
      throw new Error('Failed to fetch weather data')
    }
  }
})
```

### Example 2: Secure File Tool

```typescript
import { z } from 'zod'
import { createTool } from '@clarity-chat/tools'
import { resolve, normalize, relative } from 'path'
import { readFile } from 'fs/promises'

const SAFE_DIR = '/app/user-files'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export const readFileTool = createTool({
  name: 'read_file',
  description: 'Read a file from user directory',

  schema: z.object({
    filename: z.string()
      .min(1, 'Filename required')
      .max(255, 'Filename too long')
      .regex(/^[a-zA-Z0-9._-]+$/, 'Invalid filename')
  }),

  requiresApproval: true,
  timeout: 10000,

  execute: async ({ filename }, context) => {
    // Validate user context
    if (!context.user) {
      throw new Error('Unauthorized')
    }

    // Prevent path traversal
    const normalized = normalize(filename)
    if (normalized.includes('..') || normalized.includes('/') || normalized.includes('\\')) {
      throw new Error('Invalid filename: path traversal detected')
    }

    // Build safe path
    const userDir = resolve(SAFE_DIR, context.user.id)
    const filePath = resolve(userDir, normalized)

    // Verify path is within user directory
    const rel = relative(userDir, filePath)
    if (rel.startsWith('..') || path.isAbsolute(rel)) {
      throw new Error('Access denied')
    }

    try {
      // Check file size
      const stats = await fs.stat(filePath)
      if (stats.size > MAX_FILE_SIZE) {
        throw new Error(`File too large (max ${MAX_FILE_SIZE / 1024 / 1024}MB)`)
      }

      // Read file
      const content = await readFile(filePath, 'utf-8')

      return {
        filename,
        size: stats.size,
        content
      }
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        throw new Error('File not found')
      }
      console.error('[readFileTool] Error:', error)
      throw new Error('Failed to read file')
    }
  }
})
```

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE/SANS Top 25](https://cwe.mitre.org/top25/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Zod Documentation](https://zod.dev/)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)

---

## Questions?

If you have security questions or need to report a vulnerability:

1. **Security issues**: Report privately to security@clarity-chat.dev
2. **General questions**: Ask in #security channel
3. **Code reviews**: Request security review before deploying sensitive tools

---

**Remember**: When in doubt, be more restrictive. It's easier to relax security than to fix a breach.
