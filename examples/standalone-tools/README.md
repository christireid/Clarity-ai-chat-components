# Standalone Tool System Example

<!-- visual-header -->

> **No screenshot** — These are copy-paste snippets rather than a runnable app, so there is nothing
> to screenshot. See the [tool-calling clips in the gallery](../../docs/GALLERY.md#tools).

<!-- visual-header -->

This example shows how to use the Clarity Chat tool calling system in **ANY React application**,
without requiring Clarity Chat UI components.

The tool system is completely framework-agnostic and works with:

- ✅ Plain React
- ✅ Next.js
- ✅ Remix
- ✅ Vite + React
- ✅ Create React App
- ✅ Any other React framework

## Installation

```bash
npm install @clarity-chat/react
# or
pnpm add @clarity-chat/react
# or
yarn add @clarity-chat/react
```

## Basic Usage (No UI Components Required)

```typescript
import { ToolOrchestrator } from '@clarity-chat/react/tools'

// 1. Define your tools
const weatherTool = {
  name: 'get_weather',
  description: 'Get weather for a location',
  parameters: {
    type: 'object',
    properties: {
      location: { type: 'string' },
    },
    required: ['location'],
  },
  handler: async ({ location }) => {
    const response = await fetch(`https://api.weather.com/...`)
    return response.json()
  },
}

// 2. Create orchestrator
const orchestrator = new ToolOrchestrator({
  autoApprove: true,
  tools: [weatherTool],
})

// 3. Execute tools
const result = await orchestrator.executeTool('get_weather', {
  location: 'San Francisco',
})

console.log(result.result) // { temperature: 72, ... }
```

## Usage with Any AI Provider

### With OpenAI

```typescript
import { ToolOrchestrator } from '@clarity-chat/react/tools'
import OpenAI from 'openai'

const orchestrator = new ToolOrchestrator({ tools: [...] })
const openai = new OpenAI()

async function chat(messages) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    tools: orchestrator.getAllTools().map(t => ({
      type: 'function',
      function: {
        name: t.name,
        description: t.description,
        parameters: t.parameters
      }
    }))
  })

  // Handle tool calls
  if (response.choices[0].message.tool_calls) {
    for (const toolCall of response.choices[0].message.tool_calls) {
      const result = await orchestrator.executeTool(
        toolCall.function.name,
        JSON.parse(toolCall.function.arguments)
      )

      // Add result to messages and continue...
    }
  }
}
```

### With Anthropic Claude

```typescript
import { ToolOrchestrator } from '@clarity-chat/react/tools'
import Anthropic from '@anthropic-ai/sdk'

const orchestrator = new ToolOrchestrator({ tools: [...] })
const anthropic = new Anthropic()

async function chat(messages) {
  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    messages,
    tools: orchestrator.getAllTools().map(t => ({
      name: t.name,
      description: t.description,
      input_schema: t.parameters
    }))
  })

  // Handle tool use blocks
  for (const block of response.content) {
    if (block.type === 'tool_use') {
      const result = await orchestrator.executeTool(
        block.name,
        block.input
      )

      // Add result to messages and continue...
    }
  }
}
```

### With Vercel AI SDK

```typescript
import { ToolOrchestrator } from '@clarity-chat/react/tools'
import { streamText } from 'ai'

const orchestrator = new ToolOrchestrator({ tools: [...] })

const result = await streamText({
  model: openai('gpt-4'),
  messages,
  tools: {
    get_weather: {
      description: 'Get weather',
      parameters: z.object({
        location: z.string()
      }),
      execute: async ({ location }) => {
        const result = await orchestrator.executeTool('get_weather', { location })
        return result.result
      }
    }
  }
})
```

## Usage with Custom React UI

You can build your own UI components:

```typescript
import { ToolOrchestrator } from '@clarity-chat/react/tools'
import { useState, useEffect } from 'react'

function MyCustomChat() {
  const [messages, setMessages] = useState([])
  const [pendingTool, setPendingTool] = useState(null)

  const orchestrator = new ToolOrchestrator({
    autoApprove: false,
    tools: [...]
  })

  useEffect(() => {
    // Listen for approval requests
    orchestrator.lifecycle.on('tool_pending_approval', (event) => {
      setPendingTool(event.call)
    })
  }, [])

  const handleApprove = async () => {
    orchestrator.approveTool(pendingTool.id)
    const result = await orchestrator.executeApprovedTool(pendingTool.id)
    setPendingTool(null)

    // Update your UI with result
    setMessages(prev => [...prev, {
      role: 'tool',
      content: JSON.stringify(result.result)
    }])
  }

  return (
    <div>
      {/* Your custom chat UI */}
      <MessageList messages={messages} />

      {/* Your custom approval dialog */}
      {pendingTool && (
        <div>
          <h3>Approve tool: {pendingTool.toolName}?</h3>
          <button onClick={handleApprove}>Approve</button>
          <button onClick={() => {
            orchestrator.rejectTool(pendingTool.id, 'User declined')
            setPendingTool(null)
          }}>
            Reject
          </button>
        </div>
      )}
    </div>
  )
}
```

## Advanced Features

### Retry with Exponential Backoff

```typescript
import { executeWithRetry } from '@clarity-chat/react/tools'

const result = await executeWithRetry(
  orchestrator,
  'flaky_api',
  { url: '...' },
  {
    maxRetries: 3,
    initialDelay: 1000,
    backoffMultiplier: 2,
    onRetry: (attempt, delay) => {
      console.log(`Retry ${attempt} after ${delay}ms`)
    },
  }
)
```

### Fallback Execution

```typescript
import { executeWithFallback } from '@clarity-chat/react/tools'

const result = await executeWithFallback(
  orchestrator,
  { query: 'weather in NYC' },
  {
    tools: ['primary_api', 'secondary_api', 'backup_api'],
    onFallback: (failed, next) => {
      console.warn(`${failed} failed, trying ${next}`)
    },
  }
)
```

### Performance Monitoring

```typescript
import { ToolPerformanceMonitor, formatPerformanceReport } from '@clarity-chat/react/tools'

const monitor = new ToolPerformanceMonitor(orchestrator, {
  slowQueryThreshold: 3000,
  onSlowQuery: (metric) => {
    console.warn(`Slow: ${metric.toolName} took ${metric.duration}ms`)
  },
})

monitor.start()

// ... execute tools ...

const report = monitor.getReport()
console.log(formatPerformanceReport(report))
```

## No Clarity Components Required!

The tool system is completely independent:

| Component                | Requires Clarity? | Description                  |
| ------------------------ | ----------------- | ---------------------------- |
| `ToolOrchestrator`       | ❌ No             | Core tool execution engine   |
| `executeWithRetry`       | ❌ No             | Utility functions            |
| `ToolPerformanceMonitor` | ❌ No             | Performance tracking         |
| `ToolApprovalDialog`     | ✅ Optional       | Pre-built React UI component |

**You only need Clarity UI components if you want pre-built approval dialogs.** Everything else
works standalone!

## Integration Examples

See the `examples/` directory for complete examples:

- `examples/standalone-tools/next-js/` - Next.js App Router
- `examples/standalone-tools/remix/` - Remix
- `examples/standalone-tools/vite-react/` - Vite + React
- `examples/standalone-tools/vanilla-react/` - Plain React with custom UI

## API Reference

See the complete documentation:

- [Tool Calling Guide](../../packages/react/src/docs/TOOL_CALLING_GUIDE.md)
- [Quick Reference](../../packages/react/src/docs/TOOL_CALLING_QUICK_REFERENCE.md)
- [Migration Guide](../../packages/react/src/docs/MIGRATION_GUIDE.md)

## License

MIT
