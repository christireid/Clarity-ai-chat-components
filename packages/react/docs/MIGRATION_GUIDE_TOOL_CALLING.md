# Tool Calling Migration Guide

**Step-by-step guide for migrating from legacy tool calling patterns to canonical implementations**

This guide helps you migrate your existing tool calling code to the new, enterprise-grade APIs
introduced in the latest version.

---

## Table of Contents

1. [Migration Overview](#migration-overview)
2. [Breaking Changes](#breaking-changes)
3. [Migration Path 1: Legacy ToolRegistry → Core ToolRegistry](#migration-path-1-legacy-toolregistry--core-toolregistry)
4. [Migration Path 2: Direct Executor → ToolOrchestrator](#migration-path-2-direct-executor--toolorchestrator)
5. [Migration Path 3: Custom State Management → ToolsEngine](#migration-path-3-custom-state-management--toolsengine)
6. [Migration Path 4: autoApprove Configuration](#migration-path-4-autoapprove-configuration)
7. [Migration Path 5: Test Property Names](#migration-path-5-test-property-names)
8. [Migration Path 6: ToolCall → ToolsEngineCall Type Rename](#migration-path-6-toolcall--toolsenginecall-type-rename)
9. [New Features to Adopt](#new-features-to-adopt)
10. [Rollback Strategy](#rollback-strategy)

---

## Migration Overview

### What's Changing?

The tool calling system has been enhanced with enterprise-grade features:

- ✅ **New canonical ToolRegistry** with validation and events
- ✅ **ToolOrchestrator** for unified tool management
- ✅ **Rate limiting** and **concurrency control**
- ✅ **Audit logging** for compliance
- ✅ **Production safeguards** (autoApprove blocked in production)
- ✅ **Enhanced documentation** and API guides

### Migration Priority

| Priority  | Migration Path            | Risk   | Effort    | Timeline     |
| --------- | ------------------------- | ------ | --------- | ------------ |
| 🔴 **P0** | autoApprove in Production | High   | 5 min     | Immediate    |
| 🔴 **P0** | Test Property Names       | Low    | 15 min    | Before tests |
| 🟡 **P1** | Legacy ToolRegistry       | Low    | 1-2 hours | Week 1       |
| 🟡 **P1** | ToolOrchestrator Adoption | Medium | 2-4 hours | Week 2       |
| 🟢 **P2** | Rate Limiting             | Low    | 30 min    | Week 3       |
| 🟢 **P2** | Audit Logging             | Low    | 30 min    | Week 3       |

### Compatibility

- ✅ **Backward Compatible**: Old APIs still work with deprecation warnings
- ⚠️ **Production Breaking**: `autoApprove: true` throws error in production
- ✅ **Test Breaking**: Property name mismatch fixed

---

## Breaking Changes

### 1. autoApprove Blocked in Production

**Breaking**: Setting `autoApprove: true` in production now throws an error.

```typescript
// ❌ BREAKS in production (NODE_ENV=production)
const orchestrator = new ToolOrchestrator({
  autoApprove: true, // Error: "autoApprove cannot be enabled in production"
})

// ✅ FIX: Disable autoApprove
const orchestrator = new ToolOrchestrator({
  autoApprove: false, // Required in production
})
```

**Why**: Security risk - tools should require explicit approval in production.

**Migration**: Remove `autoApprove: true` from production configs.

---

### 2. Test Property Names

**Breaking**: Tests using `handler` instead of `execute` will fail.

```typescript
// ❌ OLD: Uses incorrect property name
const tool: ToolDefinition = {
  name: 'my_tool',
  handler: async (args) => { ... }, // WRONG
}

// ✅ NEW: Use correct property name
const tool: ToolDefinition = {
  name: 'my_tool',
  execute: async (args) => { ... }, // CORRECT
}
```

**Why**: `execute` is the correct property per `ToolDefinition` interface.

**Migration**: Find/replace `handler:` with `execute:` in test files.

---

### 3. ToolCall Renamed to ToolsEngineCall

**Breaking (v2.0.0)**: The `ToolCall` type in `tools-engine.ts` is now `ToolsEngineCall`.

```typescript
// ⚠️ DEPRECATED (still works in v1.x, removed in v2.0.0)
import type { ToolCall } from './app-api/tools-engine'

// ✅ NEW: Use explicit name
import type { ToolsEngineCall } from './app-api/tools-engine'
```

**Why**: Clarifies that this type is specific to ToolsEngine, not a generic tool call type. Reduces
confusion with:

- `ToolCallRecord` (lifecycle tracking)
- `ToolInvocation` (message format)

**Migration**: Update imports to use `ToolsEngineCall`. The old name still works via type alias but
will be removed in v2.0.0.

**See also**: [Tool Call Types Guide](./TOOL_CALL_TYPES_GUIDE.md) for detailed comparison of all
three types.

---

## Migration Path 1: Legacy ToolRegistry → Core ToolRegistry

### Scenario

You're using the legacy `ToolRegistry` from `agents/tools.ts`.

### Before (Legacy)

```typescript
// ❌ DEPRECATED
import { ToolRegistry } from '@clarity/agents/tools'

const registry = new ToolRegistry([weatherTool, calculatorTool])

const tool = registry.get('weather')
const allTools = registry.getAll()
const mathTools = registry.search('calculate')
```

### After (Canonical)

```typescript
// ✅ RECOMMENDED
import { ToolRegistry } from '@clarity/core/tool-registry'

const registry = new ToolRegistry()
registry.registerMany([weatherTool, calculatorTool])

const tool = registry.get('weather')
const allTools = registry.getAll()
const mathTools = registry.search('calculate')
```

### Migration Steps

1. **Update import**:

   ```typescript
   // Change this:
   import { ToolRegistry } from './agents/tools'

   // To this:
   import { ToolRegistry } from './core/tool-registry'
   ```

2. **Update instantiation**:

   ```typescript
   // Change this:
   const registry = new ToolRegistry(tools)

   // To this:
   const registry = new ToolRegistry()
   registry.registerMany(tools)
   ```

3. **API remains the same**:
   - `register()`, `get()`, `getAll()` - unchanged
   - `search()`, `getByCategory()`, `getByTag()` - unchanged

4. **New features available**:
   - Event system: `registry.on('tool_registered', handler)`
   - Namespacing: `registry.namespace('weather').register(tool)`
   - Validation on registration

### Benefits

- ✅ Comprehensive JSON Schema validation
- ✅ Event system for monitoring
- ✅ Namespace support
- ✅ Better TypeScript inference
- ✅ Consistent with ToolOrchestrator

### Testing

```typescript
// Verify migration
import { ToolRegistry } from './core/tool-registry'

const registry = new ToolRegistry()

// Subscribe to events (new feature)
registry.on('tool_registered', (event) => {
  console.log(`Registered: ${event.tool.name}`)
})

registry.register(weatherTool) // Should log

// Verify search works
expect(registry.search('weather')).toHaveLength(1)
```

### Timeline

- **Effort**: 1-2 hours
- **Risk**: Low (backward compatible API)
- **Priority**: P1 (Week 1)

---

## Migration Path 2: Direct Executor → ToolOrchestrator

### Scenario

You're using `ToolExecutor` directly without lifecycle management.

### Before (Direct Executor)

```typescript
// ❌ OLD: Manual lifecycle management
import { ToolExecutor } from './core/tool-executor'
import { ToolRegistry } from './core/tool-registry'

const registry = new ToolRegistry()
const executor = new ToolExecutor()

// Manual registration
registry.register(weatherTool)

// Manual execution
const tool = registry.get('weather')
const result = await executor.execute(tool, { location: 'NYC' })

// No lifecycle events
// No approval flow
// No statistics
```

### After (ToolOrchestrator)

```typescript
// ✅ NEW: Unified API with lifecycle
import { ToolOrchestrator } from './core/tool-orchestrator'

const orchestrator = new ToolOrchestrator({
  autoApprove: false,
  tools: [weatherTool],
})

// Subscribe to events
orchestrator.lifecycle.on('tool_completed', (event) => {
  console.log(`${event.call.toolName}: ${event.duration}ms`)
})

// Execute with lifecycle tracking
const result = await orchestrator.executeTool('weather', { location: 'NYC' })

// Get statistics
const stats = orchestrator.getStats()
```

### Migration Steps

1. **Replace imports**:

   ```typescript
   // Remove:
   import { ToolExecutor } from './core/tool-executor'
   import { ToolRegistry } from './core/tool-registry'

   // Add:
   import { ToolOrchestrator } from './core/tool-orchestrator'
   ```

2. **Replace instantiation**:

   ```typescript
   // Remove:
   const registry = new ToolRegistry()
   const executor = new ToolExecutor()

   // Add:
   const orchestrator = new ToolOrchestrator({
     autoApprove: false, // Secure default
     tools: myTools,
   })
   ```

3. **Update execution calls**:

   ```typescript
   // Change this:
   const tool = registry.get(name)
   const result = await executor.execute(tool, args)

   // To this:
   const result = await orchestrator.executeTool(name, args)
   ```

4. **Add lifecycle monitoring** (optional but recommended):

   ```typescript
   orchestrator.lifecycle.on('tool_completed', (event) => {
     metrics.record('tool_duration', event.duration, {
       tool: event.call.toolName,
     })
   })

   orchestrator.lifecycle.on('tool_failed', (event) => {
     logger.error('Tool failed', {
       tool: event.call.toolName,
       error: event.error,
     })
   })
   ```

### Benefits

- ✅ Unified API (registry + executor + lifecycle)
- ✅ Built-in approval flow
- ✅ Comprehensive event system
- ✅ Statistics and monitoring
- ✅ Cache management
- ✅ Simpler code (less boilerplate)

### Side-by-Side Comparison

| Feature       | Direct Executor | ToolOrchestrator |
| ------------- | --------------- | ---------------- |
| Registration  | Manual          | Built-in         |
| Lifecycle     | Manual          | Automatic        |
| Events        | No              | Yes (11 types)   |
| Approval Flow | Manual          | Built-in         |
| Statistics    | Manual          | Built-in         |
| Caching       | Manual          | Built-in         |
| Code          | More            | Less             |

### Testing

```typescript
// Verify migration
const orchestrator = new ToolOrchestrator({
  autoApprove: true, // OK in tests
  tools: [weatherTool],
})

// Test lifecycle events
const events: string[] = []
orchestrator.lifecycle.on('all', (e) => events.push(e.type))

await orchestrator.executeTool('weather', { location: 'SF' })

expect(events).toContain('tool_requested')
expect(events).toContain('tool_completed')

// Test statistics
const stats = orchestrator.getStats()
expect(stats.calls.total).toBe(1)
```

### Timeline

- **Effort**: 2-4 hours
- **Risk**: Medium (API changes, testing required)
- **Priority**: P1 (Week 2)

---

## Migration Path 3: Custom State Management → ToolsEngine

### Scenario

You're using custom React state for tool management.

### Before (Custom State)

```typescript
// ❌ OLD: Custom state management
const [tools, setTools] = useState<Tool[]>([])
const [pendingCalls, setPendingCalls] = useState<ToolCall[]>([])

const executeTool = async (name: string, args: any) => {
  // Manual validation
  const tool = tools.find((t) => t.name === name)
  if (!tool) throw new Error('Not found')

  // Manual approval tracking
  const call = { id: uuid(), name, args, status: 'pending' }
  setPendingCalls([...pendingCalls, call])

  // Manual execution
  try {
    const result = await tool.execute(args)
    setPendingCalls((pending) => pending.filter((c) => c.id !== call.id))
    return result
  } catch (error) {
    // Manual error handling
    setPendingCalls((pending) =>
      pending.map((c) => (c.id === call.id ? { ...c, status: 'failed' } : c))
    )
    throw error
  }
}
```

### After (ToolsEngine)

```typescript
// ✅ NEW: Functional state management built-in
import { createToolsEngine, executeTool } from '@clarity/app-api/tools-engine'

const [toolsState, setToolsState] = useState(() =>
  createToolsEngine({
    autoApprove: false,
    registry: [weatherTool, calculatorTool],
  })
)

const handleExecuteTool = async (name: string, args: any) => {
  // All state management handled automatically
  const { state: newState, result } = await executeTool(toolsState, name, args)
  setToolsState(newState)
  return result
}
```

### Migration Steps

1. **Add import**:

   ```typescript
   import {
     createToolsEngine,
     executeTool,
     approveToolCall,
     rejectToolCall,
     getToolStats,
   } from './app-api/tools-engine'
   ```

2. **Initialize state**:

   ```typescript
   const [toolsState, setToolsState] = useState(() =>
     createToolsEngine({
       autoApprove: false,
       registry: myTools,
       timeoutMs: 30000,
     })
   )
   ```

3. **Replace execution logic**:

   ```typescript
   // Remove all manual state management
   // Replace with:
   const handleExecute = async (name: string, params: any) => {
     const { state, result } = await executeTool(toolsState, name, params)
     setToolsState(state)

     if (result.success) {
       return result.result
     } else {
       throw new Error(result.error)
     }
   }
   ```

4. **Add approval flow** (if needed):

   ```typescript
   const handleApprove = (callId: string) => {
     setToolsState(approveToolCall(toolsState, callId))
   }

   const handleReject = (callId: string, reason: string) => {
     setToolsState(rejectToolCall(toolsState, callId, reason))
   }
   ```

### Benefits

- ✅ Immutable state updates (React-friendly)
- ✅ No external state management needed
- ✅ Built-in validation and caching
- ✅ Functional API (pure functions)
- ✅ Less code, fewer bugs

### Example: Complete Component Migration

**Before:**

```typescript
function ToolExecutor() {
  const [tools, setTools] = useState<Tool[]>([])
  const [calls, setCalls] = useState<ToolCall[]>([])
  const [loading, setLoading] = useState(false)

  const execute = async (name: string, args: any) => {
    setLoading(true)
    try {
      const tool = tools.find(t => t.name === name)
      if (!tool) throw new Error('Not found')

      const call = { id: uuid(), name, args, status: 'pending' }
      setCalls([...calls, call])

      const result = await tool.execute(args)

      setCalls(calls.map(c =>
        c.id === call.id ? { ...c, status: 'completed', result } : c
      ))

      return result
    } catch (error) {
      // Error handling...
    } finally {
      setLoading(false)
    }
  }

  return <ToolUI onExecute={execute} calls={calls} />
}
```

**After:**

```typescript
import { createToolsEngine, executeTool } from '@clarity/app-api/tools-engine'

function ToolExecutor() {
  const [state, setState] = useState(() =>
    createToolsEngine({ registry: myTools })
  )
  const [loading, setLoading] = useState(false)

  const execute = async (name: string, args: any) => {
    setLoading(true)
    try {
      const { state: newState, result } = await executeTool(state, name, args)
      setState(newState)
      return result.result
    } catch (error) {
      // Error handling...
    } finally {
      setLoading(false)
    }
  }

  return <ToolUI onExecute={execute} calls={state.completedCalls} />
}
```

### Timeline

- **Effort**: 2-3 hours
- **Risk**: Low (functional API, easy to test)
- **Priority**: P2 (Week 2-3)

---

## Migration Path 4: autoApprove Configuration

### Scenario

Your production config has `autoApprove: true`.

### Before (Insecure)

```typescript
// ❌ BREAKS: Security risk in production
const orchestrator = new ToolOrchestrator({
  autoApprove: true, // Error in production!
})
```

### After (Secure)

```typescript
// ✅ FIX: Environment-aware configuration
const orchestrator = new ToolOrchestrator({
  autoApprove: process.env.NODE_ENV !== 'production', // Auto in dev, manual in prod
})

// Or explicitly:
const orchestrator = new ToolOrchestrator({
  autoApprove: false, // Always safe
})
```

### Migration Steps

1. **Find all autoApprove: true**:

   ```bash
   grep -r "autoApprove: true" src/
   ```

2. **Update production configs**:

   ```typescript
   // Option 1: Environment-aware
   autoApprove: process.env.NODE_ENV !== 'production'

   // Option 2: Always secure
   autoApprove: false

   // Option 3: Feature flag
   autoApprove: featureFlags.toolAutoApprove && !isProduction
   ```

3. **Implement approval UI**:

   ```typescript
   orchestrator.lifecycle.on('tool_pending_approval', (event) => {
     showApprovalDialog({
       tool: event.toolDefinition.name,
       args: event.call.args,
       onApprove: () => orchestrator.approveTool(event.call.id),
       onReject: () => orchestrator.rejectTool(event.call.id, 'User declined'),
     })
   })
   ```

4. **Test both modes**:

   ```typescript
   // Dev: autoApprove works
   process.env.NODE_ENV = 'development'
   const dev = new ToolOrchestrator({ autoApprove: true })
   // No error, shows warning

   // Prod: autoApprove blocked
   process.env.NODE_ENV = 'production'
   expect(() => new ToolOrchestrator({ autoApprove: true })).toThrow(
     'autoApprove cannot be enabled in production'
   )
   ```

### Timeline

- **Effort**: 5-30 minutes (depending on approval UI complexity)
- **Risk**: High (breaks production if not fixed)
- **Priority**: P0 (Immediate)

---

## Migration Path 5: Test Property Names

### Scenario

Your tests use `handler` instead of `execute`.

### Before (Broken)

```typescript
// ❌ WRONG: Property name mismatch
function createTestTool(): ToolDefinition {
  return {
    name: 'test_tool',
    description: 'Test tool',
    parameters: { type: 'object', properties: {} },
    handler: async (args) => {
      // WRONG
      return { success: true }
    },
  }
}
```

### After (Fixed)

```typescript
// ✅ CORRECT: Use 'execute'
function createTestTool(): ToolDefinition {
  return {
    name: 'test_tool',
    description: 'Test tool',
    parameters: { type: 'object', properties: {} },
    execute: async (args) => {
      // CORRECT
      return { success: true }
    },
  }
}
```

### Migration Steps

1. **Find all occurrences**:

   ```bash
   grep -r "handler: async" src/**/*.test.ts
   ```

2. **Replace in test files**:

   ```bash
   # Using sed (Unix/Mac)
   find src -name "*.test.ts" -exec sed -i '' 's/handler: async/execute: async/g' {} +

   # Or manually in your editor:
   # Find: "handler: async"
   # Replace: "execute: async"
   ```

3. **Verify TypeScript**:
   ```bash
   npm run type-check
   # Should show no errors
   ```

### Timeline

- **Effort**: 15 minutes
- **Risk**: Low (compile-time error if missed)
- **Priority**: P0 (Before running tests)

---

## Migration Path 6: ToolCall → ToolsEngineCall Type Rename

### Scenario

You're using the `ToolCall` type from `tools-engine.ts`.

### Context

The tool calling system has three different types for representing tool calls at different
architectural layers:

1. **ToolInvocation** (types/tool-invocation.ts) - Message/UI layer (5 states)
2. **ToolsEngineCall** (app-api/tools-engine.ts) - Functional state management (6 states)
3. **ToolCallRecord** (core/tool-lifecycle.ts) - Lifecycle tracking (11 states)

The old `ToolCall` name in tools-engine.ts was ambiguous. It's now explicitly named
`ToolsEngineCall`.

### Before (Deprecated)

```typescript
// ⚠️ DEPRECATED: Old import (still works in v1.x via type alias)
import type { ToolCall } from './app-api/tools-engine'

function processCall(call: ToolCall) {
  // ...
}
```

### After (Recommended)

```typescript
// ✅ NEW: Explicit type name
import type { ToolsEngineCall } from './app-api/tools-engine'

function processCall(call: ToolsEngineCall) {
  // ...
}
```

### Migration Steps

1. **Update imports**:

   ```bash
   # Find all uses of ToolCall from tools-engine
   grep -r "import.*ToolCall.*from.*tools-engine" src/
   ```

2. **Replace type references**:

   ```typescript
   // Find: import type { ToolCall } from './app-api/tools-engine'
   // Replace: import type { ToolsEngineCall } from './app-api/tools-engine'

   // Find: call: ToolCall
   // Replace: call: ToolsEngineCall

   // Find: calls: ToolCall[]
   // Replace: calls: ToolsEngineCall[]
   ```

3. **Verify no other ToolCall types are affected**:

   ```typescript
   // These are DIFFERENT types and should NOT be changed:
   import type { ToolCallRecord } from './core/tool-lifecycle' // ← Keep as-is
   import type { ToolInvocation } from './types/tool-invocation' // ← Keep as-is
   ```

4. **Update function signatures**:

   ```typescript
   // Before:
   function handleCall(call: ToolCall): void {
     // ...
   }

   // After:
   function handleCall(call: ToolsEngineCall): void {
     // ...
   }
   ```

### Type Conversion

If you need to convert between the three types, use the provided converters:

```typescript
import { toToolCallRecord, toToolInvocation } from './app-api/tools-engine'

// ToolsEngineCall → ToolCallRecord (for lifecycle tracking)
const engineCall: ToolsEngineCall = state.completedCalls[0]
const record = toToolCallRecord(engineCall)
lifecycle.trackCall(record)

// ToolsEngineCall → ToolInvocation (for messages)
const engineCall: ToolsEngineCall = state.completedCalls[0]
const invocation = toToolInvocation(engineCall)

const message: AssistantMessage = {
  id: 'msg_123',
  role: 'assistant',
  content: 'Done!',
  toolInvocations: [invocation],
}
```

### Understanding the Three Types

| Type                | Purpose             | When to Use                                             |
| ------------------- | ------------------- | ------------------------------------------------------- |
| **ToolInvocation**  | Chat message format | Adding tool calls to `AssistantMessage.toolInvocations` |
| **ToolsEngineCall** | Functional state    | Using ToolsEngine API, React state management           |
| **ToolCallRecord**  | Lifecycle tracking  | Using ToolLifecycleManager, events, audit logs          |

**See**: [Tool Call Types Guide](./TOOL_CALL_TYPES_GUIDE.md) for detailed comparison and examples.

### Timeline

- **Effort**: 30 minutes
- **Risk**: Low (backward compatible via type alias in v1.x)
- **Priority**: P1 (Week 2, required before v2.0.0)
- **Breaking**: Type alias removed in v2.0.0

---

## New Features to Adopt

### 1. Rate Limiting (Recommended)

```typescript
// Enable rate limiting to prevent abuse
const executor = new ToolExecutor(lifecycle, {
  enableRateLimit: true,
  maxRequestsPerWindow: 100, // 100 req/min
  rateLimitWindowMs: 60000,
})
```

**Benefits**: Prevents DoS, resource exhaustion

**Effort**: 5 minutes

---

### 2. Concurrency Control (Recommended)

```typescript
// Limit parallel tool executions
const executor = new ToolExecutor(lifecycle, {
  enableConcurrencyLimit: true,
  maxConcurrentExecutions: 10,
})
```

**Benefits**: Prevents system overload

**Effort**: 5 minutes

---

### 3. Audit Logging (Recommended)

```typescript
// Enable audit logging for compliance
const lifecycle = new ToolLifecycleManager({
  auditLog: {
    enabled: true,
    maxEntries: 10000,
    includeSensitiveData: false,
    persister: databasePersister, // Optional
  },
})

// Export logs
const logs = lifecycle.exportAuditLogs({
  toolName: 'sensitive_operation',
  startTime: Date.now() - 86400000, // Last 24 hours
})
```

**Benefits**: Compliance, forensics, monitoring

**Effort**: 15 minutes

---

### 4. Lifecycle Events (Recommended)

```typescript
// Monitor tool execution
orchestrator.lifecycle.on('tool_completed', (event) => {
  metrics.histogram('tool_duration', event.duration, {
    tool: event.call.toolName,
    cached: event.call.cached,
  })
})

orchestrator.lifecycle.on('tool_failed', (event) => {
  logger.error('Tool execution failed', {
    tool: event.call.toolName,
    error: event.error.message,
    userId: event.call.context.userId,
  })
})

orchestrator.lifecycle.on('tool_timeout', (event) => {
  alerts.send({
    severity: 'warning',
    message: `Tool ${event.call.toolName} timed out after ${event.timeoutMs}ms`,
  })
})
```

**Benefits**: Observability, debugging, alerting

**Effort**: 30 minutes

---

## Rollback Strategy

### If Migration Fails

1. **Revert code changes**:

   ```bash
   git revert <commit-hash>
   ```

2. **Legacy APIs still work**:

   ```typescript
   // Old code continues to function (with warnings)
   import { ToolRegistry } from './agents/tools'
   const registry = new ToolRegistry()
   // Still works, emits deprecation warning
   ```

3. **Disable new features**:
   ```typescript
   // Turn off new features if causing issues
   const executor = new ToolExecutor(lifecycle, {
     enableRateLimit: false, // Disable
     enableConcurrencyLimit: false, // Disable
   })
   ```

### Gradual Migration

Migrate incrementally:

1. **Week 1**: Fix autoApprove + test properties (P0)
2. **Week 2**: Migrate ToolRegistry (P1, low risk)
3. **Week 3**: Adopt ToolOrchestrator (P1, test thoroughly)
4. **Week 4**: Enable rate limiting + audit logging (P2)
5. **Week 5**: Monitor and optimize

---

## Summary

### Migration Checklist

- [ ] **P0** Fix autoApprove in production configs
- [ ] **P0** Fix test property names (`handler` → `execute`)
- [ ] **P1** Migrate from legacy ToolRegistry to canonical
- [ ] **P1** Adopt ToolOrchestrator for unified API
- [ ] **P2** Enable rate limiting and concurrency control
- [ ] **P2** Enable audit logging
- [ ] **P2** Adopt lifecycle events for monitoring
- [ ] **P3** Update documentation and training
- [ ] **P3** Monitor metrics post-migration

### Key Takeaways

1. **Break changes are minimal** - Most APIs backward compatible
2. **Security is enforced** - autoApprove blocked in production
3. **Migration is gradual** - Can be done over several weeks
4. **Rollback is safe** - Legacy APIs still functional
5. **Benefits are significant** - Enterprise-grade security + DX

### Get Help

- **API Guide**: See `TOOL_CALLING_API_GUIDE.md` for API reference
- **Security**: See `TOOL_SECURITY_GUIDE.md` for security best practices
- **Issues**: Check GitHub issues or create a new one

Good luck with your migration! 🚀
