# TODO-001 Alternate Approach: Use Reducer

## Current Issues

The queue-based approach with `flushSync` still fails because:
- Only 1 out of 10 operations processes
- Queue operations aren't being dequeued properly
- State updates aren't completing before next operation starts

## Proposed Solution

Use `useReducer` instead of multiple `useState` calls:

### Benefits of Reducer Approach
1. **Atomic Updates**: Reducer guarantees all state updates happen atomically
2. **No Closure Staleness**: Reducer always receives current state
3. **Sequential Processing**: Actions process in order automatically
4. **Simpler Logic**: No need for refs, queues, or flush Sync

### Implementation Plan
1. Create a reducer that handles all message operations
2. Dispatch actions for undo/redo
3. Reducer reads current state and applies changes atomically
4. No need for operation queue or concurrent execution prevention

### Example Reducer Structure
```typescript
type State = {
  messages: MessageWithOperations[]
  history: MessageOperation[]
  redoStack: MessageOperation[]
  currentBranchId: string
}

type Action =
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'ADD_MESSAGE', payload: ... }
  | ...

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'UNDO':
      if (state.history.length === 0) return state
      const lastOp = state.history[state.history.length - 1]
      // Apply undo logic atomically
      return {
        ...state,
        history: state.history.slice(0, -1),
        redoStack: [...state.redoStack, lastOp],
        messages: // ... undo the operation
      }
    // ... other cases
  }
}
```

This approach is cleaner and will handle rapid operations correctly because React guarantees that reducer calls are processed sequentially with the current state.
