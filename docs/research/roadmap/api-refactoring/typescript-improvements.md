# TypeScript Generic Support Improvement Specification

**Status**: Draft **Priority**: High **Created**: 2026-01-27 **Owner**: Engineering Team

---

## Executive Summary

This specification outlines improvements to TypeScript generic support in Clarity Chat Components,
drawing inspiration from Vercel AI SDK's exceptional type system and Assistant UI's composable
architecture. The goal is to provide world-class type inference, better developer experience, and
maintain type safety throughout the library.

**Key Objectives**:

- Improve generic type inference across hooks and components
- Implement better constraint types for tool definitions
- Enhance IntelliSense and autocomplete experience
- Reduce need for explicit type annotations
- Maintain backward compatibility where possible

---

## Table of Contents

1. [Current State Analysis](#current-state-analysis)
2. [Competitive Analysis](#competitive-analysis)
3. [Proposed Improvements](#proposed-improvements)
4. [Implementation Plan](#implementation-plan)
5. [Migration Strategy](#migration-strategy)
6. [Testing Strategy](#testing-strategy)

---

## Current State Analysis

### Strengths

**Well-Structured Types**:

- Clear separation of UI and Model messages (`UIMessage`, `ModelMessage`)
- Comprehensive tool definition types with lifecycle hooks
- Discriminated unions for state management
- Type guards for runtime safety

**Type Safety Features**:

- Strict TypeScript configuration enabled
- Type validation functions (`validateToolDefinition`, `MessageValidator`)
- Branded types for IDs (`ChatId`, `MessageId`, `ApiUrl`)
- Helper types for better DX (`IntelliSenseProps`, `AsyncState`)

**Good Patterns**:

- Discriminated unions for message parts and tool invocations
- Generic tool definition: `ToolDefinition<TArgs, TResult>`
- Type builders (`TypedMessageBuilder`)
- Comprehensive type guards

### Weaknesses

**Limited Generic Inference**:

```typescript
// Current: Requires explicit type annotations
const tool: ToolDefinition<{ location: string }, WeatherData> = {
  name: 'get_weather',
  // ...
}

// Desired: Type inference from schema
const tool = makeToolDefinition({
  name: 'get_weather',
  schema: z.object({ location: z.string() }),
  execute: async (args) => {
    // args should be inferred as { location: string }
  },
})
```

**No Schema Integration for Type Inference**:

- Tool definitions don't infer types from Zod schemas
- Hooks don't support generic message types
- No type-safe tool result inference in components

**Hook Return Types Could Be Better**:

```typescript
// Current: Object return but could be more specific
function useClarityChat(config: ChatConfig) {
  return {
    messages,
    append,
    isLoading,
    // ... many more properties, hard to discover
  }
}

// Desired: Namespace-based grouping for better IntelliSense
function useClarityChat(config: ChatConfig) {
  return {
    messages,
    actions: { append, regenerate, stop },
    status: { isLoading, isStreaming, error },
    // Clear grouping
  }
}
```

**Missing Type-Level Utilities**:

- No conditional types based on configuration
- Limited utility types for component props
- No helper types for common patterns like partial messages during streaming

---

## Competitive Analysis

### Vercel AI SDK - Best TypeScript Support (10/10)

**Strengths to Adopt**:

1. **Schema-Based Type Inference**:

```typescript
// Vercel AI SDK
const { object } = useObject({
  schema: z.object({
    title: z.string(),
    items: z.array(z.string()),
  }),
})
// object type: DeepPartial<{ title: string; items: string[] }>
```

2. **Generic Hooks with Type Parameters**:

```typescript
experimental_useObject<RESULT, INPUT>({...})
```

3. **Request-Level Type Overrides**:

```typescript
sendMessage(
  { text: input },
  {
    headers: { 'X-Custom': 'value' }, // Type-safe
    body: { temperature: 0.7 }, // Type-safe
  }
)
```

4. **Provider Type Safety**:

```typescript
import { LanguageModel } from 'ai'
function works(model: LanguageModel) { ... }
```

5. **Discriminated Unions for Message Parts**:

```typescript
type UIMessagePart =
  | { type: 'text'; text: string }
  | { type: 'tool-call'; toolName: string; args: unknown }
  | { type: 'reasoning'; text: string }
```

6. **InferUITools for Tool Type Inference**:

```typescript
// Type inference from tool definitions
type InferredTools = InferUITools<typeof tools>
```

### Assistant UI - Excellent TypeScript (5/5)

**Strengths to Adopt**:

1. **Namespace Exports for Types**:

```typescript
namespace MessagePrimitiveRoot {
  export type Element = ComponentRef<typeof Primitive.div>
  export type Props = ComponentPropsWithoutRef<typeof Primitive.div>
}
```

2. **Generic Component Types**:

```typescript
const Component = forwardRef<Element, Props>((props, ref) => {
  // Implementation
})
```

3. **Discriminated Unions for Messages**:

```typescript
type ThreadMessage = ThreadSystemMessage | ThreadUserMessage | ThreadAssistantMessage
```

4. **Zod Integration for Tool Parameters**:

```typescript
const tool = makeAssistantTool({
  parameters: z.object({ location: z.string() }),
  execute: async ({ location }) => {
    // location is typed as string
  },
})
```

5. **Type-Safe Component Overrides**:

```typescript
<Thread.Messages
  components={{
    UserMessage: CustomUserMessage,  // Type-checked
    AssistantMessage: CustomAssistantMessage,
  }}
/>
```

---

## Proposed Improvements

### 1. Schema-Based Type Inference

**Goal**: Infer types from Zod schemas automatically.

**Implementation**:

```typescript
// packages/react/src/types/schema-inference.ts

import type { z } from 'zod'

/**
 * Infer TypeScript type from Zod schema
 */
export type InferZodSchema<T> = T extends z.ZodType<infer U> ? U : never

/**
 * Deep partial for streaming objects
 */
export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T

/**
 * Type-safe tool definition builder with schema inference
 */
export function makeToolDefinition<TSchema extends z.ZodObject<any>, TResult = unknown>(config: {
  name: string
  description: string
  schema: TSchema
  execute: (args: z.infer<TSchema>) => Promise<TResult>
  // ... other options
}): ToolDefinition<z.infer<TSchema>, TResult> {
  return {
    name: config.name,
    description: config.description,
    parameters: zodToJsonSchema(config.schema),
    execute: config.execute as any, // Safe cast due to inference
    // ... other fields
  }
}

// Usage
const weatherTool = makeToolDefinition({
  name: 'get_weather',
  schema: z.object({
    location: z.string(),
    units: z.enum(['celsius', 'fahrenheit']).optional(),
  }),
  execute: async (args) => {
    // args is typed as: { location: string; units?: 'celsius' | 'fahrenheit' }
    const data = await fetchWeather(args.location, args.units)
    return data
  },
})
// weatherTool type: ToolDefinition<{ location: string; units?: 'celsius' | 'fahrenheit' }, WeatherData>
```

### 2. Generic Hook Types

**Goal**: Better type inference and IntelliSense in hooks.

**Implementation**:

```typescript
// packages/react/src/hooks/use-clarity-chat/types-improved.ts

/**
 * Configuration options with conditional types
 */
export interface UseClarityChatOptions<
  TMemoryEnabled extends boolean = false,
  TStreamingEnabled extends boolean = true,
> {
  api: string

  // Memory configuration affects return type
  memory?: TMemoryEnabled extends true
    ? { enabled: true; strategy: MemoryStrategy }
    : { enabled?: false }

  // Streaming configuration
  streaming?: TStreamingEnabled extends true
    ? { enabled: true; transport: 'sse' | 'websocket' }
    : { enabled?: false }

  // ... other options
}

/**
 * Return type depends on configuration
 */
export interface UseClarityChatReturn<
  TMemoryEnabled extends boolean = false,
  TStreamingEnabled extends boolean = true,
> {
  // Core state
  messages: UIMessage[]

  // Actions grouped for better IntelliSense
  actions: {
    append: (message: string | UIMessage) => Promise<void>
    regenerate: (messageId: string) => Promise<void>
    stop: () => void
    setMessages: (messages: UIMessage[]) => void
  }

  // Status grouped for clarity
  status: {
    isLoading: boolean
    isStreaming: TStreamingEnabled extends true ? boolean : never
    error: Error | undefined
  }

  // Memory info only if enabled
  memory: TMemoryEnabled extends true
    ? {
        enabled: true
        strategy: MemoryStrategy
        tokenCount: number
        // ... memory-specific fields
      }
    : { enabled: false }
}

// Hook implementation with overloads
export function useClarityChat<
  TMemoryEnabled extends boolean = false,
  TStreamingEnabled extends boolean = true,
>(
  options: UseClarityChatOptions<TMemoryEnabled, TStreamingEnabled>
): UseClarityChatReturn<TMemoryEnabled, TStreamingEnabled>

// Usage
const chat1 = useClarityChat({
  api: '/api/chat',
  memory: { enabled: true, strategy: 'sliding-window' },
})
// chat1.memory.enabled is true, memory fields available

const chat2 = useClarityChat({
  api: '/api/chat',
  memory: { enabled: false },
})
// chat2.memory.enabled is false, no memory fields
```

### 3. Namespace-Based Component Types

**Goal**: Clean type exports like Assistant UI.

**Implementation**:

```typescript
// packages/react/src/components/message/ChatMessage.tsx

import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from 'react'
import { Primitive } from '@radix-ui/react-primitive'

export namespace ChatMessage {
  /**
   * Element type for ref forwarding
   */
  export type Element = ComponentRef<typeof Primitive.div>

  /**
   * Props for ChatMessage component
   */
  export interface Props extends ComponentPropsWithoutRef<typeof Primitive.div> {
    message: UIMessage
    onEdit?: (id: string, content: string) => void
    onDelete?: (id: string) => void
    isStreaming?: boolean

    // Component overrides
    components?: {
      Text?: ComponentType<{ part: UITextPart }>
      Image?: ComponentType<{ part: UIImagePart }>
      ToolCall?: ComponentType<{ part: UIToolCallPart }>
      Code?: ComponentType<{ part: UICodePart }>
    }
  }

  /**
   * Ref type for external ref usage
   */
  export type Ref = Element
}

/**
 * ChatMessage component with namespace types
 */
export const ChatMessage = forwardRef<ChatMessage.Element, ChatMessage.Props>(
  (props, ref) => {
    // Implementation
  }
)

ChatMessage.displayName = 'ChatMessage'

// Usage
import { ChatMessage } from '@/components/message/ChatMessage'

const MyComponent = () => {
  const ref = useRef<ChatMessage.Element>(null)

  return (
    <ChatMessage
      ref={ref}
      message={message}
      components={{
        Text: CustomTextPart,  // Type-checked
        ToolCall: CustomToolCallPart
      }}
    />
  )
}
```

### 4. Tool Type Inference

**Goal**: Infer tool result types throughout the component tree.

**Implementation**:

```typescript
// packages/react/src/types/tool-inference.ts

import type { ToolDefinition } from './tool-definition'

/**
 * Infer tool arguments type
 */
export type InferToolArgs<T> = T extends ToolDefinition<infer TArgs, any> ? TArgs : never

/**
 * Infer tool result type
 */
export type InferToolResult<T> = T extends ToolDefinition<any, infer TResult> ? TResult : never

/**
 * Create a type-safe tool registry
 */
export type ToolRegistry<T extends Record<string, ToolDefinition>> = T

/**
 * Infer all tool names from registry
 */
export type ToolNames<T extends ToolRegistry<any>> = keyof T

/**
 * Get tool definition by name
 */
export type GetTool<T extends ToolRegistry<any>, K extends ToolNames<T>> = T[K]

/**
 * Type-safe tool executor
 */
export interface ToolExecutor<T extends ToolRegistry<any>> {
  execute<K extends ToolNames<T>>(
    name: K,
    args: InferToolArgs<GetTool<T, K>>
  ): Promise<InferToolResult<GetTool<T, K>>>
}

// Usage
const tools = {
  get_weather: makeToolDefinition({
    name: 'get_weather',
    schema: z.object({ location: z.string() }),
    execute: async (args) => ({ temp: 72, condition: 'sunny' }),
  }),

  calculate: makeToolDefinition({
    name: 'calculate',
    schema: z.object({ expression: z.string() }),
    execute: async (args) => ({ result: 42 }),
  }),
} satisfies ToolRegistry<any>

// Type-safe execution
const executor: ToolExecutor<typeof tools> = createExecutor(tools)

const result = await executor.execute('get_weather', {
  location: 'San Francisco',
})
// result is typed as: { temp: number; condition: string }

await executor.execute('get_weather', {
  wrong: 'param',
})
// ❌ Type error: 'wrong' does not exist in type
```

### 5. Streaming Type Utilities

**Goal**: Type-safe streaming message updates.

**Implementation**:

```typescript
// packages/react/src/types/streaming-types.ts

/**
 * Deep partial for progressively building objects during streaming
 */
export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T

/**
 * Message with streaming state
 */
export interface StreamingMessage<T extends UIMessage = UIMessage> {
  /** The message being built */
  message: T

  /** Whether message is currently streaming */
  isStreaming: boolean

  /** Partial content for streaming objects */
  partialContent?: T extends { parts: Array<infer P> } ? DeepPartial<P>[] : never
}

/**
 * Streaming status with granular states
 */
export type StreamStatus =
  | { status: 'idle' }
  | { status: 'connecting' }
  | { status: 'streaming'; progress?: number }
  | { status: 'paused' }
  | { status: 'complete'; duration: number }
  | { status: 'error'; error: Error; retryable: boolean }

/**
 * Type-safe streaming hook
 */
export interface UseStreamingReturn<T> {
  /** Current streaming data */
  data: DeepPartial<T> | undefined

  /** Streaming status */
  status: StreamStatus

  /** Control actions */
  actions: {
    start: () => void
    stop: () => void
    pause: () => void
    resume: () => void
  }
}

/**
 * Hook for streaming structured objects with type inference
 */
export function useStreamingObject<T extends z.ZodType>(config: {
  schema: T
  api: string
}): UseStreamingReturn<z.infer<T>>

// Usage
const { data, status, actions } = useStreamingObject({
  schema: z.object({
    title: z.string(),
    sections: z.array(
      z.object({
        heading: z.string(),
        content: z.string(),
      })
    ),
  }),
  api: '/api/generate',
})

// data is typed as DeepPartial<{ title: string; sections: { heading: string; content: string }[] }>

if (status.status === 'streaming') {
  console.log(`Progress: ${status.progress}%`)
}

if (status.status === 'error') {
  console.error(`Error: ${status.error.message}`)
  if (status.retryable) {
    actions.start() // Retry
  }
}
```

### 6. Component Prop Utilities

**Goal**: Better component prop types with composition.

**Implementation**:

```typescript
// packages/react/src/types/component-props.ts

import type { ComponentPropsWithoutRef, ComponentPropsWithRef } from 'react'

/**
 * Extract props from component, excluding ref
 */
export type PropsOf<T> = T extends React.ComponentType<infer P> ? P : never

/**
 * Merge component props with additional props
 */
export type MergeProps<T, U> = Omit<T, keyof U> & U

/**
 * Make certain props required
 */
export type RequireProps<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * Polymorphic component props
 */
export type PolymorphicProps<E extends React.ElementType, P = {}> = P &
  Omit<ComponentPropsWithoutRef<E>, keyof P> & {
    as?: E
  }

/**
 * Component with ref forwarding
 */
export type ComponentWithRef<E extends React.ElementType, P = {}> =
  PolymorphicProps<E, P> & {
    ref?: React.Ref<ComponentRef<E>>
  }

/**
 * WithChildren helper
 */
export type WithChildren<T = {}> = T & {
  children?: React.ReactNode
}

/**
 * WithClassName helper
 */
export type WithClassName<T = {}> = T & {
  className?: string
}

// Usage in components
interface ButtonBaseProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

// Polymorphic button that can render as different elements
export function Button<E extends React.ElementType = 'button'>({
  as,
  ...props
}: PolymorphicProps<E, ButtonBaseProps>) {
  const Component = as || 'button'
  return <Component {...props} />
}

// Usage
<Button variant="primary">Click me</Button>
<Button as="a" href="/link" variant="secondary">Link button</Button>
```

### 7. Error Type Refinement

**Goal**: Better error handling with discriminated unions.

**Implementation**:

```typescript
// packages/react/src/types/error-types.ts

/**
 * Base error with common fields
 */
interface BaseError {
  message: string
  timestamp: Date
  retryable: boolean
}

/**
 * Network error
 */
export interface NetworkError extends BaseError {
  type: 'network'
  statusCode?: number
  endpoint: string
}

/**
 * Validation error
 */
export interface ValidationError extends BaseError {
  type: 'validation'
  field: string
  constraint: string
  value: unknown
}

/**
 * Rate limit error
 */
export interface RateLimitError extends BaseError {
  type: 'ratelimit'
  retryAfter: number
  limit: number
  remaining: number
}

/**
 * Authentication error
 */
export interface AuthError extends BaseError {
  type: 'auth'
  code: 'unauthorized' | 'forbidden' | 'expired'
}

/**
 * Timeout error
 */
export interface TimeoutError extends BaseError {
  type: 'timeout'
  duration: number
  operation: string
}

/**
 * Server error
 */
export interface ServerError extends BaseError {
  type: 'server'
  statusCode: number
  errorCode?: string
}

/**
 * Discriminated union of all error types
 */
export type ChatError =
  | NetworkError
  | ValidationError
  | RateLimitError
  | AuthError
  | TimeoutError
  | ServerError

/**
 * Type guard for specific error types
 */
export function isErrorType<T extends ChatError['type']>(
  error: ChatError,
  type: T
): error is Extract<ChatError, { type: T }> {
  return error.type === type
}

// Usage
function handleError(error: ChatError) {
  if (isErrorType(error, 'ratelimit')) {
    // TypeScript knows: error.retryAfter exists
    console.log(`Rate limited. Retry after ${error.retryAfter}s`)
  }

  if (isErrorType(error, 'validation')) {
    // TypeScript knows: error.field exists
    console.error(`Validation failed for field: ${error.field}`)
  }

  // Generic fallback
  console.error(error.message)
}
```

### 8. Type-Safe Configuration Builder

**Goal**: Fluent API for type-safe configuration.

**Implementation**:

```typescript
// packages/react/src/types/config-builder.ts

/**
 * Type-safe configuration builder
 */
export class ChatConfigBuilder<
  TMemory extends boolean = false,
  TStreaming extends boolean = false,
  TRateLimit extends boolean = false,
> {
  private config: Partial<UseClarityChatOptions> = {}

  api(endpoint: string): this {
    this.config.api = endpoint
    return this
  }

  withMemory<S extends MemoryStrategy>(
    strategy: S,
    maxTokens?: number
  ): ChatConfigBuilder<true, TStreaming, TRateLimit> {
    this.config.memory = {
      enabled: true,
      strategy,
      maxTokens: maxTokens || 4000,
    }
    return this as any
  }

  withStreaming(transport: 'sse' | 'websocket'): ChatConfigBuilder<TMemory, true, TRateLimit> {
    this.config.streaming = {
      enabled: true,
      transport,
    }
    return this as any
  }

  withRateLimit(maxRequestsPerMinute: number): ChatConfigBuilder<TMemory, TStreaming, true> {
    this.config.rateLimiting = {
      enabled: true,
      maxRequestsPerMinute,
    }
    return this as any
  }

  build(): UseClarityChatOptions<TMemory, TStreaming> & {
    rateLimiting: TRateLimit extends true ? { enabled: true; maxRequestsPerMinute: number } : never
  } {
    return this.config as any
  }
}

// Usage
const config = new ChatConfigBuilder()
  .api('/api/chat')
  .withMemory('sliding-window', 4000)
  .withStreaming('sse')
  .withRateLimit(60)
  .build()

// config type is fully inferred based on builder chain
```

---

## Implementation Plan

### Phase 1: Foundation (Week 1-2)

**Goal**: Core type infrastructure.

**Tasks**:

1. Create schema inference utilities
2. Implement `makeToolDefinition` with Zod integration
3. Add namespace-based type exports for key components
4. Create streaming type utilities (`DeepPartial`, etc.)

**Files to Create**:

- `packages/react/src/types/schema-inference.ts`
- `packages/react/src/types/streaming-types.ts`
- `packages/react/src/types/tool-inference.ts`

**Files to Update**:

- `packages/react/src/types/tool-definition.ts` (add builder)
- `packages/react/src/components/message/ChatMessage.tsx` (namespace types)

**Success Criteria**:

- Tool definitions infer types from Zod schemas
- Components export namespace types
- Streaming utilities provide type-safe partial updates

### Phase 2: Hook Improvements (Week 3-4)

**Goal**: Better hook types and IntelliSense.

**Tasks**:

1. Refactor `useClarityChat` with conditional types
2. Add namespace-grouped return values
3. Implement `useStreamingObject` with type inference
4. Create configuration builder with type safety

**Files to Update**:

- `packages/react/src/hooks/use-clarity-chat/types.ts`
- `packages/react/src/hooks/use-clarity-chat/index.ts`
- `packages/react/src/hooks/streaming/use-streaming-object.ts` (create)
- `packages/react/src/types/config-builder.ts` (create)

**Success Criteria**:

- Hook return types reflect configuration
- Memory fields only present when memory enabled
- IntelliSense shows grouped actions/status
- Configuration builder provides full type safety

### Phase 3: Component Type System (Week 5-6)

**Goal**: Type-safe component composition.

**Tasks**:

1. Add polymorphic component types
2. Implement type-safe component overrides
3. Create prop utility types
4. Add ref forwarding with proper types

**Files to Create**:

- `packages/react/src/types/component-props.ts`

**Files to Update**:

- All components in `packages/react/src/components/`
- Add namespace type exports
- Add component override types

**Success Criteria**:

- Components support polymorphic rendering
- Component overrides are type-checked
- Ref forwarding works with proper types
- Props compose cleanly without conflicts

### Phase 4: Error Handling (Week 7)

**Goal**: Type-safe error handling.

**Tasks**:

1. Implement discriminated error unions
2. Add type guards for error types
3. Update hooks to return typed errors
4. Add error recovery utilities

**Files to Create**:

- `packages/react/src/types/error-types.ts`

**Files to Update**:

- `packages/react/src/hooks/use-clarity-chat/index.ts`
- `packages/react/src/hooks/resilience/*`

**Success Criteria**:

- Errors are discriminated unions
- Type guards narrow error types
- IntelliSense shows error-specific fields
- Error handling is type-safe

### Phase 5: Documentation & Examples (Week 8)

**Goal**: Document new type system.

**Tasks**:

1. Update TypeScript documentation
2. Add type-focused examples
3. Create migration guide
4. Add JSDoc comments with examples

**Files to Create**:

- `docs/typescript-guide.md`
- `docs/type-migration.md`
- `examples/typescript-patterns/`

**Files to Update**:

- Add comprehensive JSDoc comments
- Update README with type examples

**Success Criteria**:

- Complete TypeScript guide
- Migration path documented
- Example code for all new patterns
- JSDoc provides inline help

---

## Migration Strategy

### Breaking Changes

**Minimal Breaking Changes**:

- Most improvements are additive
- Existing code continues to work
- Deprecation warnings for old patterns

**Potential Breaking Changes**:

1. Hook return structure (grouped actions/status)
2. Tool definition format (if using builder)
3. Error types (if checking specific error types)

### Migration Path

**Step 1: Opt-In Period** (2 weeks)

- New types available via new exports
- Old types still work with deprecation warnings
- Documentation shows both old and new patterns

**Step 2: Deprecation** (4 weeks)

- Old patterns marked deprecated
- ESLint rules warn on old usage
- Codemod tool available for automatic migration

**Step 3: Removal** (Next major version)

- Old patterns removed
- Breaking change documented in changelog
- Migration guide in documentation

### Codemods

```typescript
// codemods/tool-to-builder.ts
// Converts old tool definitions to builder pattern

// Before
const tool: ToolDefinition<{ location: string }, WeatherData> = {
  name: 'get_weather',
  parameters: {
    /* JSON schema */
  },
  execute: async (args) => {
    /* ... */
  },
}

// After
const tool = makeToolDefinition({
  name: 'get_weather',
  schema: z.object({ location: z.string() }),
  execute: async (args) => {
    /* ... */
  },
})
```

### Backward Compatibility

**Maintain Compatibility**:

- Old hook signatures still work
- Existing tool definitions still valid
- Component props backward compatible

**Deprecation Warnings**:

```typescript
/**
 * @deprecated Use makeToolDefinition() instead
 */
export interface ToolDefinition<TArgs, TResult> {
  // ...
}
```

---

## Testing Strategy

### Type Tests

**Create Type Test Files**:

```typescript
// packages/react/src/types/__tests__/schema-inference.test-d.ts

import { expectType, expectError } from 'tsd'
import { makeToolDefinition, InferToolArgs, InferToolResult } from '../schema-inference'
import { z } from 'zod'

// Test: Schema inference works
const tool = makeToolDefinition({
  name: 'test',
  schema: z.object({
    name: z.string(),
    age: z.number(),
  }),
  execute: async (args) => {
    expectType<{ name: string; age: number }>(args)
    return { success: true }
  },
})

expectType<{ name: string; age: number }>({} as InferToolArgs<typeof tool>)

expectType<{ success: boolean }>({} as InferToolResult<typeof tool>)

// Test: Invalid schemas cause errors
expectError(
  makeToolDefinition({
    name: 'test',
    schema: z.object({ name: z.string() }),
    execute: async (args: { wrong: string }) => {
      // ❌ Should error: args type mismatch
    },
  })
)
```

### Runtime Tests

```typescript
// packages/react/src/hooks/__tests__/use-clarity-chat-types.test.ts

describe('useClarityChat types', () => {
  it('returns memory info when memory enabled', () => {
    const chat = useClarityChat({
      api: '/api/chat',
      memory: { enabled: true, strategy: 'sliding-window' },
    })

    // Memory info should be present
    expect(chat.memory.enabled).toBe(true)
    expect(chat.memory.strategy).toBe('sliding-window')
  })

  it('returns no memory info when memory disabled', () => {
    const chat = useClarityChat({
      api: '/api/chat',
      memory: { enabled: false },
    })

    // Memory info should indicate disabled
    expect(chat.memory.enabled).toBe(false)
  })
})
```

### Integration Tests

```typescript
// packages/react/src/__tests__/integration/type-safety.test.tsx

import { render, screen } from '@testing-library/react'
import { ChatMessage } from '@/components/message/ChatMessage'
import { makeToolDefinition } from '@/types/schema-inference'
import { z } from 'zod'

describe('Type-safe tool integration', () => {
  it('tool results are type-safe in components', async () => {
    const weatherTool = makeToolDefinition({
      name: 'get_weather',
      schema: z.object({ location: z.string() }),
      execute: async ({ location }) => ({
        temp: 72,
        condition: 'sunny',
        location,
      }),
    })

    const result = await weatherTool.execute(
      { location: 'San Francisco' },
      { callId: '1', startedAt: Date.now() }
    )

    // Result is typed correctly
    expect(result.temp).toBe(72)
    expect(result.condition).toBe('sunny')
    expect(result.location).toBe('San Francisco')
  })
})
```

### Test Coverage Goals

- **Type Tests**: 100% coverage of public type APIs
- **Runtime Tests**: 85%+ coverage of type utilities
- **Integration Tests**: All major type patterns tested end-to-end

---

## Success Metrics

### Developer Experience

**Qualitative Metrics**:

- Reduced need for explicit type annotations
- Better IntelliSense and autocomplete
- Clearer error messages
- Faster development velocity

**Quantitative Metrics**:

- 50% reduction in explicit type annotations
- 80% decrease in type-related issues in issue tracker
- 90% positive feedback in developer survey

### Type Safety

**Metrics**:

- Zero `any` types in public API
- 100% of functions have proper return types
- All exported types have JSDoc documentation
- Type test coverage at 100%

### Performance

**Metrics**:

- TypeScript compilation time < 10s for full build
- IDE responsiveness < 500ms for IntelliSense
- No type instantiation depth issues

---

## Risks & Mitigation

### Risk 1: Breaking Changes

**Impact**: High **Likelihood**: Medium

**Mitigation**:

- Extensive backward compatibility layer
- Phased rollout with deprecation period
- Comprehensive migration guide
- Automated codemods for common patterns

### Risk 2: Complexity

**Impact**: Medium **Likelihood**: Medium

**Mitigation**:

- Progressive enhancement (simple cases stay simple)
- Comprehensive documentation with examples
- Type complexity hidden in utilities
- Sensible defaults reduce configuration

### Risk 3: TypeScript Version Lock-In

**Impact**: Low **Likelihood**: Low

**Mitigation**:

- Target TypeScript 4.9+ (widely adopted)
- Avoid bleeding-edge features
- Polyfills for older versions where possible
- Clear minimum version requirements

### Risk 4: Build Performance

**Impact**: Medium **Likelihood**: Low

**Mitigation**:

- Profile TypeScript compilation regularly
- Use project references for incremental builds
- Optimize type complexity where needed
- Consider type-level caching strategies

---

## Future Enhancements

### Beyond Initial Implementation

**Advanced Patterns** (Future):

1. Higher-kinded types for even better inference
2. Nominal typing for stronger guarantees
3. Effect types for async operations
4. Algebraic data types for state machines

**Tooling** (Future):

1. VS Code extension for Clarity Chat
2. Type visualization tools
3. Interactive type playground
4. Automated type documentation generator

**Integration** (Future):

1. tRPC-style end-to-end type safety
2. OpenAPI schema generation from types
3. GraphQL type integration
4. Database schema synchronization

---

## References

### External Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vercel AI SDK Types](https://github.com/vercel/ai/tree/main/packages/core/src)
- [Assistant UI Types](https://github.com/Yonom/assistant-ui)
- [Zod Schema Validation](https://zod.dev/)
- [Type-Level TypeScript](https://github.com/gvergnaud/ts-pattern)

### Internal Documents

- [Current Architecture](../../architecture.md)
- [Best Practices](../../best-practices.md)
- [React Package Guide](../../../packages/react/CLAUDE.md)
- [API Refactoring Roadmap](./README.md)

---

## Appendix A: Type Patterns Comparison

### Current vs. Proposed

**Tool Definition**:

```typescript
// Current
const tool: ToolDefinition<{ location: string }, WeatherData> = {
  name: 'get_weather',
  description: 'Get weather',
  parameters: {
    type: 'object',
    properties: {
      location: { type: 'string' },
    },
    required: ['location'],
  },
  execute: async (args) => {
    // args: { location: string } via explicit type param
    return fetchWeather(args.location)
  },
}

// Proposed
const tool = makeToolDefinition({
  name: 'get_weather',
  description: 'Get weather',
  schema: z.object({
    location: z.string(),
  }),
  execute: async (args) => {
    // args: { location: string } inferred from schema
    return fetchWeather(args.location)
  },
})
```

**Hook Usage**:

```typescript
// Current
const chat = useClarityChat({ api: '/api/chat' })
// chat: { messages, append, isLoading, ... } - flat structure

chat.append({ role: 'user', content: 'Hello' })

// Proposed
const chat = useClarityChat({ api: '/api/chat' })
// chat: { messages, actions, status, memory }

chat.actions.append({ role: 'user', content: 'Hello' })
```

**Component Types**:

```typescript
// Current
export interface ChatMessageProps {
  message: UIMessage
  onEdit?: (id: string, content: string) => void
  // ... other props
}

export function ChatMessage(props: ChatMessageProps) {
  // Implementation
}

// Proposed
export namespace ChatMessage {
  export type Element = ComponentRef<typeof Primitive.div>
  export interface Props extends ComponentPropsWithoutRef<typeof Primitive.div> {
    message: UIMessage
    onEdit?: (id: string, content: string) => void
    // ... other props
  }
}

export const ChatMessage = forwardRef<ChatMessage.Element, ChatMessage.Props>((props, ref) => {
  // Implementation
})
```

---

## Appendix B: IntelliSense Improvements

### Before & After Examples

**Tool Definition IntelliSense**:

Before:

```typescript
const tool: ToolDefinition<, > = {
  // ❌ No help, must manually type generic params
}
```

After:

```typescript
const tool = makeToolDefinition({
  // ✅ IntelliSense suggests: name, description, schema, execute
  schema: z.object({
    // ✅ Full Zod autocomplete
  }),
  execute: async (args) => {
    // ✅ args typed from schema
    args. // ✅ IntelliSense shows inferred fields
  }
})
```

**Hook Return IntelliSense**:

Before:

```typescript
const chat = useClarityChat({...})
chat. // ✅ Shows: messages, append, isLoading, error, ...
      // ❌ But flat list of 20+ properties
```

After:

```typescript
const chat = useClarityChat({...})
chat. // ✅ Shows: messages, actions, status, memory
chat.actions. // ✅ Shows: append, regenerate, stop, setMessages
chat.status. // ✅ Shows: isLoading, isStreaming, error
```

**Component Props IntelliSense**:

Before:

```typescript
<ChatMessage
  // ✅ Basic props work
  message={msg}
  onEdit={}
/>
```

After:

```typescript
<ChatMessage
  // ✅ All props + namespace types
  ref={} // ✅ Knows ref type is ChatMessage.Element
  message={msg}
  components={{ // ✅ Type-safe overrides
    Text: CustomText, // ✅ Validated against correct signature
  }}
/>
```

---

## Changelog

| Date       | Version | Changes               | Author           |
| ---------- | ------- | --------------------- | ---------------- |
| 2026-01-27 | 1.0     | Initial specification | Engineering Team |

---

**End of Specification**
