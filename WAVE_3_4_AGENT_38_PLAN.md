# Wave 3.4 Agent 38: Data Validation

**Agent Type**: `compound-engineering:review:data-integrity-guardian` **Priority**: P1 - High
**Target**: Risk score 6.5/10 → 2/10 **Estimated Time**: 2.5 hours **Risk Level**: Low (validation
layer addition)

---

## Mission Objective

Add Zod schema validation to 12 API endpoints missing input validation. Reduce data integrity risk
score from 6.5/10 to 2/10 by implementing comprehensive request/response validation.

### Endpoints Requiring Validation

Based on Wave 2 research findings:

1. `/api/docs-assistant` - Missing query validation
2. `/api/live-demo-chat` - Missing message validation
3. `/api/ai/components` - Missing component data validation
4. `/api/revalidate` - Path validation exists but incomplete
5. 8 additional API routes (identified in Wave 2 report)

---

## Task 1: Set Up Zod Infrastructure

### Step 1.1: Install Zod

**Command**:

```bash
# Install Zod
pnpm add zod

# Install Zod OpenAPI integration (optional, for API docs)
pnpm add zod-openapi
```

### Step 1.2: Create Validation Utilities

**File**: `apps/streamlined-docs/lib/validation.ts` (NEW)

```typescript
import { z, ZodError } from 'zod'
import { NextResponse } from 'next/server'

/**
 * Validate request body against Zod schema
 */
export async function validateRequestBody<T>(
  request: Request,
  schema: z.Schema<T>
): Promise<{ success: true; data: T } | { success: false; error: ZodError }> {
  try {
    const body = await request.json()
    const data = schema.parse(body)
    return { success: true, data }
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error }
    }
    throw error
  }
}

/**
 * Validate query parameters
 */
export function validateQueryParams<T>(
  searchParams: URLSearchParams,
  schema: z.Schema<T>
): { success: true; data: T } | { success: false; error: ZodError } {
  try {
    const params = Object.fromEntries(searchParams.entries())
    const data = schema.parse(params)
    return { success: true, data }
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error }
    }
    throw error
  }
}

/**
 * Format Zod errors for API response
 */
export function formatValidationErrors(error: ZodError) {
  return {
    error: 'Validation failed',
    issues: error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
      code: issue.code,
    })),
  }
}

/**
 * Create validation error response
 */
export function validationErrorResponse(error: ZodError) {
  return NextResponse.json(formatValidationErrors(error), { status: 400 })
}
```

---

## Task 2: Add Validation to /api/docs-assistant

### Current State

**File**: `apps/streamlined-docs/app/api/docs-assistant/route.ts`

**Current Code** (NO validation):

```typescript
export async function POST(request: Request) {
  const { query } = await request.json() // UNSAFE

  // Use query directly...
}
```

### Step 2.1: Define Schema

**File**: `apps/streamlined-docs/app/api/docs-assistant/schema.ts` (NEW)

```typescript
import { z } from 'zod'

export const docsAssistantRequestSchema = z.object({
  query: z
    .string()
    .min(1, 'Query cannot be empty')
    .max(500, 'Query must be less than 500 characters')
    .trim(),

  conversationId: z.string().uuid().optional(),

  context: z
    .object({
      currentPage: z.string().url().optional(),
      previousMessages: z.array(z.string()).max(10).optional(),
    })
    .optional(),

  options: z
    .object({
      maxTokens: z.number().int().positive().max(4000).default(2000),
      temperature: z.number().min(0).max(1).default(0.7),
      stream: z.boolean().default(false),
    })
    .optional(),
})

export const docsAssistantResponseSchema = z.object({
  response: z.string(),
  sources: z.array(
    z.object({
      title: z.string(),
      url: z.string().url(),
      excerpt: z.string(),
    })
  ),
  conversationId: z.string().uuid(),
  tokensUsed: z.number().int().positive(),
})

export type DocsAssistantRequest = z.infer<typeof docsAssistantRequestSchema>
export type DocsAssistantResponse = z.infer<typeof docsAssistantResponseSchema>
```

### Step 2.2: Apply Validation

**File**: `apps/streamlined-docs/app/api/docs-assistant/route.ts` (MODIFY)

```typescript
import { docsAssistantRequestSchema, docsAssistantResponseSchema } from './schema'
import { validateRequestBody, validationErrorResponse } from '@/lib/validation'

export async function POST(request: Request) {
  // Validate request
  const validation = await validateRequestBody(request, docsAssistantRequestSchema)

  if (!validation.success) {
    return validationErrorResponse(validation.error)
  }

  const { query, conversationId, context, options } = validation.data

  try {
    // Safe to use validated data
    const response = await processDocsQuery(query, {
      conversationId,
      context,
      ...options,
    })

    // Validate response before sending
    const validatedResponse = docsAssistantResponseSchema.parse(response)

    return NextResponse.json(validatedResponse)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

---

## Task 3: Add Validation to /api/live-demo-chat

### Step 3.1: Define Schema

**File**: `apps/streamlined-docs/app/api/live-demo-chat/schema.ts` (NEW)

```typescript
import { z } from 'zod'

export const liveDemoChatRequestSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(2000, 'Message too long').trim(),

  sessionId: z.string().uuid(),

  metadata: z
    .object({
      component: z.string().optional(),
      theme: z.enum(['light', 'dark']).optional(),
      timestamp: z.number().int().positive(),
    })
    .optional(),
})

export const liveDemoChatResponseSchema = z.object({
  reply: z.string(),
  sessionId: z.string().uuid(),
  suggestions: z.array(z.string()).max(3).optional(),
  error: z.string().optional(),
})

export type LiveDemoChatRequest = z.infer<typeof liveDemoChatRequestSchema>
export type LiveDemoChatResponse = z.infer<typeof liveDemoChatResponseSchema>
```

### Step 3.2: Apply Validation

**File**: `apps/streamlined-docs/app/api/live-demo-chat/route.ts` (MODIFY)

```typescript
import { liveDemoChatRequestSchema, liveDemoChatResponseSchema } from './schema'
import { validateRequestBody, validationErrorResponse } from '@/lib/validation'

export async function POST(request: Request) {
  const validation = await validateRequestBody(request, liveDemoChatRequestSchema)

  if (!validation.success) {
    return validationErrorResponse(validation.error)
  }

  const { message, sessionId, metadata } = validation.data

  try {
    const reply = await generateChatResponse(message, sessionId, metadata)

    const response = liveDemoChatResponseSchema.parse({
      reply,
      sessionId,
      suggestions: generateSuggestions(message),
    })

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ error: 'Chat generation failed' }, { status: 500 })
  }
}
```

---

## Task 4: Add Validation to /api/ai/components

### Step 4.1: Define Schema

**File**: `apps/streamlined-docs/app/api/ai/components/schema.ts` (NEW)

```typescript
import { z } from 'zod'

export const componentGenerationRequestSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters').max(1000, 'Prompt too long'),

  framework: z.enum(['react', 'vue', 'svelte', 'solid']).default('react'),

  options: z
    .object({
      typescript: z.boolean().default(true),
      styling: z.enum(['tailwind', 'css', 'styled-components']).default('tailwind'),
      accessibility: z.boolean().default(true),
    })
    .optional(),
})

export const componentGenerationResponseSchema = z.object({
  code: z.string(),
  language: z.string(),
  explanation: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
})

export type ComponentGenerationRequest = z.infer<typeof componentGenerationRequestSchema>
export type ComponentGenerationResponse = z.infer<typeof componentGenerationResponseSchema>
```

### Step 4.2: Apply Validation

**File**: `apps/streamlined-docs/app/api/ai/components/route.ts` (MODIFY)

```typescript
import { componentGenerationRequestSchema, componentGenerationResponseSchema } from './schema'
import { validateRequestBody, validationErrorResponse } from '@/lib/validation'

export async function POST(request: Request) {
  const validation = await validateRequestBody(request, componentGenerationRequestSchema)

  if (!validation.success) {
    return validationErrorResponse(validation.error)
  }

  const { prompt, framework, options } = validation.data

  try {
    const generatedCode = await generateComponent(prompt, framework, options)

    const response = componentGenerationResponseSchema.parse(generatedCode)

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ error: 'Component generation failed' }, { status: 500 })
  }
}
```

---

## Task 5: Add Validation to Remaining 9 Endpoints

### Step 5.1: Identify All Endpoints

**Command**:

```bash
# Find all API route files
find apps/streamlined-docs/app/api -name "route.ts" -type f

# For each, check if validation exists
grep -l "zod\|z\." apps/streamlined-docs/app/api/**/route.ts
```

### Step 5.2: Batch Create Schemas

For each endpoint without validation:

1. **Analyze request structure** (what data it expects)
2. **Create schema file** (`schema.ts` in same directory)
3. **Apply validation** using utility functions
4. **Add response validation** for type safety

**Template for New Validation**:

```typescript
// schema.ts
import { z } from 'zod'

export const myEndpointRequestSchema = z.object({
  // Define expected fields
})

export const myEndpointResponseSchema = z.object({
  // Define response structure
})

// route.ts
import { myEndpointRequestSchema, myEndpointResponseSchema } from './schema'
import { validateRequestBody, validationErrorResponse } from '@/lib/validation'

export async function POST(request: Request) {
  const validation = await validateRequestBody(request, myEndpointRequestSchema)

  if (!validation.success) {
    return validationErrorResponse(validation.error)
  }

  const { ...data } = validation.data

  // Process request...

  const response = myEndpointResponseSchema.parse(result)
  return NextResponse.json(response)
}
```

---

## Task 6: Add E2E Validation Tests

### Step 6.1: Create Validation Test Suite

**File**: `tests/api/validation.test.ts` (NEW)

```typescript
import { describe, it, expect } from 'vitest'

describe('API Validation', () => {
  describe('/api/docs-assistant', () => {
    it('should reject empty query', async () => {
      const response = await fetch('http://localhost:3000/api/docs-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '' }),
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toBe('Validation failed')
      expect(data.issues[0].path).toBe('query')
    })

    it('should reject query over 500 characters', async () => {
      const longQuery = 'a'.repeat(501)
      const response = await fetch('http://localhost:3000/api/docs-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: longQuery }),
      })

      expect(response.status).toBe(400)
    })

    it('should accept valid query', async () => {
      const response = await fetch('http://localhost:3000/api/docs-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'How do I use clarity-chat?',
          options: { maxTokens: 1000 },
        }),
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toHaveProperty('response')
      expect(data).toHaveProperty('sources')
    })
  })

  describe('/api/live-demo-chat', () => {
    it('should reject invalid sessionId', async () => {
      const response = await fetch('http://localhost:3000/api/live-demo-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Hello',
          sessionId: 'not-a-uuid',
        }),
      })

      expect(response.status).toBe(400)
    })

    it('should reject message over 2000 characters', async () => {
      const longMessage = 'a'.repeat(2001)
      const response = await fetch('http://localhost:3000/api/live-demo-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: longMessage,
          sessionId: '550e8400-e29b-41d4-a716-446655440000',
        }),
      })

      expect(response.status).toBe(400)
    })
  })

  // Add tests for all 12 endpoints...
})
```

**Run**:

```bash
pnpm test tests/api/validation.test.ts
```

---

## Task 7: Generate API Documentation

### Step 7.1: Use Zod-to-OpenAPI

**File**: `scripts/generate-api-docs.ts` (NEW)

```typescript
import { extendZodWithOpenApi } from 'zod-openapi'
import { z } from 'zod'
import { writeFileSync } from 'fs'

// Extend Zod with OpenAPI
extendZodWithOpenApi(z)

// Import all schemas
import {
  docsAssistantRequestSchema,
  docsAssistantResponseSchema,
} from '../apps/streamlined-docs/app/api/docs-assistant/schema'
// ... import other schemas

// Generate OpenAPI spec
const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Clarity Chat API',
    version: '1.0.0',
  },
  paths: {
    '/api/docs-assistant': {
      post: {
        summary: 'Query documentation assistant',
        requestBody: {
          content: {
            'application/json': {
              schema: docsAssistantRequestSchema,
            },
          },
        },
        responses: {
          '200': {
            content: {
              'application/json': {
                schema: docsAssistantResponseSchema,
              },
            },
          },
        },
      },
    },
    // ... add other endpoints
  },
}

// Write to file
writeFileSync('public/api-spec.json', JSON.stringify(openApiSpec, null, 2))

console.log('✅ API documentation generated')
```

**Run**:

```bash
npx tsx scripts/generate-api-docs.ts
```

---

## Task 8: Create Validation Report

### Step 8.1: Generate Coverage Report

**File**: `WAVE_3_4_AGENT_38_VALIDATION_REPORT.md` (NEW)

````markdown
# API Validation Coverage Report - Agent 38

**Date**: 2026-01-26 **Status**: ✅ ALL ENDPOINTS VALIDATED

## Summary

- **Total API Endpoints**: 12
- **Endpoints Validated**: 12 (100%)
- **Risk Score**: 6.5/10 → 2/10 (-70%)

## Endpoints Validated

| Endpoint            | Request Schema | Response Schema | Tests |
| ------------------- | -------------- | --------------- | ----- |
| /api/docs-assistant | ✅             | ✅              | ✅    |
| /api/live-demo-chat | ✅             | ✅              | ✅    |
| /api/ai/components  | ✅             | ✅              | ✅    |
| /api/revalidate     | ✅             | ✅              | ✅    |
| ... (8 more)        | ✅             | ✅              | ✅    |

## Validation Rules

### Input Validation

- String length limits (min/max)
- Type checking (string, number, boolean, enum)
- Format validation (UUID, URL, email)
- Nested object validation
- Array length limits

### Output Validation

- Response structure verification
- Type safety guarantees
- Consistent error format

## Error Handling

### 400 Bad Request

```json
{
  "error": "Validation failed",
  "issues": [
    {
      "path": "query",
      "message": "Query cannot be empty",
      "code": "too_small"
    }
  ]
}
```
````

## Test Coverage

- **Unit Tests**: 36 validation tests
- **E2E Tests**: 12 endpoint tests
- **Coverage**: 100% of API routes

## Benefits

1. **Security**: Prevents injection attacks, malformed data
2. **Reliability**: Catches errors early in request pipeline
3. **Developer Experience**: Auto-generated TypeScript types
4. **Documentation**: OpenAPI spec generated from schemas
5. **Consistency**: Standardized error responses

````

---

## Success Criteria

| Metric | Before | Target | Success Threshold |
|--------|--------|--------|-------------------|
| Risk Score | 6.5/10 | 2/10 | ≤3/10 ✅ |
| Validated Endpoints | 0/12 | 12/12 | 100% ✅ |
| Test Coverage | 0% | 100% | ≥95% ✅ |
| Type Safety | Partial | Full | Full ✅ |

---

## Rollback Plan

### If Validation Breaks Existing Clients

```bash
# Make validation permissive temporarily
# In validation.ts, add:
export const STRICT_VALIDATION = false

# Then check and fix clients before re-enabling
````

### If Schema is Too Restrictive

```bash
# Adjust schema constraints
# Example: increase max length
query: z.string().max(1000)  // was 500
```

---

## Deliverables

### Files Created

1. `lib/validation.ts` - Validation utilities (110 lines)
2. `app/api/docs-assistant/schema.ts` - Docs assistant schemas
3. `app/api/live-demo-chat/schema.ts` - Live chat schemas
4. `app/api/ai/components/schema.ts` - Component generation schemas
5. 9 additional schema files (one per endpoint)
6. `tests/api/validation.test.ts` - Validation tests (300+ lines)
7. `scripts/generate-api-docs.ts` - OpenAPI generator
8. `WAVE_3_4_AGENT_38_VALIDATION_REPORT.md` - Coverage report

### Files Modified

1. 12 API route files (`route.ts`) - Added validation

---

**Agent 38 Status**: 📋 PLANNED **Ready for Execution**: ✅ YES (no dependencies) **Parallel Safe**:
✅ YES (with Agents 36, 37, 39, 40) **Next Agent**: Agent 39 (Advanced Prompting Rollout)
