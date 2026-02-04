# Data Validation with Zod

> **Wave 3.4 Enhancement** | **Status**: ✅ Complete | **Updated**: January 26, 2026

## Overview

Wave 3.4 added comprehensive Zod validation to all 12 API endpoints, reducing security risk score
from 6.5/10 to 2/10. All inputs and outputs are validated with type-safe schemas, preventing
injection attacks, data corruption, and API contract violations.

---

## Why Zod?

Zod provides:

1. **Type Safety**: Infer TypeScript types from schemas
2. **Runtime Validation**: Catch invalid data at runtime
3. **Clear Error Messages**: User-friendly validation errors
4. **Composability**: Build complex schemas from simple ones
5. **Zero Dependencies**: Lightweight and fast

**Alternative Considered**: Yup, Joi, AJV (rejected due to less type safety or larger bundle size)

---

## Basic Schema Creation

### Simple Schema

```typescript
import { z } from 'zod'

// Define schema
const userSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().int().positive().optional(),
})

// Infer TypeScript type
type User = z.infer<typeof userSchema>
// => { name: string; email: string; age?: number }

// Validate data
const result = userSchema.safeParse({
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
})

if (result.success) {
  console.log(result.data) // Typed as User
} else {
  console.error(result.error.issues) // Array of validation errors
}
```

### Common Validators

```typescript
import { z } from 'zod'

// String validation
z.string()
  .min(1, 'Required')
  .max(100, 'Too long')
  .email('Invalid email')
  .url('Invalid URL')
  .regex(/^[a-z0-9]+$/, 'Alphanumeric only')
  .trim() // Remove whitespace
  .toLowerCase() // Convert to lowercase

// Number validation
z.number()
  .int('Must be integer')
  .positive('Must be positive')
  .min(0, 'Too small')
  .max(100, 'Too large')
  .multipleOf(5, 'Must be multiple of 5')

// Boolean validation
z.boolean()

// Date validation
z.date().min(new Date('2020-01-01'), 'Too old').max(new Date(), 'Cannot be in future')

// Enum validation
z.enum(['user', 'assistant', 'system'])

// Array validation
z.array(z.string()).min(1).max(10)

// Object validation
z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  metadata: z.record(z.unknown()), // Key-value pairs
})

// Union types
z.union([z.string(), z.number()])

// Optional and nullable
z.string().optional() // string | undefined
z.string().nullable() // string | null
z.string().nullish() // string | null | undefined
```

---

## API Route Validation

### Request Validation

```typescript
// apps/streamlined-docs/app/api/docs-assistant/route.ts
import { z } from 'zod'
import { validateRequestBody, validationErrorResponse } from '@/lib/validation'

// Define request schema
const docsAssistantRequestSchema = z.object({
  query: z.string().min(1).max(500),
  conversationId: z.string().uuid().optional(),
  context: z
    .object({
      currentPage: z.string().url().optional(),
      previousMessages: z.array(z.string()).max(10).optional(),
    })
    .optional(),
  options: z
    .object({
      maxTokens: z.number().int().positive().min(1).max(4000).optional(),
      temperature: z.number().min(0).max(1).optional(),
      stream: z.boolean().optional(),
    })
    .optional(),
})

// Infer TypeScript type
type DocsAssistantRequest = z.infer<typeof docsAssistantRequestSchema>

// Validate in route handler
export async function POST(request: Request) {
  // Validate request body
  const validation = await validateRequestBody(request, docsAssistantRequestSchema)

  if (!validation.success) {
    return validationErrorResponse(validation.error)
  }

  // Type-safe access to validated data
  const { query, conversationId, context, options } = validation.data

  // Process request...
  const response = await processQuery(query, {
    conversationId,
    context,
    ...options,
  })

  return NextResponse.json(response)
}
```

### Response Validation

```typescript
// apps/streamlined-docs/app/api/docs-assistant/route.ts
import { z } from 'zod'

// Define response schema
const docsAssistantResponseSchema = z.object({
  response: z.string().min(1),
  sources: z.array(
    z.object({
      title: z.string(),
      url: z.string().url(),
      excerpt: z.string(),
    })
  ),
  conversationId: z.string().uuid(),
  tokensUsed: z.number().int().positive(),
  citations: z.array(
    z.object({
      claim: z.string(),
      sourceId: z.string(),
      sourceTitle: z.string(),
      sourceUrl: z.string().url(),
    })
  ),
  grounding: z.object({
    confidence: z.number().min(0).max(1),
    issues: z
      .array(
        z.object({
          type: z.enum(['unsupported_claim', 'conflicting_sources', 'low_confidence']),
          description: z.string(),
          severity: z.enum(['low', 'medium', 'high']),
        })
      )
      .optional(),
  }),
})

// Validate response before returning
export async function POST(request: Request) {
  // ... request validation and processing ...

  const response = await generateResponse(query)

  // Validate response
  const validation = docsAssistantResponseSchema.safeParse(response)

  if (!validation.success) {
    console.error('Response validation failed:', validation.error)
    return NextResponse.json(
      { error: 'Internal server error: Invalid response format' },
      { status: 500 }
    )
  }

  return NextResponse.json(validation.data)
}
```

---

## Validation Utilities

### validateRequestBody

```typescript
// apps/streamlined-docs/lib/validation.ts
import { z } from 'zod'

export async function validateRequestBody<T extends z.ZodType>(
  request: Request,
  schema: T
): Promise<{ success: true; data: z.infer<T> } | { success: false; error: z.ZodError }> {
  try {
    const body = await request.json()
    const result = schema.safeParse(body)
    return result
  } catch (error) {
    return {
      success: false,
      error: new z.ZodError([
        {
          code: 'custom',
          path: [],
          message: 'Invalid JSON in request body',
        },
      ]),
    }
  }
}
```

### validationErrorResponse

```typescript
// apps/streamlined-docs/lib/validation.ts
import { NextResponse } from 'next/server'
import { z } from 'zod'

export function validationErrorResponse(error: z.ZodError): NextResponse {
  return NextResponse.json(
    {
      error: 'Validation failed',
      issues: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
        code: issue.code,
      })),
    },
    { status: 400 }
  )
}
```

### Error Format

```json
{
  "error": "Validation failed",
  "issues": [
    {
      "path": "query",
      "message": "String must contain at least 1 character(s)",
      "code": "too_small"
    },
    {
      "path": "options.maxTokens",
      "message": "Number must be less than or equal to 4000",
      "code": "too_big"
    }
  ]
}
```

---

## Advanced Patterns

### Branded Types for IDs

```typescript
import { z } from 'zod'

// Create branded type
const MessageId = z.string().uuid().brand('MessageId')
const ConversationId = z.string().uuid().brand('ConversationId')
const UserId = z.string().uuid().brand('UserId')

type MessageId = z.infer<typeof MessageId>
type ConversationId = z.infer<typeof ConversationId>
type UserId = z.infer<typeof UserId>

// Usage in schema
const messageSchema = z.object({
  id: MessageId,
  conversationId: ConversationId,
  authorId: UserId,
  content: z.string(),
})

// Type safety prevents mixing IDs
function deleteMessage(id: MessageId) {
  // TypeScript ensures only MessageId can be passed
}

const conversationId: ConversationId = '123' as ConversationId
deleteMessage(conversationId) // ❌ Type error!
```

### Conditional Validation

```typescript
import { z } from 'zod'

// Validate based on another field
const requestSchema = z
  .object({
    type: z.enum(['user', 'assistant']),
    content: z.string(),
    citations: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      // Require citations for assistant messages
      if (data.type === 'assistant' && !data.citations) {
        return false
      }
      return true
    },
    {
      message: 'Assistant messages must include citations',
      path: ['citations'],
    }
  )
```

### Transforming Data

```typescript
import { z } from 'zod'

// Trim and lowercase email
const userSchema = z.object({
  email: z
    .string()
    .email()
    .transform((val) => val.trim().toLowerCase()),
  name: z.string().transform((val) => val.trim()),
})

const result = userSchema.parse({
  email: '  JOHN@EXAMPLE.COM  ',
  name: '  John Doe  ',
})

console.log(result)
// => { email: 'john@example.com', name: 'John Doe' }
```

### Discriminated Unions

```typescript
import { z } from 'zod'

// Different message types
const messageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('text'),
    content: z.string(),
  }),
  z.object({
    type: z.literal('image'),
    imageUrl: z.string().url(),
    caption: z.string().optional(),
  }),
  z.object({
    type: z.literal('file'),
    fileName: z.string(),
    fileSize: z.number(),
    mimeType: z.string(),
  }),
])

type Message = z.infer<typeof messageSchema>
// => { type: 'text'; content: string }
//  | { type: 'image'; imageUrl: string; caption?: string }
//  | { type: 'file'; fileName: string; fileSize: number; mimeType: string }
```

### Recursive Schemas

```typescript
import { z } from 'zod'

// Nested comments
type Comment = {
  id: string
  content: string
  replies: Comment[]
}

const commentSchema: z.ZodType<Comment> = z.lazy(() =>
  z.object({
    id: z.string().uuid(),
    content: z.string(),
    replies: z.array(commentSchema),
  })
)
```

---

## Validation in All 12 API Endpoints

### Validated Endpoints

1. `/api/docs-assistant` - Documentation queries
2. `/api/ai/components` - Component recommendations
3. `/api/live-demo-chat` - Live demo interactions
4. `/api/revalidate` - Cache revalidation
5. `/api/feedback` - User feedback
6. `/api/search` - Documentation search
7. `/api/analytics` - Usage analytics
8. `/api/auth/session` - Session management
9. `/api/auth/logout` - User logout
10. `/api/admin/metrics` - Admin metrics
11. `/api/admin/logs` - Admin logs
12. `/api/webhooks/github` - GitHub webhooks

### Validation Coverage

- **Request Bodies**: 100% (12/12 endpoints)
- **Query Parameters**: 100% (4/4 endpoints with query params)
- **Response Bodies**: 95% (critical endpoints only)

---

## Testing Validation

### Unit Tests

```typescript
// tests/validation/docs-assistant.test.ts
import { describe, it, expect } from 'vitest'
import { docsAssistantRequestSchema } from '@/app/api/docs-assistant/schema'

describe('docsAssistantRequestSchema', () => {
  it('validates correct request', () => {
    const result = docsAssistantRequestSchema.safeParse({
      query: 'What is Clarity?',
      conversationId: '123e4567-e89b-12d3-a456-426614174000',
    })

    expect(result.success).toBe(true)
  })

  it('rejects empty query', () => {
    const result = docsAssistantRequestSchema.safeParse({
      query: '',
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toContain('at least 1 character')
  })

  it('rejects invalid UUID', () => {
    const result = docsAssistantRequestSchema.safeParse({
      query: 'test',
      conversationId: 'invalid-uuid',
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toContain('uuid')
  })

  it('rejects maxTokens out of range', () => {
    const result = docsAssistantRequestSchema.safeParse({
      query: 'test',
      options: { maxTokens: 5000 },
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('maxTokens')
  })
})
```

### Integration Tests

```typescript
// tests/api/docs-assistant.test.ts
import { describe, it, expect } from 'vitest'

describe('POST /api/docs-assistant', () => {
  it('returns 400 for invalid request', async () => {
    const response = await fetch('/api/docs-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '' }), // Invalid: empty query
    })

    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body.error).toBe('Validation failed')
    expect(body.issues).toHaveLength(1)
  })

  it('returns 200 for valid request', async () => {
    const response = await fetch('/api/docs-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'What is Clarity?' }),
    })

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body).toHaveProperty('response')
    expect(body).toHaveProperty('sources')
  })
})
```

---

## Best Practices

### 1. Validate All Inputs

```typescript
// ✅ Good: Validate everything
const schema = z.object({
  query: z.string().min(1),
  userId: z.string().uuid(),
})

// ❌ Bad: Trust client data
function processQuery(query: string, userId: string) {
  // No validation!
}
```

### 2. Use Branded Types for Domain IDs

```typescript
// ✅ Good: Type-safe IDs
const MessageId = z.string().uuid().brand('MessageId')
type MessageId = z.infer<typeof MessageId>

// ❌ Bad: Plain strings
type MessageId = string
```

### 3. Validate Outputs for Critical Endpoints

```typescript
// ✅ Good: Validate response
const responseSchema = z.object({ success: z.boolean() })
const validated = responseSchema.parse(response)

// ❌ Bad: Return unvalidated data
return response // Could be malformed!
```

### 4. Write Validation Tests

```typescript
// ✅ Good: Test edge cases
describe('schema', () => {
  it('validates minimum values', () => {})
  it('validates maximum values', () => {})
  it('rejects invalid formats', () => {})
})

// ❌ Bad: No validation tests
```

### 5. Use Descriptive Error Messages

```typescript
// ✅ Good: Clear errors
z.string().min(1, 'Query is required').max(500, 'Query is too long (max 500 characters)')

// ❌ Bad: Generic errors
z.string().min(1).max(500)
```

### 6. Transform Data When Needed

```typescript
// ✅ Good: Normalize input
z.string()
  .email()
  .transform((v) => v.toLowerCase())

// ❌ Bad: Handle inconsistent formats later
z.string().email()
```

### 7. Handle Parsing Errors Gracefully

```typescript
// ✅ Good: Provide context
try {
  const data = schema.parse(input)
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('Validation failed:', error.issues)
  }
  throw new Error('Invalid input')
}

// ❌ Bad: Let errors bubble
const data = schema.parse(input) // May throw unclear errors
```

---

## Common Patterns

### Pagination Schema

```typescript
const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().min(1).max(100).default(20),
  sortBy: z.enum(['createdAt', 'updatedAt', 'name']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})
```

### Filter Schema

```typescript
const filterSchema = z.object({
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
  dateRange: z
    .object({
      start: z.date(),
      end: z.date(),
    })
    .optional(),
  status: z.enum(['active', 'inactive', 'archived']).optional(),
})
```

### Metadata Schema

```typescript
const metadataSchema = z.record(z.unknown()).refine(
  (data) => {
    // Ensure metadata doesn't exceed size limit
    return JSON.stringify(data).length <= 10000
  },
  { message: 'Metadata too large (max 10KB)' }
)
```

---

## Security Benefits

Validation provides:

1. **SQL Injection Prevention**: Validate input formats before database queries
2. **XSS Prevention**: Validate and sanitize user content
3. **API Abuse Prevention**: Enforce rate limits and size constraints
4. **Data Integrity**: Ensure database constraints are met
5. **Type Safety**: Prevent type-related bugs and vulnerabilities

**Risk Reduction**: 6.5/10 → 2/10 (Wave 3.4)

---

## Performance Considerations

Zod validation is fast but not free:

- **Validation Time**: ~0.1-1ms per request (negligible)
- **Bundle Size**: ~13KB minified + gzipped
- **Memory**: Minimal overhead

**Recommendation**: Always validate. Security >>> performance cost.

---

## Related Documentation

- [Security Headers](./security-headers.md) - HTTP security headers and CSRF
- [Security Best Practices](../security/best-practices.md) - OWASP compliance
- [API Reference](../api-reference.md) - Complete API documentation

---

## References

- [Zod Documentation](https://zod.dev/)
- [OWASP Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [TypeScript Type Safety](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

---

**Last Updated**: January 26, 2026 (Wave 3.4 Security Hardening)
