# React 19 Hooks Integration Guide

This document outlines opportunities and considerations for integrating React 19 features into the
Clarity Chat hooks system.

## Overview

React 19 introduces several new primitives that can enhance our hooks:

- `use` hook for suspense-compatible data fetching
- `useOptimistic` for optimistic UI updates
- `useActionState` for form actions
- `useFormStatus` for form submission status
- Improved ref handling (ref as prop)

## Integration Opportunities

### 1. `use` Hook Integration

**Applicable Hooks:**

- `useStreaming` - Could use `use` for suspense-compatible streaming
- `useAssistant` - Could suspend while loading assistant configuration
- `useCompletion` - Could integrate with suspense boundaries

**Example Pattern:**

```tsx
// Future: Suspense-compatible streaming
function useStreamingSuspense(url: string) {
  const stream = use(fetchStream(url))
  return stream
}
```

**Current Status:** Not implemented. Requires careful consideration of:

- Error boundary integration
- Streaming chunk handling
- Cancellation semantics

### 2. `useOptimistic` for Chat Messages

**Applicable Hooks:**

- `useClarityChat` - Already has optimistic updates, could use native hook
- `useMessageOperations` - Optimistic message operations

**Example Pattern:**

```tsx
function useClarityChatWithOptimistic(options) {
  const [messages, setMessages] = useState([])
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [...state, { ...newMessage, sending: true }]
  )

  async function sendMessage(content) {
    addOptimisticMessage({ role: 'user', content })
    await api.send(content)
  }

  return { messages: optimisticMessages, sendMessage }
}
```

**Current Status:** Investigated. Current implementation is sufficient for most cases. The benefit
of `useOptimistic` would be automatic rollback on error.

### 3. `useFormStatus` for Input Components

**Applicable Components:**

- `ChatInput` - Could show pending state during submission
- `MessageComposer` - Could disable during submission

**Example Pattern:**

```tsx
function SubmitButton() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>Send</button>
}
```

**Current Status:** Not applicable. Our components don't use form actions.

### 4. `useActionState` for Server Actions

**Applicable Patterns:**

- Server-side chat processing
- RAG pipeline integration

**Current Status:** Not applicable. We use client-side API calls.

## Ref-as-Prop Migration

React 19 deprecates `forwardRef` in favor of passing ref as a prop.

**Migration Status:**

- ESLint rule configured to warn on `forwardRef` usage
- See `REACT_19_REF_MIGRATION.md` for detailed migration guide

**Affected Components:**

- All components using `forwardRef`
- Search for `forwardRef` in codebase

## Testing Considerations

### @testing-library/react Compatibility

Some tests are skipped due to React 19 compatibility issues:

```typescript
// packages/react/src/hooks/__tests__/use-streaming.test.ts
// TODO: Revisit when @testing-library/react has better React 19 support.
```

**Workarounds:**

1. Use `act()` wrapper more aggressively
2. Await microtasks with `await new Promise(r => setTimeout(r, 0))`
3. Use `waitFor` with longer timeouts

### Concurrent Features

React 19's concurrent features may affect:

- `useDebounce` - transitions may affect timing
- `useThrottle` - batching may change behavior
- `useAutoScroll` - layout effects timing

## Server Components Compatibility

### Hooks That Work with RSC

These hooks have no client-side state and could theoretically work in RSC:

- None currently (all hooks use client-side state)

### Hooks That Require 'use client'

All current hooks require `'use client'` directive because they use:

- `useState`
- `useEffect`
- `useRef`
- Browser APIs

### RSC-Compatible Patterns

For future RSC support, consider:

1. Splitting data fetching from UI state
2. Using server actions for mutations
3. Passing serializable props from server to client

## Migration Checklist

- [x] Enable `react-hooks/exhaustive-deps` linting
- [ ] Migrate `forwardRef` to ref-as-prop (in progress)
- [ ] Evaluate `useOptimistic` for chat messages
- [ ] Investigate `use` hook for streaming
- [ ] Update @testing-library/react when compatible
- [ ] Add Suspense boundary examples

## Version Requirements

```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "@testing-library/react": "^15.0.0" // or later with React 19 support
}
```

## Resources

- [React 19 Blog Post](https://react.dev/blog/2024/04/25/react-19)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [New Hooks in React 19](https://react.dev/reference/react/hooks)
