# Tool Calling API Guide

**Decision Tree for Choosing the Right API**

This guide helps you choose the right tool calling API for your use case in Clarity AI Chat
Components.

---

## Quick Decision Tree

```
START: What do you need?

├─ Full-featured tool management + lifecycle tracking + events
│  → Use **ToolOrchestrator** ✅ RECOMMENDED
│  └─ Location: packages/react/src/core/tool-orchestrator.ts
│
├─ Functional/immutable state management for React
│  → Use **ToolsEngine** (app-api)
│  └─ Location: packages/react/src/app-api/tools-engine.ts
│
├─ Low-level execution only (no lifecycle, no registry)
│  → Use **ToolExecutor**
│  └─ Location: packages/react/src/core/tool-executor.ts
│
└─ Simple tool registry (legacy, deprecated)
   → Migrate to **ToolRegistry** (core)
   └─ Location: packages/react/src/core/tool-registry.ts
```

---

## API Comparison Table

| Feature                  | ToolOrchestrator  | ToolsEngine            | ToolExecutor        | ToolRegistry                    |
| ------------------------ | ----------------- | ---------------------- | ------------------- | ------------------------------- |
| **Use Case**             | Full-featured OOP | React state management | Low-level execution | Registry only                   |
| **Lifecycle Tracking**   | ✅ Yes            | ❌ No                  | ❌ No               | ❌ No                           |
| **Event System**         | ✅ Yes            | ❌ No                  | ❌ No               | ✅ Yes                          |
| **Approval Flow**        | ✅ Yes            | ✅ Yes                 | ❌ No               | ❌ No                           |
| **Validation**           | ✅ Yes            | ✅ Yes                 | ✅ Yes              | ✅ Yes                          |
| **Caching**              | ✅ Yes            | ✅ Yes                 | ✅ Yes              | ❌ No                           |
| **Rate Limiting**        | ✅ Yes            | ❌ No                  | ✅ Yes              | ❌ No                           |
| **Concurrency Control**  | ✅ Yes            | ❌ No                  | ✅ Yes              | ❌ No                           |
| **Audit Logging**        | ✅ Yes            | ❌ No                  | ❌ No               | ❌ No                           |
| **Timeout Protection**   | ✅ Yes            | ✅ Yes                 | ✅ Yes              | ❌ No                           |
| **Tool Discovery**       | ✅ Yes            | ✅ Yes                 | ❌ No               | ✅ Yes                          |
| **Immutable State**      | ❌ No             | ✅ Yes                 | ❌ No               | ❌ No                           |
| **TypeScript Inference** | ⭐⭐⭐⭐          | ⭐⭐⭐                 | ⭐⭐⭐⭐            | ⭐⭐⭐⭐⭐                      |
| **Complexity**           | Medium            | Low                    | Low                 | Very Low                        |
| **Status**               | ✅ Recommended    | ✅ Stable              | ✅ Stable           | ⚠️ Deprecated (agents/tools.ts) |

---

## Detailed Use Cases

### 1. ToolOrchestrator - Full-Featured Application

**When to use:**

- You need complete tool lifecycle management
- You want event-driven architecture
- You need approval flows for sensitive tools
- You want audit logging for compliance
- You need rate limiting and concurrency control
- You're building a production application

**Example:**

```typescript
import { ToolOrchestrator } from '@clarity/core/tool-orchestrator'

const orchestrator = new ToolOrchestrator({
  autoApprove: false, // Require explicit approval
  enableCaching: true,
  tools: [weatherTool, calculatorTool],
})

// Subscribe to lifecycle events
orchestrator.lifecycle.on('tool_completed', (event) => {
  console.log(`✓ ${event.call.toolName} completed in ${event.duration}ms`)
})

// Execute tool with full lifecycle
const result = await orchestrator.executeTool('get_weather', {
  location: 'San Francisco',
})

// Get statistics
const stats = orchestrator.getStats()
console.log(`Cache hit rate: ${stats.cache.hitRate}`)

// Export audit logs
const auditLogs = orchestrator.lifecycle.exportAuditLogs()
```

**Key Features:**

- ✅ Registry + Executor + Lifecycle in one unified API
- ✅ Comprehensive event system
- ✅ Built-in approval flow
- ✅ Statistics and monitoring
- ✅ Cache management
- ✅ Enterprise-grade security controls

---

### 2. ToolsEngine - React State Management

**When to use:**

- You're using React with functional/immutable state patterns
- You want to store tool state in React state (useState, useReducer)
- You prefer functional programming over OOP
- You don't need lifecycle events or audit logging
- You want minimal bundle size

**Example:**

```typescript
import { createToolsEngine, executeTool } from '@clarity/app-api/tools-engine'
import { useState } from 'react'

function MyComponent() {
  const [toolsState, setToolsState] = useState(() =>
    createToolsEngine({
      autoApprove: false,
      registry: [weatherTool, calculatorTool],
    })
  )

  const handleExecuteTool = async (name: string, params: any) => {
    const { state: newState, result } = await executeTool(toolsState, name, params)
    setToolsState(newState)
    return result
  }

  return (
    <div>
      <button onClick={() => handleExecuteTool('get_weather', { location: 'NYC' })}>
        Get Weather
      </button>
    </div>
  )
}
```

**Key Features:**

- ✅ Immutable state updates (perfect for React)
- ✅ No external state management required
- ✅ Functional API
- ✅ Built-in tools (calculator, time, uuid, json formatter)
- ❌ No lifecycle events
- ❌ No audit logging

---

### 3. ToolExecutor - Low-Level Execution

**When to use:**

- You only need tool execution, not registry or lifecycle
- You're building a custom tool system
- You want maximum control
- You're integrating with existing architecture
- You need rate limiting and concurrency control without lifecycle overhead

**Example:**

```typescript
import { ToolExecutor } from '@clarity/core/tool-executor'

const executor = new ToolExecutor(undefined, {
  enableRateLimit: true,
  maxRequestsPerWindow: 100,
  rateLimitWindowMs: 60000,
  enableConcurrencyLimit: true,
  maxConcurrentExecutions: 10,
})

// Execute tool directly
const result = await executor.execute(
  weatherTool,
  {
    location: 'Boston',
  },
  {
    timeout: 5000,
    signal: abortController.signal,
  }
)

// Check stats
const stats = executor.getStats()
console.log(`Active executions: ${stats.concurrency.active}`)
console.log(`Rate limit: ${stats.rateLimit.currentRequests}/${stats.rateLimit.maxRequests}`)
```

**Key Features:**

- ✅ Lightweight execution engine
- ✅ Validation, timeout, caching
- ✅ Rate limiting and concurrency control
- ✅ AbortSignal support
- ❌ No registry (you manage tools)
- ❌ No lifecycle tracking
- ❌ No events

---

### 4. ToolRegistry - Tool Management Only

**When to use:**

- You only need to register and discover tools
- You're building a custom execution system
- You want type-safe tool definitions
- You need namespacing and search

**Example:**

```typescript
import { ToolRegistry, globalToolRegistry } from '@clarity/core/tool-registry'

// Use global instance
globalToolRegistry.register(weatherTool)
globalToolRegistry.register(calculatorTool)

// Or create isolated instance
const registry = new ToolRegistry()
registry.registerMany([weatherTool, calculatorTool])

// Namespace tools
const weatherNamespace = registry.namespace('weather')
weatherNamespace.register(weatherTool)

// Search tools
const mathTools = registry.search('calculate')

// Get tool for execution
const tool = registry.get('get_weather')
if (tool) {
  // Execute with your own logic
}
```

**Key Features:**

- ✅ Type-safe tool registration
- ✅ Validation on registration
- ✅ Event emission (tool_registered, tool_unregistered)
- ✅ Fuzzy search
- ✅ Namespacing
- ❌ No execution
- ❌ No lifecycle

---

## Migration Guide

### From Legacy ToolRegistry (agents/tools.ts) → Core ToolRegistry

```typescript
// ❌ Old (deprecated)
import { ToolRegistry } from '@clarity/agents/tools'
const registry = new ToolRegistry([tool1, tool2])

// ✅ New (recommended)
import { ToolRegistry } from '@clarity/core/tool-registry'
const registry = new ToolRegistry()
registry.registerMany([tool1, tool2])

// Or use global instance
import { globalToolRegistry } from '@clarity/core/tool-registry'
globalToolRegistry.registerMany([tool1, tool2])
```

**Benefits of migration:**

- ✅ JSON Schema validation
- ✅ Event system
- ✅ Namespace support
- ✅ Better TypeScript inference
- ✅ Consistent with Orchestrator

---

## Best Practices

### 1. Choose ToolOrchestrator for Most Use Cases

```typescript
// ✅ RECOMMENDED for production applications
import { ToolOrchestrator } from '@clarity/core/tool-orchestrator'

const orchestrator = new ToolOrchestrator({
  autoApprove: false, // Always false in production
  enableCaching: true,
  defaultTimeout: 30000,
  tools: myTools,
})

// Enable audit logging for compliance
const orchestrator = new ToolOrchestrator({
  // ... other config
})

// Note: Audit logging is configured in ToolLifecycleManager
const lifecycle = new ToolLifecycleManager({
  auditLog: {
    enabled: true,
    maxEntries: 10000,
    includeSensitiveData: false,
  },
})
```

### 2. Use ToolsEngine for Simple React Apps

```typescript
// ✅ GOOD for simple React state management
import { createToolsEngine } from '@clarity/app-api/tools-engine'

const [tools, setTools] = useState(() => createToolsEngine({ autoApprove: false }))
```

### 3. Never Use autoApprove in Production

```typescript
// ❌ DANGER: autoApprove bypasses security
const orchestrator = new ToolOrchestrator({
  autoApprove: true, // Will throw error in production
})

// ✅ SAFE: Require explicit approval
const orchestrator = new ToolOrchestrator({
  autoApprove: false,
})

// Approve manually
orchestrator.approveTool(callId, userId)
```

### 4. Enable Rate Limiting for Public APIs

```typescript
// ✅ RECOMMENDED for user-facing tools
const executor = new ToolExecutor(lifecycle, {
  enableRateLimit: true,
  maxRequestsPerWindow: 100,
  rateLimitWindowMs: 60000,
  enableConcurrencyLimit: true,
  maxConcurrentExecutions: 10,
})
```

### 5. Use Lifecycle Events for Monitoring

```typescript
// ✅ RECOMMENDED for observability
orchestrator.lifecycle.on('tool_failed', (event) => {
  logger.error('Tool execution failed', {
    tool: event.call.toolName,
    error: event.error,
    duration: event.call.duration,
  })
})

orchestrator.lifecycle.on('tool_timeout', (event) => {
  metrics.increment('tool.timeout', {
    tool: event.call.toolName,
  })
})
```

---

## Common Patterns

### Pattern 1: Approval Flow with UI

```typescript
const orchestrator = new ToolOrchestrator({ autoApprove: false, tools })

// Listen for approval requests
orchestrator.lifecycle.on('tool_pending_approval', async (event) => {
  const approved = await showApprovalDialog({
    tool: event.call.toolName,
    args: event.call.args,
    description: event.toolDefinition.description,
  })

  if (approved) {
    orchestrator.approveTool(event.call.id, currentUserId)
    const result = await orchestrator.executeApprovedTool(event.call.id)
    displayResult(result)
  } else {
    orchestrator.rejectTool(event.call.id, 'User declined')
  }
})

// Request execution
orchestrator.executeTool('dangerous_operation', params).catch(() => {
  // Expected: approval required
})
```

### Pattern 2: Progress Tracking

```typescript
orchestrator.lifecycle.on('tool_progress', (event) => {
  updateProgressBar(event.call.toolName, event.progress)
})

// In your tool implementation
async execute(args, context) {
  for (let i = 0; i < 100; i++) {
    await doWork(i)

    // Update progress
    lifecycle.updateProgress(context.callId, i + 1, `Processing item ${i + 1}/100`)
  }
}
```

### Pattern 3: Retry with Exponential Backoff

```typescript
async function executeWithRetry(
  orchestrator: ToolOrchestrator,
  toolName: string,
  args: any,
  maxRetries = 3
) {
  for (let i = 0; i < maxRetries; i++) {
    const result = await orchestrator.executeTool(toolName, args)

    if (result.status === 'completed') {
      return result
    }

    if (result.status === 'failed' || result.status === 'timeout') {
      const delay = Math.pow(2, i) * 1000 // 1s, 2s, 4s
      await new Promise((resolve) => setTimeout(resolve, delay))
      continue
    }

    throw new Error(`Tool execution ${result.status}`)
  }

  throw new Error(`Tool failed after ${maxRetries} retries`)
}
```

---

## Security Checklist

When implementing tool calling:

- [ ] Set `autoApprove: false` in production
- [ ] Enable rate limiting for user-facing tools
- [ ] Enable concurrency limits to prevent resource exhaustion
- [ ] Use `requiresApproval: true` for sensitive tools (database, file system, API calls)
- [ ] Enable audit logging for compliance requirements
- [ ] Set appropriate timeouts for all tools
- [ ] Validate tool arguments with JSON Schema
- [ ] Sanitize sensitive data in logs (`includeSensitiveData: false`)
- [ ] Use AbortSignal for cancellable operations
- [ ] Monitor lifecycle events for failures and timeouts

---

## Performance Considerations

### Caching

```typescript
// Enable caching for expensive operations
const weatherTool: ToolDefinition = {
  name: 'get_weather',
  cacheable: true,
  cacheTtl: 300000, // 5 minutes
  execute: async (args) => {
    // Expensive API call
    return await weatherApi.fetch(args.location)
  },
}
```

### Concurrency Control

```typescript
// Prevent resource exhaustion
const executor = new ToolExecutor(lifecycle, {
  enableConcurrencyLimit: true,
  maxConcurrentExecutions: 10, // Max 10 tools running in parallel
})
```

### Rate Limiting

```typescript
// Protect against abuse
const executor = new ToolExecutor(lifecycle, {
  enableRateLimit: true,
  maxRequestsPerWindow: 100, // 100 requests per minute
  rateLimitWindowMs: 60000,
})
```

---

## Troubleshooting

### "autoApprove cannot be enabled in production"

**Cause:** You set `autoApprove: true` in a production environment.

**Solution:** Set `autoApprove: false` and implement proper approval flow.

```typescript
// ✅ Fix
const orchestrator = new ToolOrchestrator({
  autoApprove: false,
})
```

### "Tool requires approval"

**Cause:** Tool has `requiresApproval: true` and `autoApprove` is disabled.

**Solution:** Manually approve the tool or use approval flow pattern.

```typescript
orchestrator.approveTool(callId, userId)
const result = await orchestrator.executeApprovedTool(callId)
```

### "Rate limit exceeded"

**Cause:** Too many tool executions in the rate limit window.

**Solution:** Implement backoff logic or increase rate limit.

```typescript
const executor = new ToolExecutor(lifecycle, {
  enableRateLimit: true,
  maxRequestsPerWindow: 200, // Increase limit
})
```

---

## Summary

**Quick Recommendations:**

- 🚀 **Production apps**: Use **ToolOrchestrator** (recommended)
- ⚛️ **React apps**: Use **ToolsEngine** (functional state)
- 🔧 **Custom systems**: Use **ToolExecutor** + **ToolRegistry**
- ⚠️ **Legacy code**: Migrate to canonical APIs

**Key Principles:**

1. Always disable `autoApprove` in production
2. Enable rate limiting and concurrency control
3. Use lifecycle events for monitoring
4. Enable audit logging for compliance
5. Validate all tool arguments
6. Set appropriate timeouts

For more details, see the source files:

- `packages/react/src/core/tool-orchestrator.ts`
- `packages/react/src/core/tool-executor.ts`
- `packages/react/src/core/tool-registry.ts`
- `packages/react/src/core/tool-lifecycle.ts`
- `packages/react/src/app-api/tools-engine.ts`
