# DX Improvements Phase 2 - Unified APIs & Simplified Hooks

## Overview

This phase focuses on creating unified, simplified APIs that reduce cognitive load and make the library easier to use.

## New APIs Added

### 1. `useChat` Hook - Simplified Unified Hook ⭐

**Location**: `packages/react/src/hooks/use-chat-unified.ts`

**Purpose**: Provides a simpler API than `useClarityChat` while maintaining access to all features.

**Key Features**:
- ✅ Automatic message conversion (`CoreMessage[]` → `Message[]`)
- ✅ Built-in persistence (optional)
- ✅ Auto-scroll support
- ✅ Simplified `sendMessage` function
- ✅ Access to full `chat` object for advanced features

**Example**:
```tsx
// Simple usage
const { messages, sendMessage, isLoading } = useChat({ api: '/api/chat' })

// With persistence
const chat = useChat({
  api: '/api/chat',
  persistMessages: true,
  storageKey: 'my-chat',
})
```

**Benefits**:
- Fewer lines of code than `useClarityChat`
- No manual message conversion needed
- Built-in common patterns (persistence, auto-scroll)
- Still has access to full API via `chat` property

### 2. `ChatWithErrorBoundary` Component

**Location**: `packages/react/src/components/chat-with-error-boundary.tsx`

**Purpose**: Wraps `ClarityChat` with automatic error boundary for production-ready error handling.

**Example**:
```tsx
<ChatWithErrorBoundary
  api="/api/chat"
  onError={(error) => {
    // Send to error tracking service
    trackError(error)
  }}
/>
```

**Benefits**:
- Production-ready error handling out of the box
- No need to manually wrap with ErrorBoundary
- Customizable error fallback UI
- Automatic error recovery

## Improved Helper Hooks

### `useClarityChatWithWindow` - Updated Documentation

**Changes**:
- Added deprecation notice pointing to `ClarityChat` component
- Improved JSDoc with migration examples
- Better chatId handling

**Migration Path**:
```tsx
// Old (still works)
const { messages, handleSendMessage } = useClarityChatWithWindow({ api: '/api/chat' })

// New (recommended)
<ClarityChat api="/api/chat" />
```

## API Comparison

| API | Complexity | Use Case | Lines of Code |
|-----|-----------|----------|---------------|
| `ClarityChat` | ⭐ Simplest | Standard chat UI | 1 |
| `useChat` | ⭐⭐ Simple | Custom UI, persistence | ~10 |
| `useClarityChat` | ⭐⭐⭐ Advanced | Maximum control | ~15 |

## Examples Created

1. **Unified Chat Examples** (`unified-chat-examples.tsx`)
   - Basic usage
   - With persistence
   - With memory
   - Full control examples

2. **Quickstart Guide** (`QUICKSTART.md`)
   - Three ways to use the library
   - When to use what
   - Common patterns
   - Migration guide

## Documentation Updates

1. **Main README** - Updated quickstart section with all three options
2. **QUICKSTART.md** - Comprehensive guide for new users
3. **Helper hooks** - Improved JSDoc and deprecation notices

## Benefits Summary

### For New Users
- ✅ Clear migration path from simplest to most advanced
- ✅ Multiple entry points based on needs
- ✅ Comprehensive examples and guides

### For Existing Users
- ✅ Backward compatible (no breaking changes)
- ✅ Can gradually migrate to simpler APIs
- ✅ All existing code continues to work

### For the Library
- ✅ Better developer experience
- ✅ Reduced support burden (fewer "how do I..." questions)
- ✅ Clearer mental model (simple → advanced)

## Migration Guide

### From `useClarityChat` to `useChat`

**Before**:
```tsx
const { messages, append, isLoading } = useClarityChat({ api: '/api/chat' })
const converted = convertCoreMessagesToMessages(messages)
```

**After**:
```tsx
const { messages, sendMessage, isLoading } = useChat({ api: '/api/chat' })
// messages already converted, sendMessage is simpler
```

### From `useClarityChatWithWindow` to `ClarityChat`

**Before**:
```tsx
const { messages, handleSendMessage, isLoading } = useClarityChatWithWindow({ api: '/api/chat' })
return <ChatWindow messages={messages} isLoading={isLoading} onSendMessage={handleSendMessage} />
```

**After**:
```tsx
return <ClarityChat api="/api/chat" />
```

## Next Steps

1. ✅ Create unified hook (`useChat`)
2. ✅ Add error boundary wrapper
3. ✅ Improve helper hooks documentation
4. ✅ Create comprehensive examples
5. ✅ Update main documentation
6. ⏳ Add Storybook stories for new APIs
7. ⏳ Create migration codemods
8. ⏳ Add more examples for edge cases

## Files Changed

1. **New**: `packages/react/src/hooks/use-chat-unified.ts` - Unified hook
2. **New**: `packages/react/src/components/chat-with-error-boundary.tsx` - Error boundary wrapper
3. **New**: `packages/react/src/examples/unified-chat-examples.tsx` - Examples
4. **New**: `packages/react/QUICKSTART.md` - Quickstart guide
5. **Updated**: `packages/react/src/hooks/use-clarity-chat-helpers.ts` - Improved docs
6. **Updated**: `packages/react/src/index.ts` - Export new APIs
7. **Updated**: `README.md` - Updated quickstart section

---

**Status**: ✅ Phase 2 Complete
**Breaking Changes**: None (fully backward compatible)
**Migration Effort**: Optional (existing code still works)
