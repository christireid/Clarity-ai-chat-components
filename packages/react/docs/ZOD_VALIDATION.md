# Zod Runtime Validation

## Overview

`zod` is a required peer dependency for `@clarity-chat/react` that provides TypeScript-first schema
validation with static type inference.

**Size:** ~50KB (minified + gzipped) **Version:** ^3.24.0 **Usage:** Runtime validation for prompt
architect and data validation

## Installation

```bash
npm install zod
# or
pnpm add zod
# or
yarn add zod
```

## Why Zod is Required

Zod is used throughout the library for:

1. **Prompt Architect Validation** - Runtime validation of AI-generated code analysis, security
   findings, and architectural decisions
2. **Type Safety** - Ensures data conforms to expected schemas at runtime
3. **API Response Validation** - Validates external API responses before processing
4. **User Input Validation** - Validates user-provided configurations and settings

## Usage in Clarity Chat

### Prompt Architect

The Prompt Architect feature uses extensive Zod schemas for validating AI outputs:

```typescript
import { AuditResultSchema, StrategicPlanSchema } from '@clarity-chat/react/prompt'

// Validate security audit results
const auditResult = AuditResultSchema.parse(aiResponse)

// Validate strategic plans
const plan = StrategicPlanSchema.safeParse(planData)
if (plan.success) {
  console.log('Valid plan:', plan.data)
} else {
  console.error('Invalid plan:', plan.error)
}
```

### Available Schemas

The library exports these validation schemas:

#### Audit Phase

- `SecurityFindingSchema` - OWASP vulnerability detection
- `CodeSmellFindingSchema` - Code quality issues
- `TechnicalDebtItemSchema` - Technical debt tracking
- `AuditResultSchema` - Complete audit results

#### Planning Phase

- `PlanningStepSchema` - Individual planning steps
- `PatternRecommendationSchema` - Design pattern suggestions
- `StrategicPlanSchema` - Complete strategic plans

#### Implementation Phase

- `ImplementationOutputSchema` - Code generation output
- `StyleGuideRulesSchema` - Code style configuration

#### Review Phase

- `ReviewResultSchema` - Code review results
- `ArchitectureDecisionRecordSchema` - ADR documentation

### Validation Utilities

The library provides helper functions for common validation tasks:

```typescript
import { validateOrThrow, validateSafe, validators } from '@clarity-chat/react/prompt'

// Throw on validation error
const result = validateOrThrow(AuditResultSchema, data, 'AuditResult')

// Safe validation with error handling
const safeResult = validateSafe(AuditResultSchema, data, 'AuditResult')
if (safeResult.success) {
  console.log(safeResult.data)
} else {
  console.error(safeResult.error.getFormattedErrors())
}

// Pre-bound validators
const auditResult = validators.auditResult(data)
```

## Custom Validation

You can extend Zod schemas for custom validation:

```typescript
import { z } from 'zod'
import { AuditResultSchema } from '@clarity-chat/react/prompt'

// Extend existing schema
const CustomAuditSchema = AuditResultSchema.extend({
  customField: z.string(),
  metadata: z.record(z.unknown()),
})

// Create custom schema
const UserInputSchema = z.object({
  query: z.string().min(1, 'Query is required').max(1000),
  maxResults: z.number().int().positive().max(100),
  filters: z.array(z.string()).optional(),
})

type UserInput = z.infer<typeof UserInputSchema>
```

## Error Handling

The library provides a custom `ValidationError` class:

```typescript
import { ValidationError } from '@clarity-chat/react/prompt'

try {
  const result = validators.auditResult(data)
} catch (error) {
  if (error instanceof ValidationError) {
    // Get formatted error messages
    const errors = error.getFormattedErrors()
    console.error('Validation errors:', errors)

    // Access raw Zod errors
    console.error('Raw errors:', error.errors)
  }
}
```

## Performance Considerations

1. **Parse vs SafeParse**
   - Use `parse()` when you want to throw on errors
   - Use `safeParse()` for non-throwing validation

2. **Schema Reuse**
   - Schemas are compiled once and can be reused
   - Store schemas as constants for better performance

3. **Lazy Validation**
   - Use `.lazy()` for recursive or circular schemas
   - Helpful for deeply nested data structures

4. **Partial Validation**
   - Use `.partial()` to make all fields optional
   - Use `.pick()` or `.omit()` to validate subsets

## Migration from Other Validators

### From Yup

```typescript
// Yup
const schema = yup.object({
  name: yup.string().required(),
  age: yup.number().positive().integer(),
})

// Zod equivalent
const schema = z.object({
  name: z.string().min(1),
  age: z.number().int().positive(),
})
```

### From Joi

```typescript
// Joi
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8),
})

// Zod equivalent
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})
```

## Best Practices

1. **Type Inference** - Use `z.infer<typeof Schema>` for TypeScript types
2. **Error Messages** - Provide clear error messages in schemas
3. **Validation at Boundaries** - Validate at system boundaries (API, user input)
4. **Schema Composition** - Reuse schemas with `.extend()`, `.merge()`, `.pick()`
5. **Runtime Safety** - Always validate untrusted data

## Resources

- [Zod Documentation](https://zod.dev)
- [Zod GitHub](https://github.com/colinhacks/zod)
- [TypeScript Integration](https://zod.dev/?id=typescript-integration)
- [Error Handling](https://zod.dev/?id=error-handling)

## Troubleshooting

### Peer Dependency Warning

```
npm WARN peer dependency missing: zod@^3.24.0
```

**Solution:**

```bash
npm install zod
```

### Type Mismatch Errors

If you see TypeScript errors about Zod types:

1. Ensure you're using Zod ^3.24.0
2. Clear TypeScript cache: `rm -rf node_modules/.cache`
3. Restart TypeScript server in your IDE

### Bundle Size Concerns

Zod is now externalized (not bundled with the library), so:

- It's shared across all packages using Zod
- You only pay the ~50KB cost once
- Tree-shaking removes unused validators

### Version Conflicts

If you have multiple Zod versions:

```bash
# Check versions
npm ls zod

# Force single version
npm install zod@^3.24.0 --save-exact
```

## Examples

### Basic Validation

```typescript
import { z } from 'zod'

const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(['admin', 'user', 'guest']),
  preferences: z.record(z.boolean()).optional(),
})

// Parse and throw on error
const user = UserSchema.parse(apiResponse)

// Safe parse
const result = UserSchema.safeParse(apiResponse)
if (result.success) {
  console.log('Valid user:', result.data)
}
```

### Advanced Validation

```typescript
import { z } from 'zod'

// Conditional validation
const FormSchema = z
  .object({
    type: z.enum(['email', 'sms']),
    contact: z.string(),
  })
  .refine(
    (data) => {
      if (data.type === 'email') {
        return z.string().email().safeParse(data.contact).success
      }
      return /^\d{10}$/.test(data.contact)
    },
    { message: 'Invalid contact format' }
  )

// Async validation
const UsernameSchema = z.string().refine(
  async (username) => {
    const available = await checkUsernameAvailability(username)
    return available
  },
  { message: 'Username already taken' }
)
```

### Custom Error Messages

```typescript
const StrictSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().positive('Age must be positive').int('Age must be an integer'),
  email: z.string().email('Please provide a valid email address'),
})
```

## Summary

Zod is a critical dependency that provides:

- Type-safe runtime validation
- Excellent TypeScript integration
- Clear error messages
- Minimal bundle impact (~50KB)
- Used extensively in Prompt Architect features

Install it alongside `@clarity-chat/react` for full functionality.
