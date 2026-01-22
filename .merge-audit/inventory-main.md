# Inventory: Main Branch

**Branch**: `main` **SHA**: `7ed57c479` **Date**: 2026-01-22

---

## Area 1: Tool Calling & Approval System

### Core Implementation Files

#### `packages/react/src/app-api/tools-engine.ts`

**Purpose**: Production-ready tool execution engine with type-safe registry, parameter validation,
timeout handling, result caching, and auto-approval for safe tools.

**Exports**:

- `interface ToolCall` - Represents a single tool invocation
- `interface ToolExecutionResult` - Result of tool execution
- `interface ToolsEngineState` - Engine state management
- `function createToolsEngine(config)` - Initialize engine
- `function registerTool(state, tool)` - Add tool to registry
- `function unregisterTool(state, name)` - Remove tool
- `function getAvailableTools(state)` - List tools
- `function createToolCall(state, name, params)` - Create pending call
- `function approveToolCall(state, id)` - Approve execution
- `function rejectToolCall(state, id)` - Reject execution
- `function getToolStats(state)` - Get execution stats
- `function clearToolHistory(state)` - Clear completed calls
- `function clearToolCache(state)` - Clear result cache

**Key Features**:

- Auto-approval for safe tools
- 30-second default timeout
- Result caching with TTL (default 5 minutes)
- Parameter validation (basic type checking)
- Built-in tools: `get_current_time`, `calculate`, `random_number`, `format_text`
- Status tracking: pending, approved, executing, completed, failed, timeout

**Limitations on Main**:

- ❌ No AbortSignal support for timeout cleanup
- ❌ Basic parameter validation only (no JSON Schema constraints)
- ❌ No approval modes (auto/manual/allowlist/blocklist)
- ❌ No risk classification system
- ❌ No audit logging
- ❌ Tools don't receive AbortSignal parameter

**Lines**: ~625 lines

---

#### `packages/react/src/app-api/types.ts`

**Purpose**: Type definitions for the app-api system including configuration and tool definitions.

**Tool-Related Types**:

```typescript
export interface ToolsConfig {
  registry?: ToolDefinition[]
  defaultRenderer?: 'json' | 'card' | 'custom'
  customRenderer?: React.ComponentType<{ result: unknown; toolName: string }>
  autoApprove?: boolean
  timeoutMs?: number
}

export interface ToolDefinition {
  name: string
  description: string
  parameters: Record<string, unknown> // Basic JSON object
  execute: (params: unknown) => Promise<unknown> // No AbortSignal
  renderer?: React.ComponentType<{ result: unknown }>
}
```

**Limitations on Main**:

- ❌ ToolDefinition.execute does NOT accept AbortSignal
- ❌ No ToolApprovalMode type
- ❌ No ToolRiskLevel type
- ❌ No approval configuration beyond autoApprove boolean
- ❌ No requiresApproval field
- ❌ No PII sanitization fields

---

### Test Files

#### `packages/react/src/app-api/__tests__/`

**Existing on Main**:

1. `ClarityChatApp.test.tsx` - Integration tests for app configuration
2. `resolve-config.test.ts` - Configuration resolution tests

**Missing on Main**:

- ❌ No tools-engine.test.ts (basic tool execution)
- ❌ No tools-engine-abort.test.ts (AbortSignal cleanup)
- ❌ No tools-engine-approval.test.ts (approval system)
- ❌ No tools-engine-validation.test.ts (JSON Schema validation)

**Test Coverage on Main**: ~20 tool-related tests (estimated from integration tests)

---

### Dependencies & Consumers

**Internal Imports**:

- `safeEvaluate` from `../utils/math/safe-evaluator` (for calculator tool)

**Consumed By**:

- `ClarityChatApp` component (main integration point)
- Public API exports (if any)
- Documentation examples

---

### Design Patterns on Main

1. **Registry Pattern**: Tools registered in Map-based registry
2. **State Management**: Immutable state updates
3. **Functional Core**: Pure functions for state transitions
4. **Timeout via Promise.race**: No cleanup mechanism
5. **Simple Caching**: Map-based with timestamp checks
6. **Basic Validation**: Type coercion, no schema enforcement

---

## Summary: Area 1 on Main

**Strengths**:

- Clean functional architecture
- Type-safe registry
- Basic caching and timeouts
- Built-in safe tools

**Gaps**:

- No timeout cleanup (resource leaks)
- Limited parameter validation
- No approval system beyond boolean
- No risk classification
- No audit logging
- Missing comprehensive tests

**Lines of Code**: ~625 (tools-engine.ts)

---

_Next: Inventory Area 2 on Main_
