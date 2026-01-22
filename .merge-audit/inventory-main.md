# Inventory - Main Branch

**Branch**: `main`
**HEAD**: `7ed57c47937508b9ea52ffb5661819d362692e56`
**Date**: 2026-01-22

---

## AREA 3: Core Tool System (2,383 lines)

### `/packages/react/src/core/tool-executor.ts` (649 lines)
- **Purpose**: Tool execution with validation, timeout, and caching
- **Key Exports**:
  - `ToolExecutor` class
  - `ToolValidationError` class
  - `validateToolArguments()` function
  - `ExecutorConfig`, `ExecutionOptions`, `ExecutionResult` types
- **Features**:
  - Basic parameter validation
  - Timeout protection
  - Simple caching
  - Lifecycle integration

### `/packages/react/src/core/tool-lifecycle.ts` (721 lines)
- **Purpose**: Manages tool execution lifecycle states
- **Key Exports**:
  - `ToolLifecycleManager` class
  - `ToolCallRecord` interface
  - `ToolCallStatus` type
  - Lifecycle event types
  - `globalToolLifecycle` singleton
- **Features**:
  - State machine (basic)
  - Event emission
  - Call tracking

### `/packages/react/src/core/tool-orchestrator.ts` (527 lines)
- **Purpose**: High-level coordinator for tool management
- **Key Exports**:
  - `ToolOrchestrator` class
  - `OrchestrationResult` interface
  - `OrchestratorConfig` interface
  - `globalToolOrchestrator` singleton
- **Features**:
  - Registry integration
  - Executor integration
  - Lifecycle integration
  - Auto-approval support

### `/packages/react/src/core/tool-registry.ts` (486 lines)
- **Purpose**: Central registry for tool definitions
- **Key Exports**:
  - `ToolRegistry` class
  - `NamespacedRegistry` class
  - Registry event types
  - `globalToolRegistry` singleton
- **Features**:
  - Tool registration/unregistration
  - Tool discovery (by name, category, tags)
  - Search functionality
  - Event notifications

---

## AREA 6: App API Layer (627 lines)

### `/packages/react/src/app-api/tools-engine.ts` (627 lines)
- **Purpose**: Functional/immutable tools API for React
- **Key Exports**:
  - `createToolsEngine()` function
  - `ToolsEngineState` interface
  - State manipulation functions
- **Features**:
  - Immutable state management
  - Tool call creation
  - Result handling

---

## AREA 4: Tool Utilities (1,110 lines)

### `/packages/react/src/utils/tool-execution.ts` (548 lines)
- **Purpose**: Helper functions for tool execution patterns
- **Key Exports**:
  - `executeWithRetry()`
  - `executeWithFallback()`
  - `executeWithTimeout()`
  - `executeWithLogging()`
  - `executeBatch()`, `executeBatchSimple()`
- **Features**:
  - Retry logic
  - Fallback handling
  - Timeout wrapping
  - Batch execution

### `/packages/react/src/utils/tool-performance.ts` (562 lines)
- **Purpose**: Performance monitoring for tool execution
- **Key Exports**:
  - `ToolPerformanceMonitor` class
  - Performance metric types
  - Reporting functions
- **Features**:
  - Execution timing
  - Statistics collection
  - Performance reports

### `/packages/react/src/utils/tool-helpers.ts`
- **Status**: **DOES NOT EXIST ON MAIN**

---

## AREA 7: Agents (Unknown - needs check)

### `/packages/react/src/agents/tools.ts`
- **Purpose**: Built-in tools and legacy ToolRegistry
- **Status**: EXISTS (need to check for deprecation warnings)

---

## AREA 2: Documentation

### Tool Calling Documentation
- **Status**: **NO TOOL CALLING DOCS ON MAIN**
- No `*TOOL_CALLING*.md` files in `packages/react/docs/`

---

## AREA 5: Test Coverage

### Existing Tests on Main:
- `packages/react/src/core/__tests__/tool-executor.test.ts`
- `packages/react/src/core/__tests__/tool-lifecycle.test.ts`
- `packages/react/src/core/__tests__/tool-orchestrator.test.ts`
- `packages/react/src/core/__tests__/tool-registry.test.ts`
- `packages/react/src/core/__tests__/tool-system-e2e.test.ts`
- `packages/react/src/core/__tests__/streaming-tools-integration.test.ts`
- `packages/react/src/utils/__tests__/tool-execution.test.ts`
- `packages/react/src/utils/__tests__/tool-performance.test.ts`

### Missing Tests on Main:
- No test for tool-helpers.ts (doesn't exist)
- No test for tool-implementation-validator.ts (doesn't exist)
- No tests for tool-result utilities

---

## AREA 9: Package Configuration

### Main's Package State:
- `packages/react/package.json` - unknown version
- `pnpm-lock.yaml` - state at main HEAD
- Other package.json files

---

## Summary

**Total Lines in Core Tool System**: ~4,120 lines
- Core: 2,383 lines
- App API: 627 lines
- Utilities: 1,110 lines

**Missing on Main (vs Branch)**:
- tool-helpers.ts (654 lines)
- tool-implementation-validator.ts (429 lines)
- All 6 tool calling documentation guides
- Additional test coverage

**Known Files to Compare**:
1. tool-executor.ts (main: 649 lines)
2. tool-lifecycle.ts (main: 721 lines)
3. tool-orchestrator.ts (main: 527 lines)
4. tool-registry.ts (main: 486 lines)
5. tools-engine.ts (main: 627 lines)
6. tool-execution.ts (main: 548 lines)
7. tool-performance.ts (main: 562 lines)
8. agents/tools.ts (main: unknown)
