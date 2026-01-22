# Tool Calling Quick Reference

**Quick reference for common tool calling operations**

---

## Setup

```typescript
import { ToolOrchestrator, type ToolDefinition } from '@clarity-chat/react'

const orchestrator = new ToolOrchestrator({
  autoApprove: false,        // Safe default
  defaultTimeout: 30000,     // 30 seconds
  enableCaching: true,       // Enable cache
  defaultCacheTtl: 300000,   // 5 minutes
  tools: [...]               // Pre-register tools
})
```

---

## Define a Tool

```typescript
const weatherTool: ToolDefinition = {
  name: 'get_weather',
  description: 'Get current weather for a location',
  parameters: {
    type: 'object',
    properties: {
      location: { type: 'string', description: 'City name' },
      units: { type: 'string', enum: ['celsius', 'fahrenheit'] }
    },
    required: ['location']
  },
  handler: async ({ location, units = 'celsius' }) => {
    const response = await fetch(`/api/weather?location=${location}&units=${units}`)
    return response.json()
  },
  requiresApproval: false,   // Optional: require user consent
  enableCaching: true,       // Optional: enable caching
  cacheTtl: 300000          // Optional: cache duration
}
```

---

## Register Tools

```typescript
// Single tool
orchestrator.registerTool(weatherTool)

// Multiple tools
orchestrator.registerTools([weatherTool, calculatorTool, databaseTool])

// In constructor
const orchestrator = new ToolOrchestrator({
  tools: [weatherTool, calculatorTool]
})
```

---

## Execute Tools

### Basic Execution

```typescript
const response = await orchestrator.executeTool('get_weather', {
  location: 'San Francisco',
  units: 'fahrenheit'
})

if (response.status === 'completed') {
  console.log(response.result)
}
```

### With Options

```typescript
const response = await orchestrator.executeTool('slow_tool', args, {
  timeout: 60000,           // Custom timeout
  skipCache: true,          // Skip cache
  skipValidation: true,     // Skip validation
  requireApproval: true,    // Require approval
  signal: abortController.signal // Abort signal
})
```

### Parallel Execution

```typescript
const [weather, calc, search] = await Promise.all([
  orchestrator.executeTool('get_weather', { location: 'London' }),
  orchestrator.executeTool('calculate', { expression: '10 + 5' }),
  orchestrator.executeTool('search', { query: 'React' })
])
```

### Sequential Execution

```typescript
const weather = await orchestrator.executeTool('get_weather', { location: 'Tokyo' })
const converted = await orchestrator.executeTool('calculate', {
  expression: `${weather.result.temperature} * 9/5 + 32`
})
```

---

## Approval Flow

### Listen for Approval Requests

```typescript
orchestrator.lifecycle.on('tool_pending_approval', (event) => {
  console.log('Approval needed for:', event.call.toolName)
  console.log('Arguments:', event.call.args)
})
```

### Approve Tool

```typescript
orchestrator.approveTool(callId, 'user@example.com')
const result = await orchestrator.executeApprovedTool(callId)
```

### Reject Tool

```typescript
orchestrator.rejectTool(callId, 'User declined', 'user@example.com')
```

---

## Events

### Subscribe to Events

```typescript
// Tool created
orchestrator.lifecycle.on('tool_call_created', (event) => {
  console.log('Created:', event.call.toolName)
})

// Tool executing
orchestrator.lifecycle.on('tool_executing', (event) => {
  console.log('Executing:', event.call.toolName)
})

// Tool completed
orchestrator.lifecycle.on('tool_completed', (event) => {
  console.log('Completed:', event.call.toolName)
  console.log('Duration:', event.call.duration, 'ms')
  console.log('Result:', event.result)
})

// Tool failed
orchestrator.lifecycle.on('tool_failed', (event) => {
  console.error('Failed:', event.call.toolName)
  console.error('Error:', event.error)
})

// Cache hit
orchestrator.lifecycle.on('tool_result_cached', (event) => {
  console.log('Cached:', event.call.toolName)
})
```

### All Events

| Event | When Fired |
|-------|-----------|
| `tool_call_created` | Call initiated |
| `tool_pending_approval` | Awaiting approval |
| `tool_approved` | Approved by user/system |
| `tool_rejected` | Rejected by user |
| `tool_executing` | Execution started |
| `tool_completed` | Successfully finished |
| `tool_failed` | Error occurred |
| `tool_timeout` | Execution timeout |
| `tool_cancelled` | Cancelled by user/system |
| `tool_result_cached` | Cache hit |
| `tool_cache_invalidated` | Cache cleared |

---

## Query & Monitoring

### Get Tool Calls

```typescript
// Get specific call
const call = orchestrator.getToolCall(callId)

// Get all calls
const allCalls = orchestrator.getAllToolCalls()

// Get calls by status
const pending = orchestrator.getToolCallsByStatus('pending_approval')
const completed = orchestrator.getToolCallsByStatus('completed')
const failed = orchestrator.getToolCallsByStatus('failed')

// Get pending approvals
const pendingApprovals = orchestrator.getPendingToolCalls()
```

### Statistics

```typescript
const stats = orchestrator.getStats()

console.log('Total tools:', stats.registry.totalTools)
console.log('Total calls:', stats.calls.total)
console.log('Completed calls:', stats.calls.byStatus.completed)
console.log('Cache hit rate:', stats.cache.hitRate)
```

### Cache Stats

```typescript
const cacheStats = orchestrator.getCacheStats()

console.log('Hits:', cacheStats.hits)
console.log('Misses:', cacheStats.misses)
console.log('Hit rate:', cacheStats.hitRate)
console.log('Size:', cacheStats.size)
```

---

## Cache Management

```typescript
// Clear specific tool cache
orchestrator.clearCache('get_weather')

// Clear all cache
orchestrator.clearCache()

// Skip cache for single call
await orchestrator.executeTool('tool', args, { skipCache: true })

// Disable caching for tool
const tool: ToolDefinition = {
  name: 'no_cache_tool',
  enableCaching: false,
  // ...
}

// Custom cache TTL
const tool: ToolDefinition = {
  name: 'short_cache_tool',
  cacheTtl: 60000, // 1 minute
  // ...
}
```

---

## React Integration

### Basic Hook Integration

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
      const response = await orchestrator.executeTool(
        toolCall.toolName,
        toolCall.args
      )
      return response.result
    }
  })

  return <ChatInterface messages={messages} onSend={append} />
}
```

### With Manual Approval

```typescript
export function ChatWithApproval() {
  const [pending, setPending] = useState<ToolCallRecord | null>(null)

  useEffect(() => {
    orchestrator.lifecycle.on('tool_pending_approval', (event) => {
      setPending(event.call)
    })
  }, [])

  const handleApprove = async () => {
    if (!pending) return
    orchestrator.approveTool(pending.id)
    const result = await orchestrator.executeApprovedTool(pending.id)
    setPending(null)
    return result.result
  }

  return (
    <>
      <ChatInterface />
      {pending && (
        <ApprovalDialog
          tool={pending}
          onApprove={handleApprove}
          onReject={() => {
            orchestrator.rejectTool(pending.id, 'User declined')
            setPending(null)
          }}
        />
      )}
    </>
  )
}
```

---

## Error Handling

### Try-Catch Pattern

```typescript
try {
  const response = await orchestrator.executeTool('tool', args)

  if (response.status === 'completed') {
    console.log('Success:', response.result)
  } else if (response.status === 'failed') {
    console.error('Tool failed:', response.error)
  } else if (response.status === 'timeout') {
    console.error('Tool timed out')
  }
} catch (error) {
  console.error('Execution error:', error)
}
```

### Status Checking

```typescript
const response = await orchestrator.executeTool('tool', args)

switch (response.status) {
  case 'completed':
    return response.result
  case 'failed':
    throw new Error(`Tool failed: ${response.error?.message}`)
  case 'timeout':
    throw new Error('Tool execution timed out')
  case 'cancelled':
    throw new Error('Tool execution was cancelled')
  default:
    throw new Error(`Unexpected status: ${response.status}`)
}
```

---

## Common Patterns

### Retry with Exponential Backoff

```typescript
async function executeWithRetry(
  toolName: string,
  args: ToolArguments,
  maxRetries = 3
) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const response = await orchestrator.executeTool(toolName, args)

    if (response.status === 'completed') {
      return response.result
    }

    if (attempt < maxRetries) {
      const delay = Math.pow(2, attempt - 1) * 1000
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw new Error('Max retries exceeded')
}
```

### Fallback Tools

```typescript
async function executeWithFallback(
  primaryTool: string,
  fallbackTool: string,
  args: ToolArguments
) {
  const primary = await orchestrator.executeTool(primaryTool, args)
  if (primary.status === 'completed') return primary.result

  const fallback = await orchestrator.executeTool(fallbackTool, args)
  if (fallback.status === 'completed') return fallback.result

  throw new Error('Both primary and fallback failed')
}
```

### Tool Result Wrapper

```typescript
async function execute(toolName: string, args: ToolArguments) {
  const response = await orchestrator.executeTool(toolName, args)

  if (response.status !== 'completed') {
    throw new Error(`Tool execution failed: ${response.error?.message}`)
  }

  return response.result
}

// Usage
const result = await execute('get_weather', { location: 'Paris' })
// No need to unwrap .result
```

---

## TypeScript Types

```typescript
import type {
  ToolDefinition,
  ToolArguments,
  ToolResult,
  ToolCallRecord,
  ToolCallStatus,
  ToolExecutionContext,
  OrchestrationResult,
  OrchestratorConfig
} from '@clarity-chat/react'

// Tool definition
const tool: ToolDefinition = { ... }

// Execution result
const response: OrchestrationResult = await orchestrator.executeTool(...)

// Call record
const call: ToolCallRecord = orchestrator.getToolCall(callId)

// Status
const status: ToolCallStatus = 'completed'
```

---

## Lifecycle States

```
created → pending_approval → approved → executing → completed
                          ↘          ↘          ↘
                           rejected  failed    timeout
                                              cancelled
```

| State | Terminal? | Description |
|-------|-----------|-------------|
| `created` | No | Call initiated |
| `pending_approval` | No | Waiting for user consent |
| `approved` | No | User/system approved |
| `rejected` | Yes | User declined |
| `executing` | No | Tool is running |
| `completed` | Yes | Successfully finished |
| `failed` | Yes | Error during execution |
| `timeout` | Yes | Execution took too long |
| `cancelled` | Yes | User/system cancelled |
| `cached` | Yes | Result from cache |

---

## Best Practices

### Security

✅ **DO**:
- Use `autoApprove: false` in production
- Validate tool inputs
- Set timeouts to prevent DoS
- Log all executions for audit

❌ **DON'T**:
- Never use `eval()` or `new Function()` in handlers
- Don't expose credentials in tool definitions
- Don't skip approval for sensitive operations

### Performance

✅ **DO**:
- Enable caching for expensive operations
- Execute independent tools in parallel
- Set appropriate cache TTLs
- Monitor cache hit rates

❌ **DON'T**:
- Don't fetch same data repeatedly
- Don't execute sequential when parallel is possible
- Don't set infinite timeouts

### UX

✅ **DO**:
- Show clear approval dialogs
- Display loading states
- Provide meaningful error messages
- Allow cancellation of long operations

❌ **DON'T**:
- Don't execute tools without user awareness
- Don't block UI during execution
- Don't hide errors from users

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Tool not found" | Register tool with `orchestrator.registerTool(tool)` |
| "Tool requires approval" | Set `autoApprove: true` or implement approval flow |
| "Validation failed" | Check args match parameter schema |
| "Timeout" | Increase timeout or optimize handler |
| Results are undefined | Unwrap with `response.result` |
| Events not firing | Use `orchestrator.lifecycle.on()` |

---

## Links

- [Complete Guide](./TOOL_CALLING_GUIDE.md)
- [Migration Guide](./MIGRATION_GUIDE.md)
- [Streaming Integration](./STREAMING_TOOLS.md)
- [Memory Integration](./MEMORY_TOOLS.md)

---

**Version**: 1.0.0
**Last Updated**: 2026-01-21
