# Tool Calling Architecture Refactoring Plan

**Generated**: 2026-01-21
**Target Completion**: This Session
**Target Rubric Score**: ≥98/100

---

## Strategic Approach

This plan follows a **bottom-up refactoring strategy**:

1. **Fix Critical Security Issues** (immediate)
2. **Establish Canonical Architecture** (foundation)
3. **Refactor Implementation** (systematic)
4. **Integrate Streaming & Memory** (advanced)
5. **Verify & Document** (completion)

---

## Phase 1: Critical Security Fixes ✅ Priority

### 1.1 Fix `new Function()` Code Execution Risk
**TODO-001** | **Blocker** | Est: 30 min

**Actions**:
1. Extract safe math evaluator from `agents/tools.ts`
2. Move to `packages/react/src/utils/math/safe-evaluator.ts`
3. Replace `tools-engine.ts:101` with safe evaluator
4. Add tests for calculator tool security
5. Update both tools and examples to use shared implementation

**Files Modified**:
- `packages/react/src/app-api/tools-engine.ts`
- `packages/react/src/utils/math/safe-evaluator.ts` (new)
- `examples/tool-calling/lib/tools.ts`

**Acceptance**:
- [ ] No `new Function()` or `eval()` calls in codebase
- [ ] Tests verify injection attempts fail safely
- [ ] Calculator still works correctly

### 1.2 Fix Auto-Approve Default
**TODO-002** | **Blocker** | Est: 20 min

**Actions**:
1. Change default in `tools-engine.ts:266` to `false`
2. Update all examples to explicitly set `autoApprove`
3. Add warning when autoApprove is true
4. Update documentation with security guidance

**Files Modified**:
- `packages/react/src/app-api/tools-engine.ts`
- All example files using tools
- Documentation

**Acceptance**:
- [ ] Default is `autoApprove: false`
- [ ] Console warning when autoApprove is true
- [ ] Examples show explicit opt-in
- [ ] Docs explain security implications

---

## Phase 2: Canonical Architecture Definition ✅ Priority

### 2.1 Define Canonical Tool Definition Format
**TODO-004** | **High** | Est: 1 hour

**Decision**: Use enhanced Agent format as canonical:

```typescript
interface ToolDefinition {
  // Identification
  name: string
  description: string

  // Schema (JSON Schema Draft 7)
  parameters: ToolParameters

  // Execution
  execute: (args: ToolArguments) => Promise<ToolResult>

  // Security & Behavior
  requiresApproval?: boolean
  cacheable?: boolean
  cacheTtl?: number
  timeout?: number

  // Discovery & UX
  category?: string
  tags?: string[]
  displayName?: string
  icon?: string

  // Lifecycle Hooks
  onBefore?: (args: ToolArguments) => void | Promise<void>
  onAfter?: (result: ToolResult) => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}
```

**Actions**:
1. Create `packages/react/src/types/tool-definition.ts`
2. Define canonical ToolDefinition interface
3. Create adapters for OpenAI format
4. Update tools-engine to use canonical format
5. Add migration guide for existing tools

**Files Created**:
- `packages/react/src/types/tool-definition.ts`
- `packages/react/src/adapters/tool-formats.ts`

**Files Modified**:
- `packages/react/src/agents/types.ts` (extend)
- `packages/react/src/app-api/tools-engine.ts`

**Acceptance**:
- [ ] Single ToolDefinition type
- [ ] Adapters for OpenAI format
- [ ] All internal code uses canonical format
- [ ] Migration guide exists

### 2.2 Define Canonical Message Format
**TODO-005** | **High** | Est: 1 hour

**Decision**: Use `toolInvocations` format as canonical:

```typescript
interface ToolInvocation {
  // Identity
  toolCallId: string
  toolName: string

  // Execution
  args: Record<string, unknown>
  state: 'call' | 'executing' | 'result' | 'error'

  // Results
  result?: ToolResult
  error?: string

  // Metadata
  timestamp?: number
  duration?: number
  cached?: boolean
}

interface AssistantMessage extends CoreMessage {
  role: 'assistant'
  content: string
  toolInvocations?: ToolInvocation[]
}
```

**Actions**:
1. Update `CoreMessage` type to use canonical format
2. Create adapter for `toolCalls` format (OpenAI legacy)
3. Update `extractToolResults` to only handle canonical format
4. Add migration warnings for old format

**Files Modified**:
- `packages/react/src/types/messages.ts`
- `packages/react/src/hooks/chat/use-chat-enhanced.ts`
- `packages/react/src/hooks/chat/use-clarity-chat-with-tools.ts`

**Acceptance**:
- [ ] Single message format for tool calls
- [ ] Adapter handles legacy format
- [ ] Clear migration path

### 2.3 Define Tool Execution Lifecycle
**TODO-006** | **High** | Est: 1.5 hours

**Lifecycle States**:
```
idle → requested → (pending_approval) → approved → executing → completed
                                                            └→ failed
```

**Lifecycle Events**:
```typescript
interface ToolLifecycleEvents {
  onToolRequested: (call: ToolCall) => void
  onToolPendingApproval: (call: ToolCall) => void
  onToolApproved: (call: ToolCall) => void
  onToolRejected: (call: ToolCall, reason: string) => void
  onToolExecuting: (call: ToolCall) => void
  onToolProgress: (call: ToolCall, progress: number) => void
  onToolCompleted: (call: ToolCall, result: ToolResult) => void
  onToolFailed: (call: ToolCall, error: Error) => void
  onToolTimeout: (call: ToolCall) => void
  onToolCached: (call: ToolCall, result: ToolResult) => void
}
```

**Actions**:
1. Create `packages/react/src/core/tool-lifecycle.ts`
2. Implement event emitter for lifecycle
3. Update tools-engine to emit events
4. Add hooks: `useToolLifecycle`, `useToolCall`
5. Connect UI components to lifecycle

**Files Created**:
- `packages/react/src/core/tool-lifecycle.ts`
- `packages/react/src/hooks/tools/use-tool-lifecycle.ts`
- `packages/react/src/hooks/tools/use-tool-call.ts`

**Acceptance**:
- [ ] Explicit lifecycle with events
- [ ] Hooks for React integration
- [ ] UI components use lifecycle
- [ ] Docs explain flow

### 2.4 Unify Status States
**TODO-010** | **High** | Est: 30 min

**Canonical Status Enum**:
```typescript
type ToolCallStatus =
  | 'idle'
  | 'requested'
  | 'pending_approval'
  | 'approved'
  | 'executing'
  | 'completed'
  | 'failed'
  | 'timeout'
  | 'rejected'
  | 'cached'
```

**Actions**:
1. Create `packages/react/src/types/tool-status.ts`
2. Update all components to use canonical status
3. Create status transition validator
4. Add status → UI variant mapping

**Files Modified**:
- `packages/react/src/components/message/tool-invocation-card.tsx`
- `packages/react/src/app-api/tools-engine.ts`
- `packages/react/src/hooks/chat/use-assistant.ts`

**Acceptance**:
- [ ] Single ToolCallStatus type
- [ ] All components aligned
- [ ] Status transitions validated

---

## Phase 3: Implementation Consolidation ✅ Priority

### 3.1 Consolidate Tool Execution Systems
**TODO-003** | **Blocker** | Est: 2 hours

**Strategy**: Merge into single system

**Canonical System Architecture**:
```
packages/react/src/core/
  ├── tool-registry.ts      (from agents/tools.ts ToolRegistry)
  ├── tool-executor.ts      (from tools-engine.ts execution logic)
  ├── tool-lifecycle.ts     (new lifecycle manager)
  └── tool-orchestrator.ts  (new high-level coordinator)
```

**Actions**:
1. Extract ToolRegistry from agents, enhance it
2. Extract execution logic from tools-engine
3. Create ToolExecutor with approval, caching, timeout
4. Create ToolOrchestrator to coordinate lifecycle
5. Deprecate old systems with warnings
6. Update all hooks to use new core

**Files Created**:
- `packages/react/src/core/tool-registry.ts`
- `packages/react/src/core/tool-executor.ts`
- `packages/react/src/core/tool-orchestrator.ts`

**Files Deprecated**:
- `packages/react/src/app-api/tools-engine.ts` (keep for compatibility)
- `packages/react/src/agents/tools.ts` (keep builtInTools export)

**Migration Strategy**:
- Old APIs marked @deprecated with migration instructions
- Compatibility shims route to new core
- Remove in next major version

**Acceptance**:
- [ ] Single core system
- [ ] Old APIs deprecated
- [ ] All hooks use new core
- [ ] Migration guide complete

### 3.2 Enhance Tool Parameter Validation
**TODO-016** | **Med** | Est: 1 hour

**Actions**:
1. Implement full JSON Schema Draft 7 validator
2. Support nested objects, arrays, oneOf, anyOf, allOf
3. Add detailed validation error messages
4. Add schema-based TypeScript inference (optional)

**Files Modified**:
- `packages/react/src/core/tool-executor.ts`
- New: `packages/react/src/utils/validation/json-schema.ts`

**Acceptance**:
- [ ] Full JSON Schema support
- [ ] Detailed error messages
- [ ] Tests for complex schemas

### 3.3 Standardize Error Handling
**TODO-017** | **Med** | Est: 45 min

**Canonical Error Type**:
```typescript
class ToolExecutionError extends Error {
  constructor(
    public toolName: string,
    public reason: 'validation' | 'timeout' | 'execution' | 'rejected',
    public details?: unknown,
    message?: string
  )
}
```

**Actions**:
1. Create `ToolExecutionError` class
2. Update all tool execution paths to use it
3. Add error serialization for logging
4. Update UI components to display errors consistently

**Files Created**:
- `packages/react/src/errors/tool-errors.ts`

**Acceptance**:
- [ ] Consistent error type
- [ ] All paths use ToolExecutionError
- [ ] UI displays errors properly

### 3.4 Deduplicate Safe Math Evaluator
**TODO-011** | **Med** | Est: 20 min

**Actions**:
1. Extract to `packages/react/src/utils/math/safe-evaluator.ts`
2. Update agents/tools.ts to import
3. Update examples to import
4. Remove duplicated code

**Acceptance**:
- [ ] Single implementation
- [ ] No duplicated code

---

## Phase 4: Streaming & Memory Integration ✅ Priority

### 4.1 Document Streaming + Tool Behavior
**TODO-008** | **High** | Est: 1.5 hours

**Actions**:
1. Audit streaming adapters for tool support
2. Test streaming + tool call scenarios
3. Document pause/resume semantics
4. Add streaming + tool integration tests
5. Create visual diagram of streaming lifecycle

**Test Scenarios**:
- Text → tool call → text
- Multiple tool calls in sequence
- Multiple tool calls in parallel
- User interruption during tool execution
- Tool failure during stream
- Retry after tool failure

**Files Created**:
- `packages/react/src/docs/streaming-tools.md`
- `packages/react/src/__tests__/streaming-tools.test.ts`

**Acceptance**:
- [ ] All scenarios tested
- [ ] Docs explain behavior
- [ ] Diagram shows lifecycle

### 4.2 Complete Adapter Tool Support
**TODO-014** | **Med** | Est: 1 hour

**Actions**:
1. Complete OpenAI streaming tool support
2. Verify Anthropic tool support
3. Verify Google tool support
4. Add adapter capability matrix to docs

**Files Modified**:
- `packages/react/src/adapters/openai.ts`
- `packages/react/src/adapters/anthropic.ts`
- `packages/react/src/adapters/google.ts`

**Acceptance**:
- [ ] All adapters support tools
- [ ] Streaming works correctly
- [ ] Tests verify each adapter

### 4.3 Document Memory Integration
**TODO-009** | **High** | Est: 1 hour

**Actions**:
1. Audit memory system tool storage
2. Define what gets stored (calls + results)
3. Define summarization rules for tool results
4. Document context window management
5. Add memory + tools integration tests

**Questions to Answer**:
- Are tool calls stored in memory?
- Are tool results stored?
- How are tools represented in context?
- How are tool results summarized?
- Thread-scoped vs user-scoped?

**Files Created**:
- `packages/react/src/docs/memory-tools.md`
- Tests for memory integration

**Acceptance**:
- [ ] Memory rules documented
- [ ] Integration tested
- [ ] Context management clear

---

## Phase 5: Hook & Component Integration ✅ Priority

### 5.1 Fix useClarityChatWithTools
**TODO-020** | **Med** | Est: 45 min

**Decision**: Clarify it's extraction-only, create execution hook separately

**Actions**:
1. Rename to `useToolResultExtractor` (or keep with clear docs)
2. Create new `useToolExecution` hook
3. Create new `useClarityChatWithToolExecution` that combines both
4. Update docs to explain difference

**Files Created**:
- `packages/react/src/hooks/tools/use-tool-execution.ts`

**Files Modified**:
- `packages/react/src/hooks/chat/use-clarity-chat-with-tools.ts`

**Acceptance**:
- [ ] Clear separation of concerns
- [ ] Docs explain when to use each

### 5.2 Connect UI to Lifecycle
**TODO-015** | **Med** | Est: 45 min

**Actions**:
1. Update ToolInvocationCard to use lifecycle events
2. Connect approve/reject buttons to orchestrator
3. Add real-time status updates
4. Add progress indicators for long-running tools

**Files Modified**:
- `packages/react/src/components/message/tool-invocation-card.tsx`

**Acceptance**:
- [ ] UI reflects lifecycle state
- [ ] Buttons trigger lifecycle methods
- [ ] Real-time updates work

### 5.3 Add Lifecycle Hooks
**TODO-013** | **Med** | Est: 1 hour

**Hooks to Create**:
```typescript
useToolCall(toolCallId: string): ToolCall & { approve, reject, retry }
useToolExecution(options): { execute, executeBatch, status }
useToolLifecycle(callbacks): void
useToolStats(): ToolStatistics
```

**Files Created**:
- `packages/react/src/hooks/tools/use-tool-call.ts`
- `packages/react/src/hooks/tools/use-tool-execution.ts`
- `packages/react/src/hooks/tools/use-tool-lifecycle.ts`
- `packages/react/src/hooks/tools/use-tool-stats.ts`

**Acceptance**:
- [ ] All hooks implemented
- [ ] Tests for each hook
- [ ] Docs with examples

---

## Phase 6: Testing & Verification ✅ Priority

### 6.1 Integration Test Suite
**TODO-018** | **Med** | Est: 2 hours

**Test Categories**:
1. **Happy Path**: Define → Register → Execute → Render
2. **Approval Flow**: requiresApproval → pending → approve → execute
3. **Error Handling**: validation fail, execution fail, timeout
4. **Caching**: cacheable tools, TTL, invalidation
5. **Streaming**: stream + tool + stream, interruption
6. **Memory**: tool calls in memory, summarization
7. **Security**: injection attempts, unsafe operations

**Files Created**:
- `packages/react/src/__tests__/integration/tool-calling.test.ts`
- `packages/react/src/__tests__/integration/tool-streaming.test.ts`
- `packages/react/src/__tests__/integration/tool-memory.test.ts`
- `packages/react/src/__tests__/integration/tool-security.test.ts`

**Acceptance**:
- [ ] All scenarios tested
- [ ] >90% code coverage
- [ ] All tests pass

### 6.2 Security Audit
**TODO-001, TODO-002, plus comprehensive review** | Est: 1 hour

**Checklist**:
- [ ] No eval() or Function() usage
- [ ] Auto-approve default is false
- [ ] Approval required for dangerous tools
- [ ] Input validation on all tools
- [ ] Rate limiting considerations
- [ ] Error messages don't leak sensitive data
- [ ] Tool results sanitized before rendering

**Actions**:
1. Run security-focused code review
2. Add security tests
3. Update security docs
4. Add CSP considerations

**Files Created**:
- `packages/react/src/docs/security-tools.md`

**Acceptance**:
- [ ] Security checklist complete
- [ ] No critical vulnerabilities
- [ ] Docs explain security model

---

## Phase 7: Documentation & Examples ✅ Priority

### 7.1 Comprehensive Tool Calling Guide
**TODO-019** | **Med** | Est: 2 hours

**Guide Structure**:
1. **Introduction**: What are tools, why use them
2. **Quick Start**: Define and use a tool in 3 steps
3. **Tool Definition**: Comprehensive format guide
4. **Registration**: Registry, built-ins, custom tools
5. **Execution Lifecycle**: Detailed flow diagram
6. **Approval Flow**: When and how to require approval
7. **Streaming Integration**: How streaming + tools interact
8. **Memory Integration**: What gets stored and when
9. **UI Components**: Rendering tools and results
10. **Security**: Best practices and considerations
11. **Advanced**: Parallel execution, caching, progress
12. **Troubleshooting**: Common issues and solutions

**Files Created**:
- `apps/docs/app/guides/tool-calling-complete/page.tsx`
- `packages/react/src/docs/TOOL_CALLING.md`

**Acceptance**:
- [ ] Comprehensive guide complete
- [ ] All sections with examples
- [ ] Visual diagrams included

### 7.2 Canonical Example
**TODO-028** | **Low** | Est: 1 hour

**Actions**:
1. Create reference implementation
2. Show all features: approval, streaming, caching, UI
3. Add extensive comments
4. Link from all other examples

**Files Created**:
- `examples/tool-calling-canonical/`

**Acceptance**:
- [ ] Production-ready example
- [ ] All features demonstrated
- [ ] Well-documented

### 7.3 API Documentation
**Action**: Update all tool-related API docs

**Files to Update**:
- Component docs (ToolInvocationCard, ClarityToolResult)
- Hook docs (all tool hooks)
- Core API docs (registry, executor, orchestrator)
- Type docs (ToolDefinition, ToolCall, etc.)

**Acceptance**:
- [ ] All APIs documented
- [ ] Examples in every doc
- [ ] Types fully documented

---

## Phase 8: Polish & Optimization (Optional)

### 8.1 Enhanced Features (Time Permitting)

- [ ] **TODO-021**: Expand built-in tool library
- [ ] **TODO-023**: Tool browser UI with filtering
- [ ] **TODO-024**: Expose tool stats in hooks
- [ ] **TODO-025**: Generic type parameters for type safety
- [ ] **TODO-026**: Per-tool cache TTL
- [ ] **TODO-027**: Parallel tool execution

**Estimate**: 3-4 hours total

---

## Success Criteria

### Rubric Targets (≥98/100)

1. **Tool calling correctness & safety**: 30/30
   - ✅ No security vulnerabilities
   - ✅ Safe defaults (approval required)
   - ✅ Comprehensive validation
   - ✅ Error handling complete

2. **Streaming + tool interleaving robustness**: 20/20
   - ✅ All scenarios tested
   - ✅ Pause/resume works correctly
   - ✅ Race conditions handled
   - ✅ Documented behavior

3. **Memory integration clarity & safety**: 15/15
   - ✅ Clear storage rules
   - ✅ Summarization defined
   - ✅ Context management
   - ✅ Tests verify behavior

4. **DX & API mental model**: 15/15
   - ✅ Single canonical architecture
   - ✅ Clear lifecycle
   - ✅ Excellent TypeScript types
   - ✅ Minimal config needed

5. **Error handling & transparency**: 10/10
   - ✅ Consistent error types
   - ✅ Clear error messages
   - ✅ Visible failures
   - ✅ Recovery mechanisms

6. **Docs & examples accuracy**: 10/10
   - ✅ Comprehensive guide
   - ✅ All APIs documented
   - ✅ Working examples
   - ✅ Accurate to implementation

**Target**: 100/100 (allows margin for iteration)

### Definition of Done

- [ ] All blocker TODOs resolved
- [ ] All high-priority TODOs resolved
- [ ] Most medium-priority TODOs resolved
- [ ] All integration tests passing
- [ ] Security audit complete
- [ ] Documentation complete
- [ ] Examples updated
- [ ] Rubric score ≥98/100
- [ ] Zero breaking changes (or migration guide provided)

---

## Timeline Estimate

**Total Estimated Time**: 18-22 hours

**Phase Breakdown**:
- Phase 1 (Security): 1 hour
- Phase 2 (Architecture): 4 hours
- Phase 3 (Consolidation): 4 hours
- Phase 4 (Streaming/Memory): 3 hours
- Phase 5 (Integration): 3 hours
- Phase 6 (Testing): 3 hours
- Phase 7 (Docs): 3 hours
- Phase 8 (Optional): 3 hours

**Session Strategy**: Complete Phases 1-7, partial Phase 8

---

## Risk Mitigation

### Breaking Changes Risk
**Mitigation**:
- Use deprecation warnings, not removals
- Provide compatibility shims
- Clear migration guide

### Testing Risk
**Mitigation**:
- Write tests as we refactor
- Run existing tests frequently
- Add integration tests early

### Scope Creep Risk
**Mitigation**:
- Focus on critical path first
- Mark optional items clearly
- Time-box each phase

---

**End of Plan**
