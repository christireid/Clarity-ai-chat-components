# Complete Tool Calling Guide

**Comprehensive guide to tool calling architecture in Clarity Chat**

Version: 1.0.0
Last Updated: 2026-01-21

---

## Table of Contents

1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Quick Start](#quick-start)
4. [Core Concepts](#core-concepts)
5. [Component Reference](#component-reference)
6. [Integration Patterns](#integration-patterns)
7. [Advanced Topics](#advanced-topics)
8. [Best Practices](#best-practices)
9. [Migration Guide](#migration-guide)
10. [Troubleshooting](#troubleshooting)

---

## Introduction

### What is Tool Calling?

Tool calling enables AI assistants to interact with external systems, APIs, and functions during conversations. Instead of only generating text, the AI can:

- **Execute code** (calculations, data processing)
- **Fetch data** (weather, stock prices, database queries)
- **Perform actions** (send emails, create files, make API calls)
- **Access knowledge** (search documents, query databases)

### When to Use Tool Calling

**Use tool calling when**:
- You need real-time data (weather, stock prices, etc.)
- You want to perform calculations or data transformations
- Your AI needs to interact with external APIs or databases
- You're building agentic workflows with multiple steps
- You need to verify AI responses with actual data

**Don't use tool calling when**:
- The AI's knowledge is sufficient (no real-time data needed)
- Simple text generation is adequate
- You want to minimize complexity
- Performance is critical and tools would add latency

### System Requirements

- **React**: 19.0.0 or higher
- **TypeScript**: 5.0.0 or higher
- **Node**: 20.0.0 or higher

---

## Architecture Overview

### Component Hierarchy

```
┌─────────────────────────────────────────┐
│         ToolOrchestrator                │  ← High-level API
│  (Unified interface for everything)    │
└─────────────────────────────────────────┘
          │        │        │
          ▼        ▼        ▼
    ┌─────────┐ ┌─────────┐ ┌─────────┐
    │Registry │ │Executor │ │Lifecycle│
    │         │ │         │ │ Manager │
    └─────────┘ └─────────┘ └─────────┘
          │        │        │
          ▼        ▼        ▼
    [Tools]   [Validation] [Events]
              [Cache]      [Tracking]
```

### Component Responsibilities

| Component | Responsibility | When to Use |
|-----------|---------------|-------------|
| **ToolOrchestrator** | Unified API for all tool operations | Always - your main entry point |
| **ToolRegistry** | Store and retrieve tool definitions | Advanced: custom tool management |
| **ToolExecutor** | Execute tools with validation & caching | Advanced: custom execution logic |
| **ToolLifecycleManager** | Track state, emit events | Advanced: custom lifecycle hooks |

### Data Flow

```
User Input
    ↓
AI Model generates tool call
    ↓
ToolOrchestrator.executeTool()
    ↓
┌─────────────────────┐
│ 1. Registry Lookup  │ ← Get tool definition
└─────────────────────┘
    ↓
┌─────────────────────┐
│ 2. Lifecycle Create │ ← Track call start
└─────────────────────┘
    ↓
┌─────────────────────┐
│ 3. Approval Check   │ ← Manual or auto approve
└─────────────────────┘
    ↓
┌─────────────────────┐
│ 4. Executor Run     │ ← Validate, cache, execute
└─────────────────────┘
    ↓
┌─────────────────────┐
│ 5. Lifecycle Update │ ← Mark complete/failed
└─────────────────────┘
    ↓
Return result to AI
    ↓
AI continues response
```

---

## Quick Start

### Basic Setup (Auto-Approve)

For development or trusted environments:

```typescript
import { ToolOrchestrator } from '@clarity-chat/react'

// 1. Define your tools
const weatherTool = {
  name: 'get_weather',
  description: 'Get current weather for a location',
  parameters: {
    type: 'object',
    properties: {
      location: { type: 'string', description: 'City name' },
      units: {
        type: 'string',
        enum: ['celsius', 'fahrenheit'],
        default: 'celsius'
      }
    },
    required: ['location']
  },
  handler: async ({ location, units }) => {
    const response = await fetch(
      `https://api.weather.com/v1/${location}?units=${units}`
    )
    return response.json()
  }
}

// 2. Create orchestrator
const orchestrator = new ToolOrchestrator({
  autoApprove: true, // ⚠️ Only for development!
  tools: [weatherTool]
})

// 3. Execute tool
const result = await orchestrator.executeTool('get_weather', {
  location: 'San Francisco',
  units: 'fahrenheit'
})

console.log(result.result) // { temperature: 72, condition: 'sunny', ... }
```

### Production Setup (Manual Approval)

For production environments with user consent:

```typescript
const orchestrator = new ToolOrchestrator({
  autoApprove: false, // ✅ Safe default
  tools: [weatherTool, databaseTool]
})

// Subscribe to approval requests
orchestrator.lifecycle.on('tool_pending_approval', async (event) => {
  const { call, tool } = event

  // Show UI to user
  const approved = await showApprovalDialog({
    toolName: tool.name,
    description: tool.description,
    args: call.args
  })

  if (approved) {
    orchestrator.approveTool(call.id, 'user@example.com')
    const result = await orchestrator.executeApprovedTool(call.id)
    return result
  } else {
    orchestrator.rejectTool(call.id, 'User declined', 'user@example.com')
  }
})
```

### React Integration

```typescript
'use client'

import { useChat } from '@clarity-chat/react'
import { ToolOrchestrator } from '@clarity-chat/react'

const orchestrator = new ToolOrchestrator({
  autoApprove: true,
  tools: [weatherTool, calculatorTool]
})

export function ChatComponent() {
  const { messages, append } = useChat({
    api: '/api/chat',
    onToolCall: async (toolCall) => {
      // Execute tool when AI requests it
      const result = await orchestrator.executeTool(
        toolCall.toolName,
        toolCall.args
      )
      return result.result
    }
  })

  return (
    <ChatInterface
      messages={messages}
      onSend={append}
    />
  )
}
```

---

## Core Concepts

### 1. Tool Definitions

A tool definition describes what a tool does and how to execute it:

```typescript
interface ToolDefinition {
  /** Unique tool name (snake_case recommended) */
  name: string

  /** Human-readable description for AI */
  description: string

  /** JSON Schema for parameters */
  parameters: JSONSchema

  /** Async function that executes the tool */
  handler: (args: ToolArguments) => Promise<ToolResult>

  /** Require user approval? (default: false) */
  requiresApproval?: boolean

  /** Enable caching? (default: true) */
  enableCaching?: boolean

  /** Cache TTL in ms (default: 300000 = 5min) */
  cacheTtl?: number
}
```

#### Example: Calculator Tool

```typescript
const calculatorTool: ToolDefinition = {
  name: 'calculate',
  description: 'Perform mathematical calculations. Supports +, -, *, /, parentheses.',
  parameters: {
    type: 'object',
    properties: {
      expression: {
        type: 'string',
        description: 'Math expression (e.g., "2 + 2", "(10 * 5) / 2")'
      }
    },
    required: ['expression']
  },
  handler: async ({ expression }) => {
    // Use safe evaluator (no eval/Function)
    const result = safeEvaluateMath(expression)
    return { result, expression }
  }
}
```

### 2. Tool Arguments

Tool arguments are the inputs passed to a tool:

```typescript
type ToolArguments = Record<string, unknown>

// Examples:
const weatherArgs = {
  location: 'San Francisco',
  units: 'fahrenheit'
}

const calcArgs = {
  expression: '(10 + 5) * 2'
}

const searchArgs = {
  query: 'React hooks documentation',
  maxResults: 5,
  filters: { type: 'tutorial' }
}
```

### 3. Tool Results

Tool results are the outputs returned by a tool:

```typescript
type ToolResult = unknown // Any JSON-serializable value

// Examples:
const weatherResult = {
  temperature: 72,
  condition: 'sunny',
  humidity: 65,
  windSpeed: 10,
  forecast: [...]
}

const calcResult = {
  result: 30,
  expression: '(10 + 5) * 2'
}

const searchResult = {
  results: [
    { title: '...', url: '...', snippet: '...' },
    { title: '...', url: '...', snippet: '...' }
  ],
  count: 2
}
```

### 4. Lifecycle States

Every tool call goes through a lifecycle:

```
created → pending_approval → approved → executing → completed
                          ↘          ↘          ↘
                           rejected  failed    timeout
                                              cancelled
```

| State | Description | Next States |
|-------|-------------|-------------|
| `created` | Call initiated | `pending_approval`, `approved` |
| `pending_approval` | Waiting for user consent | `approved`, `rejected` |
| `approved` | User/system approved | `executing` |
| `rejected` | User declined | (terminal) |
| `executing` | Tool is running | `completed`, `failed`, `timeout`, `cancelled` |
| `completed` | Successfully finished | (terminal) |
| `failed` | Error during execution | (terminal) |
| `timeout` | Execution took too long | (terminal) |
| `cancelled` | User/system cancelled | (terminal) |
| `cached` | Result from cache | (terminal) |

### 5. Lifecycle Events

Events are emitted during the lifecycle:

```typescript
// Subscribe to events
orchestrator.lifecycle.on('tool_call_created', (event) => {
  console.log(`📝 Tool call created: ${event.call.toolName}`)
})

orchestrator.lifecycle.on('tool_pending_approval', (event) => {
  console.log(`⏳ Waiting for approval: ${event.call.toolName}`)
})

orchestrator.lifecycle.on('tool_approved', (event) => {
  console.log(`✅ Approved by: ${event.approvedBy}`)
})

orchestrator.lifecycle.on('tool_executing', (event) => {
  console.log(`⚙️  Executing: ${event.call.toolName}`)
})

orchestrator.lifecycle.on('tool_completed', (event) => {
  console.log(`✓ Completed in ${event.call.duration}ms`)
})

orchestrator.lifecycle.on('tool_failed', (event) => {
  console.error(`❌ Failed: ${event.error.message}`)
})
```

**All Events**:
1. `tool_call_created` - Call initiated
2. `tool_pending_approval` - Awaiting approval
3. `tool_approved` - Approved by user/system
4. `tool_rejected` - Rejected by user
5. `tool_executing` - Execution started
6. `tool_completed` - Successfully finished
7. `tool_failed` - Error occurred
8. `tool_timeout` - Execution timeout
9. `tool_cancelled` - Cancelled by user/system
10. `tool_result_cached` - Cache hit
11. `tool_cache_invalidated` - Cache cleared

---

## Component Reference

### ToolOrchestrator

Main API for all tool operations.

#### Constructor

```typescript
const orchestrator = new ToolOrchestrator({
  autoApprove?: boolean        // Auto-approve tools (default: false)
  defaultTimeout?: number       // Timeout in ms (default: 30000)
  enableCaching?: boolean       // Enable cache (default: true)
  defaultCacheTtl?: number      // Cache TTL in ms (default: 300000)
  tools?: ToolDefinition[]      // Pre-register tools
})
```

#### Methods

**Tool Management**:
```typescript
registerTool(tool: ToolDefinition): void
registerTools(tools: ToolDefinition[]): void
unregisterTool(name: string): boolean
getTool(name: string): ToolDefinition | undefined
getAllTools(): ToolDefinition[]
```

**Tool Execution**:
```typescript
executeTool(
  toolName: string,
  args: ToolArguments,
  options?: {
    timeout?: number
    signal?: AbortSignal
    skipValidation?: boolean
    skipCache?: boolean
    context?: Partial<ToolExecutionContext>
    requireApproval?: boolean
  }
): Promise<OrchestrationResult>
```

**Approval Flow**:
```typescript
approveTool(callId: string, approvedBy?: string): void
rejectTool(callId: string, reason: string, rejectedBy?: string): void
executeApprovedTool(callId: string): Promise<OrchestrationResult>
```

**Query & Monitoring**:
```typescript
getToolCall(callId: string): ToolCallRecord
getAllToolCalls(): ToolCallRecord[]
getToolCallsByStatus(status: ToolCallStatus): ToolCallRecord[]
getPendingToolCalls(): ToolCallRecord[]
getStats(): OrchestratorStats
```

**Cache Management**:
```typescript
clearCache(toolName?: string): void
getCacheStats(): CacheStats
```

**Lifecycle Management**:
```typescript
clearCompletedCalls(): void
reset(): void // Clears calls and cache
```

#### Return Types

**OrchestrationResult**:
```typescript
interface OrchestrationResult {
  callId: string                 // Call ID for tracking
  toolName: string               // Tool name
  args: ToolArguments            // Tool arguments
  status: ToolCallStatus         // Final status
  result?: ToolResult            // Execution result (if completed)
  error?: Error                  // Error (if failed)
  duration?: number              // Execution duration in ms
  cached?: boolean               // Whether result came from cache
  lifecycleRecord: ToolCallRecord // Full lifecycle record
}
```

---

## Integration Patterns

### Pattern 1: Simple Auto-Approve

Best for: Development, trusted environments

```typescript
const orchestrator = new ToolOrchestrator({
  autoApprove: true,
  tools: [weatherTool, calculatorTool]
})

function ChatComponent() {
  const { messages, append } = useChat({
    onToolCall: async (toolCall) => {
      const result = await orchestrator.executeTool(
        toolCall.toolName,
        toolCall.args
      )
      return result.result
    }
  })

  // ... rest of component
}
```

### Pattern 2: Manual Approval with UI

Best for: Production, user-facing apps

```typescript
const orchestrator = new ToolOrchestrator({
  autoApprove: false,
  tools: [weatherTool, databaseTool, emailTool]
})

function ChatComponent() {
  const [pendingTool, setPendingTool] = useState<ToolCallRecord | null>(null)

  useEffect(() => {
    orchestrator.lifecycle.on('tool_pending_approval', (event) => {
      setPendingTool(event.call)
    })
  }, [])

  const handleApprove = async () => {
    if (!pendingTool) return

    orchestrator.approveTool(pendingTool.id, 'user')
    const result = await orchestrator.executeApprovedTool(pendingTool.id)
    setPendingTool(null)

    // Send result back to AI
    return result.result
  }

  const handleReject = () => {
    if (!pendingTool) return
    orchestrator.rejectTool(pendingTool.id, 'User declined')
    setPendingTool(null)
  }

  return (
    <>
      <ChatInterface messages={messages} />

      {pendingTool && (
        <ApprovalDialog
          toolName={pendingTool.toolName}
          args={pendingTool.args}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </>
  )
}
```

### Pattern 3: Conditional Approval

Best for: Mixed security requirements

```typescript
const orchestrator = new ToolOrchestrator({
  autoApprove: false, // Default to manual
  tools: [
    { ...weatherTool, requiresApproval: false },  // Auto-approve
    { ...calculatorTool, requiresApproval: false }, // Auto-approve
    { ...databaseTool, requiresApproval: true },   // Manual approval
    { ...emailTool, requiresApproval: true }       // Manual approval
  ]
})

function ChatComponent() {
  const { messages, append } = useChat({
    onToolCall: async (toolCall) => {
      const tool = orchestrator.getTool(toolCall.toolName)

      if (tool?.requiresApproval) {
        // Show approval UI for sensitive tools
        const approved = await showApprovalDialog(toolCall)
        if (!approved) return { error: 'User declined' }
      }

      const result = await orchestrator.executeTool(
        toolCall.toolName,
        toolCall.args,
        { requireApproval: tool?.requiresApproval }
      )

      return result.result
    }
  })

  // ... rest of component
}
```

### Pattern 4: Streaming Integration

Best for: Real-time AI responses with tools

See [STREAMING_TOOLS.md](./STREAMING_TOOLS.md) for complete guide.

```typescript
const orchestrator = new ToolOrchestrator({
  autoApprove: true,
  tools: [weatherTool]
})

function StreamingChat() {
  const { messages, append, isLoading } = useChat({
    api: '/api/chat',
    experimental_streamMode: 'stream-tools',
    onToolCall: async (toolCall) => {
      // Stream pauses here automatically
      const result = await orchestrator.executeTool(
        toolCall.toolName,
        toolCall.args
      )
      // Stream resumes after tool completes
      return result.result
    }
  })

  return <ChatInterface messages={messages} isLoading={isLoading} />
}
```

### Pattern 5: Memory Integration

Best for: Persistent tool history

See [MEMORY_TOOLS.md](./MEMORY_TOOLS.md) for complete guide.

```typescript
const orchestrator = new ToolOrchestrator({
  autoApprove: true,
  tools: [weatherTool]
})

function ChatWithMemory() {
  const memory = useMemoryEngine()

  const { messages, append } = useChat({
    onToolCall: async (toolCall) => {
      const result = await orchestrator.executeTool(
        toolCall.toolName,
        toolCall.args
      )

      // Store tool call in memory
      await memory.addEntry({
        message: {
          role: 'assistant',
          content: 'Tool result',
          toolInvocations: [{
            state: 'result',
            toolCallId: result.callId,
            toolName: toolCall.toolName,
            args: toolCall.args,
            result: result.result
          }]
        },
        scope: 'thread',
        importance: 0.8
      })

      return result.result
    }
  })

  return <ChatInterface messages={messages} />
}
```

---

## Advanced Topics

### Parallel Tool Execution

Execute multiple tools simultaneously:

```typescript
const [weather1, weather2, calc] = await Promise.all([
  orchestrator.executeTool('get_weather', { location: 'London' }),
  orchestrator.executeTool('get_weather', { location: 'Paris' }),
  orchestrator.executeTool('calculate', { expression: '10 + 5' })
])

console.log('London:', weather1.result)
console.log('Paris:', weather2.result)
console.log('Calculation:', calc.result)
```

### Sequential Tool Chaining

Execute tools in sequence, using previous results:

```typescript
// Step 1: Get weather
const weather = await orchestrator.executeTool('get_weather', {
  location: 'Tokyo',
  units: 'celsius'
})

// Step 2: Convert temperature to Fahrenheit
const converted = await orchestrator.executeTool('calculate', {
  expression: `${weather.result.temperature} * 9/5 + 32`
})

console.log(`${weather.result.temperature}°C = ${converted.result.result}°F`)
```

### Custom Validation

Add custom validation logic:

```typescript
const orchestrator = new ToolOrchestrator({
  autoApprove: true,
  tools: [weatherTool]
})

// Wrap executeTool with custom validation
async function executeWithValidation(toolName: string, args: ToolArguments) {
  // Custom pre-execution validation
  if (toolName === 'get_weather' && !args.location) {
    throw new Error('Location is required for weather tool')
  }

  if (toolName === 'database_query' && args.query.includes('DELETE')) {
    throw new Error('DELETE queries are not allowed')
  }

  // Execute tool
  const result = await orchestrator.executeTool(toolName, args)

  // Custom post-execution validation
  if (result.status !== 'completed') {
    throw new Error(`Tool execution failed: ${result.error?.message}`)
  }

  return result.result
}
```

### Error Handling Strategies

**Strategy 1: Retry with Exponential Backoff**

```typescript
async function executeWithRetry(
  toolName: string,
  args: ToolArguments,
  maxRetries = 3
) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await orchestrator.executeTool(toolName, args)

      if (result.status === 'completed') {
        return result.result
      }

      if (result.status === 'failed' && attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt - 1) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }

      throw result.error || new Error('Tool execution failed')
    } catch (error) {
      if (attempt === maxRetries) throw error
    }
  }
}
```

**Strategy 2: Fallback Tools**

```typescript
async function executeWithFallback(
  primaryTool: string,
  fallbackTool: string,
  args: ToolArguments
) {
  try {
    const result = await orchestrator.executeTool(primaryTool, args)
    if (result.status === 'completed') return result.result
  } catch (error) {
    console.warn(`Primary tool ${primaryTool} failed, trying fallback`)
  }

  // Try fallback
  const fallbackResult = await orchestrator.executeTool(fallbackTool, args)
  if (fallbackResult.status === 'completed') return fallbackResult.result

  throw new Error('Both primary and fallback tools failed')
}
```

### Cache Management

**Clear Specific Tool Cache**:
```typescript
orchestrator.clearCache('get_weather')
```

**Clear All Cache**:
```typescript
orchestrator.clearCache()
```

**Disable Cache for Specific Call**:
```typescript
const result = await orchestrator.executeTool('get_weather', args, {
  skipCache: true
})
```

**Custom Cache TTL**:
```typescript
const weatherTool: ToolDefinition = {
  name: 'get_weather',
  description: '...',
  parameters: { ... },
  handler: async (args) => { ... },
  cacheTtl: 60000 // 1 minute
}
```

### Performance Monitoring

```typescript
// Track execution times
const startTime = Date.now()
const result = await orchestrator.executeTool('slow_tool', args)
const duration = Date.now() - startTime

console.log(`Tool executed in ${duration}ms`)
console.log(`Cached: ${result.cached}`)

// Get orchestrator stats
const stats = orchestrator.getStats()
console.log('Total tools:', stats.registry.totalTools)
console.log('Total calls:', stats.calls.total)
console.log('Cache hit rate:', stats.cache.hitRate)

// Get cache stats
const cacheStats = orchestrator.getCacheStats()
console.log('Cache hits:', cacheStats.hits)
console.log('Cache misses:', cacheStats.misses)
console.log('Cache size:', cacheStats.size)
```

---

## Best Practices

### 1. Security

**✅ DO**:
- Always use `autoApprove: false` in production
- Validate tool inputs before execution
- Use `requiresApproval: true` for sensitive tools (database, email, file system)
- Implement proper error handling
- Log all tool executions for audit trails
- Use timeout limits to prevent DoS

**❌ DON'T**:
- Never use `new Function()` or `eval()` in tool handlers
- Don't trust user input without validation
- Don't expose sensitive credentials in tool definitions
- Don't allow arbitrary code execution
- Don't skip approval for destructive operations

### 2. Performance

**✅ DO**:
- Enable caching for expensive operations
- Use appropriate cache TTL based on data freshness needs
- Execute independent tools in parallel with `Promise.all()`
- Set reasonable timeout values
- Monitor cache hit rates

**❌ DON'T**:
- Don't fetch the same data repeatedly (use cache)
- Don't execute sequential tools when parallel is possible
- Don't set infinite timeouts
- Don't cache data that changes frequently

### 3. User Experience

**✅ DO**:
- Show approval dialogs with clear tool information
- Display tool execution progress/loading states
- Provide meaningful error messages to users
- Allow users to cancel long-running tools
- Show which tools are available

**❌ DON'T**:
- Don't execute tools without user awareness
- Don't block the UI during tool execution
- Don't hide tool failures from users
- Don't show technical error details to non-technical users

### 4. Code Organization

**✅ DO**:
- Group related tools together
- Use TypeScript for type safety
- Write comprehensive JSDoc comments
- Create reusable tool factories
- Test tool handlers independently

**❌ DON'T**:
- Don't put tool definitions in UI components
- Don't hardcode URLs or credentials in tools
- Don't mix business logic with tool definitions

### 5. Testing

**✅ DO**:
- Write unit tests for tool handlers
- Test approval flows
- Test error scenarios
- Test cache behavior
- Use E2E tests for complete flows

**❌ DON'T**:
- Don't skip testing error cases
- Don't rely only on manual testing
- Don't test with production APIs (use mocks)

---

## Migration Guide

### From Old Tool System

If you're using the old tool calling system, follow this migration guide:

#### Step 1: Update Imports

**Before**:
```typescript
import { createToolEngine } from '@clarity-chat/react/tools'
```

**After**:
```typescript
import { ToolOrchestrator } from '@clarity-chat/react'
```

#### Step 2: Update Tool Definitions

**Before**:
```typescript
const tools = {
  get_weather: {
    description: 'Get weather',
    parameters: { ... },
    execute: async (args) => { ... }
  }
}
```

**After**:
```typescript
const weatherTool: ToolDefinition = {
  name: 'get_weather',
  description: 'Get weather',
  parameters: { ... },
  handler: async (args) => { ... }
}
```

#### Step 3: Update Tool Registration

**Before**:
```typescript
const engine = createToolEngine({ tools })
```

**After**:
```typescript
const orchestrator = new ToolOrchestrator({
  tools: [weatherTool]
})
```

#### Step 4: Update Tool Execution

**Before**:
```typescript
const result = await engine.execute('get_weather', args)
```

**After**:
```typescript
const result = await orchestrator.executeTool('get_weather', args)
console.log(result.result) // Note: result is wrapped
```

#### Step 5: Update Event Handling

**Before**:
```typescript
engine.on('toolExecuted', (event) => { ... })
```

**After**:
```typescript
orchestrator.lifecycle.on('tool_completed', (event) => { ... })
```

### Breaking Changes

1. **Return Value**: `executeTool()` returns `OrchestrationResult` (wrapped), not raw result
2. **Events**: New event names and structure
3. **Auto-Approve**: Default changed from `true` to `false`
4. **Tool Format**: Tools must include `name` field
5. **Handler Name**: `execute` renamed to `handler`

---

## Troubleshooting

### Tool Not Found

**Error**: `Tool not found: tool_name`

**Cause**: Tool not registered with orchestrator

**Fix**:
```typescript
// Register the tool
orchestrator.registerTool(toolDefinition)

// Or include in constructor
const orchestrator = new ToolOrchestrator({
  tools: [toolDefinition]
})
```

### Approval Required

**Error**: `Tool requires approval: tool_name`

**Cause**: Tool requires manual approval but none was given

**Fix**:
```typescript
// Option 1: Enable auto-approve (development only)
const orchestrator = new ToolOrchestrator({
  autoApprove: true
})

// Option 2: Manually approve
orchestrator.approveTool(callId, 'user')
const result = await orchestrator.executeApprovedTool(callId)

// Option 3: Disable approval for specific tool
const tool: ToolDefinition = {
  ...toolDefinition,
  requiresApproval: false
}
```

### Validation Failed

**Error**: `Validation failed: ...`

**Cause**: Arguments don't match tool's parameter schema

**Fix**:
```typescript
// Ensure args match the schema
const result = await orchestrator.executeTool('get_weather', {
  location: 'Paris', // ✅ Required field
  units: 'celsius'    // ✅ Valid enum value
})

// Check tool schema
const tool = orchestrator.getTool('get_weather')
console.log(tool.parameters)
```

### Timeout

**Error**: `Tool execution timeout`

**Cause**: Tool took longer than configured timeout

**Fix**:
```typescript
// Option 1: Increase timeout globally
const orchestrator = new ToolOrchestrator({
  defaultTimeout: 60000 // 60 seconds
})

// Option 2: Increase timeout for specific call
const result = await orchestrator.executeTool('slow_tool', args, {
  timeout: 120000 // 2 minutes
})

// Option 3: Optimize tool handler
const tool: ToolDefinition = {
  handler: async (args) => {
    // Add timeout to external calls
    const response = await fetch(url, {
      signal: AbortSignal.timeout(10000)
    })
    return response.json()
  }
}
```

### Cache Not Working

**Issue**: Results not being cached

**Possible Causes**:
1. Caching disabled globally
2. Cache TTL expired
3. Arguments are different (cache key mismatch)

**Fix**:
```typescript
// Enable caching globally
const orchestrator = new ToolOrchestrator({
  enableCaching: true
})

// Enable caching for specific tool
const tool: ToolDefinition = {
  ...toolDefinition,
  enableCaching: true,
  cacheTtl: 300000 // 5 minutes
}

// Check cache stats
const stats = orchestrator.getCacheStats()
console.log('Hit rate:', stats.hitRate)

// Clear and retry
orchestrator.clearCache()
```

---

## Additional Resources

- **[STREAMING_TOOLS.md](./STREAMING_TOOLS.md)** - Streaming integration guide
- **[MEMORY_TOOLS.md](./MEMORY_TOOLS.md)** - Memory integration guide
- **API Reference** - TypeScript definitions and API docs
- **Examples** - Sample implementations and use cases

---

## Support

For issues, questions, or feature requests:
- **GitHub Issues**: [github.com/christireid/Clarity-ai-chat-components/issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
- **Documentation**: [clarity-chat.dev/docs](https://clarity-chat.dev/docs)

---

**Version**: 1.0.0
**Last Updated**: 2026-01-21
**License**: MIT
