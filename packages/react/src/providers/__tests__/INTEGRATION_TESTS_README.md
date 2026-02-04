# Integration Tests for Clarity Chat Providers

## Summary

Complete integration test suite for `ClarityChatProvider` and `AgentExecutionProvider` with comprehensive combined provider tests.

**Total Test Coverage: 123+ tests across 3 files**

---

## Files Overview

### 1. ClarityChatProvider.test.tsx
- **Location**: `./ClarityChatProvider.test.tsx`
- **Lines**: 1,145
- **Test Cases**: 48+
- **Describe Blocks**: 14

**Purpose**: Tests the unified context provider for clarity-chat components, covering message management, streaming, tools, thinking state, and configuration.

**Key Test Areas**:
- Context provider initialization and setup
- Message lifecycle operations (send, receive, clear, regenerate)
- Streaming state tracking and management
- Event system with subscription/unsubscription
- External adapter integration and syncing
- Tool operations (approve/reject workflows)
- Configuration management and updates
- Error handling and callbacks
- All specialized hooks (9 total hooks)

---

### 2. AgentExecutionProvider.test.tsx
- **Location**: `./AgentExecutionProvider.test.tsx`
- **Lines**: 1,668
- **Test Cases**: 60+
- **Describe Blocks**: 14

**Purpose**: Tests the agent execution context provider for plan management, tool execution, approvals, and execution lifecycle.

**Key Test Areas**:
- Execution lifecycle (start, pause, resume, cancel, complete)
- Plan creation and step management (5 step states)
- Tool call workflows with full lifecycle
- Approval workflows (request, approve, reject)
- Event system with multiple subscription types
- Thinking step management
- Status transitions and validation
- Progress calculation and tracking
- Time tracking (duration, pause, completion)
- Auto-approval mechanisms
- Execution summary generation
- All specialized hooks (6 total hooks)

---

### 3. integration.test.tsx (NEW)
- **Location**: `./integration.test.tsx`
- **Lines**: 797
- **Test Cases**: 15
- **Describe Blocks**: 8

**Purpose**: Tests combined usage of both providers together, covering cross-provider interactions, event coordination, and realistic workflows.

**Key Test Areas**:
- **Dual Provider Setup** (4 tests):
  - Rendering both providers together
  - Simultaneous context access
  - Reversed nesting order
  - State isolation between providers

- **Event Coordination** (2 tests):
  - Separate event tracking
  - Coordinated tool operations

- **Tool Workflow Integration** (1 test):
  - Cross-provider tool execution

- **State Synchronization** (2 tests):
  - Execution plan to both providers
  - Attachment-to-tool syncing

- **Execution with Chat Integration** (1 test):
  - Plan execution while maintaining chat history

- **Hooks Composition** (1 test):
  - Multiple hooks from both providers

- **Complex Workflows** (2 tests):
  - Full agent workflow with messaging
  - User approval requirements across providers

- **Performance & Cleanup** (2 tests):
  - Event subscription cleanup
  - Rapid state updates handling

---

## Test Statistics

| Metric | Value |
|--------|-------|
| **Total Test Files** | 3 |
| **Total Test Cases** | 123+ |
| **Total Describe Blocks** | 36 |
| **Total Test Code Lines** | 3,610 |
| **Mock Functions** | 50+ |

---

## Testing Stack

- **Test Framework**: Vitest
- **Component Testing**: React Testing Library
- **Rendering**: `render()`, `renderHook()`
- **Query Methods**: `screen`, `getByTestId()`, `getByText()`
- **Actions**: `act()`, `click()`, `fireEvent()`
- **Async**: `waitFor()`, `async/await`
- **Mocking**: `vi.fn()`, `vi.spyOn()`

---

## Key Features Tested

### ClarityChatProvider Features
- Message state management
- Streaming lifecycle
- Tool approval workflows
- Event emission system
- External adapter integration
- Configuration merging
- Error callbacks
- 9 specialized hooks
- Multiple subscribers
- Null safety

### AgentExecutionProvider Features
- Execution lifecycle states
- Plan step management
- Tool call tracking
- Approval workflows
- Event system
- Thinking management
- Status transitions
- Progress tracking
- Time tracking
- Auto-approval
- 6 specialized hooks
- Summary generation

### Integration Features
- Dual provider initialization
- Cross-provider context access
- Event coordination
- Tool workflows spanning both contexts
- State synchronization patterns
- Chat history maintenance
- Approval workflows across contexts
- Hook composition
- Performance handling
- Resource cleanup

---

## Test Patterns Used

### 1. Mock Adapter Factory
```typescript
const createMockChatAdapter = (): ChatAdapter => {
  // Factory creates configurable mock adapters
  return { ... }
}
```

### 2. Component Test Wrapper
```typescript
function TestComponent() {
  const { ... } = useClarityChat()
  return <div>...</div>
}

render(
  <ClarityChatProvider>
    <TestComponent />
  </ClarityChatProvider>
)
```

### 3. Event Handler Testing
```typescript
const handler = vi.fn()
React.useEffect(() => {
  return on('event:type', handler)
}, [on])
```

### 4. Async Operation Testing
```typescript
await act(async () => {
  screen.getByTestId('button').click()
  await waitFor(() => {
    expect(screen.getByTestId('result')).toHaveTextContent('value')
  })
})
```

### 5. State Verification
```typescript
expect(screen.getByTestId('state')).toHaveTextContent('expected-value')
```

---

## Coverage Checklist

### ClarityChatProvider
- [x] Provider initialization
- [x] Message operations (send, receive, clear)
- [x] Streaming state
- [x] Event emission and subscription
- [x] External adapter integration
- [x] Tool approval/rejection
- [x] Configuration management
- [x] Error handling
- [x] All hooks
- [x] Edge cases
- [x] Multiple subscribers
- [x] Cleanup on unmount

### AgentExecutionProvider
- [x] Execution lifecycle
- [x] Plan management
- [x] Tool calls
- [x] Approval workflows
- [x] Event system
- [x] Thinking steps
- [x] Status tracking
- [x] Progress calculation
- [x] Time tracking
- [x] Auto-approval
- [x] All hooks
- [x] State transitions

### Integration
- [x] Dual provider setup
- [x] Simultaneous context access
- [x] Event coordination
- [x] Tool workflows
- [x] State synchronization
- [x] Chat + execution workflows
- [x] Hook composition
- [x] Complex workflows
- [x] Performance
- [x] Cleanup

---

## Running Tests

### All Tests
```bash
npm test
```

### Specific Test File
```bash
npm test ClarityChatProvider.test.tsx
npm test AgentExecutionProvider.test.tsx
npm test integration.test.tsx
```

### With Coverage
```bash
npm test -- --coverage
```

### Watch Mode
```bash
npm test -- --watch
```

### Specific Test Pattern
```bash
npm test -- --grep "should render"
npm test -- --grep "event"
```

---

## Quality Metrics

### Test Quality
- Comprehensive API coverage
- Edge case handling
- Async operation testing
- Event system verification
- State transition validation
- Integration scenarios
- Error handling
- Performance testing
- Resource cleanup

### Code Quality
- Clear test descriptions
- Organized with describe blocks
- Proper setup/teardown
- Mock factory patterns
- Type safety (TypeScript)
- Consistent naming
- Readable assertions
- Isolated tests

---

## Common Test Scenarios

### Scenario 1: Basic Provider Rendering
```typescript
render(
  <ClarityChatProvider>
    <TestComponent />
  </ClarityChatProvider>
)
expect(screen.getByTestId('content')).toBeInTheDocument()
```

### Scenario 2: Message Sending
```typescript
const adapter = createMockChatAdapter()
render(
  <ClarityChatProvider adapter={adapter}>
    <SendButton />
  </ClarityChatProvider>
)
await act(async () => {
  screen.getByTestId('send').click()
  await waitFor(() => {
    expect(adapter.sendMessage).toHaveBeenCalled()
  })
})
```

### Scenario 3: Event Subscription
```typescript
const handler = vi.fn()
function TestComponent() {
  const { on } = useClarityChat()
  React.useEffect(() => {
    return on('event:type', handler)
  }, [on])
  return <button onClick={() => emit('event:type', {})}>Emit</button>
}
```

### Scenario 4: Dual Provider
```typescript
render(
  <AgentExecutionProvider>
    <ClarityChatProvider>
      <ComponentUsingBoth />
    </ClarityChatProvider>
  </AgentExecutionProvider>
)
```

---

## Maintenance Notes

- Tests use real `React` hooks where appropriate
- Mock adapters are fully configurable
- Tests are isolated and don't affect each other
- Cleanup happens automatically via Vitest
- Event subscriptions are properly cleaned up
- Async operations use proper `act()` wrapping
- Timeouts are explicitly set for long operations

---

## Future Enhancements

- [ ] Performance benchmarking tests
- [ ] Memory leak detection
- [ ] Stress testing with large data volumes
- [ ] Concurrent provider operations
- [ ] Error recovery scenarios
- [ ] Snapshot testing for complex state
- [ ] Visual regression tests
- [ ] Accessibility testing

