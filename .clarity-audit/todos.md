# Clarity Chat Audit TODO Registry

**Status**: Active **Last Updated**: 2026-01-21 **Total TODOs**: 87 **Unchecked**: 87 **Target**: 0
unchecked items for production readiness

---

## CRITICAL TODOS (MUST FIX - Sprint 1)

### TODO-001 | BLOCKER | Core Functionality

- [x] **Fix Race Condition in Message Undo/Redo** ✅ **COMPLETED**
  - **Severity**: Blocker
  - **Area**: Func
  - **Evidence**: `/packages/react/src/hooks/message/use-message-operations.ts:454-509`
  - **Issue**: Rapid undo operations access stale history state from closure
  - **Fix Plan**: ~~Add transaction queue with mutex pattern~~ → Refactored to useReducer for atomic
    state updates
  - **Acceptance**: Test with 10 rapid undo clicks, verify no data corruption
  - **Owner**: Agent #2
  - **Status**: Completed (2026-01-21)
  - **Linked**: CRIT-001
  - **Time**: 8 hours
  - **Implementation**:
    - ✅ Refactored from multiple useState to single useReducer for atomic state transitions
    - ✅ Created operationsReducer handling all state changes (ADD_MESSAGE, EDIT_MESSAGE,
      DELETE_MESSAGE, UNDO, REDO, etc.)
    - ✅ Wrapped undo/redo dispatch calls in flushSync() to ensure synchronous completion
    - ✅ Eliminated closure staleness - reducer always receives current state
    - ✅ Created production-realistic race condition tests (3 test cases, all passing)
    - ✅ Tests simulate real user interactions with delays between operations
    - ✅ Manual verification: 10 rapid undo operations complete without data corruption

### TODO-002 | BLOCKER | Streaming

- [x] **Fix Memory Leak in SSE Reconnection Loop** ✅ **COMPLETED**
  - **Severity**: Blocker
  - **Area**: Perf
  - **Evidence**: `/packages/react/src/hooks/streaming/use-streaming-sse.tsx:328-341, 520-522`
  - **Issue**: Heartbeat timeout accumulation during reconnection cycles
  - **Fix Plan**: Clear ALL timeouts explicitly in disconnect(), add cleanup verification
  - **Acceptance**: Run 100 reconnection cycles, verify no timeout accumulation
  - **Owner**: Agent #2
  - **Status**: Completed (2026-01-21)
  - **Linked**: CRIT-002
  - **Time**: 2 hours (faster than estimated 12h)
  - **Implementation**:
    - ✅ Added timeout cleanup in error handler reconnection logic (lines 577-620)
    - ✅ Clear heartbeatTimeoutRef, reconnectTimeoutRef, abortControllerRef, readerRef before
      scheduling reconnect
    - ✅ Added defense-in-depth cleanup at start of connect() function
    - ✅ Prevents accumulation over many reconnection cycles
    - ✅ Created 5 comprehensive test cases (all passing)
    - ✅ Tests verify setTimeout/clearTimeout are balanced, no unbounded growth
    - **Files Modified**:
      - `src/hooks/streaming/use-streaming-sse.tsx` (timeout cleanup added)
      - `src/hooks/streaming/__tests__/use-streaming-sse-memory-leak.test.tsx` (new test file)
    - **Tests**: 5/5 passing - verifies no timeout accumulation over reconnection cycles

### TODO-003 | BLOCKER | Streaming

- [ ] **Fix Race Condition Between Disconnect and Incoming Data**
  - **Severity**: Blocker
  - **Area**: Func
  - **Evidence**: `/packages/react/src/hooks/streaming/use-streaming-sse.tsx:555-584, 423-482`
  - **Issue**: reader.read() can return chunk just as disconnect() clears refs
  - **Fix Plan**: Add isDisconnecting flag, abort pending reads before clearing refs
  - **Acceptance**: Test disconnect during active streaming, verify clean shutdown
  - **Owner**: Agent #2
  - **Status**: Not Started
  - **Linked**: CRIT-003

### TODO-004 | BLOCKER | Streaming

- [x] **Implement State Machine Validation** ✅ **COMPLETED**
  - **Severity**: Blocker
  - **Area**: Func
  - **Evidence**: `/packages/react/src/hooks/streaming/use-streaming-sse.tsx:347-406`
  - **Issue**: No validation of valid state transitions (streaming → error → connecting)
  - **Fix Plan**: Add state transition validator, prevent invalid transitions, log violations
  - **Acceptance**: Test all transition paths, verify only valid transitions allowed
  - **Owner**: Agent #2
  - **Status**: Completed (2026-01-21)
  - **Linked**: CRIT-004
  - **Time**: 6 hours
  - **Implementation**:
    - ✅ Created VALID_STATE_TRANSITIONS map defining all allowed transitions
    - ✅ Implemented isValidTransition() function to check transition validity
    - ✅ Created setStatusSafe() wrapper that validates before changing state
    - ✅ Replaced all setStatus() calls with setStatusSafe()
    - ✅ Invalid transitions log warnings with transition details
    - ✅ Created 8 comprehensive test cases covering all valid transitions
    - ✅ All tests passing (8/8) - validates state machine correctness

### TODO-005 | BLOCKER | Memory

- [ ] **Fix Cache-Vector Store Synchronization**
  - **Severity**: Blocker
  - **Area**: Func
  - **Evidence**: `/packages/memory/src/memory-service.ts:551-594, 606-626`
  - **Issue**: Cache updates without vector store sync on error, no rollback
  - **Fix Plan**: Implement atomic updates or rollback mechanism, add consistency checks
  - **Acceptance**: Inject vector store errors, verify cache rollback or atomic commit
  - **Owner**: Agent #8
  - **Status**: Not Started
  - **Linked**: CRIT-005

### TODO-006 | BLOCKER | Memory

- [ ] **Implement Cross-Session State Restoration**
  - **Severity**: Blocker
  - **Area**: Func
  - **Evidence**: All store implementations
  - **Issue**: Buffer, decay manager, event listener state lost on restart
  - **Fix Plan**: Persist runtime state to storage, implement hydration on initialization
  - **Acceptance**: Restart service with pending items, verify all state restored
  - **Owner**: Agent #8
  - **Status**: Not Started
  - **Linked**: CRIT-006

### TODO-007 | BLOCKER | Memory

- [ ] **Add Mutex/Locking to File Store Writes**
  - **Severity**: Blocker
  - **Area**: Func
  - **Evidence**: `/packages/memory/src/stores/file.ts:62-80`
  - **Issue**: Concurrent add() calls can cause data corruption
  - **Fix Plan**: Implement simple async-lock or queue for file writes
  - **Acceptance**: Run 100 concurrent writes, verify no corruption or lost data
  - **Owner**: Agent #8
  - **Status**: Not Started
  - **Linked**: CRIT-007

### TODO-008 | BLOCKER | Security

- [x] **Sanitize Tool Arguments in Logs** ✅ **COMPLETED**
  - **Severity**: Blocker
  - **Area**: Sec
  - **Evidence**: `/tools/mcp-server/src/index.ts:602`
  - **Issue**: Tool arguments logged without redaction (exposes API keys, PII)
  - **Fix Plan**: Implement sanitizeArgsForLogging(), apply before all logger calls
  - **Acceptance**: Pass API key in args, verify masked in logs
  - **Owner**: Agent #9
  - **Status**: Completed (2026-01-21)
  - **Linked**: CRIT-008
  - **Time**: 2 hours
  - **Implementation**:
    - ✅ Created `maskSensitive()` function (40+ sensitive key patterns)
    - ✅ Created `sanitizeForLogging()` with recursive object traversal
    - ✅ Applied to 5 logging locations across 4 files
    - ✅ Added 36 comprehensive test cases
    - ✅ Manual verification: API keys, passwords, PII properly masked

---

## HIGH PRIORITY TODOS (Sprint 2)

### TODO-009 | HIGH | Core Functionality

- [ ] **Fix Branch Conversation Message References**
  - **Severity**: High
  - **Area**: Func
  - **Evidence**: `/packages/react/src/hooks/message/use-message-operations.ts:385-410`
  - **Issue**: Parent references lost when branching, breaks message chain
  - **Fix Plan**: Correct parentId assignment logic in branchConversation()
  - **Acceptance**: Branch conversation, verify message hierarchy intact
  - **Owner**: Agent #2
  - **Status**: Not Started
  - **Linked**: HIGH-001

### TODO-010 | HIGH | Core Functionality

- [ ] **Implement Message Edit Rollback**
  - **Severity**: High
  - **Area**: Func
  - **Evidence**: `/packages/react/src/hooks/message/use-message-operations.ts:281-314`
  - **Issue**: Message updated locally without rollback on API failure
  - **Fix Plan**: Store original content, rollback on error, show user notification
  - **Acceptance**: Trigger API error during edit, verify rollback to original
  - **Owner**: Agent #2
  - **Status**: Not Started
  - **Linked**: HIGH-002

### TODO-011 | HIGH | Streaming

- [ ] **Implement Event ID Tracking for Resume**
  - **Severity**: High
  - **Area**: Func
  - **Evidence**: `/packages/react/src/hooks/streaming/use-streaming-sse.tsx:316-323`
  - **Issue**: Events without IDs prevent resume, data lost on reconnection
  - **Fix Plan**: Generate IDs for events without them, use for Last-Event-ID resume
  - **Acceptance**: Stream without IDs, disconnect/reconnect, verify no data loss
  - **Owner**: Agent #2
  - **Status**: Not Started
  - **Linked**: HIGH-003

### TODO-012 | HIGH | Tools

- [x] **Disable Cache for Non-Deterministic Tools** ✅ **COMPLETED**
  - **Severity**: High
  - **Area**: Func
  - **Evidence**: `/packages/react/src/app-api/tools-engine.ts:433-456`
  - **Issue**: Tools like get_current_time, generate_uuid incorrectly cached
  - **Fix Plan**: Add deterministic flag to tool definitions, skip cache if false
  - **Acceptance**: Call get_current_time twice, verify different results
  - **Owner**: Agent #2
  - **Status**: Completed (2026-01-21)
  - **Linked**: HIGH-004
  - **Time**: 1 hour
  - **Implementation**:
    - ✅ Added `deterministic?: boolean` field to ToolDefinition interface
    - ✅ Marked get_current_time and generate_uuid as `deterministic: false`
    - ✅ Modified cache read logic to check isDeterministic flag
    - ✅ Modified cache write logic to only cache deterministic tools
    - ✅ Added 7 comprehensive test cases covering all scenarios
    - ✅ All tests passing (7/7)

### TODO-013 | HIGH | Tools

- [ ] **Implement Tool Timeout with AbortSignal**
  - **Severity**: High
  - **Area**: Func
  - **Evidence**: `/packages/react/src/app-api/tools-engine.ts:470-478`
  - **Issue**: Tool continues running after timeout, no cleanup
  - **Fix Plan**: Pass AbortSignal to tool.execute(), cancel on timeout
  - **Acceptance**: Create slow tool, verify proper cancellation on timeout
  - **Owner**: Agent #2
  - **Status**: Not Started
  - **Linked**: HIGH-005

### TODO-014 | HIGH | Security

- [ ] **Add Tool Approval System**
  - **Severity**: High
  - **Area**: Sec
  - **Evidence**: `/tools/mcp-server/src/index.ts`
  - **Issue**: No tool approval, allowlist, capability-based access control
  - **Fix Plan**: Create tool capability model, implement permission checks, add audit logging
  - **Acceptance**: Register dangerous tool, verify approval required before execution
  - **Owner**: Agent #9
  - **Status**: Not Started
  - **Linked**: HIGH-014
  - **Time**: 8 hours

_(15 High priority TODOs total - see full list in extended docs)_

---

## MEDIUM PRIORITY TODOS (Sprint 3-4)

### TODO-023 | MEDIUM | UI/UX

- [ ] **Add Mobile Breakpoint Strategy**
  - **Severity**: Medium
  - **Area**: UI
  - **Evidence**: `/packages/react/src/components/chat/chat-window.tsx`
  - **Issue**: No mobile-optimized breakpoints, hard-coded padding
  - **Fix Plan**: Implement responsive padding: px-3 (mobile), px-4 (tablet), px-6 (desktop)
  - **Acceptance**: Test on 320px, 768px, 1024px screens, verify proper padding
  - **Owner**: Agent #4
  - **Status**: Not Started
  - **Linked**: MED-001

### TODO-024 | MEDIUM | Performance

- [ ] **Add Virtualization for Large Messages**
  - **Severity**: Medium
  - **Area**: Perf
  - **Evidence**: Multiple component files
  - **Issue**: No virtual scrolling for 100k+ token responses, causes lag
  - **Fix Plan**: Implement react-window for message lists, add chunking
  - **Acceptance**: Render 100k token message, verify no lag, smooth scrolling
  - **Owner**: Agent #7
  - **Status**: Not Started
  - **Linked**: MED-010

_(34 Medium priority TODOs total)_

---

## LOW PRIORITY TODOS (Backlog)

### TODO-058 | LOW | DX

- [ ] **Export Tool Utilities Publicly**
  - **Severity**: Low
  - **Area**: DX
  - **Evidence**: `/utils/tools/*`
  - **Issue**: 15+ helper functions for tool results are internal only
  - **Fix Plan**: Add to public-api.ts exports, document usage
  - **Acceptance**: Import from @clarity-chat/react, verify TypeScript types
  - **Owner**: Agent #5
  - **Status**: Not Started
  - **Linked**: LOW-001

_(30 Low priority TODOs total)_

---

## TODO STATISTICS

| Priority     | Total  | Not Started | In Progress | Blocked | Completed |
| ------------ | ------ | ----------- | ----------- | ------- | --------- |
| **Critical** | 8      | 3           | 0           | 0       | 5         |
| **High**     | 15     | 13          | 0           | 0       | 2         |
| **Medium**   | 34     | 34          | 0           | 0       | 0         |
| **Low**      | 30     | 30          | 0           | 0       | 0         |
| **TOTAL**    | **87** | **80**      | **0**       | **0**   | **7**     |

---

## COMPLETION CRITERIA

### Sprint 1 (Critical TODOs)

- ✅ All 8 critical TODOs completed
- ✅ Unit tests added for all fixes
- ✅ Integration tests pass
- ✅ Security scan clean
- ✅ No regressions introduced

### Sprint 2 (High Priority TODOs)

- ✅ All 15 high priority TODOs completed
- ✅ E2E tests added for key flows
- ✅ Accessibility audit passes
- ✅ Performance benchmarks meet targets

### Production Readiness

- ✅ All critical + high TODOs completed (23 items)
- ✅ 80%+ of medium TODOs completed (27/34 items)
- ✅ Rubric score ≥98/100
- ✅ Zero open blockers
- ✅ All tests passing

---

## CLOSURE RULES

A TODO may only be closed when ALL of the following are met:

1. ✅ Fix implemented and tested
2. ✅ Repo-wide propagation complete (code, docs, examples updated)
3. ✅ Verification evidence recorded (test results, screenshots, logs)
4. ✅ No new untracked TODOs created during fix
5. ✅ PR reviewed and merged (if applicable)
6. ✅ Regression tests added

---

**TODO Registry Active**: 2026-01-21 **Next Review**: After Sprint 1 completion
