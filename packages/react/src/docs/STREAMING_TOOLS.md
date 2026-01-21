# Streaming + Tool Calling Integration

**Version**: 1.0
**Last Updated**: 2026-01-21

---

## Overview

This document describes how tool calling integrates with streaming responses in Clarity Chat. Understanding these semantics is crucial for building robust, responsive AI chat applications.

---

## Core Concepts

### 1. Streaming Flow

In a streaming chat response:
1. **Text tokens stream in** progressively
2. **Tool call requests** can appear mid-stream
3. **Stream pauses** while tools execute
4. **Tool results** are incorporated
5. **Stream resumes** with final response

### 2. Tool Invocation States During Streaming

```
┌─────────────────────────────────────────────────────────────┐
│                    Streaming Timeline                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Text Tokens                                                │
│  ─────────►  partial-call  ─────►  call  ─────►  executing │
│             (streaming)          (complete)      (paused)   │
│                                                              │
│  ◄─────────  result  ◄─────────  Text Tokens               │
│            (resume)              (continue)                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 3. State Progression

| State | Description | Stream Status | Action Required |
|-------|-------------|---------------|-----------------|
| `partial-call` | Tool call streaming in | **Active** | Continue receiving |
| `call` | Tool call complete | **Paused** | Validate & prepare |
| `executing` | Tool is running | **Paused** | Wait for completion |
| `result` | Tool completed | **Ready** | Resume stream |
| `error` | Tool failed | **Ready** | Resume with error |

---

## Streaming Semantics

### 1. Stream Pause Behavior

**When does streaming pause?**

The stream pauses when:
- A complete tool call is detected (state: `call`)
- Tool requires execution before continuing
- LLM needs tool result to generate next tokens

**The stream does NOT pause for:**
- Partial tool calls (state: `partial-call`)
- Text being generated before/after tool calls
- Tool calls in previous messages (already completed)

### 2. Partial Tool Calls

During streaming, tool calls arrive incrementally:

```typescript
// Frame 1: Partial arguments
{
  toolCallId: 'call_123',
  toolName: 'get_weather',
  state: 'partial-call',
  rawArgs: '{"location": "San Fr'  // Incomplete
}

// Frame 2: More arguments
{
  toolCallId: 'call_123',
  toolName: 'get_weather',
  state: 'partial-call',
  rawArgs: '{"location": "San Francisco"'  // Still incomplete
}

// Frame 3: Complete
{
  toolCallId: 'call_123',
  toolName: 'get_weather',
  state: 'call',
  args: { location: 'San Francisco' }  // Parsed and complete
}
```

**UI Handling**:
- Show "calling tool..." indicator for `partial-call`
- Parse arguments optimistically if possible
- Handle parse errors gracefully

### 3. Multiple Tool Calls

**Sequential Tool Calls** (Most Common):
```
Text → Tool1 → Tool2 → Text
```

Stream pauses after each tool completes:
1. Stream text tokens
2. Pause for Tool1 execution
3. Resume with Tool1 result
4. Pause for Tool2 execution
5. Resume with Tool2 result
6. Stream final text

**Parallel Tool Calls** (Advanced):
```
Text → [Tool1, Tool2, Tool3] → Text
```

Stream pauses once, executes all tools concurrently:
1. Stream text tokens
2. Detect multiple tool calls
3. Execute all tools in parallel
4. Resume when all complete
5. Stream final text

**Determining Parallel vs Sequential**:
- **LLM decides**: Some models specify parallel execution
- **Tool configuration**: `tool.parallelizable` flag
- **Orchestrator setting**: `allowParallelExecution` option

---

## Integration Patterns

### Pattern 1: Simple Streaming with Tools

```typescript
import { ToolOrchestrator } from '@clarity-chat/react/core/tool-orchestrator'
import { useChat } from '@clarity-chat/react/hooks/chat/use-chat-enhanced'

const orchestrator = new ToolOrchestrator({
  autoApprove: true,  // For this example
  tools: [weatherTool, calculatorTool]
})

function ChatComponent() {
  const { messages, append, isLoading } = useChat({
    api: '/api/chat',
    onToolCall: async (toolCall) => {
      // Stream has paused here
      const result = await orchestrator.executeTool(
        toolCall.toolName,
        toolCall.args
      )

      return result.result
    }
  })

  return (
    <div>
      {messages.map(msg => (
        <MessageComponent key={msg.id} message={msg} />
      ))}
      {isLoading && <LoadingIndicator />}
    </div>
  )
}
```

### Pattern 2: Manual Approval During Streaming

```typescript
const orchestrator = new ToolOrchestrator({
  autoApprove: false  // Require approval
})

function ChatComponent() {
  const [pendingTools, setPendingTools] = useState<ToolCall[]>([])

  const { messages, append } = useChat({
    api: '/api/chat',
    onToolCall: async (toolCall) => {
      // Stream paused, awaiting approval

      // Show approval UI
      setPendingTools(prev => [...prev, toolCall])

      // Wait for user approval (this would be async in real app)
      const approved = await waitForApproval(toolCall.id)

      if (approved) {
        const result = await orchestrator.executeTool(
          toolCall.toolName,
          toolCall.args
        )
        return result.result
      } else {
        throw new Error('Tool rejected by user')
      }
    }
  })

  return (
    <div>
      {pendingTools.map(tool => (
        <ApprovalDialog
          key={tool.id}
          tool={tool}
          onApprove={() => handleApprove(tool.id)}
          onReject={() => handleReject(tool.id)}
        />
      ))}
      {/* ... messages ... */}
    </div>
  )
}
```

### Pattern 3: Progress Updates for Long-Running Tools

```typescript
const orchestrator = new ToolOrchestrator()

orchestrator.lifecycle.on('tool_progress', (event) => {
  // Update UI with progress
  updateToolProgress(event.call.id, event.progress, event.message)
})

async function executeLongRunningTool(toolCall) {
  const result = await orchestrator.executeTool(
    toolCall.toolName,
    toolCall.args,
    {
      timeout: 60000  // 1 minute for long operations
    }
  )

  return result.result
}
```

---

## Edge Cases & Error Handling

### 1. User Interruption During Tool Execution

**Scenario**: User sends new message while tool is executing

**Behavior**:
- Current tool execution continues (or gets cancelled)
- New message starts new conversation turn
- Previous tool result may be discarded

**Handling**:
```typescript
const abortController = new AbortController()

useChat({
  onToolCall: async (toolCall) => {
    try {
      const result = await orchestrator.executeTool(
        toolCall.toolName,
        toolCall.args,
        { signal: abortController.signal }
      )
      return result.result
    } catch (error) {
      if (error.message.includes('cancelled')) {
        // Tool was cancelled, handle gracefully
        return { cancelled: true }
      }
      throw error
    }
  },
  onNewMessage: () => {
    // Cancel in-flight tool executions
    abortController.abort()
  }
})
```

### 2. Tool Execution Timeout

**Scenario**: Tool takes too long to execute

**Behavior**:
- Tool execution times out after configured duration
- Stream resumes with error state
- User sees timeout message

**Handling**:
```typescript
useChat({
  onToolCall: async (toolCall) => {
    const result = await orchestrator.executeTool(
      toolCall.toolName,
      toolCall.args,
      { timeout: 30000 }  // 30 seconds
    )

    if (result.status === 'timeout') {
      // Show timeout message to user
      return {
        error: `Tool ${toolCall.toolName} timed out. Please try again.`
      }
    }

    return result.result
  }
})
```

### 3. Tool Execution Failure

**Scenario**: Tool throws error during execution

**Behavior**:
- Error is caught and logged
- Stream resumes with error state
- LLM may retry or provide fallback

**Handling**:
```typescript
useChat({
  onToolCall: async (toolCall) => {
    const result = await orchestrator.executeTool(
      toolCall.toolName,
      toolCall.args
    )

    if (result.status === 'failed') {
      // Log error for debugging
      console.error('Tool execution failed:', result.error)

      // Return error to LLM
      return {
        error: result.error?.message || 'Tool execution failed'
      }
    }

    return result.result
  }
})
```

### 4. Malformed Tool Call

**Scenario**: LLM generates invalid tool arguments

**Behavior**:
- Validation fails before execution
- Stream resumes with validation error
- LLM sees error and may retry

**Handling**:
```typescript
// Validation happens automatically in ToolExecutor
// If validation fails, ToolValidationError is thrown

useChat({
  onToolCall: async (toolCall) => {
    try {
      const result = await orchestrator.executeTool(
        toolCall.toolName,
        toolCall.args
      )
      return result.result
    } catch (error) {
      if (error.name === 'ToolValidationError') {
        // Return validation error to LLM
        return {
          error: `Invalid arguments: ${error.message}`
        }
      }
      throw error
    }
  }
})
```

### 5. Network Interruption

**Scenario**: Network connection drops during streaming

**Behavior**:
- Stream connection lost
- Tool execution may or may not complete
- UI should show disconnected state

**Handling**:
```typescript
useChat({
  onError: (error) => {
    if (error.message.includes('network') || error.message.includes('connection')) {
      // Show reconnection UI
      showNetworkError()

      // Attempt to recover
      retryConnection()
    }
  },
  onReconnect: () => {
    // Check if any tools were executing
    const executing = orchestrator.getToolCallsByStatus('executing')

    // Handle in-flight tools (may need to retry)
    for (const call of executing) {
      handleInFlightTool(call)
    }
  }
})
```

---

## Streaming Adapters

### OpenAI Streaming with Tools

OpenAI's streaming format includes tool calls:

```typescript
// Streaming chunks:
{ delta: { content: "Let me check" } }
{ delta: { tool_calls: [{ index: 0, id: "call_123", type: "function", function: { name: "get_weather" } }] } }
{ delta: { tool_calls: [{ index: 0, function: { arguments: '{"loc' } }] } }
{ delta: { tool_calls: [{ index: 0, function: { arguments: 'ation": "SF"}' } }] } }
{ delta: { content: " The weather is" } }
```

**Adapter responsibilities**:
1. Accumulate tool call chunks
2. Detect when tool call is complete
3. Pause stream
4. Execute tool
5. Resume stream with result

### Anthropic Streaming with Tools

Anthropic's format uses content blocks:

```typescript
// Streaming events:
{ type: "content_block_start", index: 0, content_block: { type: "tool_use", id: "toolu_123", name: "get_weather" } }
{ type: "content_block_delta", index: 0, delta: { type: "input_json_delta", partial_json: '{"location":"' } }
{ type: "content_block_delta", index: 0, delta: { type: "input_json_delta", partial_json: 'SF"}' } }
{ type: "content_block_stop", index: 0 }
```

**Adapter responsibilities**:
1. Track content blocks by index
2. Accumulate JSON deltas
3. Parse complete tool calls
4. Handle tool execution
5. Continue with response

---

## Performance Considerations

### 1. Tool Execution Latency

**Impact on UX**:
- Stream appears "frozen" during tool execution
- User may think app is broken

**Mitigations**:
- Show "executing tool..." indicator
- Display progress bar for long operations
- Set reasonable timeouts (30s default)
- Use caching for repeated calls

### 2. Parallel Tool Execution

**Benefits**:
- Faster completion for multiple tools
- Better UX (shorter pause)

**Risks**:
- Race conditions if tools share state
- Resource contention

**Best Practice**:
```typescript
const orchestrator = new ToolOrchestrator({
  // Only parallelize safe tools
  tools: tools.map(tool => ({
    ...tool,
    parallelizable: tool.category === 'readonly'
  }))
})
```

### 3. Result Caching

**Benefits**:
- Instant results for repeated calls
- Reduced API costs
- Better performance

**Configuration**:
```typescript
const weatherTool: ToolDefinition = {
  name: 'get_weather',
  cacheable: true,
  cacheTtl: 300000,  // 5 minutes
  // ...
}
```

---

## Testing Streaming + Tools

### Test Scenarios

1. **Happy Path**: Text → Tool → Result → Text
2. **Multiple Tools**: Text → Tool1 → Tool2 → Text
3. **Parallel Tools**: Text → [Tool1, Tool2] → Text
4. **Tool Failure**: Text → Tool (error) → Text
5. **Timeout**: Text → Tool (timeout) → Text
6. **Cancellation**: Text → Tool (user cancels) → Text
7. **Invalid Args**: Text → Tool (validation error) → Text
8. **Network Loss**: Text → Tool → (disconnect) → Reconnect

### Example Test

```typescript
import { describe, it, expect } from 'vitest'

describe('Streaming with Tools', () => {
  it('should pause stream during tool execution', async () => {
    const events: string[] = []

    const { streamResponse } = await simulateStream({
      onChunk: (chunk) => events.push('chunk'),
      onToolCall: async (tool) => {
        events.push('tool_start')
        await delay(100)
        events.push('tool_end')
        return { result: 'done' }
      }
    })

    await streamResponse()

    // Stream should pause for tool
    expect(events).toEqual([
      'chunk',  // Text before tool
      'tool_start',
      'tool_end',
      'chunk'   // Text after tool
    ])
  })
})
```

---

## Debugging Guide

### Common Issues

#### Issue 1: Stream Never Resumes

**Symptoms**: Stream pauses, tool executes, but no new tokens appear

**Causes**:
- Tool result not returned properly
- Error thrown but not caught
- Stream connection lost

**Debug**:
```typescript
orchestrator.lifecycle.on('all', (event) => {
  console.log('[Lifecycle]', event.type, event.call)
})
```

#### Issue 2: Tool Called Repeatedly

**Symptoms**: Same tool called multiple times in succession

**Causes**:
- Tool result not reaching LLM
- LLM retrying failed tool call
- Infinite loop in tool logic

**Debug**:
```typescript
const callCounts = new Map<string, number>()

orchestrator.lifecycle.on('tool_requested', (event) => {
  const count = callCounts.get(event.call.toolName) || 0
  callCounts.set(event.call.toolName, count + 1)

  if (count > 3) {
    console.error('Tool called too many times:', event.call.toolName)
  }
})
```

#### Issue 3: Partial Tool Calls Stuck

**Symptoms**: Tool shows "calling..." but never completes

**Causes**:
- JSON parsing incomplete
- Stream ended prematurely
- Malformed tool call from LLM

**Debug**:
```typescript
useChat({
  onToolCall: (toolCall) => {
    if (toolCall.state === 'partial-call') {
      console.warn('Partial tool call:', toolCall.rawArgs)

      // Try to parse anyway
      try {
        const args = JSON.parse(toolCall.rawArgs)
        console.log('Parsed:', args)
      } catch (e) {
        console.error('Parse failed:', e)
      }
    }
  }
})
```

---

## Best Practices

### 1. Always Show Tool Activity

```typescript
function ToolActivityIndicator({ message }: { message: AssistantMessage }) {
  const invocations = getToolInvocations(message)

  return (
    <>
      {invocations.map(inv => (
        <div key={inv.toolCallId}>
          {inv.state === 'partial-call' && <Spinner />}
          {inv.state === 'call' && <Text>Calling {inv.toolName}...</Text>}
          {inv.state === 'executing' && (
            <Progress value={inv.progress} label={inv.statusMessage} />
          )}
          {inv.state === 'result' && <Check />}
          {inv.state === 'error' && <Error message={inv.error} />}
        </div>
      ))}
    </>
  )
}
```

### 2. Handle All Tool States

```typescript
switch (invocation.state) {
  case 'partial-call':
    return <LoadingSpinner />
  case 'call':
    return <PendingApproval tool={invocation} />
  case 'executing':
    return <ExecutingTool tool={invocation} />
  case 'result':
    return <ToolResult tool={invocation} />
  case 'error':
    return <ToolError tool={invocation} />
}
```

### 3. Set Reasonable Timeouts

```typescript
const orchestrator = new ToolOrchestrator({
  defaultTimeout: 30000  // 30s for most tools
})

// Override for specific tools
const longRunningTool: ToolDefinition = {
  name: 'analyze_document',
  timeout: 120000,  // 2 minutes
  // ...
}
```

### 4. Provide Retry Mechanism

```typescript
async function executeToolWithRetry(toolCall: ToolCall, maxRetries = 2) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const result = await orchestrator.executeTool(
      toolCall.toolName,
      toolCall.args
    )

    if (result.status === 'completed') {
      return result.result
    }

    if (attempt < maxRetries) {
      console.log(`Retry ${attempt + 1}/${maxRetries}`)
      await delay(1000 * (attempt + 1))  // Exponential backoff
    }
  }

  throw new Error('Tool execution failed after retries')
}
```

### 5. Cache Aggressively (When Safe)

```typescript
const readOnlyTools = [
  weatherTool,
  searchTool,
  calculatorTool
].map(tool => ({
  ...tool,
  cacheable: true,
  cacheTtl: 300000  // 5 minutes
}))

const orchestrator = new ToolOrchestrator({
  tools: readOnlyTools
})
```

---

## Summary

### Key Takeaways

1. **Streaming pauses** when a complete tool call is detected
2. **Partial tool calls** are streamed progressively (state: `partial-call`)
3. **Tool execution** happens while stream is paused
4. **Stream resumes** after tool completes (or fails)
5. **Error handling** is critical for robust UX
6. **Progress indicators** prevent user confusion
7. **Timeouts** prevent hanging operations
8. **Caching** improves performance for repeated calls

### State Flow Summary

```
Text Streaming → partial-call → call → executing → result/error → Resume Streaming
     ↓              ↓            ↓         ↓           ↓               ↓
  Display        Show         Pause     Show        Show          Continue
   text        indicator      UI      progress    result          text
```

---

**End of Streaming + Tool Integration Guide**
