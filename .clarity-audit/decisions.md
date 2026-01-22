# Architectural Decisions Record (ADR)

**Purpose**: Document key decisions made during tool calling architecture refactoring
**Format**: Each decision includes context, options considered, decision made, and rationale

---

## ADR-001: Canonical Tool Definition Format

**Date**: 2026-01-21
**Status**: ✅ Decided
**Impact**: High - affects all tool definitions

### Context
Three different tool definition formats exist:
1. OpenAI format (external API)
2. Agent Tool format (internal, feature-rich)
3. App Tool format (tools-engine, simpler)

### Options Considered
1. **OpenAI format** - Pros: Industry standard. Cons: Limited features
2. **Agent format** - Pros: Rich features (approval, category, tags). Cons: Internal-only
3. **Create new format** - Pros: Optimal design. Cons: Migration cost
4. **Support all three** - Pros: No migration. Cons: Complexity

### Decision
**Use enhanced Agent format as canonical** with adapters for OpenAI compatibility

```typescript
interface ToolDefinition {
  name: string
  description: string
  parameters: ToolParameters
  execute: (args: ToolArguments) => Promise<ToolResult>
  requiresApproval?: boolean
  cacheable?: boolean
  cacheTtl?: number
  timeout?: number
  category?: string
  tags?: string[]
  displayName?: string
  icon?: string
  onBefore?: (args: ToolArguments) => void | Promise<void>
  onAfter?: (result: ToolResult) => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}
```

### Rationale
- Agent format already has most needed features
- Can be adapted to/from OpenAI format easily
- Allows internal enhancements while maintaining compatibility
- Existing Agent tools can be used as-is

---

## ADR-002: Canonical Message Format for Tool Calls

**Date**: 2026-01-21
**Status**: ✅ Decided
**Impact**: High - affects message structure

### Context
Two message formats for tool calls:
1. `toolInvocations` array (Vercel AI SDK style)
2. `toolCalls` + function messages (OpenAI style)

### Options Considered
1. **toolInvocations** - Pros: Self-contained, clear state. Cons: Non-standard
2. **toolCalls** - Pros: OpenAI standard. Cons: Result in separate message
3. **Support both** - Pros: Compatibility. Cons: Confusion

### Decision
**Use `toolInvocations` as canonical** with adapter for `toolCalls`

```typescript
interface ToolInvocation {
  toolCallId: string
  toolName: string
  args: Record<string, unknown>
  state: 'call' | 'executing' | 'result' | 'error'
  result?: ToolResult
  error?: string
  timestamp?: number
  duration?: number
  cached?: boolean
}
```

### Rationale
- Self-contained: call + result in same message
- Clear state machine
- Easier to extract and display
- Better for UI rendering
- Can convert to/from OpenAI format as needed

---

## ADR-003: Tool Status State Machine

**Date**: 2026-01-21
**Status**: ✅ Decided
**Impact**: Medium - affects status tracking

### Context
Different status enums across components (ToolInvocationCard, tools-engine, useAssistant)

### Decision
**Canonical status enum**:
```typescript
type ToolCallStatus =
  | 'idle'           // Initial state, no action
  | 'requested'      // LLM requested tool call
  | 'pending_approval' // Awaiting user approval
  | 'approved'       // Approved, ready to execute
  | 'executing'      // Currently executing
  | 'completed'      // Successfully completed
  | 'failed'         // Execution failed
  | 'timeout'        // Execution timed out
  | 'rejected'       // User rejected
  | 'cached'         // Result from cache
```

### Rationale
- Covers all lifecycle states
- Distinguishes timeout from failure
- Clear approval flow
- Supports caching transparency

---

## ADR-004: Tool Execution Architecture

**Date**: 2026-01-21
**Status**: ✅ Decided
**Impact**: High - core architecture

### Context
Multiple tool execution systems:
- tools-engine (stateful, approval flow, caching)
- agents/tools (functional, simple)
- examples (ad-hoc)

### Decision
**Create unified core system** with separation of concerns:

```
packages/react/src/core/
  ├── tool-registry.ts      # Tool registration & lookup
  ├── tool-executor.ts      # Execution with validation, timeout, caching
  ├── tool-lifecycle.ts     # Lifecycle event management
  └── tool-orchestrator.ts  # High-level coordination
```

**Responsibilities**:
- **Registry**: Store and retrieve tool definitions
- **Executor**: Execute with validation, timeout, error handling
- **Lifecycle**: Emit events, manage state transitions
- **Orchestrator**: Coordinate approval, execution, caching

### Rationale
- Single source of truth
- Clear separation of concerns
- Testable components
- Extensible architecture
- Deprecate old systems gradually

---

## ADR-005: Security Defaults

**Date**: 2026-01-21
**Status**: ✅ Decided
**Impact**: Critical - security model

### Context
- tools-engine defaults to `autoApprove: true`
- Calculate tool uses `new Function()`

### Decisions

1. **Auto-approve default: `false`**
   - Tools require explicit approval by default
   - Developers must opt-in to auto-approve
   - Console warning when auto-approve enabled

2. **No eval() or Function()**
   - Replace with safe recursive descent parser
   - All expression evaluation goes through safe evaluator
   - Input length limits (1000 chars)
   - Depth limits (100 levels)

3. **Approval flags**:
   - `requiresApproval` flag on tool definition
   - Default: `true` for network/file/code operations
   - Default: `false` for pure functions (math, format, etc.)

### Rationale
- Security by default
- Explicit opt-in for auto-execution
- Protection against code injection
- Clear security model for developers

---

## ADR-006: Caching Strategy

**Date**: 2026-01-21
**Status**: ✅ Decided
**Impact**: Medium - performance & correctness

### Context
- tools-engine caches all results by default
- Side-effect tools (API calls, file writes) shouldn't be cached

### Decision
**Opt-in caching** with tool-level configuration:

```typescript
interface ToolDefinition {
  cacheable?: boolean      // Default: false
  cacheTtl?: number        // Milliseconds, default: 300000 (5 min)
}
```

**Caching Rules**:
- Pure functions (math, format): `cacheable: true`
- API calls, file operations: `cacheable: false`
- Database queries: Developer decides
- Cache key: `${toolName}:${JSON.stringify(sortedArgs)}`
- Cache per session, not persistent

### Rationale
- Safe default (no caching)
- Explicit opt-in for pure functions
- Prevents incorrect cached side effects
- Reasonable TTL for typical use

---

## ADR-007: Error Handling Strategy

**Date**: 2026-01-21
**Status**: ✅ Decided
**Impact**: Medium - error reporting

### Decision
**Structured error type with categories**:

```typescript
class ToolExecutionError extends Error {
  constructor(
    public toolName: string,
    public reason: 'validation' | 'timeout' | 'execution' | 'rejected' | 'cancelled',
    public details?: unknown,
    message?: string
  )

  toJSON() // For logging
  toString() // For display
}
```

**Error Categories**:
- `validation`: Parameter validation failed
- `timeout`: Execution exceeded timeout
- `execution`: Tool threw error during execution
- `rejected`: User rejected tool call
- `cancelled`: Execution cancelled (user or system)

### Rationale
- Structured errors for programmatic handling
- Clear categorization
- Serializable for logging
- User-friendly messages

---

## ADR-008: Streaming + Tool Integration

**Date**: 2026-01-21
**Status**: ✅ Decided
**Impact**: High - streaming behavior

### Context
Unclear how streaming should pause/resume around tool calls

### Decision
**Explicit pause/resume semantics**:

1. **Stream pauses when tool call detected**
   - LLM response streaming continues until tool call complete
   - Tool call metadata streamed as special token
   - Stream enters 'processing_tools' state

2. **Tool execution phases**:
   - Parse tool call from stream
   - (Optional) Wait for approval
   - Execute tool(s)
   - Resume stream with tool result

3. **Parallel vs Sequential**:
   - Default: Sequential (one at a time)
   - Opt-in: Parallel (all tools execute concurrently)
   - Configurable per request

4. **User interruption**:
   - AbortSignal propagates to tool execution
   - Tool can cleanup on abort
   - Partial results preserved

### Rationale
- Clear mental model
- Predictable behavior
- Supports both use cases
- Handles interruption gracefully

---

## ADR-009: Memory Integration with Tools

**Date**: 2026-01-21
**Status**: ✅ Decided
**Impact**: Medium - memory behavior

### Decision
**Tool calls and results stored in memory**:

1. **What's stored**:
   - Tool call: name, arguments, ID
   - Tool result: success/error, data, duration
   - Metadata: timestamp, cached flag

2. **Storage format** (in message history):
   ```typescript
   {
     role: 'assistant',
     content: 'Response text',
     toolInvocations: [
       { toolCallId, toolName, args, state: 'result', result, ... }
     ]
   }
   ```

3. **Summarization rules**:
   - Tool calls: Keep name + args summary
   - Tool results: Summarize large payloads
   - Max size: 500 tokens per tool result
   - Truncate arrays/objects with "... N more items"

4. **Context window management**:
   - Tool calls count toward context limit
   - Results prioritized over early conversation
   - Configurable: drop tool results when trimming

### Rationale
- Full history enables multi-step workflows
- Summarization prevents token explosion
- Clear rules for trimming
- Debuggable conversation history

---

## ADR-010: TypeScript Type Safety

**Date**: 2026-01-21
**Status**: 🔄 Decided (Optional Enhancement)
**Impact**: Low - developer experience

### Context
Tool args currently `Record<string, unknown>` - no type inference

### Decision
**Generic type parameter for strict typing** (optional):

```typescript
interface Tool<TArgs = Record<string, unknown>, TResult = unknown> {
  name: string
  parameters: ToolParameters
  execute: (args: TArgs) => Promise<TResult>
}

// Usage:
const weatherTool: Tool<{ location: string }, WeatherData> = {
  // args typed as { location: string }
  // result typed as WeatherData
}
```

### Rationale
- Better IDE autocomplete
- Catch errors at compile time
- Optional (backward compatible)
- Useful for TypeScript-first projects

**Status**: Low priority, optional enhancement

---

## ADR-011: Deprecation Strategy

**Date**: 2026-01-21
**Status**: ✅ Decided
**Impact**: High - migration path

### Decision
**Gradual deprecation with compatibility shims**:

1. **Phase 1** (Current):
   - Mark old APIs as `@deprecated` in JSDoc
   - Add console warnings in development
   - Create compatibility shims that route to new core
   - Update docs with migration guide

2. **Phase 2** (Next Minor Version):
   - Increase warning visibility
   - Add breaking change notice to docs
   - Provide codemod for automated migration

3. **Phase 3** (Next Major Version):
   - Remove deprecated APIs
   - Remove compatibility shims
   - Clean up codebase

**Timeline**:
- Current: v0.x (deprecation warnings)
- Next: v0.x+1 (stronger warnings)
- Major: v1.0 (removal)

### Rationale
- No sudden breaking changes
- Clear migration path
- Time for users to adapt
- Maintain backward compatibility initially

---

## ADR-012: Tool Registry Design

**Date**: 2026-01-21
**Status**: ✅ Decided
**Impact**: Medium - tool management

### Decision
**Hierarchical registry with namespaces**:

```typescript
class ToolRegistry {
  // Core methods
  register(tool: ToolDefinition): void
  unregister(name: string): void
  get(name: string): ToolDefinition | undefined
  getAll(): ToolDefinition[]

  // Discovery
  getByCategory(category: string): ToolDefinition[]
  getByTag(tag: string): ToolDefinition[]
  search(query: string): ToolDefinition[]

  // Namespaces
  namespace(name: string): ToolRegistry  // Create scoped registry
}
```

**Built-in namespaces**:
- `builtin.*` - Built-in tools (math, time, format)
- `custom.*` - User-defined tools
- `external.*` - External API integrations

### Rationale
- Prevents name collisions
- Clear built-in vs custom
- Discoverable via category/tags
- Extensible for future features

---

## Decisions Pending

### PD-001: Parallel Tool Execution
**Status**: ⏳ To Be Decided
**Options**:
1. Always sequential (safe)
2. Always parallel (fast)
3. Developer configures per request
4. Tool defines if parallelizable

**Leaning toward**: Option 3 with opt-in for tools (PD-004)

### PD-002: Tool Progress Reporting
**Status**: ⏳ To Be Decided
**Options**:
1. No progress (simple)
2. Simple percentage (basic)
3. Structured progress with stages (advanced)

**Leaning toward**: Option 2 for Phase 1, Option 3 later

### PD-003: Tool Versioning
**Status**: ⏳ To Be Decided
**Question**: Should tools have versions?
**Use case**: API changes over time
**Leaning toward**: Not in v1, add if needed

### PD-004: Tool Dependencies
**Status**: ⏳ To Be Decided
**Question**: Can tools declare dependencies on other tools?
**Use case**: Composite tools
**Leaning toward**: Not in v1, add if requested

---

**End of Decisions Record**
