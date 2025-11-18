# Migration Guide - Phase 2 Architecture Refinement

## Overview

Phase 2 introduced a layered architecture and improved API organization. **All existing code continues to work** - this is a non-breaking change focused on better organization and documentation.

## What Changed

### 1. Export Organization

**Before**: Flat export structure
```tsx
import { ClarityChat, ChatWindow, useClarityChat, useChatEnhanced } from '@clarity-chat/react'
```

**After**: Same imports work, but now organized by layer
```tsx
// Still works exactly the same!
import { ClarityChat, ChatWindow, useClarityChat, useChatEnhanced } from '@clarity-chat/react'
```

**No migration needed** - all existing imports continue to work.

### 2. Documentation Improvements

**Before**: Basic JSDoc comments
```typescript
/**
 * useClarityChat - Flagship chat hook
 */
```

**After**: Enhanced JSDoc with architecture guidance
```typescript
/**
 * useClarityChat - Top-Level Chat State Hook
 * 
 * **Architecture Layer**: Top-Level (Drop-in Ready)
 * **Domain**: Chat State
 * 
 * For Vercel AI SDK compatibility, use mid-level `useChatEnhanced` instead.
 */
```

**No migration needed** - this is documentation only.

### 3. New Structured Exports File

**New**: `packages/react/src/exports.ts` - Reference file organized by domain

**No migration needed** - this is for reference/documentation only.

## Recommended Migrations (Optional)

While all existing code works, you can optionally migrate to use the new patterns for better clarity:

### 1. Use Top-Level APIs When Possible

**Before**:
```tsx
const chat = useChatEnhanced({ api: '/api/chat' })
const messages = convertCoreMessagesToMessages(chat.messages)
<ChatWindow messages={messages} onSendMessage={...} />
```

**After** (Simpler):
```tsx
// Option 1: Drop-in component
<ClarityChat api="/api/chat" />

// Option 2: Hook with handlers
const chat = useClarityChat({ api: '/api/chat' })
const handlers = useChatHandlers({ chat })
<ChatWindow messages={chat.messages} onSendMessage={handlers.onSendMessage} />
```

**Benefit**: Less boilerplate, clearer intent

### 2. Use Presets for Common Configurations

**Before**:
```tsx
<ClarityChat 
  api="/api/chat"
  memory={{ enabled: true, strategy: 'sliding-window', maxTokens: 4000 }}
  showHeader
  showMessageCount
/>
```

**After**:
```tsx
<ClarityChatPresets.WithMemory 
  api="/api/chat"
  memoryStrategy="sliding-window"
/>
```

**Benefit**: Less configuration, clearer intent

### 3. Use Configuration Helpers

**Before**:
```tsx
const config = {
  api: '/api/chat',
  memory: {
    enabled: true,
    strategy: 'semantic-chunks',
    maxTokens: 6000,
  },
  streamProtocol: 'sse',
}
const chat = useClarityChat(config)
```

**After**:
```tsx
import { createMemoryChatConfig } from '@clarity-chat/react'

const config = createMemoryChatConfig('/api/chat', 'semantic-chunks', 6000)
const chat = useClarityChat(config)
```

**Benefit**: Consistent configurations, less room for error

### 4. Use Handlers Hook

**Before**:
```tsx
const chat = useClarityChat({ api: '/api/chat' })
const handleSendMessage = React.useCallback(
  async (content: string) => {
    try {
      await chat.append({ role: 'user', content })
    } catch (error) {
      console.error('Failed to send:', error)
    }
  },
  [chat]
)
const handleClear = React.useCallback(() => {
  chat.setMessages([])
}, [chat])
```

**After**:
```tsx
const chat = useClarityChat({ api: '/api/chat' })
const handlers = useChatHandlers({
  chat,
  onMessageError: (error) => console.error('Failed to send:', error),
})
// Use handlers.onSendMessage, handlers.onClear, etc.
```

**Benefit**: Less boilerplate, consistent error handling

## Breaking Changes

**None!** All existing code continues to work. Phase 2 is purely additive and organizational.

## Deprecations

No APIs were deprecated in Phase 2. All existing APIs remain available and supported.

## New APIs Added

### Top-Level
- `ClarityChatPresets` - Preset components for common use cases
- `useChatHandlers` - Pre-configured handlers hook

### Utilities
- `createBasicChatConfig` - Basic chat configuration helper
- `createMemoryChatConfig` - Memory chat configuration helper
- `createStreamingChatConfig` - Streaming chat configuration helper
- `createEnterpriseChatConfig` - Enterprise chat configuration helper
- `isValidApiEndpoint` - API endpoint validation
- `getApiEndpoint` - Get API from prop or environment variable

## Questions?

- See `DESIGN.md` for architecture documentation
- See `QUICK_REFERENCE_ARCHITECTURE.md` for quick reference
- See `packages/react/src/examples/happy-path-workflows.tsx` for examples

## Timeline

- **Phase 2**: Architecture refinement (current)
- **Future**: Consider domain-specific entry points, more examples, Storybook organization

---

**Status**: ✅ Non-breaking, all existing code works
**Migration**: Optional, recommended for better DX
