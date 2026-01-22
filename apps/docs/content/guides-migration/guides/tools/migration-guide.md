# Migration Guide: Tool Calling System

**Complete guide for migrating to the new tool calling architecture**

Version: 1.0.0
Last Updated: 2026-01-21

---

## Table of Contents

1. [Overview](#overview)
2. [Breaking Changes](#breaking-changes)
3. [Step-by-Step Migration](#step-by-step-migration)
4. [Code Examples](#code-examples)
5. [Common Patterns](#common-patterns)
6. [Troubleshooting](#troubleshooting)
7. [FAQ](#faq)

---

## Overview

### What Changed?

The tool calling system has been completely refactored to provide:

- **Better security**: Safe defaults (`autoApprove: false`)
- **Improved architecture**: Separation of concerns with dedicated components
- **Enhanced features**: Lifecycle tracking, caching, approval flows
- **Type safety**: Full TypeScript support with discriminated unions
- **Better DX**: Clearer APIs, comprehensive events, better error messages

### Timeline

- **Old System**: Deprecated as of 2026-01-21
- **New System**: Stable and recommended for all projects
- **Migration Window**: 3 months (until 2026-04-21)
- **Old System Removal**: Planned for 2026-07-01

### Should You Migrate?

**Yes, if**:
- You're using the old `createToolEngine()` API
- You want better security defaults
- You need lifecycle tracking and events
- You want caching and performance improvements
- You're starting a new project

**Maybe later, if**:
- Your current implementation works perfectly
- You're close to a major release and want stability
- You have limited development time right now

---

## Breaking Changes

### 1. Default Auto-Approve Changed

**Impact**: 🔴 HIGH - Your tools may stop executing

**Old Behavior**:
```typescript
const engine = createToolEngine({ tools })
// Auto-approve defaulted to TRUE
```

**New Behavior**:
```typescript
const orchestrator = new ToolOrchestrator({ tools })
// Auto-approve defaults to FALSE (safer)
```

**Migration**:
```typescript
// If you want old behavior (not recommended for production):
const orchestrator = new ToolOrchestrator({
  autoApprove: true, // ⚠️ Explicit opt-in
  tools
})

// Better: Implement approval flow
const orchestrator = new ToolOrchestrator({
  autoApprove: false, // ✅ Safe default
  tools
})
```

### 2. Result Structure Changed

**Impact**: 🟡 MEDIUM - You need to unwrap results

**Old Behavior**:
```typescript
const result = await engine.execute('get_weather', args)
console.log(result.temperature) // Direct access
```

**New Behavior**:
```typescript
const response = await orchestrator.executeTool('get_weather', args)
console.log(response.result.temperature) // Wrapped in .result
```

**Migration**:
```typescript
// Option 1: Unwrap manually
const response = await orchestrator.executeTool('get_weather', args)
const result = response.result

// Option 2: Destructure
const { result } = await orchestrator.executeTool('get_weather', args)

// Option 3: Create helper
async function execute(toolName: string, args: ToolArguments) {
  const response = await orchestrator.executeTool(toolName, args)
  return response.result
}
```

### 3. Event Names Changed

**Impact**: 🟡 MEDIUM - Event listeners need updating

**Old Events**:
```typescript
engine.on('toolExecuted', handler)
engine.on('toolFailed', handler)
engine.on('toolCached', handler)
```

**New Events**:
```typescript
orchestrator.lifecycle.on('tool_completed', handler)
orchestrator.lifecycle.on('tool_failed', handler)
orchestrator.lifecycle.on('tool_result_cached', handler)
```

**Migration**: See [Event Migration Table](#event-migration-table)

### 4. Tool Definition Format

**Impact**: 🟢 LOW - Mostly compatible

**Old Format**:
```typescript
const tools = {
  get_weather: {
    description: 'Get weather',
    parameters: { ... },
    execute: async (args) => { ... }
  }
}
```

**New Format**:
```typescript
const weatherTool: ToolDefinition = {
  name: 'get_weather', // ✅ Add name field
  description: 'Get weather',
  parameters: { ... },
  handler: async (args) => { ... } // ✅ Rename execute → handler
}
```

**Migration**:
```typescript
// Helper to convert old tools
function convertLegacyTool(name: string, oldTool: LegacyTool): ToolDefinition {
  return {
    name,
    description: oldTool.description,
    parameters: oldTool.parameters,
    handler: oldTool.execute // Map execute → handler
  }
}

// Convert all tools
const tools = Object.entries(legacyTools).map(([name, tool]) =>
  convertLegacyTool(name, tool)
)
```

### 5. Import Paths Changed

**Impact**: 🟢 LOW - Simple find-replace

**Old Imports**:
```typescript
import { createToolEngine } from '@clarity-chat/react/tools'
import type { Tool, ToolEngine } from '@clarity-chat/react/tools'
```

**New Imports**:
```typescript
import { ToolOrchestrator } from '@clarity-chat/react'
import type { ToolDefinition, ToolOrchestrator } from '@clarity-chat/react'
```

---

## Step-by-Step Migration

### Phase 1: Preparation (15 minutes)

1. **Review your current tool usage**
   ```bash
   # Find all tool engine usage
   grep -r "createToolEngine\|ToolEngine" src/

   # Find all tool definitions
   grep -r "execute:" src/
   ```

2. **Back up your code**
   ```bash
   git checkout -b migrate-tool-system
   git commit -m "Backup before tool system migration"
   ```

3. **Install latest version**
   ```bash
   pnpm update @clarity-chat/react
   ```

### Phase 2: Update Tool Definitions (30 minutes)

1. **Convert tool format**

   **Before**:
   ```typescript
   // src/lib/tools.ts
   export const tools = {
     get_weather: {
       description: 'Get current weather',
       parameters: {
         type: 'object',
         properties: {
           location: { type: 'string' }
         },
         required: ['location']
       },
       execute: async ({ location }) => {
         const response = await fetch(`/api/weather?location=${location}`)
         return response.json()
       }
     },
     calculate: {
       description: 'Perform calculation',
       parameters: {
         type: 'object',
         properties: {
           expression: { type: 'string' }
         },
         required: ['expression']
       },
       execute: async ({ expression }) => {
         return { result: evaluateMath(expression) }
       }
     }
   }
   ```

   **After**:
   ```typescript
   // src/lib/tools.ts
   import type { ToolDefinition } from '@clarity-chat/react'

   export const weatherTool: ToolDefinition = {
     name: 'get_weather',
     description: 'Get current weather',
     parameters: {
       type: 'object',
       properties: {
         location: { type: 'string' }
       },
       required: ['location']
     },
     handler: async ({ location }) => {
       const response = await fetch(`/api/weather?location=${location}`)
       return response.json()
     }
   }

   export const calculatorTool: ToolDefinition = {
     name: 'calculate',
     description: 'Perform calculation',
     parameters: {
       type: 'object',
       properties: {
         expression: { type: 'string' }
       },
       required: ['expression']
     },
     handler: async ({ expression }) => {
       return { result: evaluateMath(expression) }
     }
   }

   export const tools: ToolDefinition[] = [
     weatherTool,
     calculatorTool
   ]
   ```

### Phase 3: Update Tool Engine Creation (15 minutes)

**Before**:
```typescript
// src/app/api/chat/route.ts
import { createToolEngine } from '@clarity-chat/react/tools'
import { tools } from '@/lib/tools'

const engine = createToolEngine({
  tools,
  autoApprove: true
})
```

**After**:
```typescript
// src/app/api/chat/route.ts
import { ToolOrchestrator } from '@clarity-chat/react'
import { tools } from '@/lib/tools'

const orchestrator = new ToolOrchestrator({
  tools,
  autoApprove: true // Keep old behavior initially
})
```

### Phase 4: Update Tool Execution (20 minutes)

**Before**:
```typescript
const result = await engine.execute(toolName, args)
console.log(result)
```

**After**:
```typescript
const response = await orchestrator.executeTool(toolName, args)
const result = response.result // ✅ Unwrap result
console.log(result)
```

### Phase 5: Update Event Listeners (20 minutes)

**Before**:
```typescript
engine.on('toolExecuted', ({ toolName, result, duration }) => {
  console.log(`Tool ${toolName} completed in ${duration}ms`)
})

engine.on('toolFailed', ({ toolName, error }) => {
  console.error(`Tool ${toolName} failed:`, error)
})
```

**After**:
```typescript
orchestrator.lifecycle.on('tool_completed', (event) => {
  console.log(`Tool ${event.call.toolName} completed in ${event.call.duration}ms`)
})

orchestrator.lifecycle.on('tool_failed', (event) => {
  console.error(`Tool ${event.call.toolName} failed:`, event.error)
})
```

### Phase 6: Test Thoroughly (30 minutes)

1. **Run your test suite**
   ```bash
   pnpm test
   ```

2. **Test each tool manually**
   - Execute each tool
   - Verify results are correct
   - Check error handling
   - Test timeout scenarios

3. **Test in development**
   ```bash
   pnpm dev
   ```

4. **Test edge cases**
   - Invalid arguments
   - Network failures
   - Timeouts
   - Concurrent executions

### Phase 7: Implement Approval Flow (Optional, 45 minutes)

**Before** (auto-approve always):
```typescript
const orchestrator = new ToolOrchestrator({
  autoApprove: true,
  tools
})
```

**After** (production-safe):
```typescript
const orchestrator = new ToolOrchestrator({
  autoApprove: false, // ✅ Require approval
  tools
})

// In your React component
function ChatComponent() {
  const [pendingTool, setPendingTool] = useState<ToolCallRecord | null>(null)

  useEffect(() => {
    orchestrator.lifecycle.on('tool_pending_approval', (event) => {
      setPendingTool(event.call)
    })
  }, [])

  const handleApprove = async () => {
    if (!pendingTool) return
    orchestrator.approveTool(pendingTool.id)
    const result = await orchestrator.executeApprovedTool(pendingTool.id)
    setPendingTool(null)
    return result.result
  }

  return (
    <>
      <ChatInterface />
      {pendingTool && (
        <ApprovalDialog
          tool={pendingTool}
          onApprove={handleApprove}
          onReject={() => {
            orchestrator.rejectTool(pendingTool.id, 'User declined')
            setPendingTool(null)
          }}
        />
      )}
    </>
  )
}
```

---

## Code Examples

### Example 1: Basic Chat Component

**Before**:
```typescript
'use client'

import { useChat } from '@clarity-chat/react'
import { createToolEngine } from '@clarity-chat/react/tools'
import { tools } from '@/lib/tools'

const engine = createToolEngine({ tools, autoApprove: true })

export function Chat() {
  const { messages, append } = useChat({
    api: '/api/chat',
    onToolCall: async (toolCall) => {
      return await engine.execute(toolCall.toolName, toolCall.args)
    }
  })

  return <ChatInterface messages={messages} onSend={append} />
}
```

**After**:
```typescript
'use client'

import { useChat } from '@clarity-chat/react'
import { ToolOrchestrator } from '@clarity-chat/react'
import { tools } from '@/lib/tools'

const orchestrator = new ToolOrchestrator({ tools, autoApprove: true })

export function Chat() {
  const { messages, append } = useChat({
    api: '/api/chat',
    onToolCall: async (toolCall) => {
      const response = await orchestrator.executeTool(
        toolCall.toolName,
        toolCall.args
      )
      return response.result // ✅ Unwrap
    }
  })

  return <ChatInterface messages={messages} onSend={append} />
}
```

### Example 2: API Route Handler

**Before**:
```typescript
// app/api/chat/route.ts
import { StreamingTextResponse } from 'ai'
import { createToolEngine } from '@clarity-chat/react/tools'
import { tools } from '@/lib/tools'

const engine = createToolEngine({ tools })

export async function POST(req: Request) {
  const { messages } = await req.json()

  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    tools: Object.values(tools).map(t => ({
      type: 'function',
      function: {
        name: t.name,
        description: t.description,
        parameters: t.parameters
      }
    })),
    stream: true
  })

  return new StreamingTextResponse(stream)
}
```

**After**:
```typescript
// app/api/chat/route.ts
import { StreamingTextResponse } from 'ai'
import { ToolOrchestrator } from '@clarity-chat/react'
import { tools } from '@/lib/tools'

const orchestrator = new ToolOrchestrator({ tools, autoApprove: true })

export async function POST(req: Request) {
  const { messages } = await req.json()

  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    tools: orchestrator.getAllTools().map(t => ({
      type: 'function',
      function: {
        name: t.name,
        description: t.description,
        parameters: t.parameters
      }
    })),
    stream: true
  })

  return new StreamingTextResponse(stream)
}
```

### Example 3: Event Handling

**Before**:
```typescript
engine.on('toolExecuted', ({ toolName, result, duration, cached }) => {
  console.log(`✓ ${toolName} (${duration}ms)${cached ? ' [cached]' : ''}`)
  analytics.track('tool_executed', { toolName, duration, cached })
})

engine.on('toolFailed', ({ toolName, error }) => {
  console.error(`✗ ${toolName}:`, error)
  analytics.track('tool_failed', { toolName, error: error.message })
})

engine.on('toolCached', ({ toolName }) => {
  console.log(`⚡ ${toolName} (from cache)`)
})
```

**After**:
```typescript
orchestrator.lifecycle.on('tool_completed', (event) => {
  const { toolName, duration } = event.call
  const cached = event.call.cached
  console.log(`✓ ${toolName} (${duration}ms)${cached ? ' [cached]' : ''}`)
  analytics.track('tool_executed', { toolName, duration, cached })
})

orchestrator.lifecycle.on('tool_failed', (event) => {
  console.error(`✗ ${event.call.toolName}:`, event.error)
  analytics.track('tool_failed', {
    toolName: event.call.toolName,
    error: event.error.message
  })
})

orchestrator.lifecycle.on('tool_result_cached', (event) => {
  console.log(`⚡ ${event.call.toolName} (from cache)`)
})
```

---

## Common Patterns

### Pattern: Batch Tool Conversion

Convert all legacy tools at once:

```typescript
// tools/convert.ts
import type { ToolDefinition } from '@clarity-chat/react'
import { legacyTools } from './legacy-tools'

export const convertedTools: ToolDefinition[] = Object.entries(legacyTools).map(
  ([name, tool]) => ({
    name,
    description: tool.description,
    parameters: tool.parameters,
    handler: tool.execute,
    // Map additional fields
    requiresApproval: tool.requiresApproval,
    enableCaching: tool.enableCaching,
    cacheTtl: tool.cacheTtl
  })
)
```

### Pattern: Gradual Migration

Migrate one tool at a time:

```typescript
// Create hybrid system
const orchestrator = new ToolOrchestrator({
  tools: [
    // New tools
    weatherTool,
    calculatorTool,

    // Converted legacy tools
    convertLegacyTool('database_query', legacyTools.database_query)
  ]
})
```

### Pattern: Wrapper for Backward Compatibility

Create a wrapper to maintain old API:

```typescript
// lib/legacy-compat.ts
import { ToolOrchestrator } from '@clarity-chat/react'

export class LegacyToolEngine {
  private orchestrator: ToolOrchestrator

  constructor(config: { tools: any, autoApprove?: boolean }) {
    const convertedTools = Object.entries(config.tools).map(([name, tool]) =>
      convertLegacyTool(name, tool)
    )

    this.orchestrator = new ToolOrchestrator({
      tools: convertedTools,
      autoApprove: config.autoApprove
    })
  }

  async execute(toolName: string, args: any) {
    const response = await this.orchestrator.executeTool(toolName, args)
    return response.result // Auto-unwrap for compatibility
  }

  on(event: string, handler: Function) {
    // Map old events to new events
    const eventMap = {
      toolExecuted: 'tool_completed',
      toolFailed: 'tool_failed',
      toolCached: 'tool_result_cached'
    }

    const newEvent = eventMap[event] || event
    this.orchestrator.lifecycle.on(newEvent as any, handler as any)
  }
}

// Usage: Drop-in replacement
const engine = new LegacyToolEngine({ tools, autoApprove: true })
```

---

## Event Migration Table

| Old Event | New Event | Event Data Changes |
|-----------|-----------|-------------------|
| `toolExecuted` | `tool_completed` | `event.call` instead of direct properties |
| `toolFailed` | `tool_failed` | `event.error` and `event.call` |
| `toolCached` | `tool_result_cached` | `event.call` |
| `toolStarted` | `tool_executing` | `event.call` |
| N/A | `tool_call_created` | New event |
| N/A | `tool_pending_approval` | New event |
| N/A | `tool_approved` | New event |
| N/A | `tool_rejected` | New event |
| N/A | `tool_timeout` | New event |
| N/A | `tool_cancelled` | New event |
| N/A | `tool_cache_invalidated` | New event |

---

## Troubleshooting

### Issue: "Tool not found" errors

**Cause**: Tools not converted to new format

**Solution**:
```typescript
// Ensure tools have 'name' field
const tools: ToolDefinition[] = [
  {
    name: 'get_weather', // ✅ Required
    description: '...',
    parameters: { ... },
    handler: async (args) => { ... }
  }
]
```

### Issue: Results are undefined

**Cause**: Forgetting to unwrap `response.result`

**Solution**:
```typescript
// ❌ Wrong
const result = await orchestrator.executeTool('tool', args)
console.log(result.temperature) // undefined!

// ✅ Correct
const response = await orchestrator.executeTool('tool', args)
console.log(response.result.temperature) // Works!
```

### Issue: Tools not executing

**Cause**: `autoApprove: false` (new default)

**Solution**:
```typescript
// Quick fix (not recommended for production)
const orchestrator = new ToolOrchestrator({
  autoApprove: true
})

// Better: Implement approval flow
orchestrator.lifecycle.on('tool_pending_approval', async (event) => {
  orchestrator.approveTool(event.call.id)
  await orchestrator.executeApprovedTool(event.call.id)
})
```

### Issue: Events not firing

**Cause**: Using old event names

**Solution**:
```typescript
// ❌ Wrong
orchestrator.on('toolExecuted', handler)

// ✅ Correct
orchestrator.lifecycle.on('tool_completed', handler)
```

### Issue: TypeScript errors

**Cause**: Types changed

**Solution**:
```typescript
// Update imports
import type {
  ToolDefinition,    // (was: Tool)
  ToolOrchestrator,  // (was: ToolEngine)
  ToolResult,        // (was: ToolExecutionResult)
  ToolCallRecord     // (new)
} from '@clarity-chat/react'
```

---

## FAQ

### Q: Can I use both old and new systems?

**A**: Not recommended. Choose one system to avoid confusion. If you must, isolate them:

```typescript
// Separate modules
import { oldEngine } from './old-tools'
import { orchestrator } from './new-tools'

// Use in different parts of app
```

### Q: How long will the old system be supported?

**A**: The old system is deprecated as of 2026-01-21 and will be removed in 2026-07-01 (6 months).

### Q: What if I have a large codebase?

**A**: Migrate incrementally:
1. Create new orchestrator alongside old engine
2. Convert tools one by one
3. Update components gradually
4. Remove old engine when done

### Q: Will this break my production app?

**A**: Not immediately, but:
- Old system will be removed in 6 months
- New system has better security defaults
- Migration is straightforward (2-4 hours for most apps)

### Q: Do I need to rewrite all my tools?

**A**: No! Use the conversion helper:
```typescript
const convertedTools = Object.entries(legacyTools).map(([name, tool]) =>
  convertLegacyTool(name, tool)
)
```

### Q: Can I gradually migrate?

**A**: Yes! Convert tools one at a time and test incrementally.

### Q: What about my custom tool engine wrapper?

**A**: You can extend `ToolOrchestrator`:
```typescript
class CustomOrchestrator extends ToolOrchestrator {
  constructor(config) {
    super(config)
    // Add custom logic
  }

  async executeTool(toolName, args, options) {
    // Custom pre-execution logic
    const result = await super.executeTool(toolName, args, options)
    // Custom post-execution logic
    return result
  }
}
```

---

## Getting Help

- **Documentation**: [TOOL_CALLING_GUIDE.md](./TOOL_CALLING_GUIDE.md)
- **GitHub Issues**: [github.com/christireid/Clarity-ai-chat-components/issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
- **Examples**: See `examples/` directory

---

**Version**: 1.0.0
**Last Updated**: 2026-01-21
**License**: MIT
