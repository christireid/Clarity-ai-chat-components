# Tool Call Types Guide

**Version**: 1.0 **Last Updated**: 2026-01-22 **Status**: Production Ready

This guide clarifies the three different tool call types in the Clarity Chat tool calling system and
when to use each.

---

## Quick Reference

| Type                | Purpose            | Layer        | States | Property Names                   | Use When                           |
| ------------------- | ------------------ | ------------ | ------ | -------------------------------- | ---------------------------------- |
| **ToolInvocation**  | Message/UI format  | Presentation | 5      | `toolCallId`, `toolName`, `args` | Adding tool calls to chat messages |
| **ToolsEngineCall** | Functional state   | Application  | 6      | `id`, `name`, `parameters`       | Using ToolsEngine functional API   |
| **ToolCallRecord**  | Lifecycle tracking | Internal     | 11     | `id`, `toolName`, `args`         | Using ToolLifecycleManager         |

---

## Overview

The Clarity Chat tool calling system uses **three different types** to represent tool calls at
different architectural layers:

```
┌─────────────────────────────────────────────────┐
│  PRESENTATION LAYER                             │
│  ToolInvocation → Chat messages, UI rendering   │
├─────────────────────────────────────────────────┤
│  APPLICATION LAYER                              │
│  ToolsEngineCall → React state, functional API  │
├─────────────────────────────────────────────────┤
│  INTERNAL LAYER                                 │
│  ToolCallRecord → Lifecycle, events, audit      │
└─────────────────────────────────────────────────┘
```

These types serve **different purposes** and are **not interchangeable**, but **converter
functions** are provided for interoperability.

---

## 1. ToolInvocation (Presentation Layer)

### Purpose

Canonical format for representing tool calls in **chat messages**. Used for UI rendering and
conversation history.

### Location

```typescript
import type {
  ToolInvocation,
  ToolCallResult,
  ToolCallError,
  CompleteToolCall,
  ExecutingToolCall,
} from './types/tool-invocation'
```

### States (5 total)

```typescript
type ToolInvocationState =
  | 'partial-call' // Streaming: incomplete arguments
  | 'call' // Complete tool call, awaiting execution
  | 'executing' // Currently executing
  | 'result' // Successfully completed
  | 'error' // Execution failed
```

### Structure

```typescript
// Discriminated union - type-safe!
type ToolInvocation =
  | PartialToolCall // state: 'partial-call'
  | CompleteToolCall // state: 'call'
  | ExecutingToolCall // state: 'executing'
  | ToolCallResult // state: 'result'
  | ToolCallError // state: 'error'

// All variants have:
interface ToolInvocationBase {
  toolCallId: string // ← Note: toolCallId
  toolName: string // ← Note: toolName
  state: ToolInvocationState
  timestamp?: number
}

// Result variant:
interface ToolCallResult extends ToolInvocationBase {
  state: 'result'
  args: Record<string, unknown>
  result: unknown
  duration?: number
  cached?: boolean
}
```

### When to Use

✅ **Use ToolInvocation when:**

- Adding tool calls to `AssistantMessage.toolInvocations`
- Rendering tool calls in the UI
- Serializing conversation history
- Working with streaming AI responses

❌ **Don't use for:**

- Internal lifecycle tracking (use ToolCallRecord)
- Functional state management (use ToolsEngineCall)

### Example

```typescript
import type { AssistantMessage, ToolInvocation } from './types/tool-invocation'

const toolInvocation: ToolInvocation = {
  toolCallId: 'call_123',
  toolName: 'get_weather',
  state: 'result',
  args: { location: 'San Francisco' },
  result: { temp: 72, condition: 'sunny' },
  duration: 234,
}

const message: AssistantMessage = {
  id: 'msg_456',
  role: 'assistant',
  content: 'Let me check the weather...',
  toolInvocations: [toolInvocation],
}
```

### Key Features

- **Discriminated union**: TypeScript narrows type based on `state`
- **Type-safe state transitions**: Helper functions ensure valid transitions
- **Streaming-friendly**: Supports partial calls during streaming
- **UI-ready**: Includes all data needed for rendering

---

## 2. ToolsEngineCall (Application Layer)

### Purpose

Functional/immutable state representation for **React applications**. Used with the ToolsEngine
functional API.

### Location

```typescript
import type { ToolsEngineCall } from './app-api/tools-engine'

// Legacy alias (deprecated):
// import type { ToolCall } from './app-api/tools-engine'
```

### States (6 total)

```typescript
type ToolsEngineCallStatus =
  | 'pending' // Awaiting approval
  | 'approved' // Approved, ready to execute
  | 'executing' // Currently executing
  | 'completed' // Successfully completed
  | 'failed' // Execution failed
  | 'timeout' // Execution timed out
```

### Structure

```typescript
interface ToolsEngineCall {
  id: string // ← Note: id
  name: string // ← Note: name (not toolName)
  parameters: Record<string, unknown> // ← Note: parameters (not args)
  status: ToolsEngineCallStatus
  result?: unknown
  error?: string
  startTime?: number
  endTime?: number
}
```

### When to Use

✅ **Use ToolsEngineCall when:**

- Using the ToolsEngine functional API
- Managing tool state in React components
- Working with immutable state patterns
- Need functional/pure operations

❌ **Don't use for:**

- Chat messages (use ToolInvocation)
- Full lifecycle tracking (use ToolCallRecord)

### Example

```typescript
import {
  createToolsEngine,
  createToolCall,
  approveToolCall,
  executeToolCall,
  type ToolsEngineCall,
} from './app-api/tools-engine'

// Initial state
let state = createToolsEngine({ registry: tools })

// Create call
const { state: newState, call } = createToolCall(state, 'get_weather', {
  location: 'San Francisco',
})
state = newState

// Approve call
state = approveToolCall(state, call.id)

// Execute call
const { state: finalState, result } = await executeToolCall(state, call.id)
state = finalState

// Access completed call
const completedCall: ToolsEngineCall = state.completedCalls[0]
```

### Key Features

- **Immutable updates**: All functions return new state
- **React-friendly**: Works with useState/useReducer
- **Simple structure**: Flat interface for easy serialization
- **Built-in caching**: Result caching with TTL
- **Backwards compatible**: Legacy `ToolCall` alias provided

---

## 3. ToolCallRecord (Internal Layer)

### Purpose

Comprehensive **lifecycle tracking** with events, audit logs, and rich metadata. Used by
ToolLifecycleManager.

### Location

```typescript
import type { ToolCallRecord, ToolCallStatus } from './core/tool-lifecycle'
import { ToolLifecycleManager } from './core/tool-lifecycle'
```

### States (11 total)

```typescript
type ToolCallStatus =
  | 'idle' // No active call
  | 'requested' // LLM requested tool call
  | 'pending_approval' // Awaiting user approval
  | 'approved' // Approved, ready to execute
  | 'rejected' // User rejected
  | 'executing' // Currently executing
  | 'completed' // Successfully completed
  | 'failed' // Execution failed
  | 'timeout' // Execution timed out
  | 'cancelled' // Execution cancelled
  | 'cached' // Result from cache
```

### Structure

```typescript
interface ToolCallRecord {
  id: string
  toolName: string // ← Note: toolName
  args: ToolArguments // ← Note: args
  status: ToolCallStatus
  context: ToolExecutionContext

  // Rich timestamp tracking
  timestamps: {
    requested?: number
    approved?: number
    rejected?: number
    executionStarted?: number
    executionEnded?: number
  }

  // Execution details
  result?: ToolResult
  error?: {
    message: string
    code?: string
    details?: unknown
  }
  rejectionReason?: string
  progress?: number // 0-100
  statusMessage?: string
  cached?: boolean
  duration?: number
  retryCount?: number
}
```

### When to Use

✅ **Use ToolCallRecord when:**

- Using ToolLifecycleManager for lifecycle tracking
- Need event emission for monitoring
- Need audit logging for compliance
- Building tool execution dashboards
- Implementing approval workflows

❌ **Don't use for:**

- Chat messages (use ToolInvocation)
- Simple functional state (use ToolsEngineCall)

### Example

```typescript
import { ToolLifecycleManager, type ToolCallRecord } from './core/tool-lifecycle'

const lifecycle = new ToolLifecycleManager({
  auditLog: {
    enabled: true,
    maxEntries: 1000,
  },
})

// Subscribe to lifecycle events
lifecycle.on('tool_requested', (event) => {
  console.log(`Tool requested: ${event.call.toolName}`)
})

lifecycle.on('tool_completed', (event) => {
  console.log(`Tool completed in ${event.duration}ms`)
})

// Create and track tool call
const call: ToolCallRecord = lifecycle.createToolCall(
  'get_weather',
  { location: 'SF' },
  { sessionId: 'session_123', userId: 'user_456' }
)

// Transition through lifecycle
lifecycle.markPendingApproval(call.id, toolDefinition)
lifecycle.approve(call.id)
lifecycle.markExecuting(call.id)
lifecycle.updateProgress(call.id, 50, 'Fetching weather data...')
lifecycle.complete(call.id, weatherData)

// Query audit logs
const logs = lifecycle.getAuditLogs({
  toolName: 'get_weather',
  startTime: Date.now() - 3600000, // Last hour
})
```

### Key Features

- **11-state lifecycle**: Most comprehensive state tracking
- **Event system**: Subscribe to all state transitions
- **Audit logging**: Immutable audit trail with sensitive data redaction
- **Progress tracking**: Real-time progress updates (0-100%)
- **Rich metadata**: Timestamps, context, retry counts
- **State validation**: Prevents invalid state transitions

---

## Interoperability

### Converting Between Types

The system provides converter functions for interoperability:

```typescript
// ToolsEngineCall → ToolCallRecord
import { toToolCallRecord } from './app-api/tools-engine'

const engineCall: ToolsEngineCall = createToolCall(state, 'tool', args).call
const record = toToolCallRecord(engineCall)
lifecycle.trackCall(record)
```

```typescript
// ToolsEngineCall → ToolInvocation (for messages)
import { toToolInvocation } from './app-api/tools-engine'

const engineCall: ToolsEngineCall = state.completedCalls[0]
const invocation = toToolInvocation(engineCall)

const message: AssistantMessage = {
  id: 'msg_123',
  role: 'assistant',
  content: 'Done!',
  toolInvocations: [invocation],
}
```

```typescript
// ToolInvocation → ToolCallRecord (manual conversion)
import type { ToolCallResult } from './types/tool-invocation'
import type { ToolCallRecord } from './core/tool-lifecycle'

function invocationToRecord(inv: ToolCallResult): Partial<ToolCallRecord> {
  return {
    id: inv.toolCallId,
    toolName: inv.toolName,
    args: inv.args,
    status: 'completed',
    result: inv.result,
    timestamps: {
      executionStarted: inv.executionStartedAt,
      executionEnded: inv.executionCompletedAt,
    },
    duration: inv.duration,
    cached: inv.cached,
  }
}
```

### Property Name Mapping

| ToolsEngineCall | ToolCallRecord | ToolInvocation | Meaning                |
| --------------- | -------------- | -------------- | ---------------------- |
| `id`            | `id`           | `toolCallId`   | Unique call identifier |
| `name`          | `toolName`     | `toolName`     | Name of the tool       |
| `parameters`    | `args`         | `args`         | Tool arguments         |
| `status`        | `status`       | `state`        | Current status/state   |

**Note**: Property names differ due to historical evolution and different use cases. Converters
handle these differences automatically.

---

## State Mapping

### ToolsEngineCall → ToolCallRecord

```typescript
const statusMap = {
  pending: 'pending_approval',
  approved: 'approved',
  executing: 'executing',
  completed: 'completed',
  failed: 'failed',
  timeout: 'timeout',
}
```

### ToolsEngineCall → ToolInvocation

```typescript
const stateMap = {
  pending: 'call',
  approved: 'call',
  executing: 'executing',
  completed: 'result',
  failed: 'error',
  timeout: 'error',
}
```

### ToolCallRecord → ToolInvocation

```typescript
const stateMap = {
  idle: 'call',
  requested: 'call',
  pending_approval: 'call',
  approved: 'call',
  rejected: 'error',
  executing: 'executing',
  completed: 'result',
  failed: 'error',
  timeout: 'error',
  cancelled: 'error',
  cached: 'result',
}
```

---

## Decision Tree

### Which type should I use?

```
START: What are you doing?

├─ Adding tool calls to chat messages?
│  → Use **ToolInvocation** ✅
│
├─ Using ToolsEngine functional API?
│  → Use **ToolsEngineCall** ✅
│
├─ Using ToolLifecycleManager for tracking?
│  → Use **ToolCallRecord** ✅
│
├─ Building a custom tool execution system?
│  ├─ Need lifecycle events & audit logs?
│  │  → Use **ToolCallRecord** with ToolLifecycleManager
│  │
│  ├─ Need React/immutable state management?
│  │  → Use **ToolsEngineCall** with ToolsEngine
│  │
│  └─ Just need to store tool call results?
│     → Use **ToolInvocation** (simplest)
│
└─ Migrating from legacy code?
   → Check property names: `handler` → `execute`
   → Check type names: `ToolCall` → `ToolsEngineCall`
```

---

## Common Pitfalls

### ❌ Mistake 1: Using wrong property names

```typescript
// WRONG: Mixing property names
const call: ToolInvocation = {
  id: 'call_123',           // ❌ Should be toolCallId
  name: 'get_weather',      // ❌ Should be toolName
  parameters: { ... },      // ❌ Should be args
  state: 'result',
}

// CORRECT:
const call: ToolInvocation = {
  toolCallId: 'call_123',   // ✅
  toolName: 'get_weather',  // ✅
  args: { ... },            // ✅
  state: 'result',
}
```

### ❌ Mistake 2: Using wrong type for context

```typescript
// WRONG: Using ToolsEngineCall in messages
const message: AssistantMessage = {
  role: 'assistant',
  content: 'Done!',
  toolInvocations: state.completedCalls, // ❌ Wrong type!
}

// CORRECT: Convert to ToolInvocation
import { toToolInvocation } from './app-api/tools-engine'

const message: AssistantMessage = {
  role: 'assistant',
  content: 'Done!',
  toolInvocations: state.completedCalls.map(toToolInvocation), // ✅
}
```

### ❌ Mistake 3: Assuming state names are consistent

```typescript
// WRONG: Assuming status names match
if (engineCall.status === 'result') {
  // ❌ No 'result' status in ToolsEngineCall
  // ...
}

// CORRECT: Use correct status names
if (engineCall.status === 'completed') {
  // ✅
  // ...
}
```

---

## Migration Guide

### From Legacy `ToolCall` to `ToolsEngineCall`

The old `ToolCall` type is now `ToolsEngineCall`. An alias is provided for backwards compatibility.

```typescript
// Old (still works, but deprecated):
import type { ToolCall } from './app-api/tools-engine'

// New (recommended):
import type { ToolsEngineCall } from './app-api/tools-engine'
```

**Action required**: Update imports before v2.0.0.

### From `handler` to `execute`

Old tool definitions used `handler`:

```typescript
// Old:
const tool = {
  name: 'my_tool',
  handler: async (args) => { ... },  // ❌ Deprecated
}

// New:
const tool: ToolDefinition = {
  name: 'my_tool',
  execute: async (args, context) => { ... },  // ✅ Correct
}
```

---

## FAQ

### Q: Why three different types?

**A**: Each type serves a different architectural layer:

- **ToolInvocation**: Presentation layer (messages, UI)
- **ToolsEngineCall**: Application layer (React state)
- **ToolCallRecord**: Internal layer (lifecycle, events)

This separation follows the **Single Responsibility Principle** and prevents type pollution across
layers.

### Q: Can I convert between types?

**A**: Yes! Use the converter functions:

- `toToolCallRecord()`: ToolsEngineCall → ToolCallRecord
- `toToolInvocation()`: ToolsEngineCall → ToolInvocation

### Q: Which type should I use for my use case?

**A**: Follow this rule:

- **Message/UI**: ToolInvocation
- **React state**: ToolsEngineCall
- **Lifecycle/audit**: ToolCallRecord

### Q: Why don't property names match?

**A**: Historical evolution. We maintain compatibility while providing converters. Future versions
may align property names.

### Q: Is `ToolCall` deprecated?

**A**: The name is deprecated (use `ToolsEngineCall`), but the type alias remains for backwards
compatibility until v2.0.0.

### Q: How do I add tool calls to messages?

**A**: Use `ToolInvocation`:

```typescript
const message: AssistantMessage = {
  id: 'msg_123',
  role: 'assistant',
  content: 'Let me check...',
  toolInvocations: [
    {
      toolCallId: 'call_123',
      toolName: 'get_weather',
      state: 'result',
      args: { location: 'SF' },
      result: { temp: 72 },
    },
  ],
}
```

---

## Related Documentation

- [Tool Calling API Guide](./TOOL_CALLING_API_GUIDE.md) - Which API to use
- [Migration Guide](./MIGRATION_GUIDE_TOOL_CALLING.md) - Migrating from legacy patterns
- [Tool Security Guide](./TOOL_SECURITY_GUIDE.md) - Security best practices
- [Tool Definition Reference](../src/types/tool-definition.ts) - ToolDefinition interface
- [Tool Invocation Types](../src/types/tool-invocation.ts) - ToolInvocation source
- [ToolsEngine API](../src/app-api/tools-engine.ts) - Functional API reference
- [Tool Lifecycle](../src/core/tool-lifecycle.ts) - Lifecycle manager reference

---

**Last Updated**: 2026-01-22 **Version**: 1.0 **Status**: Production Ready
