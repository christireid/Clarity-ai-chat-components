# Tool Calling Architecture Inventory

**Generated**: 2026-01-21
**Repository**: Clarity AI Chat Components
**Focus**: Advanced AI Chat - Tool Calling Systems

---

## Executive Summary

This inventory maps all tool calling–related code paths, identifies architectural patterns, and documents the current mental model.

### Key Findings

1. **Multiple Tool Systems**: At least 3 distinct tool calling implementations exist
2. **Format Fragmentation**: Tool definitions use different formats (OpenAI, internal, app-level)
3. **Execution Paths**: Tool execution logic is duplicated across multiple locations
4. **UI Components**: Well-developed tool result rendering system
5. **Streaming Integration**: Partial support for streaming + tools

---

## 1. Tool Definition Formats

### 1.1 OpenAI Format (Examples)
**Location**: `examples/tool-calling/lib/tools.ts`

```typescript
type: 'function'
function: {
  name: string
  description: string
  parameters: JSONSchema
}
```

**Usage**: Direct OpenAI API integration, examples, demos

### 1.2 Agent Tool Format (Internal)
**Location**: `packages/react/src/agents/types.ts`

```typescript
interface Tool {
  name: string
  description: string
  parameters: ToolParameters
  execute: (args: ToolArguments) => Promise<ToolResult>
  requiresApproval?: boolean
  category?: string
  tags?: string[]
}
```

**Usage**: Agent orchestration, built-in tools

### 1.3 App-Level Tool Format
**Location**: `packages/react/src/app-api/tools-engine.ts`

```typescript
interface ToolDefinition {
  name: string
  description: string
  parameters: Record<string, unknown>
  execute: (params: Record<string, unknown>) => Promise<unknown>
}
```

**Usage**: `ClarityChatApp`, tools engine

**Issue**: Three different formats for the same concept

---

## 2. Tool Execution Systems

### 2.1 Tools Engine (Stateful)
**Location**: `packages/react/src/app-api/tools-engine.ts`
**Lines**: 621 lines

**Features**:
- Registry-based tool management
- Approval flow (pending → approved → executing → completed)
- Parameter validation (JSON Schema)
- Result caching (1 min TTL)
- Timeout handling (30s default)
- Built-in tools: get_current_time, calculate, generate_uuid, format_json
- Statistics tracking

**State Machine**:
```
pending → approved → executing → completed/failed/timeout
```

**Concerns**:
- Uses `new Function()` for calculator (line 101) - eval-like behavior
- Auto-approve default is `true` (line 266) - security risk
- Cache key generation doesn't account for side effects
- No visibility hooks for debugging

### 2.2 Agent Tools (Functional)
**Location**: `packages/react/src/agents/tools.ts`
**Lines**: 431 lines

**Features**:
- Built-in tools: calculator, web_search, database_query, file_read, api_call, code_execution
- ToolRegistry class for management
- Safe math evaluator (no eval)
- Category and tag-based filtering
- requiresApproval flag per tool

**Tools**:
1. `calculatorTool` - Safe recursive descent parser ✅
2. `webSearchTool` - Mock implementation
3. `databaseQueryTool` - Mock, requires approval
4. `fileReadTool` - Mock, requires approval
5. `apiCallTool` - Real fetch, requires approval
6. `codeExecutionTool` - Mock, requires approval

**Good**: Safe math evaluator, approval flags
**Concerns**: Mock implementations, unclear integration path

### 2.3 Example-Level Execution
**Location**: `examples/tool-calling/lib/tools.ts`

**Features**:
- Simple executeTool function
- Simulated results (weather, search, calculate, stock)
- Safe math evaluator (duplicate of agents version)

**Issue**: Duplicated safe evaluator code

---

## 3. Tool Invocation Lifecycle

### 3.1 Message Formats

**Format A: toolInvocations (Vercel AI SDK style)**
```typescript
{
  role: 'assistant',
  toolInvocations: [{
    toolCallId: string
    toolName: string
    args: Record<string, any>
    state: 'partial-call' | 'call' | 'result' | 'error'
    result?: any
  }]
}
```

**Format B: toolCalls (OpenAI style)**
```typescript
{
  role: 'assistant',
  toolCalls: [{
    id: string
    type: 'function'
    function: {
      name: string
      arguments: string // JSON string
    }
  }]
}
```

**Location**: Both formats handled in `use-clarity-chat-with-tools.ts` (lines 104-147)

**Issue**: Two competing formats, unclear canonical choice

### 3.2 Tool Result Extraction
**Location**: `packages/react/src/hooks/chat/use-clarity-chat-with-tools.ts`
**Function**: `extractToolResults` (lines 97-151)

**Logic**:
1. Iterate through messages
2. Check for `toolInvocations` with `state === 'result'`
3. Check for `toolCalls` + subsequent `function` role message
4. Extract and normalize to `ExtractedToolResult` format

**Concerns**:
- Heuristic-based extraction, not lifecycle-aware
- No validation of tool call completeness
- Unclear how partial results are handled

---

## 4. Tool UI Components

### 4.1 ToolInvocationCard
**Location**: `packages/react/src/components/message/tool-invocation-card.tsx`
**Lines**: 462 lines

**Features**:
- Status display (pending, executing, success, error)
- Approval buttons (approve/reject)
- Expandable arguments and results
- Retry on error
- Animated state transitions

**Status States**:
- `pending` - awaiting approval
- `approved` - approved but not executing
- `executing` - in progress
- `success` - completed successfully
- `error` - failed
- `rejected` - user rejected

**Good**: Well-polished UI, clear states
**Concern**: Status states don't match tools-engine states exactly

### 4.2 ClarityToolResult
**Location**: `packages/react/src/components/message/clarity-tool-result.tsx`
**Lines**: 190 lines

**Features**:
- Registry-based tool result rendering
- Custom component per tool type
- Fallback to JSON display
- Error boundary support
- Extensible via registry

**Good**: Clean extensibility model

---

## 5. Hooks & Integration

### 5.1 useClarityChatWithTools
**Location**: `packages/react/src/hooks/chat/use-clarity-chat-with-tools.ts`
**Lines**: 200 lines

**Purpose**: Mid-level hook combining chat + tool extraction

**API**:
```typescript
const { messages, toolResults, getToolResultsForMessage } =
  useClarityChatWithTools({ api, toolRegistry })
```

**Concerns**:
- Only extracts tool results, doesn't execute
- Unclear how execution happens
- No connection to tools-engine

### 5.2 useAssistant
**Location**: `packages/react/src/hooks/chat/use-assistant.ts`

**Purpose**: Assistant with tool calling, multi-step workflows

**Features**:
- AssistantStatus state machine (idle, loading, streaming, processing_tools, complete, error)
- Tool invocation tracking
- Parallel tool execution support
- Tool result caching
- Request deduplication

**Status**: More advanced than useClarityChatWithTools

---

## 6. Adapter Integration

### 6.1 OpenAI Adapter
**Location**: `packages/react/src/adapters/openai.ts`

**Tool Support**:
- Non-streaming: Parses `tool_calls` from response (lines 85-94)
- Streaming: Partial implementation visible

**Issue**: Need to verify streaming + tool call interleaving

### 6.2 Other Adapters
- Anthropic: `packages/react/src/adapters/anthropic.ts`
- Google: `packages/react/src/adapters/google.ts`

**Status**: Need to audit tool calling support

---

## 7. Memory Integration

**Status**: Not documented in tool-related files
**Concern**: How are tool results stored in memory?
**Questions**:
- Are tool calls part of context window?
- How are tool results summarized?
- Thread-scoped vs user-scoped memory?

**Action Required**: Audit memory system interaction with tools

---

## 8. Streaming + Tool Interleaving

**Current Understanding**:
- useAssistant has `processing_tools` status
- OpenAI adapter supports streaming
- Unclear how partial tokens + tool calls interact

**Edge Cases to Test**:
- Text before tool call
- Multiple tool calls in one response
- Tool call mid-stream
- User interruption during tool execution
- Tool failure during stream
- Retry after tool failure

---

## 9. Security Analysis

### 9.1 Code Execution Risks

**CRITICAL**: `tools-engine.ts` line 101
```typescript
const result = new Function(`return (${sanitized})`)()
```

**Risk**: `new Function()` is eval-like, potential code injection
**Mitigation**: Expression is sanitized, but still risky
**Recommendation**: Use safe parser from `agents/tools.ts` instead

### 9.2 Auto-Approval Default

**CRITICAL**: `tools-engine.ts` line 266
```typescript
autoApprove: config.autoApprove ?? true
```

**Risk**: Tools execute without user consent by default
**Recommendation**: Change default to `false`

### 9.3 Unsafe Tools

Tools that require approval:
- `database_query` ✅
- `file_read` ✅
- `api_call` ✅
- `code_execution` ✅

Tools that should require approval but don't:
- `calculate` in tools-engine (uses Function)

---

## 10. Documentation & Examples

### 10.1 Working Examples
- `examples/tool-calling/` - Full working example
- `apps/docs/app/examples/tool-calling-showcase/` - Showcase with UI
- `apps/docs/app/demos/tool-calling/page.tsx` - Demo page

### 10.2 Documentation
- API docs need to be checked
- Tool calling guide: `apps/docs/app/guides/tool-integration/page.tsx`

---

## 11. Test Coverage

**Status**: Need to audit test files

**Key Test Scenarios Needed**:
- Tool parameter validation
- Tool execution timeout
- Tool approval flow
- Tool result caching
- Streaming + tool interleaving
- Tool failure and retry
- Security (injection attempts)

---

## 12. Mental Model Analysis

### Current Mental Model (Inferred)

1. **Developer defines tools** using one of 3 formats
2. **Tools are registered** in registry or engine
3. **LLM decides to call tool** during conversation
4. **Tool call appears in message** (as toolInvocations or toolCalls)
5. **System extracts tool calls** from messages
6. **Optional: User approves tool** (if requiresApproval)
7. **System executes tool** (via execute function)
8. **Tool result is returned** to LLM
9. **LLM generates final response** using tool result
10. **UI renders tool result** (via registry component)

### Problems with Current Model

1. **Steps 6-8 are unclear** - where does execution happen?
2. **No explicit lifecycle API** - approval and execution are implicit
3. **Multiple competing systems** - tools-engine vs agents vs examples
4. **Extraction is post-hoc** - not lifecycle-aware
5. **Streaming integration unclear** - when do tools pause the stream?
6. **Memory integration missing** - what gets stored?

### Desired Mental Model

1. Tool definition → single canonical format
2. Tool registration → one registry
3. Tool call → explicit lifecycle events
4. Tool approval → explicit API (if required)
5. Tool execution → explicit orchestration
6. Tool result → explicit memory write
7. Streaming → explicit pause/resume around tools
8. UI → clean separation from execution logic

---

## 13. File Inventory Summary

### Core Tool Files (26 total)

**Definitions & Types**:
- `packages/react/src/agents/types.ts` (251 lines)
- `packages/react/src/adapters/types.ts` (includes ToolCall)
- `packages/react/src/types/tool-result-types.ts`

**Execution**:
- `packages/react/src/app-api/tools-engine.ts` (621 lines) ⚠️
- `packages/react/src/agents/tools.ts` (431 lines)
- `examples/tool-calling/lib/tools.ts` (322 lines)

**Hooks**:
- `packages/react/src/hooks/chat/use-clarity-chat-with-tools.ts` (200 lines)
- `packages/react/src/hooks/chat/use-assistant.ts` (partial)

**UI Components**:
- `packages/react/src/components/message/tool-invocation-card.tsx` (462 lines)
- `packages/react/src/components/message/clarity-tool-result.tsx` (190 lines)
- `packages/react/src/agents/tool-ui-registry.ts`

**Utilities**:
- `packages/react/src/utils/tools/index.ts`
- `packages/react/src/utils/tools/tool-result-extractor.ts`
- `packages/react/src/utils/tools/tool-result-helpers.ts`

**Adapters**:
- `packages/react/src/adapters/openai.ts` (tool support)
- `packages/react/src/adapters/anthropic.ts` (tool support)
- `packages/react/src/adapters/google.ts` (tool support)

**Examples & Demos**:
- `examples/tool-calling/*` (6 files)
- `apps/docs/app/examples/tool-calling-showcase/*` (10+ files)
- `apps/docs/app/demos/tool-calling/page.tsx`

---

## 14. Next Steps (Phase 2)

1. **Failure Mode Analysis**: Test edge cases and error scenarios
2. **Streaming Integration Audit**: Verify tool + streaming behavior
3. **Memory Integration Audit**: Document tool result persistence
4. **Security Deep Dive**: Full security review of execution paths
5. **Test Coverage Audit**: Identify missing test scenarios
6. **Documentation Audit**: Verify docs match implementation

---

## Appendix A: Quick Reference

### Tool Formats
- **OpenAI**: `{ type: 'function', function: { name, description, parameters } }`
- **Agent**: `{ name, description, parameters, execute, requiresApproval }`
- **App**: `{ name, description, parameters, execute }` (in ToolDefinition)

### Message Formats
- **Format A**: `toolInvocations` array with `state` field
- **Format B**: `toolCalls` array + subsequent function message

### Execution Systems
- **tools-engine**: Stateful, approval flow, caching
- **agents/tools**: Functional, ToolRegistry class
- **examples**: Simulated, minimal

### Status States
- **ToolInvocationCard**: pending, approved, rejected, executing, success, error
- **tools-engine**: pending, approved, executing, completed, failed, timeout
- **useAssistant**: idle, loading, streaming, processing_tools, complete, error

**Consistency Issue**: Status states vary across systems

---

**End of Inventory**
