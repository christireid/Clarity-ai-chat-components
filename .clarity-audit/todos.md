# Tool Calling Audit TODO Registry

**Generated**: 2026-01-21
**Last Updated**: 2026-01-21
**Total TODOs**: 28
**Completed**: 0
**Remaining**: 28

---

## Blocker Issues (Must Fix)

- [ ] **TODO-001** | Severity: Blocker
      Area: Security
      Title: `new Function()` code execution risk in tools-engine calculator
      Evidence: `packages/react/src/app-api/tools-engine.ts:101` uses `new Function()` which is eval-like
      Fix Plan: Replace with safe math parser from `agents/tools.ts` (safeEvaluateMath)
      Acceptance Criteria: Calculator tool uses recursive descent parser, no Function() calls
      Status: Not Started
      Linked Commit: -

- [ ] **TODO-002** | Severity: Blocker
      Area: Security
      Title: Auto-approve default is `true` - tools execute without consent
      Evidence: `tools-engine.ts:266` - `autoApprove: config.autoApprove ?? true`
      Fix Plan: Change default to `false`, require explicit opt-in
      Acceptance Criteria: autoApprove defaults to false, docs updated, examples show opt-in
      Status: Not Started
      Linked Commit: -

- [ ] **TODO-003** | Severity: Blocker
      Area: ToolCalling
      Title: No canonical tool calling architecture - 3 competing systems
      Evidence: tools-engine.ts, agents/tools.ts, examples/tools.ts all implement different systems
      Fix Plan: Define canonical architecture, deprecate others, create migration guide
      Acceptance Criteria: Single tool system, clear deprecation warnings, migration complete
      Status: Not Started
      Linked Commit: -

---

## High Priority Issues

- [ ] **TODO-004** | Severity: High
      Area: ToolCalling
      Title: Tool definition format fragmentation (3 different formats)
      Evidence: OpenAI format, Agent format, App format all coexist
      Fix Plan: Define canonical format, create adapters for other formats
      Acceptance Criteria: One canonical ToolDefinition type, adapters for compatibility
      Status: Not Started
      Linked Commit: -

- [ ] **TODO-005** | Severity: High
      Area: ToolCalling
      Title: Message format inconsistency (toolInvocations vs toolCalls)
      Evidence: `use-clarity-chat-with-tools.ts:104-147` handles both formats
      Fix Plan: Choose canonical format, document clearly, provide migration path
      Acceptance Criteria: One message format, clear docs, backward compatibility
      Status: Not Started
      Linked Commit: -

- [ ] **TODO-006** | Severity: High
      Area: ToolCalling
      Title: Tool execution lifecycle is implicit, not explicit
      Evidence: No clear API for approve → execute → result flow
      Fix Plan: Create explicit lifecycle API with events and hooks
      Acceptance Criteria: `onToolCallRequested`, `onToolApproved`, `onToolExecuted` events
      Status: Not Started
      Linked Commit: -

- [ ] **TODO-007** | Severity: High
      Area: ToolCalling
      Title: Tool result extraction is post-hoc, not lifecycle-aware
      Evidence: `extractToolResults` iterates messages heuristically
      Fix Plan: Integrate extraction into execution lifecycle
      Acceptance Criteria: Tool results available immediately after execution, no heuristics
      Status: Not Started
      Linked Commit: -

- [ ] **TODO-008** | Severity: High
      Area: Streaming
      Title: Streaming + tool interleaving behavior undocumented
      Evidence: No clear docs on how streaming pauses for tool execution
      Fix Plan: Document and test streaming pause/resume semantics
      Acceptance Criteria: Docs explain behavior, tests verify all cases
      Status: Not Started
      Linked Commit: -

- [ ] **TODO-009** | Severity: High
      Area: Memory
      Title: Tool result memory integration not documented
      Evidence: No mention of how tool calls/results are stored in memory
      Fix Plan: Audit memory system, document tool storage rules
      Acceptance Criteria: Clear docs on what's stored, context limits, summarization
      Status: Not Started
      Linked Commit: -

- [ ] **TODO-010** | Severity: High
      Area: DX
      Title: Status state inconsistency across components
      Evidence: ToolInvocationCard, tools-engine, useAssistant use different states
      Fix Plan: Define canonical status enum, align all components
      Acceptance Criteria: Single ToolStatus type used everywhere
      Status: Not Started
      Linked Commit: -

---

## Medium Priority Issues

- [ ] **TODO-011** | Severity: Med
      Area: ToolCalling
      Title: Duplicated safe math evaluator code
      Evidence: `agents/tools.ts:18-126` and `examples/tool-calling/lib/tools.ts:170-250`
      Fix Plan: Extract to shared utility, deduplicate
      Acceptance Criteria: Single implementation, both locations import it
      Status: Not Started
      Linked Commit: -

- [ ] **TODO-012** | Severity: Med
      Area: ToolCalling
      Title: Tool result caching doesn't account for side effects
      Evidence: `tools-engine.ts:434-457` caches based on name+params only
      Fix Plan: Add `cacheable` flag to tool definition, default false
      Acceptance Criteria: Tools can opt-in to caching, non-idempotent tools not cached
      Status: Not Started
      Linked Commit: -

- [ ] **TODO-013** | Severity: Med
      Area: ToolCalling
      Title: No visibility hooks for tool execution debugging
      Evidence: tools-engine doesn't emit events for monitoring
      Fix Plan: Add lifecycle events: onToolCallCreated, onToolExecuting, onToolCompleted
      Acceptance Criteria: Events emitted, DevTools can subscribe
      Status: Not Started
      Linked Commit: -

- [ ] **TODO-014** | Severity: Med
      Area: Streaming
      Title: Streaming adapter tool support incomplete
      Evidence: OpenAI streaming implementation partial (line 150 truncated)
      Fix Plan: Complete streaming tool support in all adapters
      Acceptance Criteria: OpenAI, Anthropic, Google adapters stream tool calls correctly
      Status: Not Started
      Linked Commit: -

- [ ] **TODO-015** | Severity: Med
      Area: ToolCalling
      Title: Tool approval flow not integrated with UI components
      Evidence: ToolInvocationCard has approve/reject but no integration with tools-engine
      Fix Plan: Connect UI components to tools-engine approval API
      Acceptance Criteria: UI approval buttons trigger engine approval flow
      Status: Not Started
      Linked Commit: -

- [ ] **TODO-016** | Severity: Med
      Area: ToolCalling
      Title: Tool parameter validation schema limited
      Evidence: `validateParameters` only handles basic types, not nested objects
      Fix Plan: Enhance validator to support full JSON Schema spec
      Acceptance Criteria: Supports nested objects, arrays, anyOf, oneOf, etc.
      Status: Not Started
      Linked Commit: -

- [ ] **TODO-017** | Severity: Med
      Area: ToolCalling
      Title: Error handling inconsistent across tool systems
      Evidence: Different error formats in tools-engine vs agents vs examples
      Fix Plan: Define canonical ToolError type, standardize error handling
      Acceptance Criteria: All systems use ToolError, consistent structure
      Status: Not Started
      Linked Commit: -

- [ ] **TODO-018** | Severity: Med
      Area: Tests
      Title: Missing integration tests for tool calling flows
      Evidence: No end-to-end tests found for tool approval → execution → result
      Fix Plan: Add integration tests for all tool calling scenarios
      Acceptance Criteria: Tests cover happy path, errors, timeouts, retries, approvals
      Status: Not Started
      Linked Commit: -

- [ ] **TODO-019** | Severity: Med
      Area: Docs
      Title: Tool calling mental model not documented
      Evidence: No clear guide on tool execution lifecycle
      Fix Plan: Write comprehensive tool calling guide
      Acceptance Criteria: Guide covers definition, registration, execution, rendering
      Status: Not Started
      Linked Commit: -

- [ ] **TODO-020** | Severity: Med
      Area: ToolCalling
      Title: useClarityChatWithTools doesn't execute tools, only extracts results
      Evidence: Hook extracts but doesn't orchestrate execution
      Fix Plan: Clarify purpose or add execution capability
      Acceptance Criteria: Either rename to clarify or add execution integration
      Status: Not Started
      Linked Commit: -

---

## Low Priority Issues

- [ ] **TODO-021** | Severity: Low
      Area: ToolCalling
      Title: Built-in tools in tools-engine are limited
      Evidence: Only 4 basic tools: time, calculate, uuid, format_json
      Fix Plan: Expand built-in tool library with common use cases
      Acceptance Criteria: Add tools for dates, strings, arrays, objects
      Status: Not Started
      Linked Commit: -

- [ ] **TODO-022** | Severity: Low
      Area: ToolCalling
      Title: Mock tools in agents/tools.ts should be production-ready
      Evidence: web_search, database_query are mocks
      Fix Plan: Either remove mocks or document as examples only
      Acceptance Criteria: Clear documentation on which tools are production-ready
      Status: Not Started
      Linked Commit: -

- [ ] **TODO-023** | Severity: Low
      Area: ToolCalling
      Title: Tool categories and tags not used in UI
      Evidence: Tools have category/tags but no filtering UI
      Fix Plan: Add tool browser UI with category/tag filtering
      Acceptance Criteria: DevTools or demo shows tool discovery by category
      Status: Not Started
      Linked Commit: -

- [ ] **TODO-024** | Severity: Low
      Area: ToolCalling
      Title: Tool execution statistics not exposed in hooks
      Evidence: getToolStats exists but not exposed to React components
      Fix Plan: Add useToolStats hook or integrate into useClarityChatApp
      Acceptance Criteria: Components can access tool execution metrics
      Status: Not Started
      Linked Commit: -

- [ ] **TODO-025** | Severity: Low
      Area: DX
      Title: TypeScript types for tool parameters too loose
      Evidence: Tool args are Record<string, unknown> instead of inferred types
      Fix Plan: Add generic type parameter to Tool<TArgs> for type safety
      Acceptance Criteria: Tool definitions have inferred argument types
      Status: Not Started
      Linked Commit: -

- [ ] **TODO-026** | Severity: Low
      Area: Performance
      Title: Tool result caching TTL not configurable per tool
      Evidence: Global cacheTtlMs applied to all tools
      Fix Plan: Add cacheTtl option to individual tool definitions
      Acceptance Criteria: Each tool can specify its own cache TTL
      Status: Not Started
      Linked Commit: -

- [ ] **TODO-027** | Severity: Low
      Area: ToolCalling
      Title: Parallel tool execution not implemented in tools-engine
      Evidence: useAssistant has parallelTools option but tools-engine is sequential
      Fix Plan: Add parallel execution support to tools-engine
      Acceptance Criteria: Multiple tools execute concurrently when safe
      Status: Not Started
      Linked Commit: -

- [ ] **TODO-028** | Severity: Low
      Area: Docs
      Title: Examples need consistency review
      Evidence: Multiple example implementations with different patterns
      Fix Plan: Standardize example patterns, create canonical example
      Acceptance Criteria: One canonical tool calling example, others reference it
      Status: Not Started
      Linked Commit: -

---

## Completed TODOs

*(None yet)*

---

## Summary by Area

- **Security**: 2 blockers
- **ToolCalling**: 1 blocker, 8 high, 7 med, 7 low
- **Streaming**: 2 high, 1 med
- **Memory**: 1 high
- **DX**: 1 high, 1 low
- **Tests**: 1 med
- **Docs**: 1 med, 1 low
- **Performance**: 1 low

---

## Critical Path (Must complete for ≥98 score)

1. TODO-001 (Security): Fix Function() usage
2. TODO-002 (Security): Fix auto-approve default
3. TODO-003 (Architecture): Establish canonical system
4. TODO-004 (Formats): Unify tool definitions
5. TODO-005 (Formats): Unify message formats
6. TODO-006 (Lifecycle): Explicit execution API
7. TODO-008 (Streaming): Document streaming behavior
8. TODO-009 (Memory): Document memory integration
9. TODO-010 (DX): Unify status states
10. TODO-018 (Tests): Add integration tests
11. TODO-019 (Docs): Complete documentation

**Estimated Items for ≥98 Score**: 11 blockers/high + critical meds

---

**End of TODO Registry**
